/*
文件名：historyMenuButton.ts
描述：控制history按钮的脚本，访问你的历史战绩
当前版本：3.0.0
时间：7/17/2019
*/

const {ccclass, property} = cc._decorator;

import {globalModule} from '../constants';
import {getHistoryBest} from '../serverQuery'

@ccclass
export class historyShow extends cc.Component {

    onLoad() {
        let theLabel = this.node.getChildByName('scoreShow');
        let labelShow = theLabel.getComponent(cc.Label);
        getHistoryBest();
        labelShow.string = 'History Record: ' + globalModule.globalClass.historyMaxScore;
    }
    
    update(dt) {
        let theLabel = this.node.getChildByName('scoreShow');
        let labelShow = theLabel.getComponent(cc.Label);
        labelShow.string = 'History Record: ' + globalModule.globalClass.historyMaxScore;
    }
}

