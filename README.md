# Tech.SummerCamp 2024 チーム6

## 環境構築
1. リポジトリのクローン
    ```bash
    git clone https://github.com/shivasaki/tech-summer-camp-team-g
    cd tech-summer-camp-team-g
    ```

2. セットアップ
    Dockerのイメージをビルドしたりします。
    ```bash
    make setup
    ```

3. DBのマイグレーション
    ```bash
    make migrate
    ```

4. 開発コンテナの立ち上げ
    ```bash
    make dev
    ```


## その他便利コマンド
### ログを閲覧
```bash
make logs
```

### 開発コンテナの終了
```bash
make down
```

### 開発コンテナの際構築
⚠️ このコマンドは開発コンテナを再構築します。どっかのデータが消えるかもしれません。気をつけて！
```bash
make rebuild
```
