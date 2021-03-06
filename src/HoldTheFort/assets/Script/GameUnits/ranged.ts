/*
文件名：ranged.ts
描述：所有远程士兵的基类，继承了unit.ts
当前版本：1.0.0
时间：7/13/2019
*/

const { ccclass, property } = cc._decorator;

import { unit } from './unit';
import { gameConstants, unitConstants } from  '../constants';


@ccclass
export class ranged extends unit {

    public method;

    constructor() {
        super();

        // 最大值和静态属性初始化
        this.maxHealth = unitConstants.healthRangedEachLevel[0];
        this.maxAttack = unitConstants.attackRangedEachLevel[0];
        this.maxDefense = unitConstants.defenseRangedEachLevel[0];
        this.healthRestoration = unitConstants.healthRestorationEachLevel[0];
        this.type = unitConstants.typeRanged;
        this.attackRange = unitConstants.attackRangeRanged;
        this.attackTime = unitConstants.attackTimeRanged;


        // 当前值初始化
        this.currentLevel = 1;
        this.currentAttack = this.maxAttack;
        this.currentHealth = this.maxHealth;
        this.currentDefense = this.maxDefense;
        this.currentExp = 0;
    }


    upgrade() {
        super.upgrade();


        // 修改最大值
        this.maxHealth = unitConstants.healthRangedEachLevel[this.currentLevel - 1];
        this.maxAttack = unitConstants.attackRangedEachLevel[this.currentLevel - 1];
        this.maxDefense = unitConstants.defenseRangedEachLevel[this.currentLevel - 1];
        this.healthRestoration = unitConstants.healthRestorationEachLevel[this.currentLevel - 1];

        this.currentAttack = this.maxAttack;
        this.currentHealth = this.maxHealth;
        this.currentDefense = this.maxDefense;

    }
    update(dt) {
        super.update(dt);
    }
}
