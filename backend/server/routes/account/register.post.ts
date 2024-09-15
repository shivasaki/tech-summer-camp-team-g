type PostRequest = Partial<{
    email: string,
    password: string,
    display_name: string,
}>;

export default defineEventHandler(async (event) => {
    const body = await readBody<PostRequest>(event);
    if(!body.password){
        throw new Error("Missing passsword");
    }
    if(!body.email){
        throw new Error("Missing email");
    }
    if(!body.display_name){
        throw new Error("Missing display name");
    }

    // TODO: ユーザーIDを生成する
    // TODO: ユーザー情報をDBに保存する
    const user_id = 1;

    const session = await useSession(event, {
        password: "b9c2ad4e-5493-37ca-fedb-9b1dd40930f7",
        maxAge: 60 * 60 * 24 * 30,
    });

    await session.update({
        user_id: user_id,
    });
});