

const {ccclass, property} = cc._decorator;

import {unit} from './Units/unit';
import {melee} from './Units/melee';
import {ranged} from './Units/ranged';
import {rangedSoldier} from './Units/rangedSoldier';
import {rangedEnemy} from './Units/rangedEnemy';
import {meleeSoldier} from './Units/meleeSoldier';
import {meleeEnemy} from './Units/meleeEnemy';

import {ammo} from './ammo';
import {gameConstants, unitConstants, getCurrentGridPoint, getCurrentGridObject, getDistance, calculateDamage, getWorldPosition} from  './constants';



@ccclass
export default class mainGame extends cc.Component {

    @property(cc.Vec2)
    finalPlace:cc.Vec2 = null;
    //加载地图
    //ground：草地，show：城堡
    @property(cc.TiledMap)
    map:cc.TiledMap = null;

    @property(cc.TiledLayer)
    groundLayer:cc.TiledLayer = null;

    @property(cc.TiledLayer)
    showLayer:cc.TiledLayer = null;


    //加载各种兵种，子弹构成的prefab
    @property(cc.Prefab)
    meleeSoldier:cc.Prefab = null;

    @property(cc.Prefab)
    rangedSoldier:cc.Prefab = null;

    @property(cc.Prefab)
    meleeEnemy:cc.Prefab = null;

    @property(cc.Prefab)
    rangedEnemy:cc.Prefab = null;

    @property(cc.Prefab)
    ammo:cc.Prefab = null;

    //加载网格切分，各种数组，储存数据用
    @property([Boolean])
    terrainList:boolean[] = [];
    // LIFE-CYCLE CALLBACKS:

    @property([unit])
    soldierList:unit[] = [];

    @property([unit])
    enemyList:unit[] = [];

    @property([ammo])
    ammoList:ammo[] = [];



    onLoad () {
        this.terrainList = [];
        this.soldierList = [];
        this.enemyList = [];
        this.ammoList = [];
        //从地图获取最终位置
        //获取对象层
        //let objects = this.map.getObjectGroup('object');
        //获取对象
        //let finalObject = objects.getObject('flag');
        //获取坐标
        //this.finalPlace = cc.v2(finalObject.x ,finalObject.y);
        this.finalPlace = cc.v2(0,0);

        for(let i = 0; i < gameConstants.gridNumX; i ++) {
            for(let j = 0; j < gameConstants.gridNumY; j ++) {
                let place:cc.Vec2 = cc.v2(i,j);
                let terrain = false;
                if(this.getTileType(this.showLayer, cc.v2(i, j)) === 'castle'){
                    terrain = true;
                }
                this.terrainList[i * gameConstants.gridNumY + j] = terrain;
            }
        }

        for(let i = 0; i < this.node.childrenCount; i ++) {
            let element = this.node.children[i];
            let meleeEnemyProperty = null;
            meleeEnemyProperty = element.getComponent('meleeEnemy');
            let rangedEnemyProperty = null;
            rangedEnemyProperty = element.getComponent('rangedEnemy');
            let meleeSoldierProperty = null;
            meleeSoldierProperty = element.getComponent('meleeSoldier');
            let rangedSoldierProperty = null;
            rangedSoldierProperty = element.getComponent('rangedSoldier');
            if(meleeEnemyProperty !== null) {
                this.enemyList.push(meleeEnemyProperty);
                meleeEnemyProperty.changeDirection(this.finalPlace);
            }
            else if(rangedEnemyProperty !== null) {
                this.enemyList.push(rangedEnemyProperty);
                rangedEnemyProperty.changeDirection(this.finalPlace);
            }
            else if(meleeSoldierProperty !== null) {
                this.soldierList.push(meleeSoldierProperty);
                
            }
            else if(rangedSoldierProperty !== null) {
                this.soldierList.push(rangedSoldierProperty);

            }
        }
        //console.log(this.enemyList[0]);
        //console.log(this.enemyList[0].node);
    }

    //删除无用的元素
    updateDeath() {
            for(let i = 0; i < this.ammoList.length; i ++) {
                if(this.ammoList[i].valid === false) {
                    this.ammoList.splice(i,1);
                }
            }
        
        for(let i = 0; i < this.soldierList.length; i ++) {
            if(this.soldierList[i].valid === false) {
                this.soldierList.splice(i,1);
            }
        }

        for(let i = 0; i < this.enemyList.length; i ++) {
            if(this.enemyList[i].valid === false) {
                this.enemyList.splice(i,1);
            }
        }
    }

    //更新某个士兵的状态
    updateStatusSingleUnit(oneUnit:unit) {
        if(oneUnit.currentStatus === false) {
            //装填状态，不管
            return;
        }
        let position = oneUnit.node.position;
        let size = oneUnit.node.getContentSize;
        let gridList = [];
        gridList = getCurrentGridObject(position, size);
        let theSpeed = oneUnit.maxSpeed;
        for(let i = 0; i < gridList.length; i ++) {
            let grid = gridList[i];
            if(this.terrainList[grid.x * gameConstants.gridNumY + grid.y] === true) {
                //敌军有减成
                if(oneUnit.type === 0 && oneUnit.faction === false) {
                    oneUnit.currentAttack = oneUnit.maxAttack * unitConstants.attackRatioCastleMelee;
                    oneUnit.currentDefense = oneUnit.maxDefense * unitConstants.defenseRatioCastleMelee;
                }
                else{
                    oneUnit.currentAttack = oneUnit.maxAttack;
                    oneUnit.currentDefense = oneUnit.maxDefense;
                }
                theSpeed = oneUnit.maxSpeed * (unitConstants.speedRatioCastle / 100 ); 
            }
        }

        //我方进攻
        let AttackTarget = null;
        if(oneUnit.faction === true) {
            for(let i = 0; i < this.enemyList.length; i ++) {
                let newPosition = this.enemyList[i].node.position;
                //console.log(newPosition);
                let distance = getDistance(position, newPosition);
                if(distance <= oneUnit.attackRange) {
                    AttackTarget = this.enemyList[i];
                    break;
                }
            }
        }

        //敌方进攻
        else {
            for(let i = 0; i < this.soldierList.length; i ++) {
                let newPosition = this.soldierList[i].node.position;
                //console.log(newPosition);
                let distance = getDistance(position, newPosition);
                if(distance <= oneUnit.attackRange) {
                    AttackTarget = this.soldierList[i];
                    break;
                }
            }
        }

        //不能进攻，可以移动
        if(AttackTarget === null) {
            oneUnit.currentSpeed = theSpeed;
        }
        else {
            //进攻
            this.attack(oneUnit, AttackTarget);
            //设置为装填状态
            oneUnit.currentSpeed = 0;
            oneUnit.changeStatus(false);
            oneUnit.resetAttackTime();
        }
        
    }

    //更新一个子弹的状态
    updateStatusSingleAmmo(oneAmmo:ammo){
        //我军子弹
        if(oneAmmo.faction === true) {
            for(let i = 0; i < this.enemyList.length; i ++) {
                let distance = getDistance(oneAmmo.node.position, this.enemyList[i].node.position);
                if(distance < unitConstants.ammoHitRange) {
                    //命中
                    //todo:添加音效
                    oneAmmo.valid = false;
                    this.enemyList[i].beingAttack(calculateDamage(oneAmmo.damage,this.enemyList[i].currentDefense));
                }
            }
        }

        //敌军子弹
        else {
            for(let i = 0; i < this.soldierList.length; i ++) {
                let distance = getDistance(oneAmmo.node.position, this.soldierList[i].node.position);
                if(distance < unitConstants.ammoHitRange) {
                    //命中
                    //todo:添加音效
                    oneAmmo.valid = false;
                    this.soldierList[i].beingAttack(calculateDamage(oneAmmo.damage,this.soldierList[i].currentDefense));
                }
            }
        }
    }

    update(dt) {
        this.updateDeath();
        //todo:生成敌方士兵，随机事件等
        for(let i = 0; i < this.soldierList.length; i ++) {
            this.updateStatusSingleUnit(this.soldierList[i]);
        }
        for(let i = 0; i < this.enemyList.length; i ++) {
            this.updateStatusSingleUnit(this.enemyList[i]);
        }
        for(let i = 0; i < this.ammoList.length; i ++) {
            this.updateStatusSingleAmmo(this.ammoList[i]);
        }
    }

    //增加一个士兵，子弹，金钱等。。。
    spawnMeleeSoldier() {
        let newMeleeSoldier = cc.instantiate(this.meleeSoldier);
        this.node.addChild(newMeleeSoldier);
        //todo:响应事件来设置时间，设置移动
        //newMeleeSoldier.setPosition();
        let newSoldierComponent = newMeleeSoldier.getComponent('meleeSoldier');
        this.soldierList.push(newSoldierComponent);
    }

    spawnRangedSoldier() {
        let newRangedSoldier = cc.instantiate(this.rangedSoldier);
        this.node.addChild(newRangedSoldier);
        //todo:响应事件来设置时间，设置移动
        //newMeleeSoldier.setPosition();
        let newSoldierComponent = newRangedSoldier.getComponent('rangedSoldier');
        this.soldierList.push(newSoldierComponent);
    }

    spawnMeleeEnemy(){
        let newMeleeEnemy = cc.instantiate(this.meleeEnemy);
        this.node.addChild(newMeleeEnemy);
        //todo:随机生成
        //newMeleeSoldier.setPosition();
        let newEnemyComponent = newMeleeEnemy.getComponent('meleeEnemy');
        newEnemyComponent.changeDirection(this.finalPlace);
        this.enemyList.push(newEnemyComponent);

        
    }

    spawnRangedEnemy(){
        let newRangedEnemy = cc.instantiate(this.rangedEnemy);
        this.node.addChild(newRangedEnemy);
        //todo:随机生成
        //newMeleeSoldier.setPosition();
        let newEnemyComponent = newRangedEnemy.getComponent('rangedEnemy');
        newEnemyComponent.changeDirection(this.finalPlace);
        this.enemyList.push(newEnemyComponent);
    }

    spawnAmmo(origin, destination, damage, faction) {
        let newAmmo = cc.instantiate(this.ammo);
        let ammo = newAmmo.getComponent('ammo');
        newAmmo.setPosition(origin);
        ammo.setMovingDirection(destination);
        ammo.setDamage(damage);
        ammo.setFaction(faction);
        console.log(this.ammoList);
        this.ammoList.push(ammo);
        this.node.addChild(newAmmo);
        console.log(newAmmo);
    }



    //其余辅助函数
    getTileType(layer, tile){
        let prop = this.map.getPropertiesForGID(layer.getTileGIDAt(tile));
        if(prop){
            return prop.type;
        }
        else {
            return null;
        }
    }

    //判断攻击
    attack(attacker, target) {
        attacker.currentExp += attacker.attackGetExp;
        if(attacker.type === 0) {
            //melee
            target.beingAttack(calculateDamage(attacker.currentAttack,target.currentDefense));
            //todo:添加动画和音效
        }
        else if(attacker.type === 1) {
            //ranged
            this.spawnAmmo(attacker.node.position, target.node.position, attacker.currentAttack, attacker.faction);
            //todo:添加动画和音效
        }
        //todo:其他兵种的攻击方式
    }


    
}
