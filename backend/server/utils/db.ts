import pg from "pg";
const { Client } = pg;

const client = new Client({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: "postgres",
});

console.log("connecting to db,", [
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  process.env.DATABASE_HOST,
  process.env.DATABASE_PORT,
]);

client.connect();

export const query = async (text, params) => {
  const result = await client.query(text, params);
  return result;
};
