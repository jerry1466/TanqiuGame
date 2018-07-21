/**
 * MissionPanel
 * @author lijun
 **/
import BasePanel from 'BasePanel'
import EventUtil from 'EventUtil'
import Databus from 'Databus'
import TweenAlpha from 'TweenAlpha'
import ModuleManager from "ModuleManager";

let databus = new Databus()

cc.Class({
    extends: BasePanel,
    properties: {
        lbMission: {
            default: null,
            type: cc.RichText
        }
    },

    update() {

    },

    start(){
        var _this = this
        setTimeout(function(){
            var tweenAlpha = TweenAlpha.begin(_this.node, 1, 0.1, 0.3, 1)
            tweenAlpha.onFinishCallBack = function(){
                ModuleManager.GetInstance().HideModule("MissionPanel")
            }
        }, 1000)
    },

    onDestroy() {
        EventUtil.GetInstance().DispatchEvent("HideRulePanel")
    },

    Init(mission) {
        var first = Math.floor((mission - 1) / 3) + 1
        var second = (mission - 1) % 3 + 1
        this.lbMission.string = "<color=#FFFFFF>第</c><color=#03AEFF>" + first + "-" + second + "</c><color=#FFFFFF>关</c>"
        this._super()
    }
})    