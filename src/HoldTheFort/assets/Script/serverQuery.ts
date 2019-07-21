/*
文件名：serverQuery.ts
描述：给后端服务器发送请求，上传分数，获取历史记录
当前版本：3.0.0
时间：7/18/2019
*/
const { ccclass, property } = cc._decorator;

import { netWorkConstants, globalModule, gameConstants } from './constants';



// 后端代码，把新的得分发到服务器上去，并且获取当前新的历史纪录
function uploadScore(score, mode) {
    // 模式名称
    let theMode;
    if (mode === gameConstants.gameTypeStandard) {
        theMode = 'standard';
    }
    else {
        theMode = 'artillery';
    }

    let nickName = 'sgl';

    if (nickName === null) {
        return;
    }

    // 设置和发送请求
    let scoreRequest = new XMLHttpRequest();
    scoreRequest.timeout = netWorkConstants.timeOut;
    scoreRequest.setRequestHeader('Content-Type', 'application/json');
    scoreRequest.open('POST', netWorkConstants.completeUrl, true);
    let data = { 'name': nickName, 'score': score, 'mode': theMode };
    scoreRequest.send(JSON.stringify(data));

    // 接收请求，修改历史记录
    scoreRequest.onreadystatechange = function () {
        let err;
        if (scoreRequest.readyState == 4 && (scoreRequest.status >= 200 && scoreRequest.status <= 207)) {
            err = false;
        } else {
            err = true;
        }
        let response = scoreRequest.responseText;
        let bestScore = parseInt(response.substring(9, response.length - 1));

        if (mode === gameConstants.gameTypeStandard) {
            globalModule.globalClass.historyMaxScoreStandard = bestScore;
        }
        else {
            globalModule.globalClass.historyMaxScoreArtillery = bestScore;
        }
    };
    scoreRequest.ontimeout = function() {
        if (mode === gameConstants.gameTypeStandard) {
            globalModule.globalClass.historyMaxScoreStandard = score;
        }
        else {
            globalModule.globalClass.historyMaxScoreArtillery = score;
        }
        return;
    };

}


// 连接服务器，获得历史最高纪录
function getHistoryBest(mode) {
    // 模式名称
    let theMode;
    if (mode === gameConstants.gameTypeStandard) {
        theMode = 'standard';
    }
    else {
        theMode = 'artillery';
    }

    // 调用微信api，获取用户名
    let nickName = 'sgl';

    // 设置和发送请求，虽然都是post请求，但是这次发送不改变服务器内容
    let scoreRequest = new XMLHttpRequest();
    scoreRequest.timeout = netWorkConstants.timeOut;
    scoreRequest.setRequestHeader('Content-Type', 'application/json');
    scoreRequest.open('POST', netWorkConstants.completeUrl, true);
    let data = { 'name': nickName, 'score': -1, 'mode': theMode };
    scoreRequest.send(JSON.stringify(data));


    // 接收请求，修改历史记录
    scoreRequest.onreadystatechange = function () {
        let err;
        if (scoreRequest.readyState == 4 && (scoreRequest.status >= 200 && scoreRequest.status <= 207)) {
            err = false;
        } else {
            err = true;
        }
        let response = scoreRequest.responseText;
        let bestScore = parseInt(response.substring(9, response.length - 1));

        // console.log(bestScore);
        if (mode === gameConstants.gameTypeStandard) {
            globalModule.globalClass.historyMaxScoreStandard = bestScore;
        }
        else {
            globalModule.globalClass.historyMaxScoreArtillery = bestScore;
        }
    };
    scoreRequest.ontimeout = function() {
        if (mode === gameConstants.gameTypeStandard) {
            globalModule.globalClass.historyMaxScoreStandard = 0;
        }
        else {
            globalModule.globalClass.historyMaxScoreArtillery = 0;
        }
        return;
    };

}

export { uploadScore, getHistoryBest };

