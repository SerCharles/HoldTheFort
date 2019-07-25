/*
文件名：selfBomber.ts
描述：自爆兵类，继承了unit.ts
当前版本：3.0.0
时间：7/19/2019
*/

const { ccclass, property } = cc._decorator;

import { unit } from './unit';
import { gameConstants, unitConstants } from  '../constants';


@ccclass
export class selfBomber extends unit {

    public;

    constructor() {
        super();
        // 不能移动，一次性攻击，只有血条
        // 最大值初始化
        this.maxHealth = unitConstants.healthSelfBomb;
        this.maxAttack = unitConstants.attackSelfBomb;
        this.maxDefense = unitConstants.defenseSelfBomb;
        this.healthRestoration = 0;
        this.type = unitConstants.typeSelfBomb;
        this.attackRange = unitConstants.attackRangeSelfBomb;
        this.attackTime = 0;
        this.maxLevel = 1;

        // 当前值初始化
        this.currentLevel = 1;
        this.currentAttack = this.maxAttack;
        this.currentHealth = this.maxHealth;
        this.currentDefense = this.maxDefense;
        this.currentLevel = 1;

    }

    public method;

    // 没有经验条和攻击条，因此覆盖对应函数为空
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
