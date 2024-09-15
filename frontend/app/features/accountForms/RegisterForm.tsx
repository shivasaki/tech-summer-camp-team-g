import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const RegisterForm = () => {
  return (
    <form className="min-w-72 flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="username">ユーザー名</Label>
          <Input id="username" type="text" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" type="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">パスワード</Label>
          <Input id="password" type="password" />
        </div>
      </div>
      <Button type="submit">新規登録</Button>
    </form>
  );
};
