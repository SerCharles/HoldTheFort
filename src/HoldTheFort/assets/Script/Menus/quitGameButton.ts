/*
文件名：quitGameButton.ts
描述：控制quitGame按钮的脚本，控制退出游戏
当前版本：3.0.0
时间：7/17/2019
*/

const {ccclass, property} = cc._decorator;

@ccclass
export class quitGameButton extends cc.Component {

    onLoad() {
        //绑定点击事件
        this.node.on('click',function(event){
            cc.game.end();
        },this);
    }
    
}