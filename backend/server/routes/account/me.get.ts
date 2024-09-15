export default eventHandler(async (event) => {
    const session = await useSession(event, {
        password: "b9c2ad4e-5493-37ca-fedb-9b1dd40930f7",
    });
    if (!session.data.user_id) {
        return new Response("Forbidden", { status: 403 });
    }
    const user_id = session.data.user_id;

    // TODO: ユーザーIDからユーザー情報を取得する
    const email = "";
    const display_name = "";

    return {
        email,
        display_name,
    };
});
