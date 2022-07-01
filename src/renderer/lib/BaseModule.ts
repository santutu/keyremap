import {Image} from "./ScreenCapture";
import {injectable} from "inversify";

@injectable()
export abstract class HasGameImage {

    gameImage!: Image;

    setGameImage(gameImage: Image) {
        this.gameImage = gameImage;
    };
}

@injectable()
export default abstract class BaseModule extends HasGameImage {

    abstract execute(): Promise<void>;


}