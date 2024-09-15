import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function Register() {
  return (
    <div className="max-w-96">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">新規登録</CardTitle>
          <CardDescription>dice-o-genのアカウントを作成</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="min-w-72">
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
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit">新規登録</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
