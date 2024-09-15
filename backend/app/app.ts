import { Request, Response } from "express";
import rollRouter from "./router/roll";
import statusRouter from "./router/status";
import express from "express";

export const app = express();
const port = 3000;

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(rollRouter);
app.use(statusRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
