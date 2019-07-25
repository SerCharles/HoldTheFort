/*
文件名：mapChooseButton.ts
描述：控制地图选择的button
当前版本：5.0
时间：7/25/2019
*/

import { gameConstants, unitConstants, globalModule } from  '../constants';



const { ccclass, property } = cc._decorator;

@ccclass
export class mapChooseButton extends cc.Component {

    public;
    // 按钮代表的地图种类
    @property(Number)
    type: number = 0;

    public method;
    onLoad() {
        // 枚举节点名称，来获取自身代表的地图
        let theName = this.node.name;
        if (theName === 'castleButton') {
            this.type = gameConstants.mapCastle;
        }
        else if (theName === 'barbicanButton') {
            this.type = gameConstants.mapBarbican;
        }

        else if (theName === 'bastionButton') {
            this.type = gameConstants.mapBastion;
        }

        else if (theName === 'randomButton') {
            // 随机生成type
            this.type = Math.ceil(Math.random() * gameConstants.mapTypeNumber);
        }

        // 绑定点击事件,跳转到加载页面
        this.node.on('click', function(event) {
            globalModule.globalClass.mapType = this.type;
            cc.director.loadScene('loadScene');
        }, this);
    }

}
