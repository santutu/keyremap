import {randomSleep, sleep} from "../utils/utils";
import {Status} from "./Status";
import {injectable} from "inversify";
import {robot} from "./constants";
import SetInterval from "./SetInterval";


@injectable()
export default class ShuffleSpells {

    public setInterval = new SetInterval();
    public status: Status = Status.STOP

    use = false

    constructor() {
    }

    private idx = 0;

    private keys: string[] = ['2', '1', '1', '1', '1'];
    private lastKey: string = '1';

    isShuffleKey(key: string) {
        return this.keys.includes(key)
    }

    public async run() {

        if (!this.use) {
            return
        }
        // return
        if (this.isRunning()) {
            return;
        }

        this.status = Status.RUNNING;

        this.setInterval.run(100, async () => {


            if (this.isStop() || this.isPause()) {
                this.mouseUp()
                return;
            }

            this.idx++;
            if (this.idx >= this.keys.length) this.idx = 0
            // console.log('shuffle :', this.keys[this.idx])

            const key = this.keys[this.idx]

            if (this.isStop() || this.isPause()) {
                this.mouseUp()
                return;
            }

            robot.keyToggle(key, 'up');
            if (this.isStop() || this.isPause()) {
                this.mouseUp()
                return;
            }
            robot.keyToggle(key, 'down');
            if (this.isStop() || this.isPause()) {
                this.mouseUp()
                return;
            }
            this.lastKey = key;
            if (this.isStop() || this.isPause()) {
                this.mouseUp()
                return;
            }

        })


    }

    mouseUp() {
        robot.keyToggle(this.lastKey, 'up');
    }

    public pause() {
        this.status = Status.PAUSE;
        this.setInterval.stop();
        this.mouseUp()
    }

    public stop() {
        this.status = Status.STOP
        this.setInterval.stop();
        this.mouseUp()
    }

    public isStop() {
        return this.status === Status.STOP;
    }

    public isRunning() {
        return this.status === Status.RUNNING;
    }

    public isPause() {
        return this.status === Status.PAUSE;
    }
}
