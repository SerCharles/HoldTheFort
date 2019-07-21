/*
文件名：siegeTower.ts
描述：攻城塔类，继承了unit.ts
当前版本：3.0.0
时间：7/19/2019
*/

const { ccclass, property } = cc._decorator;

import { unit } from './unit';
import { gameConstants, unitConstants, globalModule } from  '../constants';


@ccclass
export class siegeTower extends unit {

    public
    constructor() {
        super();
        // 敌军，不能升级，可以移动，有击杀奖励
        // 最大值初始化
        this.maxHealth = unitConstants.healthTower;
        this.maxAttack = unitConstants.attackTower;
        this.maxDefense = unitConstants.defenseTower;
        this.maxHealthRestoration = 0;
        this.type = unitConstants.typeSiegeTower;
        this.attackRange = 0;
        this.attackTime = 0;
        this.faction = unitConstants.factionEnemy;
        this.maxLevel = 1;
        this.maxSpeed = unitConstants.speedTower;
        this.killGetMoney = unitConstants.killGainMoneyTower;
        this.killGetScore = unitConstants.killGainScoreTower;
        this.killGetExp = unitConstants.killGainExpTower;

        // 当前值初始化
        this.currentLevel = 1;
        this.currentAttack = this.maxAttack;
        this.currentHealth = this.maxHealth;
        this.currentDefense = this.maxDefense;
        this.currentHealthRestoration = this.maxHealthRestoration;
        this.currentLevel = 1;
        this.currentSpeed = this.maxSpeed;

    }

    // 死亡没有音效
    updateDeath() {
        if (this.currentHealth <= 0) {
            this.valid = false;

            // 敌方死亡，增加经验和金币
            if (this.faction === false) {
                this.node.dispatchEvent(new cc.Event.EventCustom('getScore', true));
                this.node.dispatchEvent(new cc.Event.EventCustom('spawnMoney', true));
            }
            this.node.destroy();
        }
    }

    // 不能攻击，升级之类的，也没有除了血条外的任何东西
    update(dt) {
        // 暂停
        if (globalModule.globalClass.whetherPlayGame === false) return;
        this.updateDeath();
        this.updateHealth(dt);
        this.updatePlace(dt);
        this.updateHealthBar();
    }

}
