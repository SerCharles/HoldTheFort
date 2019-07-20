/*
文件名：unitInfoButton.ts
描述：控制unitInfo按钮的脚本，访问兵种基本信息
当前版本：4.0.0
时间：7/20/2019
*/

const {ccclass, property} = cc._decorator;

@ccclass
export class unitInfoButton extends cc.Component {

    onLoad() {
        //绑定点击事件
        this.node.on('click',function(event){
            cc.director.loadScene("unitInfo");
        },this);
    }
    
}
