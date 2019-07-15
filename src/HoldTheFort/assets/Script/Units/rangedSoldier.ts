/*
文件名：rangedSoldier.ts
描述：所有远程我军的类，继承了ranged.ts，作为节点类型rangedSoldier的定义脚本文件
当前版本：1.0.0
时间：7/13/2019
*/


const {ccclass, property} = cc._decorator;

import {unit} from './unit';
import {ranged} from './ranged'
import {gameConstants, unitConstants} from  '../constants';

@ccclass
export class rangedSoldier extends ranged {
    constructor() {
        super();
        //我军，可以升级，不能移动，有造价
        this.faction = true;
        this.maxLevel = unitConstants.maxLevel;
        this.maxSpeed = 0;
        this.currentSpeed = 0;
        this.cost = unitConstants.costRanged;
        this.attackGetExp = unitConstants.attackGainExpRanged;

    }
    onLoad(){
        this.changeDirection(this.node.position);
    }
}
