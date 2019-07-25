/*
文件名：mortar.ts
描述：所有炮兵的基类，继承了unit.ts
当前版本：3.0.0
时间：7/19/2019
*/

const { ccclass, property } = cc._decorator;

import { unit } from './unit';
import { gameConstants, unitConstants } from  '../constants';


@ccclass
export class mortar extends unit {

    public method;
    constructor() {
        super();

        // 最大值初始化
        this.maxHealth = unitConstants.healthMortarEachLevel[0];
        this.maxAttack = unitConstants.attackMortarEachLevel[0];
        this.maxDefense = unitConstants.defenseMortarEachLevel[0];
        this.healthRestoration = unitConstants.healthRestorationEachLevel[0];
        this.type = unitConstants.typeMortar;
        this.attackRange = unitConstants.attackRangeMortar;
        this.attackTime = unitConstants.attackTimeMortar;


        // 当前值初始化
        this.currentLevel = 1;
        this.currentAttack = this.maxAttack;
        this.currentHealth = this.maxHealth;
        this.currentDefense = this.maxDefense;
    }

    upgrade() {
        super.upgrade();


        // 修改最大值
        this.maxHealth = unitConstants.healthMortarEachLevel[this.currentLevel - 1];
        this.maxAttack = unitConstants.attackMortarEachLevel[this.currentLevel - 1];
        this.maxDefense = unitConstants.defenseMortarEachLevel[this.currentLevel - 1];
        this.healthRestoration = unitConstants.healthRestorationEachLevel[this.currentLevel - 1];

        this.currentAttack = this.maxAttack;
        this.currentHealth = this.maxHealth;
        this.currentDefense = this.maxDefense;
    }
    update(dt) {
        super.update(dt);
    }


}
