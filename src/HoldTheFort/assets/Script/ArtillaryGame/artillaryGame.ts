/*
文件名：artillaryGame.ts
描述：炮兵模式游戏的类
当前版本：3.0.0
时间：7/20/2019
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
import { mainGame } from '../StandardGame/maingame';

import { playerMortar } from './playerMortar';


import {
    gameConstants, unitConstants, getCurrentGridPoint, getCurrentGridObject, getDistance, calculateDamage, calculateShellDamage,
    getWorldPosition, judgePointInGrid, judgeUnitInGrid, judgeOutOfRange, gridPlaceToShowPlace, globalModule
} from  '../constants';


@ccclass
export class artillaryGame extends mainGame {

    public;
    // 玩家四门炮
    @property([playerMortar])
    playerMortarList: playerMortar[] = [];

    // 能否开炮？如果能，0,1,2,3代表能开炮的编号。不能：-1
    @property(Number)
    readyFireCode: number = 0;


    public method;
    // 初始化函数
    // 区别：需要初始化四门炮的信息，但是不需要监听分数和金钱增加的事件，而且需要重写初始化开始就有的单位，排除四门炮的影响
    onLoad() {
        // bgm
        cc.audioEngine.playMusic(this.backgroundMusic, true);



        // 初始化玩家的四门炮
        this.onLoadPlayer();

        // 初始化游戏数组，终止位置，初始金币，失败倒计时等常量
        this.onLoadGameInfo();

        // 加载地形
        this.onLoadMap();

        // 初始化开始就有的单位
        this.onLoadInitialUnits();


        // 初始化敌人,我军刷新事件
        this.randomizeNextEnemyTimeCommon();
        this.randomizeNextEnemyTimeSpecial();
        this.randomizeNextEnemyTimeTower();
        this.randomizeNextSoldierTime();

        // 监听鼠标（测试）和触屏等交互事件
        this.onHearInteract();
    }

    // 初始化玩家的四门炮
    onLoadPlayer() {
        this.playerMortarList[0] = this.node.getChildByName('mortar0').getComponent('playerMortar');
        this.playerMortarList[1] = this.node.getChildByName('mortar1').getComponent('playerMortar');
        this.playerMortarList[2] = this.node.getChildByName('mortar2').getComponent('playerMortar');
        this.playerMortarList[3] = this.node.getChildByName('mortar3').getComponent('playerMortar');
        this.readyFireCode = 0;
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
            let selfBomberSoldierProperty = null;
            selfBomberSoldierProperty = element.getComponent('selfBomberSoldier');
            let mortarEnemyProperty = null;
            mortarEnemyProperty = element.getComponent('mortarEnemy');
            let selfBomberEnemyProperty = null;
            selfBomberEnemyProperty = element.getComponent('selfBomberEnemy');
            let towerEnemyProperty = null;
            towerEnemyProperty = element.getComponent('siegeTower');

            // 排除自己四门炮的干扰
            if (element.name === 'mortar0' || element.name === 'mortar1' ||
                 element.name === 'mortar2' || element.name === 'mortar3') {
                continue;
            }


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
            else if (selfBomberEnemyProperty !== null) {
                this.enemyList.push(selfBomberEnemyProperty);
                selfBomberEnemyProperty.changeDirection(this.finalPlace);
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
            else if (selfBomberSoldierProperty !== null) {
                this.soldierList.push(selfBomberSoldierProperty);
            }

        }
    }



    // 更新函数
    // 区别：需要重写更新显示函数(不显示钱了)，刷兵的位置需要重写（把上边去掉）,需要刷自己兵
    update(dt) {
        super.update(dt);
        this.updatePlayerInfo();
    }

    updateShow() {
        this.scoreDisplay.string = 'Score: ' + this.scoreNumber;
        this.roundDisplay.string = 'Current Round: ' + this.gameDifficulty;
    }

    // 更新己方炮兵状态
    updatePlayerInfo() {
        if (this.playerMortarList[0].currentStatus === unitConstants.statusCanAttack) {
            this.readyFireCode = 0;
        }
        else if (this.playerMortarList[1].currentStatus === unitConstants.statusCanAttack) {
            this.readyFireCode = 1;
        }
        else if (this.playerMortarList[2].currentStatus === unitConstants.statusCanAttack) {
            this.readyFireCode = 2;
        }
        else if (this.playerMortarList[3].currentStatus === unitConstants.statusCanAttack) {
            this.readyFireCode = 3;
        }
        else {
            this.readyFireCode = -1;
        }
    }



    // 随机生成敌人位置(只有普通兵和特殊兵刷新才需要，攻城塔刷新有其他的函数）。在边缘，返回cc.Vec2类型的位置
    // 重写父类函数，把在上面刷兵的可能性消除了
    generateRandomEnemyPlace() {
        let gridPlaceX; let
            gridPlaceY;
        let randEdge = Math.floor(Math.random() * 3);
        if (randEdge === 0) {
            // 左边
            gridPlaceX = 0;

            // 再随机生成格子位置
            gridPlaceY = Math.floor(Math.random() * (gameConstants.gridNumY - 3)) + 1;
        }
        else if (randEdge === 1) {
            // 右边
            gridPlaceX = gameConstants.gridNumX - 1;

            // 再随机生成格子位置
            gridPlaceY = Math.floor(Math.random() * (gameConstants.gridNumY - 3)) + 1;
        }
        else {
            // 下边
            gridPlaceY = 0;

            // 再随机生成格子位置
            gridPlaceX = Math.floor(Math.random() * (gameConstants.gridNumX - 2)) + 1;
        }

        // 转换成显示坐标，返回
        let showPlace = gridPlaceToShowPlace(cc.v2(gridPlaceX, gridPlaceY));
        return showPlace;
    }

    // 新增炮弹，但是和原先不同，增加了一个属性source，来和其他大炮的炮弹区分，以获取经验，得分等
    // source=0,1,2,3，代表是哪门炮打出来的炮弹
    spawnSpecialShell(origin, destination, damage, source) {
        let newShell = cc.instantiate(this.shell);
        let shell = newShell.getComponent('shell');
        newShell.setPosition(origin);
        shell.setMovingDirection(destination);
        shell.setDamage(damage);
        shell.origin = source;
        this.shellList.push(shell);
        this.node.addChild(newShell);
    }

    // 响应炮弹爆炸
    // 重写了父类函数，增加了判定炮弹来源的部分，以确定玩家操作的大炮杀死了哪些敌人，进而更新经验和得分
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

                    let originalHealth = this.enemyList[i].currentHealth;
                    this.enemyList[i].beingAttack(realDamage);
                    let newHealth = this.enemyList[i].currentHealth;

                    // 我方大炮杀了人，增加得分和经验
                    if (newHealth <= 0 && originalHealth > 0 && origin >= 0) {
                        this.gainScore(this.enemyList[i].killGetScore);
                        this.gainExp(origin, this.enemyList[i].killGetExp);
                    }
                }
            }
        }

        if (globalModule.globalClass.whetherHasSound === true) {
            cc.audioEngine.playEffect(this.shellExplodeAudio, false);
        }

        this.spawnExplodeAnimation(position);
    }


    // 让玩家的炮获取经验
    gainExp(origin, expNum) {
        this.playerMortarList[origin].changeExp(expNum);
    }


    // 响应滑动事件，也就是在对应位置添加边框代表是否可以开炮
    // 重写了父类函数，修改了其功能
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
        if (judgeOutOfRange(showPlace) === true) {
            return;
        }

        let attackType = unitConstants.typeSelfBomb;

        // 可以开炮：显示valid，否则invalid
        if (this.readyFireCode >= 0) {
            this.spawnValidNode(showPlace, attackType);
        }
        else {
            this.spawnInvalidNode(showPlace);
        }
    }


    // 响应触屏结束事件，就是如果能开炮，就往这个位置开炮
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
        this.removeAuxillaryShow();


        // 选中界外，或者不能开炮，就失败
        if (judgeOutOfRange(showPlace) === true || this.readyFireCode === -1) {
            return;
        }

        // 成功：开炮
        let attacker = this.playerMortarList[this.readyFireCode];
        let shellPlace = attacker.node.position;
        let shellDestination = showPlace;
        let shellOrigin = this.readyFireCode;
        let shellDamage = attacker.currentAttack;
        this.spawnSpecialShell(shellPlace, shellDestination, shellDamage, shellOrigin);

        // 刷新开炮者的属性
        attacker.changeStatus(unitConstants.statusNotAttack);
        attacker.resetAttackTime();

        // 播放音效
        if (globalModule.globalClass.whetherHasSound === true) {
            cc.audioEngine.playEffect(this.mortarShootAudio, false);
        }
    }


}