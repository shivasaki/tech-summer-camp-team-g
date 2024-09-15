import { Request, Response } from "express";
import rollRouter from "./router/roll";
import registerRouter from "./router/register";
import loginRouter from "./router/login";
import express from "express";

export const app = express();
const port = 3000;

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World!");
});

// JSON のリクエストボディを解析するミドルウェア
app.use(express.json());

// URL エンコードされたデータのリクエストボディを解析するミドルウェア
app.use(express.urlencoded({ extended: true }));

app.use(rollRouter);
app.use(registerRouter);
app.use(loginRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
