import {injectable} from "inversify";
import GetWindowRect, {Rect} from "./GetWindowRect";
import sharp, {OutputInfo, Sharp} from "sharp";
import {extract} from "query-string";

const screenshot = require('screenshot-desktop')

export class RGB {
    constructor(
        public r: number,
        public g: number,
        public b: number,
    ) {
    }
}

export class Image {
    buffer!: { data: Buffer; info: OutputInfo }

    constructor(public img: Sharp) {


    }

    async init() {


        this.buffer = await this.img.raw().toBuffer({resolveWithObject: true});

        return this;
    }


    get width() {
        return this.buffer.info.width
    }

    get height() {
        return this.buffer.info.height
    }

    getPixel(x: number, y: number) {
        const channels = 3
        const idx = (this.width * y + x) * channels;
        return new RGB(this.buffer.data[idx], this.buffer.data[idx + 1], this.buffer.data[idx + 2])

    }
}


@injectable()
export default class ScreenCapture {

    rect !: Rect;
    processName !: string

    constructor(
        private getWindowRect: GetWindowRect
    ) {
    }

    async init(processName: string) {
        this.rect = await this.getWindowRect.getRect(processName);
        this.processName = processName;
    }

    async capture() {
        const buffer = await screenshot({format: 'jpeg'})

        const rect: Rect = {
            left: this.rect.left,
            width: this.rect.width,
            top: this.rect.top,
            height: this.rect.height,
        }

        return sharp(buffer).extract(rect)


    }
}