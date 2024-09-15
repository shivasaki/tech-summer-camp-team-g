import { Request, Response } from "express";
import rollRouter from "./router/roll";
import express from "express";

export const app = express();
const port = 3000;

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(rollRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
