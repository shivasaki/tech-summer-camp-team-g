import { Router, Request, Response } from "express";
import { query } from "../utils/db";

const router = Router();

const rollRouter = router.post("/roll", async (req: Request, res: Response) => {
  try {
    const tokenId = "467dfc0b-aeb0-424e-98c0-e63b0004f7f2";
    console.log(tokenId);

    const requestedAt = new Date();

    // 新しいセッションを作成
    const result = await query(
      `INSERT INTO roll_session (token_id, requested_at) VALUES ($1, $2) RETURNING id`,
      [tokenId, requestedAt]
    );
    console.log(result);
    const sessionId = result.rows[0].id;

    // セッションIDを返却
    res.status(201).json({ sessionId, tokenId });
  } catch (error) {
    console.error("Error creating roll session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default rollRouter;
