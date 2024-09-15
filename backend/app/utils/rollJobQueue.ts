import Queue from "./queue";

const rollJobQueue = new Queue();

const rollRequestJob = async (sessionId: string): Promise<void> => {
    console.log(`Request roll session ${sessionId}`);
    // TODO: セッションが完了するまで1秒ごとにAPIを叩く処理を後で実装
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(`Rolled session ${sessionId}`);
};

export const addRollJob = (sessionId: string): void => {
    rollJobQueue.addJob(() => rollRequestJob(sessionId));
};