import "reflect-metadata";
import {suite, test} from "@testdeck/mocha";
import {expect} from 'chai';
import {container} from "../src/renderer/systems/Container";
import Robot from "../src/renderer/lib/Robot";

@suite
class RobotTest {

    @test
    async world() {
        const robot = container.get(Robot);
    }
}
