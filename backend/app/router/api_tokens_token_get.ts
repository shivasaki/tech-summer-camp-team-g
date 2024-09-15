import { Router, Response } from "express";
import { query } from "../utils/db";

const router = Router();

const apiTokensTokenGetRouter = router.get("/api_tokens/:token_id", async (req, res: Response) => {
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

    const sessionAll = await query(
      `SELECT * FROM user_session WHERE session_id = $1`,
      [sessionId]
    );

    if (session.rows.length === 0) {
      return res.status(403).json({ error: "expired session" });
    }

    console.log(session.rows[0].expired_at, new Date());

    // ユーザーIDを取得
    const userId = session.rows[0].user_id;
    
    // APIトークンの取得
    if(!req.params.token_id){
      res.status(400).json({ error: "Invalid session ID" });
    }
    const tokenId = req.params.token_id;

    // トークン情報の取得
    const token = await query(
      `SELECT * FROM token WHERE token_id = $1`,
      [tokenId]
    );

    const tokenExpired = await query(
      `SELECT * FROM token WHERE token_id = $1 AND expired_at > $2`,
      [tokenId, new Date()]
    );

    // トークンが存在するか確認
    if (token.rows.length === 0) {
      return res.status(404).json({ error: "Token not found" });
    }

    // トークンの有効期限を確認
    if (tokenExpired.rows.length === 0) {
      return res.status(403).json({ error: "Token expired" });
    }

    const tokenUserId = token.rows[0].user_id;

    // ユーザーIDが一致するか確認
    if (userId !== tokenUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.status(200).json({ token: token.rows[0].token });

  } catch (error) {
    console.error("Error creating roll session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default apiTokensTokenGetRouter;
