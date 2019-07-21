/*
文件名：mortarSoldier.ts
描述：所有我军炮兵的类，继承了mortar.ts，作为节点类型mortarSoldier的定义脚本文件
当前版本：3.0.0
时间：7/19/2019
*/


const { ccclass, property } = cc._decorator;

import { unit } from './unit';
import { mortar } from './mortar';
import { gameConstants, unitConstants } from  '../constants';

@ccclass
export class mortarSoldier extends mortar {

    public method

    constructor() {
        super();
        // 我军，可以升级，不能移动，有造价
        this.faction = unitConstants.factionSoldier;
        this.maxLevel = unitConstants.maxLevel;
        this.maxSpeed = 0;
        this.currentSpeed = 0;
        this.cost = unitConstants.costMortar;
        this.attackGetExp = unitConstants.attackGainExpMortar;

    }

    onLoad() {
        this.changeDirection(this.node.position);
    }

    update(dt) {
        super.update(dt);
    }
}
