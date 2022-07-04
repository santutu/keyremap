import {injectable} from "inversify";
import {Status} from "./Status";
import ShuffleSpells from "./ShuffleSpells";
//https://github.com/octalmage/robotjs
//https://robotjs.io/docs/syntax#mouseclickbutton-double
//https://wilix-team.github.io/iohook/usage.html#available-events
import {ioHook, robot} from "./constants";
import AutoClick from "./AutoClick";
import {MouseEvent} from "./MouseEvent";
import {KeyEvent} from "./KeyEvent";
import {KeyStatus, QuickSpellKey} from "./QuickSpellKey";
import GameImageModuleManager from "./GameImageModuleManager";
import {randomSleep} from "../utils/utils";
import Throttling from "./Throttling";
import {defaultKey, spellKeys} from "./SpellKeys";


@injectable()
export default class Robot {

    public status: Status = Status.STOP

    private leftClickThrottling = new Throttling(120);

    constructor(
        private shuffleSpells: ShuffleSpells,
        private autoLeftClick: AutoClick,
        private autoRightClick: AutoClick,
        private moduleManager: GameImageModuleManager,
    ) {
        this.autoRightClick.click = 'right'
        this.autoLeftClick.setDefaultKey(new QuickSpellKey({keyCode: 44, key: 'z', button: 'right', returnKey: 'z', returnKeyCode: 44}));
        this.autoRightClick.setDefaultKey(new QuickSpellKey({keyCode: 44, key: 'z', button: 'right', returnKey: 'z', returnKeyCode: 44}));
    }

    get autoClickStatus() {
        return this.autoLeftClick.status;
    }

    get autoRightClickStatus() {
        return this.autoRightClick.status;
    }

    get shuffleStatus() {
        return this.shuffleSpells.status
    }

    private defaultKey: QuickSpellKey = defaultKey;
    private defaultKeyZ: QuickSpellKey = new QuickSpellKey({keyCode: 44, key: 'z', button: 'right', returnKey: 'z', returnKeyCode: 44})

    private pressedSubKey: boolean = false;
    private beforeSmartSpellKey: QuickSpellKey | null = null;

    async initialize() {


        const subKeyCode = 41;

        this.status = Status.STOP

        //quickSpell
        const quickSpellKeyList: QuickSpellKey[] = spellKeys

        ioHook.on('keydown', async (evt: KeyEvent) => {

            if (!this.isRunning()) {
                return;
            }
            //
            // if (this.beforeSmartSpellKey?.keyCode === evt.keycode
            //     || this.autoLeftClick.beforeSmartSpellKey?.returnKeyCode === evt.keycode
            //     || this.autoRightClick.beforeSmartSpellKey?.returnKeyCode === evt.keycode
            // ) {
            //     console.log('return beforeSmartSpellKey', this.beforeSmartSpellKey?.keyCode)
            //     this.beforeSmartSpellKey = null;
            //     this.autoLeftClick.beforeSmartSpellKey = null;
            //     this.autoRightClick.beforeSmartSpellKey = null;
            //     return;
            // }


            for (const quickSpellKey of quickSpellKeyList) {

                if (evt.keycode === quickSpellKey.keyCode) {
                    if (this.shuffleSpells.isRunning()) {
                        this.shuffleSpells.pause();
                    }


                    if (this.autoLeftClick.isRunning()) {
                        this.autoLeftClick.pause();
                    }

                    if (this.autoRightClick.isRunning()) {
                        this.autoRightClick.pause();
                    }

                    // this.beforeSmartSpellKey = quickSpellKey;

                    // console.log('try quick spell', quickSpellKey.button)
                    if (!quickSpellKey.throttling.check()) {
                        return
                    }

                    // console.log('1quick spell', quickSpellKey.button)

                    // robot.keyTap(quickSpellKey.key);
                    // await randomSleep(21, 51);

                    robot.mouseToggle('down', quickSpellKey.button);
                    quickSpellKey.keyStatus = KeyStatus.Down;
                    // robot.mouseClick(quickSpellKey.button);
                    console.log('2quick spell', quickSpellKey.button)

                    return;

                }
            }

        });

        ioHook.on('keyup', (evt: KeyEvent) => {
            if (!this.isRunning()) {
                return;
            }1

            for (const quickSpellKey of quickSpellKeyList) {
                if (evt.keycode === quickSpellKey.keyCode) {
                    if (this.shuffleSpells.isPause()) {
                        this.shuffleSpells.run();
                    }

                    if (this.autoLeftClick.isPause()) {
                        this.autoLeftClick.run();
                    }

                    if (this.autoRightClick.isPause()) {
                        this.autoRightClick.run();
                    }

                    robot.mouseToggle('up', quickSpellKey.button);
                    quickSpellKey.keyStatus = KeyStatus.Up;
                    return;
                    if (quickSpellKey.returnKey === null) {
                        return
                    }
                    robot.keyTap(quickSpellKey.returnKey);

                    return;
                }
            }
        });


        //alt -> toggle ']' key
        ioHook.on('keyup', (evt: KeyEvent) => {
            if (evt.keycode === 56) {
                if (!this.isRunning()) {
                    return;
                }
                robot.keyTap(']');
            }
        });


        //subKey
        ioHook.on('keydown', (evt: KeyEvent) => {
            if (evt.keycode === subKeyCode) {
                this.pressedSubKey = true;
            }
        });

        ioHook.on('keyup', (evt: KeyEvent) => {
            if (evt.keycode === subKeyCode) {
                this.pressedSubKey = false;
            }
        });


        //left click
        ioHook.on('keydown', (evt: KeyEvent) => {
            // left click
            if (evt.keycode === 57) {
                this.leftClick();
            }
        });
        ioHook.on('mouseclick', (evt: MouseEvent) => {
            if (evt.button === 4) {
                this.leftClick();
            }
        })


        //right click
        ioHook.registerShortcut(
            [subKeyCode, 57],
            (keys) => {
                if (this.isRunning()) {
                    console.log("right")
                    robot.mouseClick('right');


                }
            }, (keys) => {

            }
        );

        //toggle auto right click
        ioHook.registerShortcut(
            [29, 41],
            (keys) => {

                if (this.autoLeftClick.isRunning()) {
                    this.autoLeftClick.stop();

                    this.shuffleSpells.stop();
                } else {
                    this.autoLeftClick.run();
                    this.shuffleSpells.run();
                    this.autoRightClick.stop();
                }
            }, (keys) => {

            }
        );


        //toggle right click
        ioHook.registerShortcut(
            [56, 41],
            (keys) => {

                if (this.autoRightClick.isRunning()) {
                    this.autoRightClick.stop();

                } else {
                    this.autoRightClick.run();
                    this.autoLeftClick.stop();
                }
            }, (keys) => {

            }
        );


        //toggle
        ioHook.registerShortcut(
            [15, 41],
            (keys) => {
                if (this.isRunning()) {
                    this.moduleManager.stop();
                    this.stop()
                } else {
                    this.moduleManager.run();
                    this.start()
                }
            }, (keys) => {

            }
        );

        ioHook.start(false);


    }

    isStop() {
        return this.status === Status.STOP;
    }

    isRunning() {
        return this.status === Status.RUNNING;
    }

    stop() {
        this.status = Status.STOP
    }

    start() {
        this.status = Status.RUNNING
    }

    private leftClick() {
        if (this.isRunning() && !this.pressedSubKey) {
            if (this.leftClickThrottling.check()) {
                console.log("left")
                robot.mouseClick('left');
            }
            if (this.autoLeftClick.isRunning()) {
                this.autoLeftClick.stop();

                this.beforeSmartSpellKey = this.defaultKey;
                // robot.keyTap(this.defaultKey.key)

            }

            if (this.autoRightClick.isRunning()) {
                this.autoRightClick.stop();


            }

            // this.moduleManager.stop();

            if (this.shuffleSpells.isRunning() || this.shuffleSpells.isPause()) {
                this.shuffleSpells.stop();
            }
        }
    }


}