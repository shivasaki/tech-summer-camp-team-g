import { Router, Response } from "express";
import { query } from "../utils/db";
import { v4 as uuid } from "uuid";

const router = Router();

const apiTokensPostRouter = router.post("/api_tokens", async (req, res: Response) => {
  try {
    // CookieからセッションIDを取得
    if (!req.cookies.session_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const sessionId = req.cookies.session_id;

    // セッションIDの有効期限を確認
    const session = await query(
      `SELECT * FROM user_session WHERE session_id = $1 AND expired_at > $2`,
      [sessionId, new Date()]
    );

    if (session.rows.length === 0) {
      return res.status(403).json({ error: "expired session" });
    }

    console.log(session.rows[0].expired_at, new Date());

    // ユーザーIDを取得
    const userId = session.rows[0].user_id;

    const now = new Date();

    // トークンの生成
    const result = await query(
      `INSERT INTO token (id, token, token_id, user_id, created_at, expired_at, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [uuid(), uuid(), uuid(), userId, now, new Date(now.getTime() + 1000 * 60 * 60 * 24), true]
    );
    res.status(201).json({
      token: result.rows[0].token,
      token_id: result.rows[0].token_id,
      created_at: result.rows[0].created_at,
      expired_at: result.rows[0].expired_at,
    });
  } catch (error) {
    console.error("Error creating roll session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default apiTokensPostRouter;
