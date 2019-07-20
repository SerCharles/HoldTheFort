/*
文件名：standardGameButton.ts
描述：控制standardGame按钮的脚本，控制加载标准模式游戏
当前版本：3.0.0
时间：7/17/2019
*/

const {ccclass, property} = cc._decorator;

import {gameConstants, globalModule} from '../constants'

@ccclass
export class standardGameButton extends cc.Component {

    onLoad() {
        //let button = this.node.getComponent(cc.Button);
        //绑定点击事件
        this.node.on('click',function(event){
            globalModule.globalClass.gameType = gameConstants.gameTypeStandard;
            cc.director.loadScene("loadScene");
        },this);
    }
    
}
