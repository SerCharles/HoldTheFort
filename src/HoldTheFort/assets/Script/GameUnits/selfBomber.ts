/*
文件名：siegeTower.ts
描述：攻城塔类，继承了unit.ts
当前版本：3.0.0
时间：7/19/2019
*/

const { ccclass, property } = cc._decorator;

import { unit } from './unit';
import { gameConstants, unitConstants } from  '../constants';


@ccclass
export class selfBomber extends unit {

    public

    constructor() {
        super();
        // 敌军，不能升级，可以移动，有击杀奖励
        // 最大值初始化
        this.maxHealth = unitConstants.healthSelfBomb;
        this.maxAttack = unitConstants.attackSelfBomb;
        this.maxDefense = unitConstants.defenseSelfBomb;
        this.maxHealthRestoration = 0;
        this.type = unitConstants.typeSelfBomb;
        this.attackRange = unitConstants.attackRangeSelfBomb;
        this.attackTime = 0;
        this.faction = unitConstants.factionEnemy;
        this.maxLevel = 1;
        this.maxSpeed = unitConstants.speedSelfBomb;
        this.killGetMoney = unitConstants.killGainMoneySelfBomb;
        this.killGetScore = unitConstants.killGainScoreSelfBomb;
        this.killGetExp = unitConstants.killGainExpSelfBomb;

        // 当前值初始化
        this.currentLevel = 1;
        this.currentAttack = this.maxAttack;
        this.currentHealth = this.maxHealth;
        this.currentDefense = this.maxDefense;
        this.currentHealthRestoration = this.maxHealthRestoration;
        this.currentLevel = 1;
        this.currentSpeed = this.maxSpeed;

    }

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

    // 敌人，没有经验条和等级显示，因此把这两个函数覆盖为空
    // 没有攻击条，因此覆盖攻击条函数为空
    updateExpBar() {

    }
    updateLevelLabel() {

    }
    updateAttackBar() {

    }

    update(dt) {
        super.update(dt);
    }

}
