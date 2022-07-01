import {randomSleep, sleep} from "../utils/utils";
import {Status} from "./Status";
import {injectable} from "inversify";
import {robot} from "./constants";


@injectable()
export default class ShuffleSpells {


    public status: Status = Status.STOP


    constructor() {
    }

    private idx = 0;

    private keys: string[] = ['1', '2'];
    private min = 101
    private max = 199

    public async run() {

        return
        if (this.isRunning()) {
            return;
        }

        this.status = Status.RUNNING;

        while (true) {
            // if (this.isPause()) {
            //     while (true) {
            //         await sleep(50);
            //         if(!this.isPause()) break
            //     }
            // }

            if (this.isStop() || this.isPause()) {
                break;
            }
            await randomSleep(this.min, this.max);

            this.idx++;
            if (this.idx >= this.keys.length) this.idx = 0
            console.log('shuffle :', this.keys[this.idx])

            if (this.isStop() || this.isPause()) {
                break;
            }

            robot.keyTap(this.keys[this.idx]);
            if (this.isStop() || this.isPause()) {
                break;
            }

        }

    }

    public pause() {
        this.status = Status.PAUSE;
    }

    public stop() {
        this.status = Status.STOP
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
