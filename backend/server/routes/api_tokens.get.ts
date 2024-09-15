type TokenInfo = {
    token_id: string;
    created_at: Date;
    expires_at: Date;
}

type APIResponse = {
    token_list: TokenInfo[];
};

export default eventHandler(async (event) => {
    const session = await useSession(event, {
        password: "b9c2ad4e-5493-37ca-fedb-9b1dd40930f7",
    });
    if (!session.data.user_id) {
        return new Response("Forbidden", { status: 403 });
    }
    const user_id = session.data.user_id;

    // TODO: ユーザーIDからトークン情報の取得

    const response: APIResponse = {
        token_list: [
            {
                token_id: "token_id_1",
                created_at: new Date(),
                expires_at: new Date(),
            },
            {
                token_id: "token_id_2",
                created_at: new Date(),
                expires_at: new Date(),
            },
        ],
    };

    return response;
});
