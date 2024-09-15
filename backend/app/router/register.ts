import { Router, Response } from "express";
import { query } from "../utils/db";
import { v4 as uuid } from "uuid";

const router = Router();

type RegisterRequestBody = {
  email: string;
  password: string;
  displayName: string;
};

const registerRouter = router.post("/account/register", async (req, res: Response) => {
  try {
    const body: RegisterRequestBody = req.body;
    console.log(body.displayName);
    if (!body.email || !body.password || !body.displayName) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // TODO: 同じメールアドレスが登録済みかどうかを確認する

    // ユーザーを作成
    const result = await query(
      `INSERT INTO "user" (id, display_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
      [uuid(), body.displayName, body.email, body.password]
    );
    console.log(result);
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
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Error creating roll session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default registerRouter;
