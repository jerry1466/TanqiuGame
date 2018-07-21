let instance
export default class ModuleConstant {
    constructor() {

    }

    static GetInstance(){
        if(instance)
        {
            return instance
        }
        instance = new ModuleConstant()
        instance.moduleNames = {}
        instance.register()
        return instance
    }

    register(){
        this.moduleNames["PanelMask"] = "Panel/PanelMask"
        this.moduleNames["MissionPanel"] = "Panel/MissionPanel"
        this.moduleNames["GameResultPanel"] = "Panel/GameResultPanel"
        this.moduleNames["RankPanel"] = "Panel/RankPanel"
        this.moduleNames["SimpleRankPanel"] = "Panel/SimpleRankPanel"
        this.moduleNames["AdPanel"] = "Panel/AdPanel"
        this.moduleNames["LoginPanel"] = "Panel/LoginPanel"
        this.moduleNames["Guide"] = "Panel/Guide"
        this.moduleNames["MissionSelectPanel"] = "Panel/MissionSelectPanel"
    }

    GetModuleUrl(moduleName){
        return this.moduleNames[moduleName]
    }
}