/*
文件名：tutorialButton.ts
描述：控制Tutorial按钮的脚本，访问教程
当前版本：3.0.0
时间：7/17/2019
*/

const { ccclass, property } = cc._decorator;

@ccclass
export class tutorialButton extends cc.Component {

    public method;
    onLoad() {
        // 绑定点击事件
        this.node.on('click', function(event) {
            cc.director.loadScene('tutorial');
        }, this);
    }

}
