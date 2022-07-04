<template>
    <div>
        main page
        <button @click="robot.start()">start</button>
        <button @click="robot.stop()">stop</button>
        <button @click="test">test</button>
        <div>
            clickRemapStatus :{{ robot.status }}
        </div>

        <div>
            autoLeftClickStatus :{{ robot.autoClickStatus }}
        </div>

        <div>
            autoRightClickStatus :{{ robot.autoRightClickStatus }}
        </div>


        <div>
            shuffleStatus :{{ robot.shuffleStatus }}
        </div>
    </div>
</template>

<script lang="ts">

import Vue from "vue"
import Component from "vue-class-component"
import {container} from "../../systems/Container";
import Robot from "../../lib/Robot";
import {sleep} from "../../utils/utils";
import {assignWith} from "lodash";
import fs from "fs-extra";
import ScreenCapture from "../../lib/ScreenCapture";
import GetWindowRect from "../../lib/GetWindowRect";
import PotionHelper from "../../lib/PotionHelper";
import GameImageModuleManager from "../../lib/GameImageModuleManager";

const {desktopCapturer, remote} = require('electron')
const screenshot = require('screenshot-desktop')

@Component
export default class MainPage extends Vue {
    robot = container.get(Robot);
    screenCapture = container.get(ScreenCapture);
    getWindowRect = container.get(GetWindowRect);
    potionHelper = container.get(PotionHelper);
    runner = container.get(GameImageModuleManager);

    async mounted() {
        await this.robot.initialize();

        }

    async test() {

        // await this.potionHelper.run();

        return;
        await sleep(1000);
        await this.screenCapture.init("Game");
        (await this.screenCapture.capture()).toFile("./sample.jpeg");


    }

}
</script>

<style scoped>

</style>