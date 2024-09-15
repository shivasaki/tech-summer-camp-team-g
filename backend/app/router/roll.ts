import { Router, Response } from "express";
import { query } from "../utils/db";
import { addRollJob } from "../utils/rollJobQueue";
import { v4 as uuid } from "uuid";

const router = Router();

const rollRouter = router.post("/roll", async (req, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // トークンを取り出す
      const token = authHeader.split(' ')[1];
      console.log(token);

      // トークンの有効性を確認
      const tokenResult = await query(
        `SELECT * FROM token WHERE token = $1`,
        [token, new Date()]
      );

      const tokenExpired = await query(
        `SELECT * FROM token WHERE token = $1 AND expired_at > $2`,
        [token, new Date()]
      );

      if (tokenResult.rows.length === 0) {
        return res.status(404).json({ error: "Token not found" });
      }
      if (tokenExpired.rows.length === 0) {
        return res.status(403).json({ error: "Token expired" });
      }

      const requestedAt = new Date();

      // 新しいセッションを作成
      const result = await query(
        `INSERT INTO roll_session (id, token_id, requested_at) VALUES ($1, $2, $3) RETURNING id`,
        [uuid(), token, requestedAt]
      );
      console.log(result);
      const sessionId = result.rows[0].id;

      // ロールジョブをキューに追加
      addRollJob(sessionId);

      // セッションIDを返却
      res.status(201).json({ sessionId });
    }
    else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error creating roll session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default rollRouter;
