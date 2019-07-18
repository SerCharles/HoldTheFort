/*
文件名：finishGameButton.ts
描述：控制finish按钮的脚本，结束游戏并且进入结算界面
当前版本：3.0.0
时间：7/17/2019
*/

import {globalModule} from '../constants'

const {ccclass, property} = cc._decorator;

@ccclass
export class leaderboardButton extends cc.Component {

    onLoad() {
        //绑定点击事件
        this.node.on('click',function(event){
            let mainGame = this.node.parent.getComponent('mainGame');
            globalModule.globalClass.score = mainGame.scoreNumber;
            cc.director.loadScene("finishScene");
        },this);
    }
    
}
