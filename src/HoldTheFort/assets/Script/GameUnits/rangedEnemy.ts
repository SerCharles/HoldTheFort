/*
文件名：rangedEnemy.ts
描述：所有远程敌军的类，继承了ranged.ts，作为节点类型rangedEnemy的定义脚本文件
当前版本：1.0.0
时间：7/13/2019
*/

const {ccclass, property} = cc._decorator;


import {unit} from './unit';
import {ranged} from './ranged'
import {gameConstants, unitConstants} from  '../constants';

@ccclass
export class rangedEnemy extends ranged {
    constructor() {
        super();
        //敌军，不能升级，可以移动，有击杀奖励
        this.maxAttack = this.maxAttack * ( unitConstants.attackRatioGroundRanged / 100);
        this.currentAttack = this.maxAttack;
        this.faction = unitConstants.factionEnemy;
        this.maxLevel = 1;
        this.currentLevel = 1;
        this.maxSpeed = unitConstants.speedUnit;
        this.currentSpeed = this.maxSpeed;
        this.killGetMoney = unitConstants.killGainMoneyRanged;
        this.killGetScore = unitConstants.killGainScoreRanged;
        this.killGetExp = unitConstants.killGainExpRanged;
    }
    
    //敌人，没有经验条和等级显示，因此把这两个函数覆盖为空
    updateExpBar() {

    }
    updateLevelLabel() {

    }

}
