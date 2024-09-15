import { Router, Response } from "express";
import { query } from "../utils/db";
import { v4 as uuid } from "uuid";

const router = Router();

type LoginRequestBody = {
  email: string;
  password: string;
};

const loginRouter = router.post("/account/login", async (req, res: Response) => {
  try {
    const body: LoginRequestBody = req.body;
    if (!body.email || !body.password) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // ユーザーを検索
    const result = await query(
      `SELECT * FROM "user" WHERE email = $1 AND password = $2`,
      [body.email, body.password]
    );
    console.log(result);

    // ユーザーがいなければエラー
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userId = result.rows[0].id;

    const now = new Date();

    // セッションを作成
    const session = await query(
      `INSERT INTO user_session (id, session_id, user_id, created_at, expired_at) VALUES ($1, $2, $3, $4, $5) RETURNING session_id`,
      [uuid(), uuid(), userId, now, new Date(now.getTime() + 1000 * 60 * 60 * 24)]
    );
    const sessionId = session.rows[0].session_id;

    // セッションIDをCookieにセット
    res.cookie("session_id", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Successfully logged in" });
  } catch (error) {
    console.error("Error creating roll session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default loginRouter;
