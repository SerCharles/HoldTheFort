/*
文件名：mortarEnemy.ts
描述：所有敌军炮兵的类，继承了mortar.ts，作为节点类型mortarEnemy的定义脚本文件
当前版本：3.0.0
时间：7/19/2019
*/

const { ccclass, property } = cc._decorator;


import { unit } from './unit';
import { mortar } from './mortar';
import { gameConstants, unitConstants } from  '../constants';

@ccclass
export class mortarEnemy extends mortar {

    public

    constructor() {
        super();
        // 敌军，不能升级，可以移动，有击杀奖励
        // this.maxAttack = this.maxAttack * ( unitConstants.attackRatioGroundRanged / 100);
        this.currentAttack = this.maxAttack;
        this.faction = unitConstants.factionEnemy;
        this.maxLevel = 1;
        this.currentLevel = 1;
        this.maxSpeed = unitConstants.speedMortar;
        this.currentSpeed = this.maxSpeed;
        this.killGetMoney = unitConstants.killGainMoneyMortar;
        this.killGetScore = unitConstants.killGainScoreMortar;
        this.killGetExp = unitConstants.killGainExpMortar;
    }

    // 敌人，没有经验条和等级显示，因此把这两个函数覆盖为空
    updateExpBar() {

    }
    updateLevelLabel() {

    }

}
