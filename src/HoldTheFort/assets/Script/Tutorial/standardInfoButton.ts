/*
文件名：standardInfoButton.ts
描述：控制standardInfo按钮的脚本，访问标准模式的信息
当前版本：4.0.0
时间：7/20/2019
*/

const { ccclass, property } = cc._decorator;

@ccclass
export class standardInfoButton extends cc.Component {

    public
    onLoad() {
        // 绑定点击事件
        this.node.on('click', function(event) {
            cc.director.loadScene('standardInfo');
        }, this);
    }

}
