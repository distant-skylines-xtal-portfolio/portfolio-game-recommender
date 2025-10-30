/**
 * Rate Limiter class to manage API calls
 */
class RateLimiter {
    private queue: Array<() => Promise<void>> = [];
    private processing = false;
    private requestsPerSeconds: number;
    private delayBetweenRequests: number;

    constructor(requestsPerSecond: number = 3) {
        this.requestsPerSeconds = requestsPerSecond;
        this.delayBetweenRequests = 1000 / requestsPerSecond;
    }

    /**
     * Add a request to the queue and start processing
     * @param fn Async Function to add to the queue
     * @returns Promise that resolves when the request completes
     */
    async add<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await fn();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });

            if (!this.processing) {
                this.process();
            }
        });
    }

    /**
     * Process all items in the queue with rate limiting
     * @returns Returns early if already processing or nothing to process
     */
    private async process() {
        if (this.processing || this.queue.length === 0) {
            return;
        }

        this.processing = true;

        while (this.queue.length > 0) {
            const fn = this.queue.shift();
            if (fn) {
                await fn();

                if (this.queue.length > 0) {
                    await this.delay(this.delayBetweenRequests);
                }
            }
        }

        this.processing = false;
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    getQueueLength(): number {
        return this.queue.length;
    }

    clear() {
        this.queue = [];
    }
}

export const coverRateLimiter = new RateLimiter(3);
