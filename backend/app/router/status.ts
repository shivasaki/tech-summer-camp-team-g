import { Router, Response } from "express";
import { query } from "../utils/db";
import { v4 as uuid } from "uuid";

const router = Router();

const statusRouter = router.post("/status/:session_id", async (req, res: Response) => {
  try {
    if(!req.params.session_id){
      res.status(400).json({ error: "Invalid session ID" });
    }
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // トークンを取り出す
      const token = authHeader.split(' ')[1];
      console.log(token);

      // アドミンユーザーの場合は認証はスキップ
      if(token != process.env.API_ADMIN_USERNAME){
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
      }

      // セッションの状態を取得
      const result = await query(
        `SELECT * FROM roll_session WHERE id = $1 AND token_id = $2`,
        [req.params.session_id, token]
      );

      // セッションIDとトークンが一致するか確認
      if(result.rows.length === 0){
        res.status(404).json({ error: "Session not found" });
        return;
      }

      // セッションの状態を返却
      if(result.rows[0].completed_at){
        res.status(200).json({ status: "resolved", result: result.rows[0].result });
        return;
      }
      if(result.rows[0].rolled_at){
        res.status(200).json({ status: "rolling", result: null });
        return;
      }
      res.status(200).json({ status: "waiting", result: null });
    }
    else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error creating roll session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default statusRouter;
