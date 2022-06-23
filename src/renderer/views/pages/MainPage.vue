<template>
    <div>
        main page
        <button @click="robot.start()">start</button>
        <button @click="robot.stop()">stop</button>
        {{robot.status}}
    </div>
</template>

<script lang="ts">

import Vue from "vue"
import Component from "vue-class-component"
import {container} from "../../systems/Container";
import Robot from "../../lib/Robot";
import {sleep} from "../../utils/utils";

@Component
export default class MainPage extends Vue {
    robot = container.get(Robot);

    mounted(){
        this.robot.initialize();
    }
    test() {
    }

}
</script>

<style scoped>

</style>