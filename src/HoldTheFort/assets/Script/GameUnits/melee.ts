/*
文件名：melee.ts
描述：所有近战士兵的基类，继承了unit.ts
当前版本：1.0.0
时间：7/13/2019
*/

const { ccclass, property } = cc._decorator;

import { unit } from './unit';
import { gameConstants, unitConstants } from  '../constants';


@ccclass
export class melee extends unit {

    public method;
    constructor() {
        super();

        // 最大值初始化
        this.maxHealth = unitConstants.healthMeleeEachLevel[0];
        this.maxAttack = unitConstants.attackMeleeEachLevel[0];
        this.maxDefense = unitConstants.defenseMeleeEachLevel[0];
        this.healthRestoration = unitConstants.healthRestorationEachLevel[0];
        this.type = unitConstants.typeMelee;
        this.attackRange = unitConstants.attackRangeMelee;
        this.attackTime = unitConstants.attackTimeMelee;

        // 当前值初始化
        this.currentLevel = 1;
        this.currentAttack = this.maxAttack;
        this.currentHealth = this.maxHealth;
        this.currentDefense = this.maxDefense;
    }

    upgrade() {
        super.upgrade();

        // 修改最大值
        this.maxHealth = unitConstants.healthMeleeEachLevel[this.currentLevel - 1];
        this.maxAttack = unitConstants.attackMeleeEachLevel[this.currentLevel - 1];
        this.maxDefense = unitConstants.defenseMeleeEachLevel[this.currentLevel - 1];
        this.healthRestoration = unitConstants.healthRestorationEachLevel[this.currentLevel - 1];

        this.currentAttack = this.maxAttack;
        this.currentHealth = this.maxHealth;
        this.currentDefense = this.maxDefense;
    }
    update(dt) {
        super.update(dt);
    }


}
