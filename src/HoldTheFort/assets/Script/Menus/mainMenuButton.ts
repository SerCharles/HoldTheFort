/*
文件名：mainMenuButton.ts
描述：控制mainMenu按钮的脚本，控制回到主界面
当前版本：3.0.0
时间：7/17/2019
*/

const { ccclass, property } = cc._decorator;

@ccclass
export class mainMenuButton extends cc.Component {

    public method;
    onLoad() {
        // 绑定点击事件
        this.node.on('click', function(event) {
            cc.director.loadScene('openScene');
        }, this);
    }

}