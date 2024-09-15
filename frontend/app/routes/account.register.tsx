import { Link } from "@remix-run/react";

export default function Register() {
  return (
    <div>
      <p>新規登録</p>
      <input type="text" placeholder="ユーザー名" />
      <input type="email" placeholder="メールアドレス" />
      <input type="password" placeholder="パスワード" />
      <Link to="/token">新規登録</Link>
    </div>
  );
}
