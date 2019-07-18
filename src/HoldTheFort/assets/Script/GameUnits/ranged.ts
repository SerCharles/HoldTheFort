/*
文件名：ranged.ts
描述：所有远程士兵的基类，继承了unit.ts
当前版本：1.0.0
时间：7/13/2019
*/

const {ccclass, property} = cc._decorator;

import {unit} from './unit';
import {gameConstants, unitConstants} from  '../constants';


@ccclass
export class ranged extends unit {

    constructor(){
        super();

        //最大值初始化
        this.maxHealth = unitConstants.healthRangedEachLevel[0];
        this.maxAttack = unitConstants.attackRangedEachLevel[0];
        this.maxDefense = unitConstants.defenseRangedEachLevel[0];
        this.maxHealthRestoration = unitConstants.healthRestorationEachLevel[0];
        this.type = 1;
        this.attackRange = unitConstants.attackRangeRanged;
        this.attackTime = unitConstants.attackTimeRanged;


        //当前值初始化
        this.currentLevel = 1;
        this.currentAttack = this.maxAttack;
        this.currentHealth = this.maxHealth;
        this.currentDefense = this.maxDefense;
        this.currentHealthRestoration = this.maxHealthRestoration;
        this.currentExp = 0;
    }


    upgrade(){
        super.upgrade();

        //计算当前值/最大值，保持该比例在升级前后不变
        let portionHealth:number = this.currentHealth / this.maxHealth;
        let portionAttack:number = this.currentAttack / this.maxAttack;
        let portionDefense:number = this.currentDefense / this.maxDefense;

        //修改最大值
        this.maxHealth = unitConstants.healthRangedEachLevel[this.currentLevel - 1];
        this.maxAttack = unitConstants.attackRangedEachLevel[this.currentLevel - 1];
        this.maxDefense = unitConstants.defenseRangedEachLevel[this.currentLevel - 1];
        this.maxHealthRestoration = unitConstants.healthRestorationEachLevel[this.currentHealthRestoration - 1];

        this.currentAttack = portionAttack * this.maxAttack;
        this.currentHealth = portionHealth * this.maxHealth;
        this.currentDefense = portionDefense * this.maxDefense;
        this.currentHealthRestoration = this.maxHealthRestoration;
    }
    update(dt) {
        super.update(dt);
    }
}
