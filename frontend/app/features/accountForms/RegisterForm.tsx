import { FormEvent, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const RegisterForm = () => {
  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    // 仮でバリデーション
    if (username === "") {
      alert("ユーザー名を入力してください");
      return;
    }

    if (
      typeof email === "string" &&
      !/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim.test(email)
    ) {
      alert("メールアドレスの形式が正しくありません");
      return;
    }

    if (
      password === "" ||
      (typeof password === "string" && password.length < 8)
    ) {
      alert("パスワードは8文字以上で入力してください");
      return;
    }

    await fetch("api/account/register", {
      method: "POST",
      body: JSON.stringify({ displayName: username, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return false;
  }, []);

  return (
    <form className="min-w-72 flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="username">ユーザー名</Label>
          <Input id="username" type="name" name="username" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" type="email" name="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">パスワード</Label>
          <Input id="password" type="password" name="password" />
        </div>
      </div>
      <Button type="submit">新規登録</Button>
    </form>
  );
};
