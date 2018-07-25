/**
 * Databus
 * @auhor clairli
 */
import MathUtil from "MathUtil"
import AffairConstant from "AffairConstant";

let instance
export default class Databus {
    constructor() {
        if (instance)
            return instance

        instance = this

        this.productName = "弹球与大炮"
        this.shortProductName = "Tanqiu"
        this.cfgUrl = "https://wxa.05babay.cn/index.php?g=Wap&m=WxaGame&a=get_config&token=fktd1531820173"
        this.soundEnable = true
        this.screenWidth = 375
        this.screenHeight = 812
        this.screenRatio = 1
        this.adHeight = 110
        this.gameRegion = cc.v2(375, 550)
        this.mission = 1
        this.hitSpeed = 2
        this.xLeftWood = -80
        this.xRightWood = -this.xLeftWood
        this.wallWidth = 40
        this.woodWidth = 40
        this.brickMoveSpeed = 10
        this.brickMoveStep = 0.26
        this.externalSeed = 0.15
        this.bulletSpeed = 1.5
        this.gravity = 980
        /**************变量部分*************/
        this.win = null
        this.gameStart = false
        this.gamePause = false
        this.gameOver = false
        this.adBanner = null
    }

    GetInstance() {
        if (instance == null) {
            instance = new Databus()
        }
        return instance
    }

    Reset(){
        this.win = null
        this.gameStart = false
        this.gamePause = false
        this.gameOver = false
        this.adBanner = null
    }
}