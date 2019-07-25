/*
文件名：artillaryCareerButton.ts
描述：控制artillaryCareer按钮的脚本，控制加载炮兵扮演模式游戏
当前版本：3.0.0
时间：7/17/2019
*/

const { ccclass, property } = cc._decorator;

import { gameConstants, globalModule } from '../constants';

@ccclass
export default class artillaryCareerButton extends cc.Component {
    public method;
    onLoad() {
        // 绑定点击事件
        this.node.on('click', function(event) {
            globalModule.globalClass.gameType = gameConstants.gameTypeArtillary;
            cc.director.loadScene('mapChooseScene');
        }, this);
    }

}
