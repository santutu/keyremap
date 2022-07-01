import {injectable} from "inversify";
import {robot} from "./constants";
import {RGB} from "./ScreenCapture";
import BaseModule from "./BaseModule";

export enum Potion {
    HP = 'HP',
    MANA = 'MANA',
    PURPLE = 'PURPLE',
    NONE = 'NONE',
}

export class BeltSlot {
    constructor(public idx: number) {
    }

    potion!: Potion;
}

@injectable()
export default class BeltManager extends BaseModule {


    constructor() {
        super();
    }

    use(idx: number) {
        if (!(idx >= 0 && idx <= 3)) {
            throw new Error("idx is must be 0~3");
        }

        robot.keyTap("f"+(idx + 9).toString());
    }

    firstSlot: BeltSlot = new BeltSlot(0);
    secondSlot: BeltSlot = new BeltSlot(1);
    thirdSlot: BeltSlot = new BeltSlot(2);
    fourthSlot: BeltSlot = new BeltSlot(3);

    get slots() {
        return [this.firstSlot, this.secondSlot, this.thirdSlot, this.fourthSlot];
    }

    async execute() {
        let xList = [1025, 1082, 1138, 1193];
        const startY = 1037
        const endY = 1057;

        for (let i = 0; i < 4; i++) {
            this.slots[i].potion = Potion.NONE;

            for (let y = startY; y <= endY; y++) {
                const rgb = this.gameImage.getPixel(xList[i], y)
                if (this.isPurple(rgb)) {
                    this.slots[i].potion = Potion.PURPLE
                    break
                }

                if (this.isRed(rgb)) {
                    this.slots[i].potion = Potion.HP;
                    break
                }


                if (this.isBlue(rgb)) {
                    this.slots[i].potion = Potion.MANA
                    break
                }


            }

        }

        console.log(this.slots.map(slot=>slot.potion));

    }

    findHpPotion(): [boolean, number] {
        const slot = this.slots.find(slot => slot.potion === Potion.HP)

        return [!!slot, slot?.idx!]
    }

    findPurplePotion(): [boolean, number] {
        const slot = this.slots.find(slot => slot.potion === Potion.PURPLE)

        return [!!slot, slot?.idx!]
    }

    findManaPotion(): [boolean, number] {
        const slot = this.slots.find(slot => slot.potion === Potion.MANA)

        return [!!slot, slot?.idx!]
    }


    private isRed(rgb: RGB) {
        return rgb.r > 160 && rgb.g < 100 && rgb.b < 100
    }

    private isBlue(rgb: RGB) {
        return rgb.r < 70 && rgb.g < 70 && rgb.b > 90
    }


    private isPurple(rgb: RGB) {
        return rgb.r > 120 && rgb.g < 75 && rgb.b > 120
    }
}