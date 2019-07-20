/*
文件名：gold.ts
描述：金币类，击杀敌人后生成，点击收集,一段时间不收集会消失
当前版本：2.0
时间：7/15/2019
*/

const {ccclass, property} = cc._decorator;

import {globalModule} from '../constants'

@ccclass
export class gold extends cc.Component {

    @property(Number)
    moneyNumber: number = 0;

    //控制钱的透明度变化，超过一定时间就消失
    @property(Number)
    currentTime: number = 0;

    @property(Number)
    maxTime: number = 3;

    @property(Number)
    minOpacity: number = 50;

    @property(cc.AudioClip)
    getMoneyAudio:cc.AudioClip = null;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START,function(event){
            this.onTouch();
        },this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN,function(event){
            this.onTouch();
        },this);

    }

    setMoneyNumber(number) {
        this.moneyNumber = number;
    }

    //更新钱不透明度，到达一定时间就消失
    update(dt) {
        //暂停
        if(globalModule.globalClass.whetherPlayGame === false) return;

        this.currentTime += dt;
        if(this.currentTime >= this.maxTime) {
            this.node.destroy();
        }
        let currentOpacity = this.minOpacity + Math.round((255 - this.minOpacity) * (1 - this.currentTime / this.maxTime));
        this.node.opacity = currentOpacity;
    }

    //接收钱
    onTouch() {
        //游戏主界面直接接收



        //暂停
        if(globalModule.globalClass.whetherPlayGame === false) return;

        
        let game = null;
        game = this.node.parent.getComponent('mainGame');
        if(game === null) {
            game = this.node.parent.getComponent('artillaryGame'); 
        }
        game.gainGold(this.moneyNumber);

        if(globalModule.globalClass.whetherHasSound === true) {
            cc.audioEngine.playEffect(this.getMoneyAudio, false);
        }
        this.node.destroy();
    }

    

}
