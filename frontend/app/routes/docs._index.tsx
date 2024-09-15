import { Link } from "@remix-run/react";

export default function Reference() {
  return (
    <div>
      <p>リファレンス</p>
      <p>ここにリファレンスを書く</p>

      <Link to="/">ホームに戻る</Link>
    </div>
  );
}