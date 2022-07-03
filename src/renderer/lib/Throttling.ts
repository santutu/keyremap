export default class Throttling {

    private before: number = 0;


    constructor(
        private interval: number
    ) {
    }


    check(): boolean {
        if (this.before === 0) {
            this.before = Date.now();
            return true;
        }
        const now = Date.now();
        // console.log('Throttling', now - this.before)
        if (now - this.before >= this.interval) {
        console.log('Throttling ON', now - this.before)
            this.before = Date.now();
            return true;
        }

        return false;

    }
}