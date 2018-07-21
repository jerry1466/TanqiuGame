/**
 * MissionSelectPanel
 * @author lijun
 **/
import BasePanel from 'BasePanel'
import ModuleManager from "../Manager/ModuleManager";
import Databus from 'Databus'

let databus = new Databus()
cc.Class({
    extends: BasePanel,

    update() {

    },

    onDestroy() {

    },


    Init() {

    },

    onMissionSelect(_, mission){
        console.log("select mission:", mission)
        databus.startMission = mission
        ModuleManager.GetInstance().HideModule("MissionSelectPanel")
    }
})    