/*
文件名：constants.ts
描述：常量和常用函数的定义位置
unitConstants存储着各种士兵，弹药的信息
gameConstants存储着游戏界面等的信息
当前版本：1.0.0
时间：7/12/2019
*/
const {ccclass, property} = cc._decorator;

const unitConstants = {
    //等级和经验
    maxLevel: 3,
    expRequiredEachLevel:[100,300],

    //按等级定义的最大生命，攻击，防御，速度
    healthRangedEachLevel:[200,240,300],
    healthMeleeEachLevel:[300,380,450],
    healthRestorationEachLevel:[2,3,5],

    attackRangedEachLevel:[150,170,200],
    attackMeleeEachLevel:[150,170,200],

    defenseRangedEachLevel:[10,20,35],
    defenseMeleeEachLevel:[20,35,50],

    speedUnit: 20,
    speedAmmo: 400,
    speedCannon: 200,

    //在城堡上运动速度只是原先的10%
    speedRatioCastle: 50,

    //近战兵在攻城时攻击力,防御力只是原来的50%
    attackRatioCastleMelee: 50,
    defenseRatioCastleMelee: 50,


    //远程兵射击城上攻击力只是原来的50%
    attackRatioGroundRanged: 50,


    //单位的造价，击杀获得的分数，经验，金币等
    costRanged:10,
    costMelee:10,

    killGainScoreRanged:10,
    killGainScoreMelee:10,

    attackGainExpRanged:20,
    attackGainExpMelee:20,

    killGainMoneyMelee: 10,
    killGainMoneyRanged: 10,

    //攻击范围，代表两个单位中心的距离
    attackRangeMelee: 40,
    attackRangeRanged: 200,

    //子弹命中判定：两个中心距离小于某个值
    ammoHitRange:25,

    //每个兵种的装填时间
    attackTimeMelee: 2,
    attackTimeRanged: 5,



}

const gameConstants = {
    //屏幕与网格信息
    screenWidth : 960,
    screenHeight: 600,
    gridWidth: 60,
    gridHeight: 60,
    gridNumX: 16,
    gridNumY: 10,

    //开始信息
    startGold: 100,

    //随机生成敌人的控制信息
    minNextEnemyTime: 5,
    maxNextEnemyTime: 10,
    maxEnemyAtScene: 10,

    //敌人占领广场的最大时间
    enemyHoldSquareMaxTime: 30,
    
    //广场范围
    squareRange: 40,

};

//关于网络连接的常量
const netWorkConstants = {
    host : '62.234.128.178:8000',
    username: 'ubuntu',
    password: '24dZe,N^~`RKw',
    url: '/score',
    completeUrl: '62.234.128.178:8000/score',
} 



//判断一个点在哪个格子
function getCurrentGridPoint(currentPlace) {
    let x:number = Math.floor((currentPlace.x + (gameConstants.gridNumX / 2) * gameConstants.gridWidth)
     / gameConstants.gridWidth);
    let y:number = Math.floor((currentPlace.y  + (gameConstants.gridNumY / 2) * gameConstants.gridHeight) / 
    gameConstants.gridHeight);

    let place:cc.Vec2;
    place = cc.v2(x,y);
    return place;
}

//判断一个正方形物体对应哪些格子
function getCurrentGridObject(centralPlace, scale) {
    let placeList:cc.Vec2[] = [];
    let halfScale:cc.Vec2;
    halfScale = cc.v2(scale.x / 2, scale.y / 2);
    let point1:cc.Vec2;
    point1 = cc.v2(centralPlace.x - halfScale.x, centralPlace.y - halfScale.y);

    let point2:cc.Vec2;
    point2 = cc.v2(centralPlace.x + halfScale.x, centralPlace.y - halfScale.y);

    let point3:cc.Vec2;
    point3 = cc.v2(centralPlace.x - halfScale.x, centralPlace.y + halfScale.y);

    let point4:cc.Vec2;
    point4 = cc.v2(centralPlace.x + halfScale.x, centralPlace.y + halfScale.y);
    
    let place1:cc.Vec2 = getCurrentGridPoint(point1);
    let place2:cc.Vec2 = getCurrentGridPoint(point2);
    let place3:cc.Vec2 = getCurrentGridPoint(point3);
    let place4:cc.Vec2 = getCurrentGridPoint(point4);

    placeList.push(place1);
    if(place2 !== place1)   placeList.push(place2);
    if(place3 !== place1 && place3 !== place2)  placeList.push(place3);
    if(place4 !== place1 && place4 !== place2 && place4 !== place3)  placeList.push(place4);
    return placeList;
}

//读取距离
function getDistance(place1,place2) {
    let dx = place1.x - place2.x;
    let dy = place1.y - place2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

//计算伤害
function calculateDamage(attack, defense){

    return (attack * ((100 - defense) / 100));
}

//读取一个节点在世界坐标系的位置
function getWorldPosition(node) {
    return node.convertToWorldSpace(node.position);
}

function judgeOutOfRange(place) {
    if(place.x < 0 - (gameConstants.screenWidth / 2) || place.y < 0 - (gameConstants.screenHeight / 2) 
        || place.x > (gameConstants.screenWidth / 2) || place.y > (gameConstants.screenHeight / 2)) {
        return true;
    }
    else return false;
}

function judgePointInGrid(point, gridCenter, gridSize) {
    let halfSize = cc.v2(gridSize.x / 2, gridSize.y / 2);
    if(point.x >= gridCenter.x - halfSize.x && point.x <= gridCenter.x + halfSize.x 
    && point.y >= gridCenter.y - halfSize.y && point.y <= gridCenter.y + halfSize.y) {
        return true;
    }
    else return false;
}


function judgeUnitInGrid(unitCenter, unitSize, gridCenter, gridSize) {
    //因为unit比grid小，因此判断四个节点就可以了
    let halfScale:cc.Vec2;
    halfScale = cc.v2(unitSize.x / 2, unitSize.y / 2);
    let point1:cc.Vec2;
    point1 = cc.v2(unitCenter.x - halfScale.x, unitCenter.y - halfScale.y);

    let point2:cc.Vec2;
    point2 = cc.v2(unitCenter.x + halfScale.x, unitCenter.y - halfScale.y);

    let point3:cc.Vec2;
    point3 = cc.v2(unitCenter.x - halfScale.x, unitCenter.y + halfScale.y);

    let point4:cc.Vec2;
    point4 = cc.v2(unitCenter.x + halfScale.x, unitCenter.y + halfScale.y);

    if(judgePointInGrid(point1, gridCenter, gridSize) === true ||
       judgePointInGrid(point2, gridCenter, gridSize) === true ||
       judgePointInGrid(point2, gridCenter, gridSize) === true ||
       judgePointInGrid(point2, gridCenter, gridSize) === true) {
           return true;
       }
    else return false;
}

//网格坐标转换成相对canvas的坐标
function gridPlaceToShowPlace(gridPlace) {
    let showPlaceX = gameConstants.gridWidth * (gridPlace.x - (gameConstants.gridNumX / 2) + 0.5);
    let showPlaceY = gameConstants.gridHeight * (gridPlace.y - (gameConstants.gridNumY / 2) + 0.5);
    let showPlace = cc.v2(showPlaceX, showPlaceY);
    return showPlace;
}

//定义一个全局模块globalModule，全局类globalClass，用于跨场景传参
module globalModule {
  export class globalClass {
    static score : number = 0;
    static historyMaxScore : number = 0;
  }
}


export {unitConstants, gameConstants, netWorkConstants, getCurrentGridPoint, getCurrentGridObject, getDistance, calculateDamage,
     getWorldPosition, judgeOutOfRange, judgePointInGrid, judgeUnitInGrid, gridPlaceToShowPlace, globalModule};
