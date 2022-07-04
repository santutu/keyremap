import {Status} from "./Status";
import {injectable} from "inversify";
import {randomSleep, sleep} from "../utils/utils";
import {robot} from "./constants";
import {QuickSpellKey} from "./QuickSpellKey";
import Throttling from "./Throttling";
import SetInterval from "./SetInterval";

@injectable()
export default class AutoClick {

    public status: Status = Status.STOP
    public defaultKey!: QuickSpellKey;
    public beforeSmartSpellKey: QuickSpellKey | null = null;
    public setInterval = new SetInterval();

    public click: string = "left"

    setDefaultKey(defaultKey: QuickSpellKey) {
        this.defaultKey = defaultKey
    }

    public async toggle() {
        if (this.isRunning()) {
            this.stop();
        } else {
            await this.run();
        }


    }

    public async run() {

        if (this.isRunning()) {
            return;
        }

        this.status = Status.RUNNING;
        // robot.keyTap('f1')

        this.setInterval.run(100, async () => {
            this.beforeSmartSpellKey = null;

            if (this.isStop() || this.isPause()) {
                this.beforeSmartSpellKey = this.defaultKey
                // robot.keyTap(this.defaultKey.key)
                this.setInterval.stop();
                return;
            }
            // await randomSleep(101, 201);
            this.mouseUp()

            robot.mouseClick(this.click);
            robot.mouseToggle('down', this.click);// await sleep(1);
            console.log(`auto  ${this.click} click`)
        });


    }

    mouseUp() {
        robot.mouseToggle('up', this.click);
    }

    public stop() {
        this.status = Status.STOP
        this.mouseUp()
    }

    public isStop() {
        return this.status === Status.STOP;
    }

    public isRunning() {
        return this.status === Status.RUNNING;
    }

    public pause() {
        this.status = Status.PAUSE;
        this.mouseUp()
    }

    public isPause() {
        return this.status === Status.PAUSE;
    }
}