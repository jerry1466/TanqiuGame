cc.Class({
    extends: cc.Component,

    properties: {
        rankingScrollView: cc.ScrollView,
        scrollViewContent: cc.Node,
        prefabRankItem: cc.Prefab,
        prefabGameOverRank: cc.Prefab,
        gameOverRankLayout: cc.Node,
        loadingLabel: cc.Node,//加载文字

        rankingTopView: cc.Node,
        rankingTopHorizon: cc.Node,
        prefabRankTop: cc.Prefab,
    },

    start() {
        console.log("GameRankingList start")
        if (CC_WECHATGAME) {
            window.wx.onMessage(data => {
                console.log("接收主域发来消息：", data)
                var showRankTop = data.messageType > 100
                var isIphoneX = (data.messageType % 100) > 20
                data.messageType = data.messageType % 10
                if (data.messageType == 0) {//移除排行榜
                    this.removeChild();
                } else if (data.messageType == 1) {//获取好友排行榜
                    this.fetchFriendData(data.MAIN_MENU_NUM, isIphoneX, showRankTop);
                } else if (data.messageType == 3) {//提交得分
                    this.currentScore = data.score
                    this.submitScore(data.MAIN_MENU_NUM, data.score);
                } else if (data.messageType == 4) {//获取好友排行榜横向排列展示模式
                    this.gameOverRank(data.MAIN_MENU_NUM, showRankTop);
                } else if (data.messageType == 5) {//获取群排行榜
                    this.fetchGroupFriendData(data.MAIN_MENU_NUM, data.shareTicket, isIphoneX, showRankTop);
                }
            });
        } else {
            this.fetchFriendData(1000);
            // this.gameOverRank(1000);
        }
    },
    submitScore(MAIN_MENU_NUM, score) { //提交得分
        if (CC_WECHATGAME) {
            console.log("尝试提交得分:" + score)
            wx.getUserCloudStorage({
                // 以key/value形式存储
                keyList: [MAIN_MENU_NUM],
                success: function (getres) {
                    console.log('getUserCloudStorage', 'success', getres)
                    if (getres.KVDataList.length != 0) {
                        if (getres.KVDataList[0].value > score) {
                            return;
                        }
                    }
                    // 对用户托管数据进行写数据操作
                    window.wx.setUserCloudStorage({
                        KVDataList: [{key: MAIN_MENU_NUM, value: "" + score}],
                        success: function (res) {
                            console.log('setUserCloudStorage', 'success', res)
                        },
                        fail: function (res) {
                            console.log('setUserCloudStorage', 'fail')
                        },
                        complete: function (res) {
                            console.log('setUserCloudStorage', 'ok')
                        }
                    });
                },
                fail: function (res) {
                    console.log('getUserCloudStorage', 'fail')
                },
                complete: function (res) {
                    console.log('getUserCloudStorage', 'ok')
                }
            });
        } else {
            cc.log("提交得分:" + MAIN_MENU_NUM + " : " + score)
        }
    },
    removeChild(showRankTop) {
        this.node.removeChildByTag(1000);
        this.scrollViewContent.removeAllChildren();
        this.rankingTopHorizon.removeAllChildren();
        this.rankingTopView.active = false;
        this.rankingScrollView.active = false;
        this.gameOverRankLayout.active = false;
        this.gameOverRankLayout.removeAllChildren();
        this.loadingLabel.getComponent(cc.Label).string = "玩命加载中...";
        this.loadingLabel.active = true;
    },

    showRankTop(data, userData, isIphoneX){
        this.curRankData = data
        this.curUserData = userData
        this.curIsIphoneX = isIphoneX
        this.rankingTopView.active = true;
        this.rankingScrollView.active = false;
        var len = Math.min(data.length, 3)
        for (let i = 0; i < len; i++) {
            var playerInfo = data[i];
            var item = cc.instantiate(this.prefabRankTop);
            item.getComponent('RankTop').init(i, playerInfo);
            this.rankingTopHorizon.addChild(item);
        }
    },

    showRankAll(data, userData, isIphoneX){
        this.rankingTopView.active = false;
        this.rankingScrollView.active = true;
        for (let i = 0; i < data.length; i++) {
            var playerInfo = data[i];
            var item = cc.instantiate(this.prefabRankItem);
            item.getComponent('RankItem').init(i, playerInfo);
            this.scrollViewContent.addChild(item);
            if(isIphoneX)
            {
                item.setScale(cc.v2(0.75, 1))
            }
        }
    },
    fetchFriendData(MAIN_MENU_NUM, isIphoneX, showRankTop) {
        this.removeChild(showRankTop);
        this.rankingScrollView.active = true;
        console.log("fetchFriendData===========")
        var _this = this
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    this.loadingLabel.active = false;
                    console.log('success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            console.log("wx.getFriendCloudStorage success", res);
                            let data = res.data;
                            //纠正第一次刷新的自身数据（此时读到的数据未必比本次提交的高）
                            for(let i = 0; i < data.length; i++)
                            {
                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    if(data[i].KVDataList[0].value < _this.currentScore)
                                    {
                                        data[i].KVDataList[0].value = _this.currentScore
                                    }
                                    break
                                }
                            }
                            for(let i = data.length - 1; i >= 0 ; i--)
                            {
                                if(data[i].KVDataList[0].value == 'undefined')
                                {
                                    data.splice(i, 1);
                                }
                            }
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });
                            if(showRankTop)
                            {
                                this.showRankTop(data, userData, isIphoneX);
                            }
                            else
                            {
                                this.showRankAll(data, userData, isIphoneX);
                            }
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                            this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        },
                    });
                },
                fail: (res) => {
                    this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    },
    fetchGroupFriendData(MAIN_MENU_NUM, shareTicket, isIphoneX, showRankTop) {
        this.removeChild(showRankTop);
        this.rankingScrollView.active = true;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    console.log('success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getGroupCloudStorage({
                        shareTicket: shareTicket,
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            console.log("wx.getGroupCloudStorage success", res);
                            this.loadingLabel.active = false;
                            let data = res.data;
                            //纠正第一次刷新的自身数据（此时读到的数据未必比本次提交的高）
                            for(let i = 0; i < data.length; i++)
                            {
                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    if(data[i].KVDataList[0].value < _this.currentScore)
                                    {
                                        data[i].KVDataList[0].value = _this.currentScore
                                    }
                                    break
                                }
                            }
                            for(let i = data.length - 1; i >= 0 ; i--)
                            {
                                if(data[i].KVDataList[0].value == 'undefined')
                                {
                                    data.splice(i, 1);
                                }
                            }
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });
                            if(showRankTop)
                            {
                                this.showRankTop(data, userData, isIphoneX);
                            }
                            else
                            {
                                this.showRankAll(data, userData, isIphoneX);
                            }
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                            this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        },
                    });
                },
                fail: (res) => {
                    this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    },

    gameOverRank(MAIN_MENU_NUM, showRankTop) {
        this.removeChild(showRankTop);
        this.gameOverRankLayout.active = true;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    cc.log('success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            cc.log("wx.getFriendCloudStorage success", res);
                            this.loadingLabel.active = false;
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    if ((i - 1) >= 0) {
                                        if ((i + 1) >= data.length && (i - 2) >= 0) {
                                            let userItem = cc.instantiate(this.prefabGameOverRank);
                                            userItem.getComponent('GameOverRank').init(i - 2, data[i - 2]);
                                            this.gameOverRankLayout.addChild(userItem);
                                        }
                                        let userItem = cc.instantiate(this.prefabGameOverRank);
                                        userItem.getComponent('GameOverRank').init(i - 1, data[i - 1]);
                                        this.gameOverRankLayout.addChild(userItem);
                                    } else {
                                        if ((i + 2) >= data.length) {
                                            let node = new cc.Node();
                                            node.width = 200;
                                            this.gameOverRankLayout.addChild(node);
                                        }
                                    }
                                    let userItem = cc.instantiate(this.prefabGameOverRank);
                                    userItem.getComponent('GameOverRank').init(i, data[i], true);
                                    this.gameOverRankLayout.addChild(userItem);
                                    if ((i + 1) < data.length) {
                                        let userItem = cc.instantiate(this.prefabGameOverRank);
                                        userItem.getComponent('GameOverRank').init(i + 1, data[i + 1]);
                                        this.gameOverRankLayout.addChild(userItem);
                                        if ((i - 1) < 0 && (i + 2) < data.length) {
                                            let userItem = cc.instantiate(this.prefabGameOverRank);
                                            userItem.getComponent('GameOverRank').init(i + 2, data[i + 2]);
                                            this.gameOverRankLayout.addChild(userItem);
                                        }
                                    }
                                }
                            }
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                            this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        },
                    });
                },
                fail: (res) => {
                    this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    },
});
