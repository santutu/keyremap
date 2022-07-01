import ScreenCapture, {Image} from "./ScreenCapture";
import BeltManager from "./BeltManager";
import PotionHelper from "./PotionHelper";
import sharp from "sharp";
import {Status} from "./Status";
import BaseModule from "./BaseModule";
import {injectable} from "inversify";

@injectable()
export default class GameImageModuleManager {

    gameImage!: Image;
    public status: Status = Status.STOP

    modules: BaseModule[] = [
        this.beltManager,
        this.potionHelper
    ];

    constructor(
        private screenCapture: ScreenCapture,
        private beltManager: BeltManager,
        private potionHelper: PotionHelper
    ) {

    }


    async run() {

        await this.screenCapture.init("Game");

        if (this.status === Status.RUNNING) {
            return;
        }
        this.status = Status.RUNNING;

        let executingCount = 0

        while (true) {
            if (this.status !== Status.RUNNING) {
                return;
            }
            executingCount += 1;
            console.log('executingCount', executingCount);


            // this.gameImage = await new Image(sharp("./sample-images/pd2-2.jpeg")).init();
            this.gameImage = await new Image(
                await this.screenCapture.capture()
            ).init();

            // await this.gameImage.img.jpeg().toFile("./sample.jpeg");
            // this.gameImage = await new Image(sharp("./sample.jpeg")).init();

            for (const module of this.modules) {

                if (this.status !== Status.RUNNING) {
                    return;
                }

                module.setGameImage(this.gameImage)
                await module.execute()

            }


        }

    }

    stop() {
        this.status = Status.STOP
    }

}