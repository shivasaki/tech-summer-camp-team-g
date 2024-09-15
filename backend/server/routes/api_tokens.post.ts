type APIResponse = {
    token_id: string;
    token: string;
    created_at: Date;
    expires_at: Date;
};

export default eventHandler(async (event) => {
    const session = await useSession(event, {
        password: "b9c2ad4e-5493-37ca-fedb-9b1dd40930f7",
    });
    if (!session.data.user_id) {
        return new Response("Forbidden", { status: 403 });
    }
    const user_id = session.data.user_id;

    // TODO: トークンDBの作成

    const response: APIResponse = {
        token_id: "token_id",
        token: "token",
        created_at: new Date(),
        expires_at: new Date(),
    };

    return response;
});
