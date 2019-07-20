/*
文件名：meleeEnemy.ts
描述：所有近战敌军的类，继承了melee.ts，作为节点类型meleeEnemy的定义脚本文件
当前版本：1.0.0
时间：7/13/2019
*/

const {ccclass, property} = cc._decorator;

import {unit} from './unit';
import {melee} from './melee'
import {gameConstants, unitConstants} from  '../constants';

@ccclass
export class meleeEnemy extends melee {
    constructor() {
        super();
        //敌军，不能升级，可以移动，有击杀奖励
        this.faction = unitConstants.factionEnemy;
        this.maxLevel = 1;
        this.currentLevel = 1;
        this.maxSpeed = unitConstants.speedUnit;
        this.currentSpeed = this.maxSpeed;
        this.killGetMoney = unitConstants.killGainMoneyMelee;
        this.killGetScore = unitConstants.killGainScoreMelee;
        this.killGetExp = unitConstants.killGainExpMelee;
    }

    //敌人，没有经验条和等级显示，因此把这两个函数覆盖为空
    updateExpBar() {

    }
    updateLevelLabel() {

    }
    
}