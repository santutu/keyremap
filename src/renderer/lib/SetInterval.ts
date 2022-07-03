export default class SetInterval {

    constructor() {
    }

    private interval: any;

    private isRunning: boolean = false

    run(interval: number, cb: () => void) {
        if (this.isRunning) return;

        this.isRunning = true;
        this.interval = setInterval(() => {
            cb()
        }, interval)
    }

    stop() {
        if (!this.isRunning) return;
        clearInterval(this.interval);
        this.isRunning = false;
    }
}