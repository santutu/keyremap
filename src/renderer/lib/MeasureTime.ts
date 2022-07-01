export default class MeasureTime {

    time: number = 0;


    reset() {
        return this.time = Date.now();

    }

    check(): number {
        return Date.now() - this.time;
    }
}