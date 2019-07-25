/*
文件名：finishGameButton.ts
描述：控制finish按钮的脚本，结束游戏并且进入结算界面
当前版本：3.0.0
时间：7/17/2019
*/

import { globalModule, gameConstants } from '../constants';

const { ccclass, property } = cc._decorator;

@ccclass
export class finishGameButton extends cc.Component {
    public method;
    onLoad() {
        // 绑定点击事件
        this.node.on('click', function(event) {
            let game = null;
            game = this.node.parent.getComponent('mainGame');
            if (game === null) {
                game = this.node.parent.getComponent('artillaryGame');
            }

            if (globalModule.globalClass.gameType === gameConstants.gameTypeStandard) {
                globalModule.globalClass.scoreStandard = game.scoreNumber;
            }
            else {
                globalModule.globalClass.scoreArtillery = game.scoreNumber;
            }

            cc.director.loadScene('finishScene');
        }, this);
    }

}
