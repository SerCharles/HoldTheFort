

const {ccclass, property} = cc._decorator;

import {unit} from './Units/unit';
import {melee} from './Units/melee';
import {ranged} from './Units/ranged';
import {rangedSoldier} from './Units/rangedSoldier';
import {rangedEnemy} from './Units/rangedEnemy';
import {meleeSoldier} from './Units/meleeSoldier';
import {meleeEnemy} from './Units/meleeEnemy';

import {ammo} from './ammo';
import {gold} from './gold';
import {gameButton} from './gameButton';


import {gameConstants, unitConstants, getCurrentGridPoint, getCurrentGridObject, getDistance, calculateDamage,
     getWorldPosition, judgePointInGrid, judgeUnitInGrid, judgeOutOfRange, gridPlaceToShowPlace} from  './constants';



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


    //加载各种兵种，子弹，金钱构成的prefab
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

    @property(cc.Prefab)
    gold:cc.Prefab = null;

    //加载地形，士兵，敌人，弹药数组
    @property([Boolean])
    terrainList:boolean[] = [];
    // LIFE-CYCLE CALLBACKS:

    @property([unit])
    soldierList:unit[] = [];

    @property([unit])
    enemyList:unit[] = [];

    @property([ammo])
    ammoList:ammo[] = [];

    //加载音效
    @property(cc.AudioClip)
    rangedAttackAudio:cc.AudioClip = null;
    
    @property(cc.AudioClip)
    meleeAttackAudio:cc.AudioClip = null;

    @property(cc.AudioClip)
    beingHitAudio:cc.AudioClip = null;

    @property(cc.AudioClip)
    spawnSoldierAudio:cc.AudioClip = null;


    //显示金币和分数
    @property(cc.Label)
    scoreDisplay:cc.Label = null;

    @property(cc.Label)
    goldDisplay:cc.Label = null;

    //分数和金币
    @property(Number)
    scoreNumber:number = 0;

    @property(Number)
    goldNumber:number = 0;

    //用于处理生成兵种事件
    //-1:未选中任何兵种，其余与兵种的type一致，近战0，远程1，以此类推
    @property(Number)
    chosenType:number = -1;

    //用于显示当前地块是否valid
    @property(cc.Prefab)
    validNode:cc.Prefab = null;
    
    @property(cc.Prefab)
    invalidNode:cc.Prefab = null;

    //距离上次刷出敌人的等待时间
    @property(Number)
    currentTimeSinceLastEnemy: number = 0;

    //刷出下个敌人的总共等待时间
    @property(Number)
    currentTimeForNextEnemy: number = 0;

    onLoad () {
        //初始化一些数组等常量
        this.terrainList = [];
        this.soldierList = [];
        this.enemyList = [];
        this.ammoList = [];
        this.finalPlace = cc.v2(0,0);
        this.goldNumber = gameConstants.startGold;

        //初始化地形
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

        //初始化开始就有的单位
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

        //初始化敌人刷新事件
        this.randomizeNextEnemyTime();

        //监听事件

        //得分事件
        this.node.on('getScore', function (event) {
            //找到事件发出者和接收者
            let killedUnitMelee = null;
            killedUnitMelee = event.target.getComponent('meleeEnemy');
            let killedUnitRanged = null;
            killedUnitRanged = event.target.getComponent('rangedEnemy');
            let current = event.getCurrentTarget();
            let currentGame = current.getComponent('mainGame');

            //处理事件
            if(killedUnitMelee !== null) {
                currentGame.gainScore(killedUnitMelee.killGetScore);
            }
            else if(killedUnitRanged !== null) {
                currentGame.gainScore(killedUnitRanged.killGetScore);
            }
            event.stopPropagation();
        });

        //得到钱事件
        this.node.on('spawnMoney', function (event) {
            //找到事件发出者和接收者
            let killedUnitMelee = null;
            killedUnitMelee = event.target.getComponent('meleeEnemy');
            let killedUnitRanged = null;
            killedUnitRanged = event.target.getComponent('rangedEnemy');
            let current = event.getCurrentTarget();
            let currentGame = current.getComponent('mainGame');

            //处理事件
            if(killedUnitMelee !== null) {
                currentGame.spawnMoney(killedUnitMelee.killGetMoney, killedUnitMelee.node.position);
            }
            else if(killedUnitRanged !== null) {
                currentGame.spawnMoney(killedUnitRanged.killGetMoney, killedUnitRanged.node.position);
            }
            event.stopPropagation();
        });


        //响应拖动事件
        this.node.on(cc.Node.EventType.TOUCH_MOVE,function(event){
            this.onTouchMove(event);
        },this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE,function(event){
            this.onTouchMove(event);
        },this);

        //响应鼠标收起事件
        this.node.on(cc.Node.EventType.TOUCH_END,function(event){
            this.onTouchEnd(event);
        },this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
            this.onTouchEnd(event);
        },this);
        this.node.on(cc.Node.EventType.MOUSE_UP,function(event){
            this.onTouchEnd(event);
        },this);
    }

    //删除无用的元素
    updateDeath() {
        if(this.ammoList !== null){
            for(let i = 0; i < this.ammoList.length; i ++) {
                if(this.ammoList[i].valid === false) {
                    this.ammoList.splice(i,1);
                }
            }
        }

        if(this.soldierList !== null){
            for(let i = 0; i < this.soldierList.length; i ++) {
                if(this.soldierList[i].valid === false) {
                    this.soldierList.splice(i,1);
                }
            }
        }

        if(this.enemyList !== null){
            for(let i = 0; i < this.enemyList.length; i ++) {
                if(this.enemyList[i].valid === false) {
                    this.enemyList.splice(i,1);
                }
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
                    oneUnit.currentAttack = oneUnit.maxAttack * (unitConstants.attackRatioCastleMelee / 100);
                    oneUnit.currentDefense = oneUnit.maxDefense * (unitConstants.defenseRatioCastleMelee / 100);
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
                    //cc.audioEngine.playEffect(this.beingHitAudio, false);
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
                    //cc.audioEngine.playEffect(this.beingHitAudio, false);
                    oneAmmo.valid = false;
                    this.soldierList[i].beingAttack(calculateDamage(oneAmmo.damage,this.soldierList[i].currentDefense));
                }
            }
        }
    }

    //更新显示
    updateShow() {
        this.scoreDisplay.string = 'score: ' + this.scoreNumber;
        this.goldDisplay.string = 'gold: ' + this.goldNumber;
    }

    //更新敌人的刷新
    updateEnemy(dt) {
        this.currentTimeSinceLastEnemy += dt;

        //时间够了，可以刷兵,
        if(this.currentTimeSinceLastEnemy >= this.currentTimeForNextEnemy ) {
            //敌人太多，暂时不刷新
            if(this.enemyList != null && this.enemyList.length >= gameConstants.maxEnemyAtScene) {
                this.currentTimeSinceLastEnemy = this.currentTimeForNextEnemy;
            }
            //随机一个位置，生成兵
            else {
                let showPlace = this.generateRandomEnemyPlace();
                let type = Math.floor(Math.random() * 2);
                if(type === 0) {
                    this.spawnMeleeEnemy(showPlace);
                }
                else {
                    this.spawnRangedEnemy(showPlace);
                }
                //重置时间为0，且重新随机一个下次刷兵时间
                this.currentTimeSinceLastEnemy = 0;
                this.randomizeNextEnemyTime();
            }
        }
    }

    update(dt) {
        this.updateDeath();
        //todo:生成敌方士兵，随机事件等
        if(this.soldierList !== null) {
            for(let i = 0; i < this.soldierList.length; i ++) {
                this.updateStatusSingleUnit(this.soldierList[i]);
            }
        }

        if(this.enemyList !== null) {
            for(let i = 0; i < this.enemyList.length; i ++) {
                this.updateStatusSingleUnit(this.enemyList[i]);
            }
        }

        if(this.ammoList.length) {
            for(let i = 0; i < this.ammoList.length; i ++) {
                this.updateStatusSingleAmmo(this.ammoList[i]);
            }
        }

        //更新刷兵事件
        this.updateEnemy(dt);
        this.updateShow();
    }

    //增加一个士兵，子弹，金钱等。。。
    spawnMeleeSoldier(place) {
        let newMeleeSoldier = cc.instantiate(this.meleeSoldier);
        this.node.addChild(newMeleeSoldier);
        newMeleeSoldier.setPosition(place);
        let newSoldierComponent = newMeleeSoldier.getComponent('meleeSoldier');
        newSoldierComponent.changeDirection(place);
        this.soldierList.push(newSoldierComponent);
        cc.audioEngine.playEffect(this.spawnSoldierAudio, false);
    }

    spawnRangedSoldier(place) {
        let newRangedSoldier = cc.instantiate(this.rangedSoldier);
        this.node.addChild(newRangedSoldier);
        newRangedSoldier.setPosition(place);
        let newSoldierComponent = newRangedSoldier.getComponent('rangedSoldier');
        newSoldierComponent.changeDirection(place);
        this.soldierList.push(newSoldierComponent);
        cc.audioEngine.playEffect(this.spawnSoldierAudio, false);
    }

    spawnMeleeEnemy(place){
        let newMeleeEnemy = cc.instantiate(this.meleeEnemy);
        this.node.addChild(newMeleeEnemy);
        newMeleeEnemy.setPosition(place);
        let newEnemyComponent = newMeleeEnemy.getComponent('meleeEnemy');
        newEnemyComponent.changeDirection(this.finalPlace);
        this.enemyList.push(newEnemyComponent);

        
    }

    spawnRangedEnemy(place){
        let newRangedEnemy = cc.instantiate(this.rangedEnemy);
        this.node.addChild(newRangedEnemy);
        newRangedEnemy.setPosition(place);
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
        this.ammoList.push(ammo);
        this.node.addChild(newAmmo);
    }

    spawnMoney(moneyNumber, place) {
        let newMoney = cc.instantiate(this.gold);
        let money = newMoney.getComponent('gold');
        money.setMoneyNumber(moneyNumber);
        newMoney.setPosition(place);
        this.node.addChild(newMoney);
    }

    //在touchmove时，显示对应的红框/黄框
    spawnValidNode(place) {
        //先删除原先的红框黄框
        for(let i = 0; i < this.node.childrenCount; i ++) {
            if(this.node.children[i].name === 'validObject' || this.node.children[i].name === 'invalidObject') {
                this.node.children[i].destroy();
            }
        }

        let newValidNode = cc.instantiate(this.validNode);
        this.node.addChild(newValidNode);
        newValidNode.setPosition(place);
    }

    spawnInvalidNode(place) {
        //先删除原先的红框黄框
        for(let i = 0; i < this.node.childrenCount; i ++) {
            if(this.node.children[i].name === 'validObject' || this.node.children[i].name === 'invalidObject') {
                this.node.children[i].destroy();
            }
        }

        let newInvalidNode = cc.instantiate(this.invalidNode);
        this.node.addChild(newInvalidNode);
        newInvalidNode.setPosition(place);
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
            cc.audioEngine.playEffect(this.meleeAttackAudio, false);

        }
        else if(attacker.type === 1) {
            //ranged
            this.spawnAmmo(attacker.node.position, target.node.position, attacker.currentAttack, attacker.faction);
            cc.audioEngine.playEffect(this.rangedAttackAudio, false);

        }
        //todo:其他兵种的攻击方式
    }


    
    //响应得分事件
    gainScore(scoreGain: number) {
        this.scoreNumber += scoreGain;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'score: ' + this.scoreNumber;
        console.log(this.scoreNumber);
    }



    //响应收集钱事件
    gainGold(goldGain: number) {
        this.goldNumber += goldGain;
        this.goldDisplay.string = 'gold: ' + this.goldNumber;
    }

    //响应滑动事件，也就是在对应位置添加边框代表是否可以放置
    onTouchMove(event) {
        //把触碰的全局位置转化成相对canvas的位置，并且把放置位置选在grid的中心
        let gridPlaceX = Math.floor((event.currentTouch._point.x - this.node.position.x) / gameConstants.gridWidth + 
        (gameConstants.gridNumX / 2));
        let gridPlaceY = Math.floor((event.currentTouch._point.y - this.node.position.y) / gameConstants.gridHeight) +
        (gameConstants.gridNumY / 2);
        let gridPlace = cc.v2(gridPlaceX, gridPlaceY);

        let showPlaceX = gridPlaceX * gameConstants.gridWidth + (gameConstants.gridWidth / 2) 
        - gameConstants.gridWidth * (gameConstants.gridNumX / 2);
        let showPlaceY = gridPlaceY * gameConstants.gridHeight + (gameConstants.gridHeight / 2) 
        - gameConstants.gridHeight * (gameConstants.gridNumY / 2);
        let showPlace = cc.v2(showPlaceX,showPlaceY);
        
        //选中界外就不行
        if(judgeOutOfRange(showPlace) === true || this.chosenType === -1) {
            return;
        }

        if(this.judgeWhetherValid(gridPlace) === true) {
            this.spawnValidNode(showPlace);
        }
        else {
            this.spawnInvalidNode(showPlace);
        }
    }

    //响应触屏结束事件，就是如果当前格子合适+选中了单位，就在这个位置添加兵种
    onTouchEnd(event) {
        //把触碰的全局位置转化成相对canvas的位置，并且把放置位置选在grid的中心
        let gridPlaceX = Math.floor((event.currentTouch._point.x - this.node.position.x) / gameConstants.gridWidth + 
        (gameConstants.gridNumX / 2));
        let gridPlaceY = Math.floor((event.currentTouch._point.y - this.node.position.y) / gameConstants.gridHeight) +
        (gameConstants.gridNumY / 2);
        let gridPlace = cc.v2(gridPlaceX, gridPlaceY);

        let showPlaceX = gridPlaceX * gameConstants.gridWidth + (gameConstants.gridWidth / 2) 
        - gameConstants.gridWidth * (gameConstants.gridNumX / 2);
        let showPlaceY = gridPlaceY * gameConstants.gridHeight + (gameConstants.gridHeight / 2) 
        - gameConstants.gridHeight * (gameConstants.gridNumY / 2);
        let showPlace = cc.v2(showPlaceX,showPlaceY);

        //删除全部valid，invalid的格子
        for(let i = 0; i < this.node.childrenCount; i ++) {
            if(this.node.children[i].name === 'validObject' || this.node.children[i].name === 'invalidObject') {
                this.node.children[i].destroy();
            }
        }

        if(this.chosenType === -1){
            return;
        }
        //选中界外，或者选择的格子无效，就放置失败，播放失败音效
        if(judgeOutOfRange(showPlace) === true  || this.judgeWhetherValid(gridPlace) === false) {
            this.chosenType = -1;
            return;
        }

        if(this.chosenType === 0) {
            this.spawnMeleeSoldier(showPlace);
            this.goldNumber -= unitConstants.costMelee;
        }
        else if(this.chosenType === 1) {
            this.spawnRangedSoldier(showPlace);
            this.goldNumber -= unitConstants.costRanged;
        }
        //todo:放置其余单位

        this.chosenType = -1;
    }


    //判断一个方格是否能放兵，也就是这个方格在不在城墙上，以及有没有兵，没有兵且在城墙上才能放
    judgeWhetherValid(place) {
        if(this.terrainList[place.x * gameConstants.gridNumY + place.y] !== true) {
            return false;
        }

        let gridCenterX = (gameConstants.gridWidth) * (0.5 + place.x - (gameConstants.gridNumX) / 2);
        let gridCenterY = (gameConstants.gridHeight) * (0.5 + place.y - (gameConstants.gridNumY) / 2);
        let gridCenter = cc.v2(gridCenterX, gridCenterY);
        let gridSize = cc.v2(gameConstants.gridWidth, gameConstants.gridHeight);

        if(this.soldierList !== null) {
            for(let i = 0; i < this.soldierList.length; i ++) {
                let unitCenter = this.soldierList[i].node.position;
                let unitSize = this.soldierList[i].node.getContentSize();
                if(judgeUnitInGrid(unitCenter, unitSize, gridCenter, gridSize) === true) {
                    return false;
                }
            }
        }
        return true;
    }

    //随机生成下一次刷兵需要的时间
    randomizeNextEnemyTime() {
        this.currentTimeForNextEnemy = gameConstants.minNextEnemyTime + 
        (gameConstants.maxNextEnemyTime - gameConstants.minNextEnemyTime) * Math.random();
    }

    //随机生成敌人位置，在边缘 
    generateRandomEnemyPlace() {
        let gridPlaceX, gridPlaceY;
        let randEdge = Math.floor(Math.random() * 4);
        if(randEdge === 0) {
            //左边
            gridPlaceX = 0;

            //再随机生成格子位置
            gridPlaceY = Math.floor(Math.random() * (gameConstants.gridNumY - 2)) + 1; 
        }
        else if(randEdge === 1) {
            //左边
            gridPlaceX = gameConstants.gridNumX - 1;

            //再随机生成格子位置
            gridPlaceY = Math.floor(Math.random() * (gameConstants.gridNumY - 2)) + 1; 
        }
        else if(randEdge === 2) {
            //下边
            gridPlaceY = 0;

            //再随机生成格子位置
            gridPlaceX = Math.floor(Math.random() * (gameConstants.gridNumX - 2)) + 1; 
        }
        else {
            gridPlaceY = gameConstants.gridNumY - 1;

            gridPlaceX = Math.floor(Math.random() * (gameConstants.gridNumX - 2)) + 1; 
        }

        //转换成显示坐标，返回
        let showPlace = gridPlaceToShowPlace(cc.v2(gridPlaceX,gridPlaceY));
        return showPlace;
    }
}