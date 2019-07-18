/*
文件名：leaderboardButton.ts
描述：控制leaderboard按钮的脚本，访问你的排行榜
当前版本：3.0.0
时间：7/17/2019
*/

const {ccclass, property} = cc._decorator;

@ccclass
export class leaderboardButton extends cc.Component {

    onLoad() {
        //绑定点击事件
        this.node.on('click',function(event){
            cc.director.loadScene("mainGame");
        },this);
    }
    
}
