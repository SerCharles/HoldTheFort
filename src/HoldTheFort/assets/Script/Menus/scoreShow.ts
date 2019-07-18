/*
文件名：scoreShow.ts
描述：控制结算界面显示分数的脚本
当前版本：3.0.0
时间：7/17/2019
*/

const {ccclass, property} = cc._decorator;

import {globalModule} from '../constants';

import {uploadScore} from '../serverQuery'


@ccclass
export class scoreShow extends cc.Component {

    onLoad() {
        let theLabel = this.node.getChildByName('scoreShow');
        let labelShow = theLabel.getComponent(cc.Label);
        
        labelShow.string = 'Your Score: ' + globalModule.globalClass.score;
        uploadScore(globalModule.globalClass.score);
    }



    


}