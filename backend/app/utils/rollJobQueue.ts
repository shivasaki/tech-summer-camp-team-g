import Queue from "./queue";
import axios from "axios";
import { query } from "./db";

const rollJobQueue = new Queue();
const rollUrl = process.env.DICEND_API_ROLL_URL;
const statusUrl = process.env.DICEND_API_STATUS_URL;

const rollRequestJob = async (sessionId: string): Promise<void> => {
  console.log(`Request roll session ${sessionId}`);
  await axios.get(`${rollUrl}`);

  // セッションの状態を更新
  await query(`UPDATE roll_session SET rolled_at = $1 WHERE id = $2`, [
    new Date(),
    sessionId,
  ]);

  // セッションが完了するまで1秒ごとに結果を聞く
  while (true) {
    const response = await axios.get(`${statusUrl}`);
    console.log("status: ", response.data);
    if (response.data.status == "completed") {
      // 結果をDBに保存
      await query(`UPDATE roll_session SET result = $1 WHERE id = $2`, [
        response.data.result,
        sessionId,
      ]);
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // セッションの状態を更新
  await query(`UPDATE roll_session SET completed_at = $1 WHERE id = $2`, [
    new Date(),
    sessionId,
  ]);
};

export const addRollJob = (sessionId: string): void => {
  rollJobQueue.addJob(() => rollRequestJob(sessionId));
};
