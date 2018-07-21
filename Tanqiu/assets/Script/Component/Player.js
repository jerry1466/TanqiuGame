/**
 * Player
 * @author lijun
 **/
import CD from 'Cd'
import Databus from 'Databus'
let databus = new Databus()

cc.Class({
    extends: cc.Component,
    properties: {
        sp: {
            default: null,
            type: cc.Sprite,
        }
    },

    onLoad(){
        this.statueCd = new CD(300, false)
    },

    update() {
        if(databus.gameStart && !databus.gamePause && !databus.gameOver)
        {
            if(this.statueCd.Tick())
            {
                this.FireBullet();
            }
        }
    },

    onDestroy() {

    },


    Init(){

    },

    FireBullet(){
        if(GameInfo.GetInstance().GetBuff(1001))
        {
            GameInfo.GetInstance().FireBullet(true, this.node.x - 5, this.node.y, -45)
            GameInfo.GetInstance().FireBullet(true, this.node.x + 5, this.node.y, 45)
        }
        else
        {
            if(databus.power < 30)
            {
                GameInfo.GetInstance().FireBullet(false, this.node.x, this.node.y, 0)
            }
            else if(databus.power >= 30 && databus.power < 100)
            {
                GameInfo.GetInstance().FireBullet(false, this.node.x - 5, this.node.y, 0)
                GameInfo.GetInstance().FireBullet(false, this.node.x + 5, this.node.y, 0)
            }
            else
            {
                GameInfo.GetInstance().FireBullet(false, this.node.x - 5, this.node.y, 0)
                GameInfo.GetInstance().FireBullet(false, this.node.x + 5, this.node.y, 0)
                GameInfo.GetInstance().FireBullet(false, this.node.x - 5, this.node.y, -45)
                GameInfo.GetInstance().FireBullet(false, this.node.x + 5, this.node.y, 45)
            }
        }
    }
})    