import { Router, Response } from "express";
import { query } from "../utils/db";

type TokenInfo = {
  tokenId: string;
  createdAt: Date;
  expiredAt: Date;
};

const router = Router();

const apiTokensGetRouter = router.get("/api_tokens", async (req, res: Response) => {
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
      if (sessionAll.rows.length === 0) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      else{
        return res.status(403).json({ error: "expired session" });
      }
    }

    console.log(session.rows[0].expired_at, new Date());

    // ユーザーIDを取得
    const userId = session.rows[0].user_id;

    // APIトークンの取得
    const result = await query(
      `SELECT * FROM token WHERE user_id = $1 AND expired_at > $2`,
      [userId, new Date()]
    );

    const tokenList: TokenInfo[] = result.rows.map((row) => ({
      tokenId: row.token_id,
      createdAt: row.created_at,
      expiredAt: row.expired_at,
    }));

    res.status(200).json({ tokenList });

  } catch (error) {
    console.error("Error creating roll session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default apiTokensGetRouter;
