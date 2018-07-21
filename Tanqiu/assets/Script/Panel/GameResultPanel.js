/**
 * GameResultPanel
 * @author lijun
 **/
import ModuleManager from 'ModuleManager'
import BasePanel from 'BasePanel'
import InterfaceManager from "InterfaceManager"
import Databus from 'Databus'
import GameInfo from "GameInfo";
import EventUtil from 'EventUtil'
import ArrayUtil from 'ArrayUtil'
import UnitManager from "UnitManager";
import ResourceManager from "ResourceManager";

let databus = new Databus()

cc.Class({
    extends: BasePanel,
    properties: {
        bg: {
            default: null,
            type: cc.Sprite
        },
        lbMission: {
            default: null,
            type: cc.RichText
        },

        btnShare: {
            default: null,
            type: cc.Button
        },

        btnPass: {
            default: null,
            type: cc.Button
        },

        btnVideo: {
            default: null,
            type: cc.Button
        },
    },

    onLoad(){
        ResourceManager.LoadRemoteSprite(this.bg, "https://cdn-game.2zhuji.cn/uploads/yxhzbzk/score_view_bg.png")
        var temp = this
        EventUtil.GetInstance().AddEventListener("VideoWatchOver", function(){
            temp.reborn()
        })

        if(databus.cfgData.audit == 1)
        {
            this.btnShare.node.active = false
        }
        else
        {
            this.btnShare.node.active = true
        }
    },

    start(){
        if(databus.cfgData.set.wx_video != null && databus.cfgData.set.wx_video.length > 0)
        {
            this.btnVideo.node.active = true
        }
        else
        {
            this.btnVideo.node.active = false
        }
        //InterfaceManager.GetInstance().CreateAdViedo(ArrayUtil.GetRandomValue(databus.cfgData.set.wx_video))
    },

    update() {

    },

    onDestroy() {
        EventUtil.GetInstance().RemoveEventKey("VideoWatchOver")
    },


    Init(win) {
        var first = Math.floor((databus.mission - 1) / 3) + 1
        var second = (databus.mission - 1) % 3 + 1
        var label = "<color=#FFFFFF>第" + first + "-" + second + "关</color>"
        this.lbMission.string = label
        wx.setStorageSync(databus.shortProductName + "_mission", databus.mission)
    },

    onShareClick() {
        InterfaceManager.GetInstance().ShareWithScore()
    },

    onRankClick() {
        ModuleManager.GetInstance().HideModule("GameResultPanel")
        ModuleManager.GetInstance().ShowModule("RankPanel")
    },

    onVideoClick(){
        InterfaceManager.GetInstance().CreateAdViedo(ArrayUtil.GetRandomValue(databus.cfgData.set.wx_video), function(){
            ModuleManager.GetInstance().HideModule("GameResultPanel")
            EventUtil.GetInstance().DispatchEvent("PlayCutScene")
            UnitManager.GetInstance().RemoveAll()
            setTimeout(function(){
                GameInfo.GetInstance().Start()
            }, 500)
        })
    },

    reborn(){
        if(databus.cfgData.set.relive_time > 0)
        {
            GameInfo.GetInstance().Reborn()
        }
    }
})    