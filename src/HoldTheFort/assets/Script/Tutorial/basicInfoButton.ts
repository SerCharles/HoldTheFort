/*
文件名：basicInfoButton.ts
描述：控制basicInfo按钮的脚本，访问游戏基本信息
当前版本：4.0.0
时间：7/20/2019
*/

const { ccclass, property } = cc._decorator;

@ccclass
export class basicInfoButton extends cc.Component {

    public;
    onLoad() {
        // 绑定点击事件
        this.node.on('click', function(event) {
            cc.director.loadScene('basicInfo');
        }, this);
    }

}
