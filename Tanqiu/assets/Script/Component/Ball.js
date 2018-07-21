/**
 * Brick
 * @author lijun
 **/
import Databus from 'Databus'
import GameInfo from "GameInfo"
import TweenAlpha from "TweenAlpha"
import MissionConfig from "MissionConfig";

let databus = new Databus()
cc.Class({
    extends: cc.Component,
    properties: {
        id:0,
        sizeIndex:0,
        xSpeed:0,
        xSpeedUpTime:0,
        lbNumber:cc.Label,
    },

    onLoad(){

    },

    update() {
        if (this.dropping)
        {
            var deltaTime = (Date.now() - this.dropStartTime) * 0.001
            this.node.x = this.startX + this.xDirection * (databus.wallWidth * 0.5 + 40 * deltaTime)
            this.node.y = this.originalY - 0.5 * databus.gravity * Math.pow(deltaTime, 2)
            var hit = GameInfo.GetInstance().HitAvatar(this.node, this.xDirection)
            if(hit == true)
            {
                this.dropping = false
                var win = this.xDirection < 0
                var tweenAlpha = TweenAlpha.begin(this.node, 1, 0, 0.4, 1)
                tweenAlpha.onFinishCallBack = function() {
                    GameInfo.GetInstance().ShowResult(win)
                }
            }
        }
        else if(!databus.gamePause && !databus.gameOver && this.xMoving)
        {
            this.node.x += this.xDirection * databus.brickMoveSpeed

            if(this.xDirection < 0)
            {
                if(this.targetSlot == 0 && this.node.x <= 0)
                {
                    this.xDirection = 0
                    this.xMoving = false
                    this.node.x = 0
                }
                else if(this.targetSlot != 0 && this.node.x <= (this.targetSlot * databus.wallWidth * databus.brickMoveStep))
                {
                    this.xDirection = 0
                    this.xMoving = false
                    this.node.x = this.targetSlot * databus.wallWidth * databus.brickMoveStep
                }
            }
            else if(this.xDirection > 0)
            {
                if(this.targetSlot == 0 && this.node.x >= 0)
                {
                    this.xDirection = 0
                    this.xMoving = false
                    this.node.x = 0
                }
                else if(this.targetSlot != 0 && this.node.x >= (this.targetSlot * databus.wallWidth * databus.brickMoveStep))
                {
                    this.xDirection = 0
                    this.xMoving = false
                    this.node.x = this.targetSlot * databus.wallWidth * databus.brickMoveStep
                }
            }
        }

        if(databus.gameStart && !databus.gamePause && !databus.gameOver)
        {
            if(this.dyncHeightEnable)
            {
                if(this.heightChangeDirection < 0)
                {
                    if(this.node.height >= 0)
                    {
                        this.node.height += this.heightChangeDirection * this.heightChangeStep
                    }
                    else
                    {
                        this.heightChangeDirection *= -1
                    }
                }
                else if(this.heightChangeDirection > 0)
                {
                    if(this.node.height <= this.originalHeight)
                    {
                        this.node.height += this.heightChangeDirection * this.heightChangeStep
                    }
                    else
                    {
                        this.heightChangeDirection *= -1
                    }
                }
            }
        }
    },

    onDestroy() {

    },


    Init() {
        this.originalY = this.node.y
    },

    Drop() {
        this.dropping = true
        this.dropStartTime = Date.now()
    },

    MoveStep(direction){
        if(this.xDirection != direction)
        {
            this.targetSlot += direction / Math.abs(direction)
            console.log("targetSlot:", this.id, this.targetSlot)
            if(Math.abs(this.targetSlot) - 1 > 0.5 / databus.brickMoveStep)
            {
                console.log("drop begin")
                databus.gameOver = true
                this.xDirection = direction
                this.startX = this.node.x
                this.Drop()
            }
            else
            {
                console.log("move begin")
                this.xDirection = direction
                this.xMoving = true
            }
        }
    }
})    