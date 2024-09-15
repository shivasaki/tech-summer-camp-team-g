import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <p>ホーム</p>
      <p>ログイン</p>
      <input type="email" placeholder="メールアドレス" />
      <input type="password" placeholder="パスワード" />
      <Link to="/token">ログイン</Link>
      <p>新規登録</p>
      <input type="text" placeholder="ユーザー名" />
      <input type="email" placeholder="メールアドレス" />
      <input type="password" placeholder="パスワード" />
      <Link to="/account/register">新規登録</Link>

      <Link to="/reference">リファレンスを見る</Link>
    </div>
  );
}
