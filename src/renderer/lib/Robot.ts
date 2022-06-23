import {injectable} from "inversify";
//https://github.com/octalmage/robotjs
//https://robotjs.io/docs/syntax#mouseclickbutton-double
const robot = require("robotjs");
//https://wilix-team.github.io/iohook/usage.html#available-events
const ioHook = require('iohook');

interface KeyEvent {
    keycode: number
    rawcode: number
    type: 'keydown' | 'keyup'
    altKey: boolean
    shiftKey: boolean
    ctrlKey: boolean
    metaKey: boolean
}

enum Status {
    RUNNING = "RUNNING",
    STOP = "STOP",

}

@injectable()
export default class Robot {

    public status: Status = Status.STOP

    constructor() {

    }


    initialize() {
        this.status = Status.STOP

        ioHook.on('keydown', (evt: KeyEvent) => {
            console.log('keycode: ', evt.keycode);
        });

        //left click
        ioHook.registerShortcut(
            [57],
            (keys) => {
                if (this.status === Status.RUNNING) {
                    console.log("left")
                    robot.mouseClick('left');


                }
            }, (keys) => {

            }
        );

        //right click
        ioHook.registerShortcut(
            [29, 57],
            (keys) => {
                if (this.status === Status.RUNNING) {
                    console.log("right")
                    robot.mouseClick('right');


                }
            }, (keys) => {

            }
        );

        //ctrl+`
        ioHook.registerShortcut(
            [29, 41],
            (keys) => {
                if (this.isRunning()) {
                    this.stop()
                } else {
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

}