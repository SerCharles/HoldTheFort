/*
文件名：meleeSoldier.ts
描述：所有近战我军的类，继承了melee.ts，作为节点类型meleeSoldier的定义脚本文件
当前版本：1.0.0
时间：7/13/2019
*/

const {ccclass, property} = cc._decorator;

import {unit} from './unit';
import {melee} from './melee'
import {gameConstants, unitConstants} from  '../constants';

@ccclass
export class meleeSoldier extends melee {
    constructor() {
        super();
        //我军，可以升级，不能移动，有造价
        this.faction = true;
        this.maxLevel = unitConstants.maxLevel;
        this.maxSpeed = 0;
        this.currentSpeed = 0;
        this.cost = unitConstants.costMelee;
        this.attackGetExp = unitConstants.attackGainExpMelee;
    }

    updateExpBar(){
        let bar = this.node.getChildByName('expBar');
        let expRatio;
        if(this.currentLevel === this.maxLevel) {
            expRatio = 1;
        }
        else {
            expRatio = this.currentExp / unitConstants.expRequiredEachLevel[this.currentLevel - 1];
        }
        let barShow = bar.getComponent(cc.ProgressBar);
        barShow.progress = expRatio;
    }

    updateLevelLabel() {
        this.levelShow.string = 'LV.'+this.currentLevel;
    }

    onLoad() {
        
        this.changeDirection(this.node.position);
    }
    
    update(dt) {
        super.update(dt);
        this.updateExpBar();
        this.updateLevelLabel();
    }
}