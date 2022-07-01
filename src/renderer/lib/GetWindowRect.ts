import SpawnExecutor from "../systems/lib/SpawnExecutor";
import {injectable} from "inversify";


export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface RawRect {
    Left: number;
    Top: number;
    Right: number;
    Bottom: number;
}

@injectable()
export default class GetWindowRect {

    constructor(
        private spawnExecutor: SpawnExecutor
    ) {
    }


    public async getRect(processName: string): Promise<Rect> {
        const jsonString = await this.spawnExecutor.executeAndWait(
            `./third-party/GetWindowRect/GetWindowRect/bin/Release/net6.0/GetWindowRect.exe`,
            processName
        )
        try {
            const rawRect: RawRect = JSON.parse(jsonString);
            return {
                top: rawRect.Top,
                left: rawRect.Left,
                width: rawRect.Right - rawRect.Left,
                height: rawRect.Bottom - rawRect.Top
            }

        } catch (e) {
            console.log(jsonString);
            throw e;
        }
    }

}