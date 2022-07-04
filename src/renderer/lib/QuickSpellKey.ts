import {Properties, PropertiesOmit, PropertiesOptional} from "../types/types";
import Throttling from "./Throttling";

export enum KeyStatus {
    Down,
    Up,

}

export class QuickSpellKey {
    keyCode!: number;
    key!: string;
    button!: 'left' | 'right';
    returnKey!: string | null;
    returnKeyCode !: number | null

    throttling = new Throttling(120);

    keyStatus: KeyStatus = KeyStatus.Up

    constructor(props: Properties<QuickSpellKey> | any) {
        Object.assign(this, props);
    }
}