/*
文件名：gameButton.ts
描述：游戏中的按钮类，用于生成士兵
当前版本：2.0
时间：7/16/2019
*/

import {gameConstants, unitConstants, getCurrentGridPoint, getCurrentGridObject, getDistance, calculateDamage, getWorldPosition} from  './constants';



const {ccclass, property} = cc._decorator;

@ccclass
export class mainGameButton extends cc.Component {

    //按钮代表的士兵种类，初始化的时候用于区分是否有效
    @property(Number)
    type: number = 0;

    @property(Number)
    cost: number = 0;


    onLoad () {
        //枚举节点名称，来获取自身代表的兵种
        let theName = this.node.name;
        if(theName === 'meleeButton') {
            this.type = 0;
            this.cost = unitConstants.costMelee;
        }
        else if(theName === 'rangedButton') {
            this.type = 1;
            this.cost = unitConstants.costRanged;
        }

        //修改代表花费cost的label
        let font = this.node.getChildByName('costLabel');
        let fontLabel = font.getComponent(cc.Label);
        fontLabel.string = '' + this.cost;


        //设置不可交互变灰
        //let button = this.node.getComponent(cc.Button);
        //button.enableAutoGrayEffect = true;

        //绑定点击事件
        this.node.on(cc.Node.EventType.TOUCH_START,function(event){
            this.onTouch();
        },this);

        this.node.on(cc.Node.EventType.MOUSE_DOWN,function(event){
            this.onTouch();
        },this);
    }

    //处理事件：点击button，此时回到主界面就会显示
    onTouch() {

        let mainGame = this.node.parent.getComponent('mainGame');
        let currentMoney = mainGame.goldNumber;
        if(currentMoney < this.cost) {
            return;
        }
        mainGame.chosenType = this.type;
    }


    update (dt) {
        let mainGame = this.node.parent.getComponent('mainGame');
        let currentMoney = mainGame.goldNumber;
        let font = this.node.getChildByName('costLabel');
        if(currentMoney < this.cost) {
            //钱不够，设置成不可交互
            this.node.opacity = 50;
            font.color = cc.color(255,0,0,255);
        }
        else {
            this.node.opacity = 255;
            font.color = cc.color(0,0,0,255);

        }
    }
}
