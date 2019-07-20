/*
文件名：artillaryInfoButton.ts
描述：控制artillaryInfo按钮的脚本，访问炮兵模式的信息
当前版本：4.0.0
时间：7/20/2019
*/

const {ccclass, property} = cc._decorator;

@ccclass
export class standardInfoButton extends cc.Component {

    onLoad() {
        //绑定点击事件
        this.node.on('click',function(event){
            cc.director.loadScene("artillaryInfo");
        },this);
    }
    
}
