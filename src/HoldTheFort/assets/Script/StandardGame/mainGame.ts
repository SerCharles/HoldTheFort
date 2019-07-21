/*
文件名：mainGame.ts
描述：标准模式游戏的类
当前版本：1.0.0
时间：7/12/2019
*/

const { ccclass, property } = cc._decorator;

import { unit } from '../GameUnits/unit';
import { melee } from '../GameUnits/melee';
import { ranged } from '../GameUnits/ranged';
import { rangedSoldier } from '../GameUnits/rangedSoldier';
import { rangedEnemy } from '../GameUnits/rangedEnemy';
import { meleeSoldier } from '../GameUnits/meleeSoldier';
import { meleeEnemy } from '../GameUnits/meleeEnemy';
import { mortar } from '../GameUnits/mortar';
import { mortarEnemy } from '../GameUnits/mortarEnemy';
import { mortarSoldier } from '../GameUnits/mortarSoldier';
import { siegeTower } from '../GameUnits/siegeTower';
import { selfBomber } from '../GameUnits/selfBomber';

import { ammo } from '../GameUnits/ammo';
import { shell } from '../GameUnits/shell';
import { gold } from '../GameUnits/gold';
import { mainGameButton } from './mainGameButton';


import {
    gameConstants, unitConstants, getCurrentGridPoint, getCurrentGridObject, getDistance, calculateDamage, calculateShellDamage,
    getWorldPosition, judgePointInGrid, judgeUnitInGrid, judgeOutOfRange, gridPlaceToShowPlace, globalModule
} from  '../constants';



@ccclass
export class mainGame extends cc.Component {

    public
    // 加载地图
    // ground：草地，show：城堡
    @property(cc.TiledMap)
    map: cc.TiledMap = null;

    @property(cc.TiledLayer)
    groundLayer: cc.TiledLayer = null;

    @property(cc.TiledLayer)
    showLayer: cc.TiledLayer = null;


    // 各种prefab，包括士兵，敌军，弹药，金币
    @property(cc.Prefab)
    meleeSoldier: cc.Prefab = null;

    @property(cc.Prefab)
    rangedSoldier: cc.Prefab = null;

    @property(cc.Prefab)
    mortarSoldier: cc.Prefab = null;

    @property(cc.Prefab)
    meleeEnemy: cc.Prefab = null;

    @property(cc.Prefab)
    rangedEnemy: cc.Prefab = null;

    @property(cc.Prefab)
    mortarEnemy: cc.Prefab = null;

    @property(cc.Prefab)
    selfBomber: cc.Prefab = null;

    @property(cc.Prefab)
    siegeTower: cc.Prefab = null;

    @property(cc.Prefab)
    ammo: cc.Prefab = null;

    @property(cc.Prefab)
    shell: cc.Prefab = null;

    @property(cc.Prefab)
    gold: cc.Prefab = null;

    // 动画的prefab
    @property(cc.Prefab)
    explodeAnimation: cc.Prefab = null;

    @property(cc.Prefab)
    meleeAnimation: cc.Prefab = null;

    // 加载地形，士兵，敌人，弹药数组
    @property([Boolean])
    terrainList: boolean[] = [];

    @property([unit])
    soldierList: unit[] = [];

    @property([unit])
    enemyList: unit[] = [];

    @property([ammo])
    ammoList: ammo[] = [];

    @property([shell])
    shellList: shell[] = [];


    // 音效
    // 加载音效
    @property(cc.AudioClip)
    rangedAttackAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    meleeAttackAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    beingHitAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    spawnSoldierAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    mortarShootAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    shellExplodeAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    backgroundMusic: cc.AudioClip = null;

    // 控制当前金币和分数的显示
    // 显示金币和分数
    @property(cc.Label)
    scoreDisplay: cc.Label = null;

    @property(cc.Label)
    goldDisplay: cc.Label = null;

    // 分数和金币
    @property(Number)
    scoreNumber: number = 0;

    @property(Number)
    goldNumber: number = 0;

    // 控制兵种生成的判定与显示
    // 用于处理生成兵种事件
    // -1:未选中任何兵种，其余与兵种的type一致，近战0，远程1，以此类推
    @property(Number)
    chosenType: number = -1;

    // 用于显示当前地块是否valid
    @property(cc.Prefab)
    validNode: cc.Prefab = null;

    @property(cc.Prefab)
    invalidNode: cc.Prefab = null;

    // 控制随机刷出敌人
    // 距离上次刷出敌人的等待时间，以下分别为普通敌人（近战与远程），特殊敌人（自爆与炮兵），攻城塔（带好几个近战远程敌人）
    @property(Number)
    currentTimeSinceLastEnemyCommon: number = 0;

    @property(Number)
    currentTimeSinceLastEnemySpecial: number = 0;

    @property(Number)
    currentTimeSinceLastEnemyTower: number = 0;

    // 刷出下个敌人的总共等待时间, 以下分别为普通敌人（近战与远程），特殊敌人（自爆与炮兵），攻城塔（带好几个近战远程敌人）
    @property(Number)
    currentTimeForNextEnemyCommon: number = 0;

    @property(Number)
    currentTimeForNextEnemySpecial: number = 0;

    @property(Number)
    currentTimeForNextEnemyTower: number = 0;

    // 游戏结束的判定变量
    // 广场位置，敌人会走直线往广场里冲，敌人占领广场一段时间就失败
    @property(cc.Vec2)
    finalPlace: cc.Vec2 = null;

    // 敌人占领广场的最大时间，超过就输了
    @property(Number)
    maxEnemyHoldSquareTime = gameConstants.enemyHoldSquareMaxTime;

    // 失败的倒计时
    @property(Number)
    countDownBeforeEnd = 0;

    // 显示失败倒计时的文字
    @property(cc.Label)
    countDownShowText = null;


    // 初始化函数集，以下的函数用于初始化，分别初始化数组和地形，初始单位，监听事件等
    onLoad() {
        // 开始bgm
        cc.audioEngine.playMusic(this.backgroundMusic, true);

        // 初始化游戏数组，终止位置，初始金币，失败倒计时等常量
        this.onLoadGameInfo();

        // 初始化开始就有的单位
        this.onLoadInitialUnits();

        // 初始化敌人刷新事件
        this.randomizeNextEnemyTimeCommon();
        this.randomizeNextEnemyTimeSpecial();
        this.randomizeNextEnemyTimeTower();


        // 监听得分事件
        this.onHearGainScore();

        // 监听得到钱事件
        this.onHearGainMoney();

        // 监听鼠标（测试）和触屏等交互事件
        this.onHearInteract();

    }


    // 初始化游戏数组，终止位置，初始金币，失败倒计时等常量
    onLoadGameInfo() {
        globalModule.globalClass.whetherPlayGame = true;
        globalModule.globalClass.whetherHasSound = true;

        this.terrainList = [];
        this.soldierList = [];
        this.enemyList = [];
        this.ammoList = [];
        this.finalPlace = cc.v2(0, 0);
        this.goldNumber = gameConstants.startGold;
        this.countDownBeforeEnd = this.maxEnemyHoldSquareTime;
        this.countDownShowText.string = '';

        // 初始化地形
        for (let i = 0; i < gameConstants.gridNumX; i++) {
            for (let j = 0; j < gameConstants.gridNumY; j++) {
                let place: cc.Vec2 = cc.v2(i, j);
                let terrain = gameConstants.terrainPlain;
                if (this.getTileType(this.showLayer, cc.v2(i, j)) === 'castle') {
                    terrain = gameConstants.terrainCastle;
                }
                this.terrainList[i * gameConstants.gridNumY + j] = terrain;
            }
        }
    }

    // 初始化开始就有的单位
    onLoadInitialUnits() {
        for (let i = 0; i < this.node.childrenCount; i++) {
            let element = this.node.children[i];
            let meleeEnemyProperty = null;
            meleeEnemyProperty = element.getComponent('meleeEnemy');
            let rangedEnemyProperty = null;
            rangedEnemyProperty = element.getComponent('rangedEnemy');
            let meleeSoldierProperty = null;
            meleeSoldierProperty = element.getComponent('meleeSoldier');
            let rangedSoldierProperty = null;
            rangedSoldierProperty = element.getComponent('rangedSoldier');
            let mortarSoldierProperty = null;
            mortarSoldierProperty = element.getComponent('mortarSoldier');
            let mortarEnemyProperty = null;
            mortarEnemyProperty = element.getComponent('mortarEnemy');
            let selfBomberProperty = null;
            selfBomberProperty = element.getComponent('selfBomber');
            let towerEnemyProperty = null;
            towerEnemyProperty = element.getComponent('siegeTower');

            if (meleeEnemyProperty !== null) {
                this.enemyList.push(meleeEnemyProperty);
                meleeEnemyProperty.changeDirection(this.finalPlace);
            }
            else if (rangedEnemyProperty !== null) {
                this.enemyList.push(rangedEnemyProperty);
                rangedEnemyProperty.changeDirection(this.finalPlace);
            }
            else if (mortarEnemyProperty !== null) {
                this.enemyList.push(mortarEnemyProperty);
                mortarEnemyProperty.changeDirection(this.finalPlace);
            }
            else if (selfBomberProperty !== null) {
                this.enemyList.push(selfBomberProperty);
                selfBomberProperty.changeDirection(this.finalPlace);
            }
            else if (towerEnemyProperty !== null) {
                this.enemyList.push(towerEnemyProperty);
                towerEnemyProperty.changeDirection(this.finalPlace);
            }

            else if (meleeSoldierProperty !== null) {
                this.soldierList.push(meleeSoldierProperty);
            }
            else if (rangedSoldierProperty !== null) {
                this.soldierList.push(rangedSoldierProperty);
            }
            else if (mortarSoldierProperty !== null) {
                this.soldierList.push(mortarSoldierProperty);
            }

        }
    }

    // 监听得分事件
    onHearGainScore() {
        this.node.on('getScore', function (event) {
            // 找到事件发出者和接收者
            let killedUnitMelee = null;
            killedUnitMelee = event.target.getComponent('meleeEnemy');
            let killedUnitRanged = null;
            killedUnitRanged = event.target.getComponent('rangedEnemy');
            let killedUnitMortar = null;
            killedUnitMortar = event.target.getComponent('mortarEnemy');
            let killedUnitSelfBomber = null;
            killedUnitSelfBomber = event.target.getComponent('selfBomber');
            let killedUnitTower = null;
            killedUnitTower = event.target.getComponent('siegeTower');
            let current = event.getCurrentTarget();
            let currentGame = current.getComponent('mainGame');

            // 处理事件
            if (killedUnitMelee !== null) {
                currentGame.gainScore(killedUnitMelee.killGetScore);
            }
            else if (killedUnitRanged !== null) {
                currentGame.gainScore(killedUnitRanged.killGetScore);
            }
            else if (killedUnitMortar !== null) {
                currentGame.gainScore(killedUnitMortar.killGetScore);
            }
            else if (killedUnitSelfBomber !== null) {
                currentGame.gainScore(killedUnitSelfBomber.killGetScore);
            }
            else if (killedUnitTower !== null) {
                currentGame.gainScore(killedUnitTower.killGetScore);
            }
            event.stopPropagation();
        });
    }

    onHearGainMoney() {
        // 得到钱事件
        this.node.on('spawnMoney', function (event) {
            // 找到事件发出者和接收者
            let killedUnitMelee = null;
            killedUnitMelee = event.target.getComponent('meleeEnemy');
            let killedUnitRanged = null;
            killedUnitRanged = event.target.getComponent('rangedEnemy');
            let killedUnitMortar = null;
            killedUnitMortar = event.target.getComponent('mortarEnemy');
            let killedUnitSelfBomber = null;
            killedUnitSelfBomber = event.target.getComponent('selfBomber');
            let killedUnitTower = null;
            killedUnitTower = event.target.getComponent('siegeTower');
            let current = event.getCurrentTarget();
            let currentGame = current.getComponent('mainGame');

            // 处理事件
            if (killedUnitMelee !== null) {
                currentGame.spawnMoney(killedUnitMelee.killGetMoney, killedUnitMelee.node.position);
            }
            else if (killedUnitRanged !== null) {
                currentGame.spawnMoney(killedUnitRanged.killGetMoney, killedUnitRanged.node.position);
            }
            else if (killedUnitMortar !== null) {
                currentGame.spawnMoney(killedUnitMortar.killGetMoney, killedUnitMortar.node.position);
            }
            else if (killedUnitSelfBomber !== null) {
                currentGame.spawnMoney(killedUnitSelfBomber.killGetMoney, killedUnitSelfBomber.node.position);
            }
            else if (killedUnitTower !== null) {
                currentGame.spawnMoney(killedUnitTower.killGetMoney, killedUnitTower.node.position);
            }
            event.stopPropagation();
        });
    }

    onHearInteract() {
        // 监听拖动事件
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
            this.onTouchMove(event);
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function(event) {
            this.onTouchMove(event);
        }, this);

        // 监听收起事件
        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
            this.onTouchEnd(event);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(event) {
            this.onTouchEnd(event);
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, function(event) {
            this.onTouchEnd(event);
        }, this);
    }



    // 各种更新函数，包括更新死亡，刷新敌兵，输赢，士兵和敌人的攻击状态等
    // 更新的主函数
    update(dt) {

        // 暂停
        if (globalModule.globalClass.whetherPlayGame === false) return;

        this.updateLose(dt);
        this.updateDeath();

        // 遍历更新单个士兵，敌人，弹药的状态
        // 主要更新攻击，受伤害等和其他单位进行交互的属性
        // 对于生命值的恢复，经验和升级的判定，装填时间的判定等，由单位自己决定
        if (this.soldierList !== null) {
            for (let i = 0; i < this.soldierList.length; i++) {
                this.updateStatusSingleUnit(this.soldierList[i]);
            }
        }

        if (this.enemyList !== null) {
            for (let i = 0; i < this.enemyList.length; i++) {
                this.updateStatusSingleUnit(this.enemyList[i]);
            }
        }

        if (this.ammoList.length) {
            for (let i = 0; i < this.ammoList.length; i++) {
                this.updateStatusSingleAmmo(this.ammoList[i]);
            }
        }

        // 更新刷兵事件
        this.updateEnemyRefresh(dt);
        this.updateShow();
    }


    // 更新失败判断
    updateLose(dt) {

        // 防止重复加载场景
        if (this.countDownBeforeEnd <= 0) {
            return;
        }

        // 有敌人到达了广场:倒计时减少，显示倒计时
        if (this.judgeWhetherEnemyInSquare() === true) {
            this.countDownBeforeEnd -= dt;
            let secondShow = this.countDownBeforeEnd.toFixed(2);
            this.countDownShowText.string = 'You will lose if the enemies still hold the square for ' + secondShow + ' seconds!';

            // 游戏结束
            if (this.countDownBeforeEnd <= 0) {
                if (globalModule.globalClass.gameType === gameConstants.gameTypeStandard) {
                    globalModule.globalClass.scoreStandard = this.scoreNumber;
                }
                else {
                    globalModule.globalClass.scoreArtillery = this.scoreNumber;
                }

                this.countDownBeforeEnd = 0;
                cc.director.loadScene('finishScene');
                return;
            }

        }
        // 没有敌人到广场
        else {
            this.countDownBeforeEnd = this.maxEnemyHoldSquareTime;
            this.countDownShowText.string = '';
        }
    }


    // 更新死亡，清理元素
    updateDeath() {
        if (this.ammoList !== null) {
            for (let i = 0; i < this.ammoList.length; i++) {
                if (this.ammoList[i].valid === false) {
                    this.ammoList.splice(i, 1);
                }
            }
        }

        if (this.shellList !== null) {
            for (let i = 0; i < this.shellList.length; i++) {
                if (this.shellList[i].valid === false) {
                    this.shellList.splice(i, 1);
                }
            }
        }

        if (this.soldierList !== null) {
            for (let i = 0; i < this.soldierList.length; i++) {
                if (this.soldierList[i].valid === false) {
                    this.soldierList.splice(i, 1);
                }
            }
        }

        if (this.enemyList !== null) {
            for (let i = 0; i < this.enemyList.length; i++) {
                if (this.enemyList[i].valid === false) {
                    this.enemyList.splice(i, 1);
                }
            }
        }
    }

    // 更新某个士兵的状态
    updateStatusSingleUnit(oneUnit: unit) {

        if (oneUnit.valid === false || oneUnit.node === null) return;

        if (oneUnit.type === unitConstants.typeSelfBomb) {
            // 自爆兵的逻辑和普通士兵不太一样，需要单写一个函数处理
            this.updateStatusSelfBomber(oneUnit);
            return;
        }

        // 读取兵种基本信息
        if (oneUnit.currentStatus === unitConstants.statusNotAttack) {
            // 装填状态，不管
            return;
        }
        let position = oneUnit.node.position;
        let size = oneUnit.node.getContentSize;

        // 判断地形对士兵产生的影响
        // 速度：普通敌人上城堡速度减少，炮兵，攻城塔不能上城堡
        // 攻击：敌人在城堡上近战攻击力下降
        // 返回这个士兵在这个地形移动的最大speed
        let theSpeed = this.updateSingleUnitByTerrain(oneUnit);

        // 我方进攻
        let AttackTarget = null;
        if (oneUnit.faction === true) {
            for (let i = 0; i < this.enemyList.length; i++) {

                if (this.enemyList[i].valid === false || this.enemyList[i].node === null) {
                    continue;
                }

                let newPosition = this.enemyList[i].node.position;
                let distance = getDistance(position, newPosition);
                if (distance <= oneUnit.attackRange) {
                    AttackTarget = this.enemyList[i];
                    break;
                }
            }
        }

        // 敌方进攻
        else {
            for (let i = 0; i < this.soldierList.length; i++) {

                if (this.soldierList[i].valid === false || this.soldierList[i].node === null) {
                    continue;
                }

                let newPosition = this.soldierList[i].node.position;
                let distance = getDistance(position, newPosition);
                if (distance <= oneUnit.attackRange) {
                    AttackTarget = this.soldierList[i];
                    break;
                }
            }
        }

        // 不能进攻，可以移动
        if (AttackTarget === null) {
            oneUnit.currentSpeed = theSpeed;
        }
        else {
            // 进攻
            if (oneUnit.type === 0 || oneUnit.type === 1 || oneUnit.type === 2) {
                this.attack(oneUnit, AttackTarget);
                // 设置为装填状态
                oneUnit.currentSpeed = 0;
                oneUnit.changeStatus(unitConstants.statusNotAttack);
                oneUnit.resetAttackTime();
            }

        }

    }

    // 判断地形对士兵产生的影响
    // 速度：普通敌人上城堡速度减少，炮兵，攻城塔不能上城堡
    // 攻击：敌人在城堡上近战攻击力下降
    // 返回这个士兵在这个地形移动的最大speed
    updateSingleUnitByTerrain(oneUnit) {
        let position = oneUnit.node.position;
        let size = oneUnit.node.getContentSize;
        let gridList = [];
        gridList = getCurrentGridObject(position, size);
        let theSpeed = oneUnit.maxSpeed;

        // 判断地形产生的debuff
        for (let i = 0; i < gridList.length; i++) {
            let grid = gridList[i];

            // 当前地形为城堡地形
            if (this.terrainList[grid.x * gameConstants.gridNumY + grid.y] === gameConstants.terrainCastle) {
                // 敌军有减成
                if (oneUnit.type === 0 && oneUnit.faction === unitConstants.factionEnemy) {
                    oneUnit.currentAttack = oneUnit.maxAttack * (unitConstants.attackRatioCastleMelee / 100);
                    oneUnit.currentDefense = oneUnit.maxDefense * (unitConstants.defenseRatioCastleMelee / 100);
                }
                else {
                    oneUnit.currentAttack = oneUnit.maxAttack;
                    oneUnit.currentDefense = oneUnit.maxDefense;
                }
                theSpeed = oneUnit.maxSpeed * (unitConstants.speedRatioCastle / 100);

                // 炮兵，攻城塔不能上墙
                if (oneUnit.type === 2 || oneUnit.type === 4) {
                    theSpeed = 0;
                }
            }
        }
        return theSpeed;
    }

    // 更新自爆兵状态
    updateStatusSelfBomber(oneUnit) {
        let position = oneUnit.node.position;
        let size = oneUnit.node.getContentSize;

        // 判断地形对士兵产生的影响
        // 速度：普通敌人上城堡速度减少，炮兵，攻城塔不能上城堡
        // 攻击：敌人在城堡上近战攻击力下降
        // 返回这个士兵在这个地形移动的最大speed
        let theSpeed = this.updateSingleUnitByTerrain(oneUnit);

        // 更新自爆兵的移动状态与自爆状态
        // 寻找离这个士兵距离最近的我军
        let target = this.findNearestSoldier(position);

        // 没有我军士兵：往城堡中心走
        if (target === null) {
            oneUnit.changeDirection(this.finalPlace);
        }
        else {
            // 够近了：让这个兵死亡，它自动自爆
            if (getDistance(position, target.node.position) <= oneUnit.attackRange) {
                oneUnit.beingAttack(gameConstants.maxNumber);
            }
            // 不够近：接着走
            else {
                oneUnit.changeDirection(target.node.position);
            }
        }
    }


    // 更新一个子弹的状态
    updateStatusSingleAmmo(oneAmmo: ammo) {
        if (oneAmmo.valid === false || oneAmmo.node === null) return;
        // 我军子弹
        if (oneAmmo.faction === true) {
            for (let i = 0; i < this.enemyList.length; i++) {

                if (this.enemyList[i].valid === false || this.enemyList[i].node === null) {
                    continue;
                }

                let distance = getDistance(oneAmmo.node.position, this.enemyList[i].node.position);
                if (distance < unitConstants.ammoHitRange) {
                    oneAmmo.valid = false;
                    this.enemyList[i].beingAttack(calculateDamage(oneAmmo.damage, this.enemyList[i].currentDefense));
                }
            }
        }

        // 敌军子弹
        else {
            for (let i = 0; i < this.soldierList.length; i++) {

                if (this.soldierList[i].valid === false || this.soldierList[i].node === null) {
                    continue;
                }

                let distance = getDistance(oneAmmo.node.position, this.soldierList[i].node.position);
                if (distance < unitConstants.ammoHitRange) {
                    oneAmmo.valid = false;
                    this.soldierList[i].beingAttack(calculateDamage(oneAmmo.damage, this.soldierList[i].currentDefense));
                }
            }
        }
    }

    // 更新显示内容
    updateShow() {
        this.scoreDisplay.string = 'score: ' + this.scoreNumber;
        this.goldDisplay.string = 'gold: ' + this.goldNumber;
    }

    // 更新敌人的刷新，下面有子函数控制三种敌人的具体刷新
    updateEnemyRefresh(dt) {
        this.currentTimeSinceLastEnemyCommon += dt;
        this.currentTimeSinceLastEnemySpecial += dt;
        this.currentTimeSinceLastEnemyTower += dt;

        // 时间够了，可以刷新敌人
        if (this.currentTimeSinceLastEnemyCommon >= this.currentTimeForNextEnemyCommon) {
            this.enemyRefreshCommon();
        }
        if (this.currentTimeSinceLastEnemySpecial >= this.currentTimeForNextEnemySpecial) {
            this.enemyRefreshSpecial();
        }
        if (this.currentTimeSinceLastEnemyTower >= this.currentTimeForNextEnemyTower) {
            this.enemyRefreshTower();
        }
    }

    enemyRefreshCommon() {
        // 敌人太多，暂时不刷新
        if (this.enemyList != null && this.enemyList.length >= gameConstants.maxEnemyAtScene) {
            this.currentTimeSinceLastEnemyCommon = this.currentTimeForNextEnemyCommon;
        }
        // 随机一个位置，生成兵
        else {
            let showPlace = this.generateRandomEnemyPlace();
            let type = Math.floor(Math.random() * 2);
            if (type === 0) {
                this.spawnMeleeEnemy(showPlace);
            }
            else {
                this.spawnRangedEnemy(showPlace);
            }
            // 重置时间为0，且重新随机一个下次刷兵时间
            this.currentTimeSinceLastEnemyCommon = 0;
            this.randomizeNextEnemyTimeCommon();
        }
    }

    enemyRefreshSpecial() {
        // 敌人太多，暂时不刷新
        if (this.enemyList != null && this.enemyList.length >= gameConstants.maxEnemyAtScene) {
            this.currentTimeSinceLastEnemySpecial = this.currentTimeForNextEnemySpecial;
        }
        // 随机一个位置，生成兵
        else {
            let showPlace = this.generateRandomEnemyPlace();
            let type = Math.floor(Math.random() * 2);
            if (type === 0) {
                this.spawnMortarEnemy(showPlace);
            }
            else {
                this.spawnSelfBomber(showPlace);
            }
            // 重置时间为0，且重新随机一个下次刷兵时间
            this.currentTimeSinceLastEnemySpecial = 0;
            this.randomizeNextEnemyTimeSpecial();
        }
    }

    enemyRefreshTower() {
        // 敌人太多，暂时不刷新
        if (this.enemyList != null && this.enemyList.length >= gameConstants.maxEnemyAtScene) {
            this.currentTimeSinceLastEnemySpecial = this.currentTimeForNextEnemySpecial;
        }
        // 随机一个位置，生成兵
        else {
            // 控制是在右边还是左边刷新
            let type = Math.floor(Math.random() * 2);
            let generatePlaceFactor = 1;
            if (type === 0) {
                generatePlaceFactor = 1;
            }
            else {
                generatePlaceFactor = -1;
            }

            // 利用存储的常数去生成兵
            let siegeTowerPlace = cc.v2(generatePlaceFactor * gameConstants.generateSiegeTowerPlaceX, 0);
            this.spawnSiegeTower(siegeTowerPlace);
            for (let i = 0; i < gameConstants.generateMeleeNumber; i++) {
                let meleePlace = cc.v2(generatePlaceFactor * gameConstants.generateMeleeX[i], 0);
                this.spawnMeleeEnemy(meleePlace);
            }
            for (let i = 0; i < gameConstants.generateRangedNumber; i++) {
                let rangedPlace = cc.v2(
                    generatePlaceFactor * gameConstants.generateSiegeTowerPlaceX,
                    gameConstants.generateRangedY[i]
                );
                this.spawnRangedEnemy(rangedPlace);
            }


            // 重置时间为0，且重新随机一个下次刷兵时间
            this.currentTimeSinceLastEnemyTower = 0;
            this.randomizeNextEnemyTimeTower();
        }
    }


    // 在游戏中添加我军，敌人，金币，弹药等的函数类
    // 在对应位置放置我军近战士兵
    spawnMeleeSoldier(place) {
        let newMeleeSoldier = cc.instantiate(this.meleeSoldier);
        this.node.addChild(newMeleeSoldier);
        newMeleeSoldier.setPosition(place);
        let newSoldierComponent = newMeleeSoldier.getComponent('meleeSoldier');
        newSoldierComponent.changeDirection(place);
        this.soldierList.push(newSoldierComponent);

    }

    // 在对应位置放置我军远程士兵
    spawnRangedSoldier(place) {
        let newRangedSoldier = cc.instantiate(this.rangedSoldier);
        this.node.addChild(newRangedSoldier);
        newRangedSoldier.setPosition(place);
        let newSoldierComponent = newRangedSoldier.getComponent('rangedSoldier');
        newSoldierComponent.changeDirection(place);
        this.soldierList.push(newSoldierComponent);

    }

    // 在对应位置放置我军炮兵
    spawnMortarSoldier(place) {
        let newMortarSoldier = cc.instantiate(this.mortarSoldier);
        this.node.addChild(newMortarSoldier);
        newMortarSoldier.setPosition(place);
        let newSoldierComponent = newMortarSoldier.getComponent('mortarSoldier');
        newSoldierComponent.changeDirection(place);
        this.soldierList.push(newSoldierComponent);

    }

    // 在对应位置放置敌人近战士兵
    spawnMeleeEnemy(place) {
        let newMeleeEnemy = cc.instantiate(this.meleeEnemy);
        this.node.addChild(newMeleeEnemy);
        newMeleeEnemy.setPosition(place);
        let newEnemyComponent = newMeleeEnemy.getComponent('meleeEnemy');
        newEnemyComponent.changeDirection(this.finalPlace);
        this.enemyList.push(newEnemyComponent);


    }

    // 在对应位置放置敌人远程士兵
    spawnRangedEnemy(place) {
        let newRangedEnemy = cc.instantiate(this.rangedEnemy);
        this.node.addChild(newRangedEnemy);
        newRangedEnemy.setPosition(place);
        let newEnemyComponent = newRangedEnemy.getComponent('rangedEnemy');
        newEnemyComponent.changeDirection(this.finalPlace);
        this.enemyList.push(newEnemyComponent);
    }

    // 在对应位置放置敌人炮兵
    spawnMortarEnemy(place) {
        let newMortarEnemy = cc.instantiate(this.mortarEnemy);
        this.node.addChild(newMortarEnemy);
        newMortarEnemy.setPosition(place);
        let newEnemyComponent = newMortarEnemy.getComponent('mortarEnemy');
        newEnemyComponent.changeDirection(this.finalPlace);
        this.enemyList.push(newEnemyComponent);
    }

    // 在对应位置放置敌人自爆兵
    spawnSelfBomber(place) {
        let newSelfBomber = cc.instantiate(this.selfBomber);
        this.node.addChild(newSelfBomber);
        newSelfBomber.setPosition(place);
        let newEnemyComponent = newSelfBomber.getComponent('selfBomber');
        newEnemyComponent.changeDirection(this.finalPlace);
        this.enemyList.push(newEnemyComponent);
    }

    // 在对应位置放敌人攻城塔
    spawnSiegeTower(place) {
        let newSiegeTower = cc.instantiate(this.siegeTower);
        this.node.addChild(newSiegeTower);
        newSiegeTower.setPosition(place);
        let newEnemyComponent = newSiegeTower.getComponent('siegeTower');
        newEnemyComponent.changeDirection(this.finalPlace);
        this.enemyList.push(newEnemyComponent);

    }

    // 在对应位置放置子弹，origin是起始点，destination用来判断方向，damage是攻击力，faction是射击方
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

    // 在对应位置放置炮弹，origin是起始点，destination用来判断方向，damage是攻击力
    spawnShell(origin, destination, damage) {
        let newShell = cc.instantiate(this.shell);
        let shell = newShell.getComponent('shell');
        newShell.setPosition(origin);
        shell.setMovingDirection(destination);
        shell.setDamage(damage);
        this.shellList.push(shell);
        this.node.addChild(newShell);
    }

    // 在对应位置放钱
    spawnMoney(moneyNumber, place) {
        let newMoney = cc.instantiate(this.gold);
        let money = newMoney.getComponent('gold');
        money.setMoneyNumber(moneyNumber);
        newMoney.setPosition(place);
        this.node.addChild(newMoney);
    }

    // 在touchmove时，显示对应的黄框(valid)
    spawnValidNode(place) {
        // 先删除原先的红框黄框
        for (let i = 0; i < this.node.childrenCount; i++) {
            if (this.node.children[i].name === 'validObject' || this.node.children[i].name === 'invalidObject') {
                this.node.children[i].destroy();
            }
        }

        let newValidNode = cc.instantiate(this.validNode);
        this.node.addChild(newValidNode);
        newValidNode.setPosition(place);
    }

    // 在touchmove时，显示对应的红框(invalid)
    spawnInvalidNode(place) {
        // 先删除原先的红框黄框
        for (let i = 0; i < this.node.childrenCount; i++) {
            if (this.node.children[i].name === 'validObject' || this.node.children[i].name === 'invalidObject') {
                this.node.children[i].destroy();
            }
        }

        let newInvalidNode = cc.instantiate(this.invalidNode);
        this.node.addChild(newInvalidNode);
        newInvalidNode.setPosition(place);
    }

    // 生成爆炸动画
    spawnExplodeAnimation(place) {
        // 获取组件
        let newAnimation = cc.instantiate(this.explodeAnimation);
        let anime = newAnimation.getComponent(cc.Animation);

        // 设置位置
        newAnimation.setPosition(place);
        this.node.addChild(newAnimation);

        // 绑定回调函数：完毕就销毁
        anime.on('finished', function() {
            anime.node.destroy();
        }, anime.node);

        // 播放
        anime.play('explode');
    }

    // 生成近战提示
    spawnMeleeAnimation(place) {
        // 获取组件
        let newAnimation = cc.instantiate(this.meleeAnimation);
        let anime = newAnimation.getComponent(cc.Animation);

        // 设置位置
        newAnimation.setPosition(place);
        this.node.addChild(newAnimation);

        // 绑定回调函数：完毕就销毁
        anime.on('finished', function() {
            anime.node.destroy();
        }, anime.node);

        // 播放
        anime.play('melee');
    }


    // 响应事件的函数
    // 响应得分事件
    gainScore(scoreGain: number) {
        this.scoreNumber += scoreGain;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'score: ' + this.scoreNumber;
    }

    // 响应收集钱事件
    gainGold(goldGain: number) {
        this.goldNumber += goldGain;
        this.goldDisplay.string = 'gold: ' + this.goldNumber;
    }

    // 响应滑动事件，也就是在对应位置添加边框代表是否可以放置
    onTouchMove(event) {
        // 暂停
        if (globalModule.globalClass.whetherPlayGame === false) return;


        // 把触碰的全局位置转化成相对canvas的位置，并且把放置位置选在grid的中心
        let gridPlaceX = Math.floor((event.currentTouch._point.x - this.node.position.x) / gameConstants.gridWidth +
        (gameConstants.gridNumX / 2));
        let gridPlaceY = Math.floor((event.currentTouch._point.y - this.node.position.y) / gameConstants.gridHeight) +
        (gameConstants.gridNumY / 2);
        let gridPlace = cc.v2(gridPlaceX, gridPlaceY);

        let showPlaceX = gridPlaceX * gameConstants.gridWidth + (gameConstants.gridWidth / 2)
        - gameConstants.gridWidth * (gameConstants.gridNumX / 2);
        let showPlaceY = gridPlaceY * gameConstants.gridHeight + (gameConstants.gridHeight / 2)
        - gameConstants.gridHeight * (gameConstants.gridNumY / 2);
        let showPlace = cc.v2(showPlaceX, showPlaceY);

        // 选中界外就不行
        if (judgeOutOfRange(showPlace) === true || this.chosenType === -1) {
            return;
        }

        if (this.judgeWhetherValid(gridPlace) === true) {
            this.spawnValidNode(showPlace);
        }
        else {
            this.spawnInvalidNode(showPlace);
        }
    }

    // 响应触屏结束事件，就是如果当前格子合适+选中了单位，就在这个位置添加兵种
    onTouchEnd(event) {
        // 暂停
        if (globalModule.globalClass.whetherPlayGame === false) return;


        // 把触碰的全局位置转化成相对canvas的位置，并且把放置位置选在grid的中心
        let gridPlaceX = Math.floor((event.currentTouch._point.x - this.node.position.x) / gameConstants.gridWidth +
        (gameConstants.gridNumX / 2));
        let gridPlaceY = Math.floor((event.currentTouch._point.y - this.node.position.y) / gameConstants.gridHeight) +
        (gameConstants.gridNumY / 2);
        let gridPlace = cc.v2(gridPlaceX, gridPlaceY);

        let showPlaceX = gridPlaceX * gameConstants.gridWidth + (gameConstants.gridWidth / 2)
        - gameConstants.gridWidth * (gameConstants.gridNumX / 2);
        let showPlaceY = gridPlaceY * gameConstants.gridHeight + (gameConstants.gridHeight / 2)
        - gameConstants.gridHeight * (gameConstants.gridNumY / 2);
        let showPlace = cc.v2(showPlaceX, showPlaceY);

        // 删除全部valid，invalid的格子
        for (let i = 0; i < this.node.childrenCount; i++) {
            if (this.node.children[i].name === 'validObject' || this.node.children[i].name === 'invalidObject') {
                this.node.children[i].destroy();
            }
        }

        if (this.chosenType === -1) {
            return;
        }
        // 选中界外，或者选择的格子无效，就放置失败，播放失败音效
        if (judgeOutOfRange(showPlace) === true || this.judgeWhetherValid(gridPlace) === false) {
            this.chosenType = -1;
            return;
        }

        if (this.chosenType === 0) {
            this.spawnMeleeSoldier(showPlace);
            this.goldNumber -= unitConstants.costMelee;
        }
        else if (this.chosenType === 1) {
            this.spawnRangedSoldier(showPlace);
            this.goldNumber -= unitConstants.costRanged;
        }
        else if (this.chosenType === 2) {
            this.spawnMortarSoldier(showPlace);
            this.goldNumber -= unitConstants.costMortar;
        }

        this.chosenType = -1;
    }

    // 响应炮弹爆炸
    onShellExplode(position, attack, range, origin) {
        if (this.soldierList !== null) {
            for (let i = 0; i < this.soldierList.length; i++) {

                if (this.soldierList[i].valid === false || this.soldierList[i].node === null) {
                    continue;
                }

                let distance = getDistance(position, this.soldierList[i].node.position);
                if (distance < range) {
                    // 造成伤害按照距离线性衰减
                    let realDamage = calculateShellDamage(attack, this.soldierList[i].currentDefense, distance, range);
                    this.soldierList[i].beingAttack(realDamage);
                }
            }
        }

        if (this.enemyList !== null) {
            for (let i = 0; i < this.enemyList.length; i++) {

                if (this.enemyList[i].valid === false || this.enemyList[i].node === null) {
                    continue;
                }

                let distance = getDistance(position, this.enemyList[i].node.position);
                if (distance < range) {
                    // 造成伤害按照距离线性衰减
                    let realDamage = calculateShellDamage(attack, this.enemyList[i].currentDefense, distance, range);
                    this.enemyList[i].beingAttack(realDamage);
                }
            }
        }

        if (globalModule.globalClass.whetherHasSound === true) {
            cc.audioEngine.playEffect(this.shellExplodeAudio, false);
        }

        this.spawnExplodeAnimation(position);
    }


    // 其余辅助函数
    // 获取某个地块的地形是城墙还是平地，返回地形（城墙true平地false
    getTileType(layer, tile) {
        let prop = this.map.getPropertiesForGID(layer.getTileGIDAt(tile));
        if (prop) {
            return prop.type;
        }
        else {
            return null;
        }
    }

    // 按照兵种来执行攻击，以及播放音效
    attack(attacker, target) {
        if (attacker.valid === false || target.valid === false || attacker.node === null || target.node === null) attacker.currentExp += attacker.attackGetExp;
        if (attacker.type === unitConstants.typeMelee) {
            // melee
            target.beingAttack(calculateDamage(attacker.currentAttack, target.currentDefense));

            if (globalModule.globalClass.whetherHasSound === true) {
                cc.audioEngine.playEffect(this.meleeAttackAudio, false);
            }

            // 中心点播放近战
            let centralPlace = cc.v2(
                (attacker.node.position.x + target.node.position.x) / 2,
                (attacker.node.position.y + target.node.position.y) / 2
            );
            this.spawnMeleeAnimation(centralPlace);

        }
        else if (attacker.type === unitConstants.typeRanged) {
            // ranged
            this.spawnAmmo(attacker.node.position, target.node.position, attacker.currentAttack, attacker.faction);

            if (globalModule.globalClass.whetherHasSound === true) {
                cc.audioEngine.playEffect(this.rangedAttackAudio, false);
            }

        }
        else if (attacker.type === unitConstants.typeMortar) {
            // mortar
            this.spawnShell(attacker.node.position, target.node.position, attacker.currentAttack);

            if (globalModule.globalClass.whetherHasSound === true) {
                cc.audioEngine.playEffect(this.mortarShootAudio, false);
            }
        }
    }


    // 判断一个方格是否能放兵，也就是这个方格在不在城墙上，以及有没有兵，没有兵且在城墙上才能放
    // 能放返回true，否则false
    judgeWhetherValid(place) {
        if (this.terrainList[place.x * gameConstants.gridNumY + place.y] !== gameConstants.terrainCastle) {
            return false;
        }

        let gridCenterX = (gameConstants.gridWidth) * (0.5 + place.x - (gameConstants.gridNumX) / 2);
        let gridCenterY = (gameConstants.gridHeight) * (0.5 + place.y - (gameConstants.gridNumY) / 2);
        let gridCenter = cc.v2(gridCenterX, gridCenterY);
        let gridSize = cc.v2(gameConstants.gridWidth, gameConstants.gridHeight);

        // 没有兵才可以放
        if (this.soldierList !== null) {
            for (let i = 0; i < this.soldierList.length; i++) {

                if (this.soldierList[i].valid === false || this.soldierList[i].node === null) {
                    continue;
                }

                let unitCenter = this.soldierList[i].node.position;
                let unitSize = this.soldierList[i].node.getContentSize();
                if (judgeUnitInGrid(unitCenter, unitSize, gridCenter, gridSize) === true) {
                    return false;
                }
            }
        }
        return true;
    }


    // 随机生成下一次刷兵需要的时间，返回时间
    randomizeNextEnemyTimeCommon() {
        this.currentTimeForNextEnemyCommon = gameConstants.minNextEnemyTimeCommon +
        (gameConstants.maxNextEnemyTimeCommon - gameConstants.minNextEnemyTimeCommon) * Math.random();
    }

    randomizeNextEnemyTimeSpecial() {
        this.currentTimeForNextEnemySpecial = gameConstants.minNextEnemyTimeSpecial +
        (gameConstants.maxNextEnemyTimeSpecial - gameConstants.minNextEnemyTimeSpecial) * Math.random();
    }

    randomizeNextEnemyTimeTower() {
        this.currentTimeForNextEnemyTower = gameConstants.minNextEnemyTimeTower +
        (gameConstants.maxNextEnemyTimeTower - gameConstants.minNextEnemyTimeTower) * Math.random();
    }

    // 随机生成敌人位置(只有普通兵和特殊兵刷新才需要，攻城塔刷新有其他的函数）。在边缘，返回cc.Vec2类型的位置
    generateRandomEnemyPlace() {
        let gridPlaceX; let
            gridPlaceY;
        let randEdge = Math.floor(Math.random() * 4);
        if (randEdge === 0) {
            // 左边
            gridPlaceX = 0;

            // 再随机生成格子位置
            gridPlaceY = Math.floor(Math.random() * (gameConstants.gridNumY - 2)) + 1;
        }
        else if (randEdge === 1) {
            // 右边
            gridPlaceX = gameConstants.gridNumX - 1;

            // 再随机生成格子位置
            gridPlaceY = Math.floor(Math.random() * (gameConstants.gridNumY - 2)) + 1;
        }
        else if (randEdge === 2) {
            // 下边
            gridPlaceY = 0;

            // 再随机生成格子位置
            gridPlaceX = Math.floor(Math.random() * (gameConstants.gridNumX - 2)) + 1;
        }
        else {
            gridPlaceY = gameConstants.gridNumY - 1;

            gridPlaceX = Math.floor(Math.random() * (gameConstants.gridNumX - 2)) + 1;
        }

        // 转换成显示坐标，返回
        let showPlace = gridPlaceToShowPlace(cc.v2(gridPlaceX, gridPlaceY));
        return showPlace;
    }

    // 判断是否有敌人到达广场，有的话返回true，否则返回false
    judgeWhetherEnemyInSquare() {
        if (this.enemyList === null) {
            return false;
        }

        for (let i = 0; i < this.enemyList.length; i++) {
            if (this.enemyList[i].valid === true) {
                let currentPlace = this.enemyList[i].node.position;
                if (getDistance(this.finalPlace, currentPlace) <= gameConstants.squareRange) {
                    return true;
                }
            }
        }

        return false;
    }

    // 找到一个离某位置最近的我军士兵，用于更新自爆兵状态.如果没有我军，返回null
    findNearestSoldier(position) {
        if (this.soldierList === null || this.soldierList.length === 0) {
            return null;
        }

        let minDistance = gameConstants.maxNumber;
        let nearestSoldier = null;
        for (let i = 0; i < this.soldierList.length; i++) {

            if (this.soldierList[i].valid === false || this.soldierList[i].node === null) {
                continue;
            }

            let distance = getDistance(position, this.soldierList[i].node.position);
            if (distance < minDistance) {
                minDistance = distance;
                nearestSoldier = this.soldierList[i];
            }
        }
        return nearestSoldier;
    }
}