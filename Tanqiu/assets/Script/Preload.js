import LevelManager from 'LevelManager'
import SceneManager from "SceneManager";
import InterfaceManager from "InterfaceManager";
import ModuleManager from "ModuleManager";
import Databus from 'Databus'
import ArrayUtil from "ArrayUtil"
import EventUtil from "EventUtil";
import StatisticManager from "StatisticManager";

let databus = new Databus()

cc.Class({
    extends: cc.Component,
    properties: {
        bg:{
            default: null,
            type: cc.Sprite,
        },
        btnEnter:{
            default: null,
            type:cc.Button,
        },

        btnRule: {
            default: null,
            type:cc.Button,
        },

        btnShare: {
            default: null,
            type:cc.Button
        },

        lbSubscribe:{
            default: null,
            type:cc.Label
        }
    },

    onLoad:function(){
        var temp = this
        SceneManager.GetInstance().rootCanvas = temp.node
        if(CC_WECHATGAME)
        {
            wx.getSystemInfo({
                success:function(res){
                    databus.screenWidth = res.windowWidth
                    databus.screenHeight = res.windowHeight
                    databus.isIphoneX = (databus.screenWidth == 375) && (databus.screenHeight == 812)
                    //temp.bg.node.width = res.windowWidth
                    //temp.bg.node.height = res.windowHeight
                    console.log("设备分辨率:", databus.screenWidth, databus.screenHeight, databus.screenRatio, databus.isIphoneX)

                }
            })
            EventUtil.GetInstance().AddEventListener("EnterBattle", function(){
                ModuleManager.GetInstance().HideModule("LoginPanel")
            })
        }
        //ResourceManager.LoadRemoteSprite(this.bg, "https://cdn-game.2zhuji.cn/uploads/yxhzbzk/cover_bg.png")
        this.lbSubscribe.label = databus.cfgData.set.subscribe_text
        if(databus.cfgData.audit == 1)
        {
            this.btnShare.node.active = false
        }
        else
        {
            this.btnShare.node.active = true
        }
        if(new LevelManager().CurrentLevelParam == 1)
        {
            if(databus.mission != null && databus.mission > 0)
            {
                databus.startMission = databus.mission
            }
        }
        else
        {
            var lastMission = wx.getStorageSync(databus.shortProductName + "_mission")
            if(lastMission == null || lastMission == 0)
            {
                databus.startMission = 1;
            }
            else
            {
                databus.startMission = lastMission;
            }
        }
        if(databus.cfgData.set.wx_bannner != null && databus.cfgData.set.wx_bannner.length > 0)
        {
            InterfaceManager.GetInstance().CreateAdBanner(ArrayUtil.GetRandomValue(databus.cfgData.set.wx_bannner))
        }
        StatisticManager.getInstance().statistics()
    },

    onDestroy(){
    },

    start(){
        setTimeout(function(){
            InterfaceManager.GetInstance().RegisterShareAppMessageHandler()
        }, 300)
    },

    onEnterClick(){
        new LevelManager().SwitchLevel("battle", databus.startMission)
    },

    onRuleClick(){
        ModuleManager.GetInstance().ShowModule("RuleTipPanel")
    },

    onMissionSelectClick(){
        if(this.trickClickCount == null || this.trickClickCount == 0)
        {
            this.trickClickCount = 1
        }
        else
        {
            this.trickClickCount += 1
        }
        if(this.trickClickCount == 3)
        {
            ModuleManager.GetInstance().ShowModule("MissionSelectPanel")
            this.trickClickCount = 0
        }
        var _this = this
        setTimeout(function(){_this.trickClickCount = 0}, 3000)
    },

    onShareClick(){
        InterfaceManager.GetInstance().ShareWithImg()
    },

    onRankClick(){
        ModuleManager.GetInstance().ShowModule("SimpleRankPanel")
    },

    onAiWanClick(){
        this.onAdClick()
    },

    onMoreGameClick(){
        ModuleManager.GetInstance().ShowModule("AdPanel")
    },

    onSoundClick(){
        databus.soundEnable = !databus.soundEnable
        var title = databus.soundEnable? "开启音效":"关闭音效"
        wx.showToast({title:title})
    },

    onAdClick(){
        //new LevelManager().SwitchLevel("ad", "0")
        wx.previewImage({
            urls:[ArrayUtil.GetRandomValue(databus.cfgData.set.more_game_ad.poster).img],
            success:function(res){
                console.log(res)
            }
        })
    },
});