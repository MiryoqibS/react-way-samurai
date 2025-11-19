import { run as analyticsRun } from "../player/player.js";

export function runPlayer() {
    console.log("player started");
    analyticsRun();
}

export function run() {
    console.log("run player");
}