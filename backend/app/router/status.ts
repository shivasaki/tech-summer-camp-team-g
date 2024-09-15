import { Router, Response } from "express";
import { query } from "../utils/db";
import { v4 as uuid } from "uuid";

const router = Router();

const statusRouter = router.post("/status/:session_id", async (req, res: Response) => {
  try {
    const tokenId = "467dfc0b-aeb0-424e-98c0-e63b0004f7f2";
    if(!req.params.session_id){
      res.status(400).json({ error: "Invalid session ID" });
    }

    const result = await query(
      `SELECT * FROM roll_session WHERE id = $1`,
      [req.params.session_id]
    );
    if(result.rows[0].completed_at){
      res.status(200).json({ status: "resolved", result: result.rows[0].result });
      return;
    }
    if(result.rows[0].rolled_at){
      res.status(200).json({ status: "rolling", result: null });
      return;
    }
    res.status(200).json({ status: "waiting", result: null });
  } catch (error) {
    console.error("Error creating roll session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default statusRouter;
