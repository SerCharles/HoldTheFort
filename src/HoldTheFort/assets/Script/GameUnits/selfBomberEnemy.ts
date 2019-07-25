/*
文件名：selfBomberEnemy.ts
描述：自爆敌兵类，继承了selfBomber.ts
当前版本：3.0.0
时间：7/19/2019
*/

const { ccclass, property } = cc._decorator;

import { unit } from './unit';
import { selfBomber } from './selfBomber';
import { gameConstants, unitConstants } from  '../constants';


@ccclass
export class selfBomberEnemy extends selfBomber {

    public;

    constructor() {
        super();
        // 敌军，不能升级，可以移动，有击杀奖励
        // 最大值初始化

        this.faction = unitConstants.factionEnemy;
        this.maxSpeed = unitConstants.speedSelfBomb;
        this.killGetMoney = unitConstants.killGainMoneySelfBomb;
        this.killGetScore = unitConstants.killGainScoreSelfBomb;
        this.killGetExp = unitConstants.killGainExpSelfBomb;

        // 当前值初始化
        this.currentSpeed = this.maxSpeed;

    }

    public method;
    // 重写死亡函数
    updateDeath() {
        if (this.currentHealth <= 0) {
            this.valid = false;

            // 敌方死亡，增加经验和金币
            this.node.dispatchEvent(new cc.Event.EventCustom('getScore', true));
            this.node.dispatchEvent(new cc.Event.EventCustom('spawnMoney', true));

            // 如果死亡或者到达预定位置，就自爆，等价于放置立刻爆炸的炸弹
            let game = null;
            game = this.node.parent.getComponent('mainGame');
            if (game === null) {
                this.node.parent.getComponent('artillaryGame');
            }
            game.spawnShell(this.node.position, this.node.position, this.currentAttack);

            this.node.destroy();
        }
    }

    update(dt) {
        super.update(dt);
    }

}
