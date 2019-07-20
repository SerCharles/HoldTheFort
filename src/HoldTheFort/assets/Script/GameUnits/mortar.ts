/*
文件名：mortar.ts
描述：所有炮兵的基类，继承了unit.ts
当前版本：3.0.0
时间：7/19/2019
*/

const {ccclass, property} = cc._decorator;

import {unit} from './unit';
import {gameConstants, unitConstants} from  '../constants';


@ccclass
export class mortar extends unit{

    constructor(){
        super();

        //最大值初始化
        this.maxHealth = unitConstants.healthMortarEachLevel[0];
        this.maxAttack = unitConstants.attackMortarEachLevel[0];
        this.maxDefense = unitConstants.defenseMortarEachLevel[0];
        this.maxHealthRestoration = unitConstants.healthRestorationEachLevel[0];
        this.type = unitConstants.typeMortar;
        this.attackRange = unitConstants.attackRangeMortar;
        this.attackTime = unitConstants.attackTimeMortar;
        

        //当前值初始化
        this.currentLevel = 1;
        this.currentAttack = this.maxAttack;
        this.currentHealth = this.maxHealth;
        this.currentDefense = this.maxDefense;
        this.currentHealthRestoration = this.maxHealthRestoration;
    }

    upgrade(){
        super.upgrade();

        //计算当前值/最大值，保持该比例在升级前后不变
        let portionHealth:number = this.currentHealth / this.maxHealth;
        let portionAttack:number = this.currentAttack / this.maxAttack;
        let portionDefense:number = this.currentDefense / this.maxDefense;

        //修改最大值
        this.maxHealth = unitConstants.healthMeleeEachLevel[this.currentLevel - 1];
        this.maxAttack = unitConstants.attackMeleeEachLevel[this.currentLevel - 1];
        this.maxDefense = unitConstants.defenseMeleeEachLevel[this.currentLevel - 1];
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