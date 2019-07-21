/*
文件名：constants.ts
描述：常量和常用函数的定义位置
unitConstants存储着各种士兵，弹药的信息
gameConstants存储着游戏界面等的信息
当前版本：1.0.0
时间：7/12/2019
*/
const { ccclass, property } = cc._decorator;

const unitConstants = {
    // 等级和经验
    maxLevel: 3,
    expRequiredEachLevel: [100, 300],

    // 按等级定义的最大生命，攻击，防御，速度
    healthRangedEachLevel: [200, 240, 300],
    healthMeleeEachLevel: [300, 380, 450],
    healthMortarEachLevel: [200, 240, 300],
    healthSelfBomb: 150,
    healthTower: 1000,
    healthRestorationEachLevel: [2, 3, 5],

    attackRangedEachLevel: [150, 170, 200],
    attackMeleeEachLevel: [150, 170, 200],
    attackMortarEachLevel: [300, 400, 500],
    attackTower: 0,
    attackSelfBomb: 300,

    defenseRangedEachLevel: [10, 20, 35],
    defenseMeleeEachLevel: [20, 35, 50],
    defenseMortarEachLevel: [10, 20, 35],
    defenseTower: 0,
    defenseSelfBomb: 35,

    speedUnit: 20,
    speedTower: 20,
    speedMortar: 10,
    speedSelfBomb: 30,
    speedAmmo: 400,
    speedShell: 200,


    // 攻击范围，代表两个单位中心的距离
    attackRangeMelee: 40,
    attackRangeRanged: 200,
    attackRangeMortar: 600,
    attackRangeSelfBomb: 40,
    attackRangeTower: 0,

    // 子弹，炮弹命中判定：两个中心距离小于某个值
    ammoHitRange: 25,
    shellHitRange: 100,

    // 两点之间距离小于5，视为同一个点
    minRange: 5,

    // 每个兵种的装填时间
    attackTimeMelee: 2,
    attackTimeRanged: 5,
    attackTimeMortar: 15,

    // 敌人在城堡上的debuff百分比
    // 在城堡上运动速度只是原先的10%
    speedRatioCastle: 50,

    // 近战兵在攻城时攻击力,防御力只是原来的50%
    attackRatioCastleMelee: 50,
    defenseRatioCastleMelee: 50,


    // 远程兵射击城上攻击力只是原来的50%
    attackRatioGroundRanged: 50,


    // 单位的造价，击杀获得的分数，经验，金币等
    costRanged: 15,
    costMelee: 15,
    costMortar: 50,

    killGainScoreRanged: 10,
    killGainScoreMelee: 10,
    killGainScoreMortar: 20,
    killGainScoreSelfBomb: 20,
    killGainScoreTower: 20,

    // 标准模式是攻击加经验
    attackGainExpRanged: 20,
    attackGainExpMelee: 20,
    attackGainExpMortar: 40,

    // 炮兵模式是击杀加经验
    killGainExpRanged: 20,
    killGainExpMelee: 20,
    killGainExpMortar: 40,
    killGainExpSelfBomb: 40,
    killGainExpTower: 40,

    killGainMoneyMelee: 10,
    killGainMoneyRanged: 10,
    killGainMoneyMortar: 20,
    killGainMoneySelfBomb: 20,
    killGainMoneyTower: 20,



    // 用常量定义了阵营和属性，还有状态码，提高代码可读性
    factionSoldier: true,
    factionEnemy: false,
    typeMelee: 0,
    typeRanged: 1,
    typeMortar: 2,
    typeSelfBomb: 3,
    typeSiegeTower: 4,
    statusCanAttack: true,
    statusNotAttack: false,

};

const gameConstants = {
    // 屏幕与网格信息
    screenWidth: 960,
    screenHeight: 600,
    gridWidth: 60,
    gridHeight: 60,
    gridNumX: 16,
    gridNumY: 10,

    // 开始信息
    startGold: 100,

    // 随机生成敌人的控制信息
    minNextSoldierTime: 8,
    maxNextSoldierTime: 16,
    minNextEnemyTimeCommon: 5,
    maxNextEnemyTimeCommon: 10,
    minNextEnemyTimeSpecial: 10,
    maxNextEnemyTimeSpecial: 20,
    minNextEnemyTimeTower: 80,
    maxNextEnemyTimeTower: 120,
    maxEnemyAtScene: 20,

    // 随机生成攻城塔附带敌兵的信息
    generateSiegeTowerPlaceX: 250,
    generateMeleeNumber: 4,
    generateMeleeX: [300, 350, 400, 450],
    generateRangedNumber: 2,
    generateRangedY: [-50, 50],

    // 敌人占领广场的最大时间
    enemyHoldSquareMaxTime: 10,

    // 广场范围
    squareRange: 40,

    // 地形类型的定义，能增加可读性
    terrainPlain: false,
    terrainCastle: true,

    // 正无穷
    maxNumber: 114514,

    // 游戏类型
    gameTypeStandard: true,
    gameTypeArtillary: false,

    // 进度条加载总时间
    loadingTimeTotal: 3

};

// 关于网络连接的常量
const netWorkConstants = {
    host: '62.234.128.178:8000',
    username: 'ubuntu',
    password: '24dZe,N^~`RKw',
    url: '/score',
    completeUrl: 'https://62.234.128.178:8000/score',
    timeOut: 2000,
};

// 记录城堡格子的网格坐标
const castleBlocks = {
    castleNumber: 20,
    castleBlocksX: [5, 5, 5, 5, 5, 5, 6, 7, 8, 9, 10, 6, 7, 8, 9, 10, 10, 10, 10, 10],
    castleBlocksY: [2, 3, 4, 5, 6, 7, 2, 2, 2, 2, 2, 7, 7, 7, 7, 7, 3, 4, 5, 6]
};

// 判断一个点在哪个格子
function getCurrentGridPoint(currentPlace) {
    let x: number = Math.floor((currentPlace.x + (gameConstants.gridNumX / 2) * gameConstants.gridWidth)
     / gameConstants.gridWidth);
    let y: number = Math.floor((currentPlace.y + (gameConstants.gridNumY / 2) * gameConstants.gridHeight) /
    gameConstants.gridHeight);

    let place: cc.Vec2;
    place = cc.v2(x, y);
    return place;
}

// 判断一个正方形物体对应哪些格子
function getCurrentGridObject(centralPlace, scale) {
    let placeList: cc.Vec2[] = [];
    let halfScale: cc.Vec2;
    halfScale = cc.v2(scale.x / 2, scale.y / 2);
    let point1: cc.Vec2;
    point1 = cc.v2(centralPlace.x - halfScale.x, centralPlace.y - halfScale.y);

    let point2: cc.Vec2;
    point2 = cc.v2(centralPlace.x + halfScale.x, centralPlace.y - halfScale.y);

    let point3: cc.Vec2;
    point3 = cc.v2(centralPlace.x - halfScale.x, centralPlace.y + halfScale.y);

    let point4: cc.Vec2;
    point4 = cc.v2(centralPlace.x + halfScale.x, centralPlace.y + halfScale.y);

    let place1: cc.Vec2 = getCurrentGridPoint(point1);
    let place2: cc.Vec2 = getCurrentGridPoint(point2);
    let place3: cc.Vec2 = getCurrentGridPoint(point3);
    let place4: cc.Vec2 = getCurrentGridPoint(point4);

    placeList.push(place1);
    if (place2 !== place1) placeList.push(place2);
    if (place3 !== place1 && place3 !== place2) placeList.push(place3);
    if (place4 !== place1 && place4 !== place2 && place4 !== place3) placeList.push(place4);
    return placeList;
}

// 读取距离
function getDistance(place1, place2) {
    let dx = place1.x - place2.x;
    let dy = place1.y - place2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// 计算攻击伤害(子弹，近战)
function calculateDamage(attack, defense) {

    return (attack * ((100 - defense) / 100));
}

// 计算爆炸伤害，最大伤害与攻防关系和近战/子弹相同，而且实际伤害是最大伤害关于距离的线性衰减结果
function calculateShellDamage(attack, defense, distance, range) {
    let damageMax = calculateDamage(attack, defense);
    let damageReal = damageMax * (1 - distance / range);
    return damageReal;
}

// 读取一个节点在世界坐标系的位置
function getWorldPosition(node) {
    return node.convertToWorldSpace(node.position);
}

function judgeOutOfRange(place) {
    if (place.x < 0 - (gameConstants.screenWidth / 2) || place.y < 0 - (gameConstants.screenHeight / 2)
        || place.x > (gameConstants.screenWidth / 2) || place.y > (gameConstants.screenHeight / 2)) {
        return true;
    }
    else { return false }
}

function judgePointInGrid(point, gridCenter, gridSize) {
    let halfSize = cc.v2(gridSize.x / 2, gridSize.y / 2);
    if (point.x >= gridCenter.x - halfSize.x && point.x <= gridCenter.x + halfSize.x
    && point.y >= gridCenter.y - halfSize.y && point.y <= gridCenter.y + halfSize.y) {
        return true;
    }
    else { return false }
}


function judgeUnitInGrid(unitCenter, unitSize, gridCenter, gridSize) {
    // 因为unit比grid小，因此判断四个节点就可以了
    let halfScale: cc.Vec2;
    halfScale = cc.v2(unitSize.x / 2, unitSize.y / 2);
    let point1: cc.Vec2;
    point1 = cc.v2(unitCenter.x - halfScale.x, unitCenter.y - halfScale.y);

    let point2: cc.Vec2;
    point2 = cc.v2(unitCenter.x + halfScale.x, unitCenter.y - halfScale.y);

    let point3: cc.Vec2;
    point3 = cc.v2(unitCenter.x - halfScale.x, unitCenter.y + halfScale.y);

    let point4: cc.Vec2;
    point4 = cc.v2(unitCenter.x + halfScale.x, unitCenter.y + halfScale.y);

    if (judgePointInGrid(point1, gridCenter, gridSize) === true ||
       judgePointInGrid(point2, gridCenter, gridSize) === true ||
       judgePointInGrid(point2, gridCenter, gridSize) === true ||
       judgePointInGrid(point2, gridCenter, gridSize) === true) {
        return true;
    }
    else { return false }
}

// 网格坐标转换成相对canvas的坐标
function gridPlaceToShowPlace(gridPlace) {
    let showPlaceX = gameConstants.gridWidth * (gridPlace.x - (gameConstants.gridNumX / 2) + 0.5);
    let showPlaceY = gameConstants.gridHeight * (gridPlace.y - (gameConstants.gridNumY / 2) + 0.5);
    let showPlace = cc.v2(showPlaceX, showPlaceY);
    return showPlace;
}

// 定义一个全局模块globalModule，全局类globalClass，用于跨场景传参
namespace globalModule {
    export class globalClass {
        static scoreStandard: number = 0;
        static scoreArtillery: number = 0;
        static historyMaxScoreStandard: number = 0;
        static historyMaxScoreArtillery: number = 0;


        // 控制游戏是否暂停,音效是否播放
        static whetherPlayGame: boolean = true;
        static whetherHasSound: boolean = true;

        // 控制游戏类型
        static gameType: boolean = true;
    }
}


export {
    unitConstants, gameConstants, netWorkConstants, getCurrentGridPoint, getCurrentGridObject, getDistance, calculateDamage,
    calculateShellDamage, getWorldPosition, judgeOutOfRange, judgePointInGrid, judgeUnitInGrid, gridPlaceToShowPlace, globalModule,
    castleBlocks
};
