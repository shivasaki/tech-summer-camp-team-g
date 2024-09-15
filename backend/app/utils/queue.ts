export default class Queue{
    private queue: (() => Promise<void>)[] = [];
    private processing: boolean = false; // 処理中かどうかを管理

    // ジョブをキューに追加
    public addJob(job: () => Promise<void>): void {
        this.queue.push(job);
        this.processNext();
    }

    // 次のジョブを処理
    private async processNext(): Promise<void> {
        if (this.processing || this.queue.length === 0) {
            return;
        }

        this.processing = true;
        const job = this.queue.shift(); // キューから次のジョブを取得

        if (job) {
            try {
                await job(); // ジョブを実行
                console.log('Job completed');
            } catch (err) {
                console.error('Job failed:', err);
            } finally {
                this.processing = false;
                this.processNext(); // 次のジョブを処理
            }
        }
    }
}