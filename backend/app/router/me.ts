import { Router, Response } from "express";
import { query } from "../utils/db";

const router = Router();

const meRouter = router.get("/account/me", async (req, res: Response) => {
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

    // ユーザー情報を取得
    const user = await query(
      `SELECT * FROM "user" WHERE id = $1`, 
      [userId]
    );

    res.status(200).json({
      displayName: user.rows[0].display_name,
      email: user.rows[0].email,
    });
  } catch (error) {
    console.error("Error creating roll session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default meRouter;
