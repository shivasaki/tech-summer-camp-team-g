import { Link } from "@remix-run/react";

export default function Token() {
  return (
    <div>
      <p>トークン取得</p>
      <button>トークンを取得する</button>
      <p>トークンは、""です。</p>

      <Link to="/">ホームに戻る</Link>
    </div>
  );
}
