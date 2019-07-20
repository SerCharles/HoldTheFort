/*
文件名：loadScene.ts
描述：控制加载场景与进度条读条
当前版本：3.0.0
时间：7/17/2019
*/

const {ccclass, property} = cc._decorator;

import {gameConstants, globalModule} from '../constants'


@ccclass
export class loadScene extends cc.Component {

    @property(Number)
    currentLoadTime:number = 0;

    //预先加载游戏
    onLoad() {
        this.currentLoadTime = 0;
        cc.audioEngine.stopAll();
        if(globalModule.globalClass.gameType === gameConstants.gameTypeStandard) {
            cc.director.preloadScene("mainGame");
        }
        else {
            cc.director.preloadScene("artillaryGame");
        }
    }

    //更新进度条
    update(dt) {
        this.currentLoadTime += dt;
        let bar = this.node.getChildByName('loadBackGround').getChildByName('progressBar');
        console.log(bar);
        let barShow = bar.getComponent(cc.ProgressBar);
        let loadRatio = this.currentLoadTime / gameConstants.loadingTimeTotal;

        //100%就加载游戏
        if(loadRatio >= 1) {
            if(globalModule.globalClass.gameType === gameConstants.gameTypeStandard) {
            cc.director.loadScene("mainGame");
        }
        else {
            cc.director.loadScene("artillaryGame");
        }
        }

        barShow.progress = loadRatio;
    }
}