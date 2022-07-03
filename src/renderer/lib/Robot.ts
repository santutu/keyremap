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
import {QuickSpellKey} from "./QuickSpellKey";
import GameImageModuleManager from "./GameImageModuleManager";
import {randomSleep} from "../utils/utils";
import Throttling from "./Throttling";


@injectable()
export default class Robot {

    public status: Status = Status.STOP

    private leftClickThrottring = new Throttling(120);
    private quickSpellThrottring = new Throttling(120);

    constructor(
        private shuffleSpells: ShuffleSpells,
        private autoClick: AutoClick,
        private moduleManager: GameImageModuleManager,
    ) {
        this.autoClick.setDefaultKey({keyCode: 44, key: 'z', button: 'right', returnKey: 'z', returnKeyCode: 44});
    }

    get autoClickStatus() {
        return this.autoClick.status;
    }

    get shuffleStatus() {
        return this.shuffleSpells.status
    }

    private defaultKey: QuickSpellKey = {keyCode: 2, key: '1', button: 'right', returnKey: '1', returnKeyCode: 2}
    private defaultKeyZ: QuickSpellKey = {keyCode: 44, key: 'z', button: 'right', returnKey: 'z', returnKeyCode: 44}

    private pressedSubKey: boolean = false;
    private beforeSmartSpellKey: QuickSpellKey | null = null;

    async initialize() {


        const subKeyCode = 41;

        this.status = Status.STOP

        //quickSpell
        const quickSpellKeyList: QuickSpellKey[] = [
            {keyCode: 2, key: '1', button: 'right', returnKey: null, returnKeyCode: null},
            {keyCode: 3, key: '2', button: 'right', returnKey: null, returnKeyCode: null},
            {
                keyCode: 4,
                key: '3',
                button: 'right',
                returnKey: null,
                returnKeyCode: null,
                // returnKey: this.defaultKey.key,
                // returnKeyCode: this.defaultKey.keyCode
            },
            {
                keyCode: 5,
                key: '4',
                button: 'right',
                returnKey: this.defaultKey.key,
                returnKeyCode: this.defaultKey.keyCode
            },

            {
                keyCode: 6,
                key: '5',
                button: 'right',
                returnKey: this.defaultKey.key,
                returnKeyCode: this.defaultKey.keyCode
            },
            {
                keyCode: 7,
                key: '6',
                button: 'right',
                returnKey: this.defaultKey.key,
                returnKeyCode: this.defaultKey.keyCode
            },
            {
                keyCode: 59,
                key: 'f1',
                button: 'right',
                returnKey: this.defaultKey.key,
                returnKeyCode: this.defaultKey.keyCode
            },
            {
                keyCode: 60,
                key: 'f2',
                button: 'right',
                returnKey: this.defaultKey.key,
                returnKeyCode: this.defaultKey.keyCode
            },

            {
                keyCode: 61,
                key: 'f3',
                button: 'right',
                returnKey: this.defaultKey.key,
                returnKeyCode: this.defaultKey.keyCode
            },
            {
                keyCode: 62,
                key: 'f4',
                button: 'right',
                returnKey: this.defaultKey.key,
                returnKeyCode: this.defaultKey.keyCode
            },
            {
                keyCode: 63,
                key: 'f5',
                button: 'right',
                returnKey: this.defaultKey.key,
                returnKeyCode: this.defaultKey.keyCode
            },
            {
                keyCode: 64,
                key: 'f6',
                button: 'right',
                returnKey: this.defaultKey.key,
                returnKeyCode: this.defaultKey.keyCode
            },

            {
                keyCode: 65, key: 'f7', button: 'right', returnKey: this.defaultKey.key,
                returnKeyCode: this.defaultKey.keyCode
            },
            {
                keyCode: 66,
                key: 'f8',
                button: 'right',
                returnKey: this.defaultKey.key,
                returnKeyCode: this.defaultKey.keyCode
            },
            {
                keyCode: 44,
                key: 'z',
                button: 'right',
                returnKey: this.defaultKey.key,
                returnKeyCode: this.defaultKey.keyCode
            },
            {
                keyCode: 45,
                key: 'x',
                button: 'right',
                returnKey: this.defaultKey.key,
                returnKeyCode: this.defaultKey.keyCode
            },
        ];

        ioHook.on('keydown', async (evt: KeyEvent) => {
            // console.log(evt);

            if (!this.isRunning()) {
                return;
            }

            if (this.beforeSmartSpellKey?.returnKeyCode == evt.keycode || this.autoClick.beforeSmartSpellKey?.returnKeyCode == evt.keycode) {
                this.beforeSmartSpellKey = null;
                this.autoClick.beforeSmartSpellKey = null;
                return;
            }

            for (const quickSpellKey of quickSpellKeyList) {

                if (evt.keycode === quickSpellKey.keyCode) {
                    if (this.shuffleSpells.isRunning()) {
                        this.shuffleSpells.pause();
                    }


                    if (this.autoClick.isRunning()) {
                        this.autoClick.pause();
                    }

                    if (!this.quickSpellThrottring.check()) {
                        return
                    }


                    this.beforeSmartSpellKey = quickSpellKey;

                    // robot.keyTap(quickSpellKey.key);
                    // await randomSleep(21, 51);

                    robot.mouseClick(quickSpellKey.button);
                    console.log('quick spell', quickSpellKey.button)

                    return;

                }
            }

        });

        ioHook.on('keyup', (evt: KeyEvent) => {
            if (!this.isRunning()) {
                return;
            }

            for (const quickSpellKey of quickSpellKeyList) {
                if (evt.keycode === quickSpellKey.keyCode) {
                    if (this.shuffleSpells.isPause()) {
                        this.shuffleSpells.run();
                    }

                    if (this.autoClick.isPause()) {
                        this.autoClick.run();
                    }

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

        //toggle auto click
        ioHook.registerShortcut(
            [29, 41],
            (keys) => {

                if (this.autoClick.isRunning()) {
                    this.autoClick.stop();


                    this.shuffleSpells.stop();
                    // this.moduleManager.stop();
                } else {
                    this.autoClick.run();
                    this.shuffleSpells.run();
                    // this.moduleManager.run();
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
            if (this.leftClickThrottring.check()) {
                console.log("left")
                robot.mouseClick('left');
            }
            if (this.autoClick.isRunning()) {
                this.autoClick.stop();

                this.beforeSmartSpellKey = this.defaultKey;
                // robot.keyTap(this.defaultKey.key)

            }

            // this.moduleManager.stop();

            if (this.shuffleSpells.isRunning() || this.shuffleSpells.isPause()) {
                this.shuffleSpells.stop();
            }
        }
    }


}