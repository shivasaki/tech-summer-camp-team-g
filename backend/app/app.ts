import { Request, Response } from "express";
import rollRouter from "./router/roll";
import registerRouter from "./router/register";
import loginRouter from "./router/login";
import meRouter from "./router/me";
import apiTokensPostRouter from "./router/api_tokens_post";
import apiTokensGetRouter from "./router/api_tokens_get";
import apiTokensTokenGetRouter from "./router/api_tokens_token_get";
import express from "express";
import cookieParser from "cookie-parser";

export const app = express();
const port = 3000;

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World!");
});

// クッキーパーサーをミドルウェアとして使う
app.use(cookieParser());

// JSON のリクエストボディを解析するミドルウェア
app.use(express.json());

// URL エンコードされたデータのリクエストボディを解析するミドルウェア
app.use(express.urlencoded({ extended: true }));

app.use(rollRouter);
app.use(registerRouter);
app.use(loginRouter);
app.use(meRouter);
app.use(apiTokensPostRouter);
app.use(apiTokensGetRouter);
app.use(apiTokensTokenGetRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
