/*
文件名：historyMenuButton.ts
描述：控制history按钮的脚本，访问你的历史战绩
当前版本：3.0.0
时间：7/17/2019
*/

const { ccclass, property } = cc._decorator;

import { globalModule, gameConstants } from '../constants';
import { getHistoryBest } from '../serverQuery';

@ccclass
export class historyShow extends cc.Component {
    public method
    onLoad() {

        let theLabel = this.node.getChildByName('scoreShow');
        let labelShow = theLabel.getComponent(cc.Label);

        let score = 0;
        if (globalModule.globalClass.gameType === gameConstants.gameTypeStandard) {
            score = globalModule.globalClass.historyMaxScoreStandard;
        }
        else {
            score = globalModule.globalClass.historyMaxScoreArtillery;
        }
        labelShow.string = 'Global History \nRecord: ' + score;
    }

    update(dt) {
        let theLabel = this.node.getChildByName('scoreShow');
        let labelShow = theLabel.getComponent(cc.Label);

        let score = 0;
        if (globalModule.globalClass.gameType === gameConstants.gameTypeStandard) {
            score = globalModule.globalClass.historyMaxScoreStandard;
        }
        else {
            score = globalModule.globalClass.historyMaxScoreArtillery;
        }
        labelShow.string = 'Global History \nRecord: ' + score;
    }
}

