import { query } from "~/utils/db";

interface RequestBody {
  name: string;
}

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const testUserId = "a7b71153-f779-41e3-85af-bffadc8a0ce1";

  console.log("querying user");
  const user = await query("SELECT * FROM users WHERE id = $1", [testUserId]);
  console.log("user:", user);

  if (user.rows.length === 0) {
    await query(
      "INSERT INTO users (id, display_name, email, password) VALUES ($1, $2, $3, $4)",
      [testUserId, "initial テス太郎", "tesutaro@example.com", "testtest"]
    );
  }

  const userDisplayName = await query(
    "SELECT display_name FROM users WHERE id = $1",
    [testUserId]
  );

  return {
    display_name: userDisplayName,
  };
});
