/**
 * 排行榜
 * @author lijun
 **/
import BasePanel from 'BasePanel'
import Databus from 'Databus'
import ModuleManager from "ModuleManager"
import EventUtil from 'EventUtil'
import UnitManager from "UnitManager";
let databus = new Databus()

cc.Class({
    extends: BasePanel,
    name: "SimpleRankingView",
    properties: {
        rankingScrollView: cc.Sprite,//显示排行榜
        btnClose:cc.Button,
        viewMore:cc.Node,
        rankingBtnAll: cc.Button,
    },
    Init() {

    },
    onLoad() {
    },
    start() {
        console.log("SimpleRankingView start " + CC_WECHATGAME)
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
            //window.sharedCanvas.width = 0.6 * databus.screenWidth;
            //window.sharedCanvas.height = 0.6 * databus.screenHeight;
            this.friendButtonFunc()
        }
    },
    friendButtonFunc(event) {
        if (CC_WECHATGAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 1 + 100 + (databus.isIphoneX?20:0),
                MAIN_MENU_NUM: "x1"
            });
        } else {
            cc.log("获取好友排行榜数据。x1");
        }
    },

    groupFriendButtonFunc: function (event) {
        if (CC_WECHATGAME) {
            window.wx.shareAppMessage({
                success: (res) => {
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        window.wx.postMessage({
                            messageType: 5 + 100 + (databus.isIphoneX?20:0),
                            MAIN_MENU_NUM: "x1",
                            shareTicket: res.shareTickets[0]
                        });
                    }
                }
            });
        } else {
            cc.log("获取群排行榜数据。x1");
        }
    },

    gameOverButtonFunc: function (event) {
        if (CC_WECHATGAME) {
            window.wx.postMessage({// 发消息给子域
                messageType: 4 + 100 + (databus.isIphoneX?20:0),
                MAIN_MENU_NUM: "x1"
            });
        } else {
            cc.log("获取横向展示排行榜数据。x1");
        }
    },

    submitScoreButtonFunc(){
        var score = databus.mission;
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 3 + 100 + (databus.isIphoneX?20:0),
                MAIN_MENU_NUM: "x1",
                score: score,
            });
        } else {
            cc.log("提交得分: x1 : " + score)
        }
    },

    closeButtonFunc(){
        ModuleManager.GetInstance().HideModule("SimpleRankPanel")
    },

    showAll(){
        if (CC_WECHATGAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 1 + (databus.isIphoneX?20:0),
                MAIN_MENU_NUM: "x1"
            });
        } else {
            cc.log("获取好友排行榜数据。x1");
        }
        this.viewMore.active = false
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update() {
        this._updateSubDomainCanvas();
    },
});
