import {RGB} from "./ScreenCapture";
import {injectable} from "inversify";
import BeltManager from "./BeltManager";
import BaseModule from "./BaseModule";
import MeasureTime from "./MeasureTime";

@injectable()
export default class PotionHelper extends BaseModule {

    constructor(
        private beltManager: BeltManager
    ) {
        super();
    }


    eatWhenBelowHpPercent = 75
    eatPurpleWhenBelowHpPercent = 50
    eatWhenBelowManaPercent = 15

    measureAteHpPotionTime: MeasureTime = new MeasureTime();
    measureAtePurplePotionTime: MeasureTime = new MeasureTime();
    measureAteManaPotionTime: MeasureTime = new MeasureTime();


    async execute() {

        const hpPercent = this.getHpPercent();
        const manaPercent = this.getManaPercent();

        // console.log('hpPercent', hpPercent)
        // console.log('manaPercent', manaPercent)


        if (hpPercent < this.eatWhenBelowHpPercent) {
            const [found, idx] = this.beltManager.findHpPotion();
            if (found && this.measureAteHpPotionTime.check() > 1000 * 5) {
                this.beltManager.use(idx)
                this.measureAteHpPotionTime.reset();

            }
        }

        if (hpPercent < this.eatPurpleWhenBelowHpPercent) {
            const [found, idx] = this.beltManager.findPurplePotion();
            if (found && this.measureAtePurplePotionTime.check() > 300) {
                this.beltManager.use(idx)
                this.measureAtePurplePotionTime.reset();
            }
        }

        if (manaPercent < this.eatWhenBelowManaPercent) {
            const [found, idx] = this.beltManager.findManaPotion();
            if (found && this.measureAteManaPotionTime.check() > 1000 * 5) {
                this.beltManager.use(idx)
                this.measureAteManaPotionTime.reset();
            }
        }
    }


    private getHpPercent() {
        const startY = 916;
        const endY = 1041;
        const length = endY - startY + 1
        let spendLength = 0;
        for (let y = startY; y < endY; y++) {
            const rgb = this.gameImage.getPixel(126, y)
            // console.log(126, y);
            // console.log(rgb);
            if (this.isRed(rgb) || this.isGreen(rgb)) {
                // console.log(y);
                break;
            }
            spendLength += 1;
        }
        return (length - spendLength) / length * 100;
    }

    private isRed(rgb: RGB) {
        return rgb.r > 90 && rgb.g < 25 && rgb.b < 25
    }

    private getManaPercent() {

        const startY = 917;
        const endY = 1025;
        const length = endY - startY + 1
        let spendLength = 0;
        for (let y = startY; y < endY; y++) {
            const rgb = this.gameImage.getPixel(1789, y)
            if (this.isBlue(rgb)) {
                break;
            }
            spendLength += 1;
        }
        return (length - spendLength) / length * 100;
    }


    private isBlue(rgb: RGB) {
        return rgb.r < 20 && rgb.g < 20 && rgb.b > 110
    }

    private isGreen(rgb: RGB) {
        return rgb.r < 60 && rgb.g > 100 && rgb.b < 50
    }

}