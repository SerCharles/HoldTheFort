/*
文件名：scoreShow.ts
描述：控制结算界面显示分数的脚本
当前版本：3.0.0
时间：7/17/2019
*/

const { ccclass, property } = cc._decorator;

import { globalModule, gameConstants } from '../constants';

import { uploadScore } from '../serverQuery';


@ccclass
export class scoreShow extends cc.Component {

    public
    onLoad() {
        let theLabel = this.node.getChildByName('scoreShow');
        let labelShow = theLabel.getComponent(cc.Label);

        // 停止bgm
        cc.audioEngine.stopAll();

        let score = 0;
        if (globalModule.globalClass.gameType === gameConstants.gameTypeStandard) {
            score = globalModule.globalClass.scoreStandard;
        }
        else {
            score = globalModule.globalClass.scoreArtillery;
        }
        labelShow.string = 'Your Score: ' + score;

        // uploadScore(score, globalModule.globalClass.gameType);
    }



}