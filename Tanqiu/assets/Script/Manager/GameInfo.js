/**
 * GameInfo
 * @auhor clairli
 */
import Databus from 'Databus'
import EventUtil from 'EventUtil'
import ModuleManager from "ModuleManager"
import UnitManager from "UnitManager"
import MissionConfig from "MissionConfig"
import SceneManager from "SceneManager";
import MathUtil from "MathUtil";

let instance
let databus = new Databus()
export default class GameInfo {
    constructor() {

    }

    static GetInstance() {
        if (instance == null) {
            instance = new GameInfo()
        }
        return instance
    }

    Start(){
        databus.Reset()
        databus.brickPos = new MissionConfig().GetMissionBrickPos(databus.mission)
        databus.moveSpeed = new MissionConfig().GetMissionMoveSpeed(databus.mission)
        databus.brickHeight = new MissionConfig().GetMissionBrickHeight(databus.mission)
        databus.woodHeight = new MissionConfig().GetMissionWoodHeight(databus.mission)
        this.initBattle()
    }

    GameOver(win){
        databus.win = win
        EventUtil.GetInstance().DispatchEvent("GameOver")
        ModuleManager.GetInstance().ShowModule("GameResultPanel", win)
    }

    initBattle(){
        var _this = this
        this.combineWall(_this, 0, function(){
            _this.combineBrick(_this, 0, function(){
                _this.combineWood(_this, function(){
                    ModuleManager.GetInstance().ShowModule("MissionPanel", databus.mission)
                    EventUtil.GetInstance().AddEventListener("HidePanel", function(moduleName){
                        if(moduleName == "MissionPanel")
                        {
                            databus.gameStart = true
                            EventUtil.GetInstance().DispatchEvent("GameStart")
                        }
                    })
                })
            })
        })
    }

    combineWall(_this, index, callback){
        if(index <= databus.brickPos.length)
        {
            UnitManager.GetInstance().CreateWall(function(wall){
                SceneManager.GetInstance().rootCanvas.addChild(wall)
                wall.width = databus.wallWidth
                if (index == 0)
                {
                    wall.height = databus.gameRegion.y * databus.brickPos[index] - databus.brickHeight * 0.5
                    wall.y = (databus.gameRegion.y + databus.adHeight) * 0.5 - wall.height * 0.5
                }
                else if(index == databus.brickPos.length)
                {
                    wall.height = databus.gameRegion.y - (databus.gameRegion.y * databus.brickPos[index - 1]) - databus.brickHeight * 0.5
                    wall.y = -(databus.gameRegion.y - databus.adHeight) * 0.5 + 0.5 * wall.height
                }
                else
                {
                    wall.height = (databus.gameRegion.y * databus.brickPos[index] - databus.brickHeight * 0.5) - (databus.gameRegion.y * databus.brickPos[index - 1] + databus.brickHeight * 0.5)
                    wall.y = (databus.gameRegion.y  + databus.adHeight) * 0.5 - databus.gameRegion.y * databus.brickPos[index - 1] - 0.5 * databus.brickHeight - 0.5 * wall.height
                }
                wall.x = 0
                _this.combineWall(_this, index + 1, callback)
            })
        }
        else
        {
            callback()
        }
    }

    combineBrick(_this, index, callback){
        if(index < databus.brickPos.length) {
            UnitManager.GetInstance().CreateBrick(index + 1, function (brick) {
                SceneManager.GetInstance().rootCanvas.addChild(brick)
                brick.width = databus.wallWidth
                brick.height = databus.brickHeight
                brick.x = 0
                brick.y = (databus.gameRegion.y + databus.adHeight) * 0.5 - databus.gameRegion.y * databus.brickPos[index]
                var comBrick = brick.getComponent("Brick")
                comBrick.Init()
                _this.combineBrick(_this, index + 1, callback)
            })
        }
        else
        {
            callback()
        }
    }

    combineWood(_this, callback){
        UnitManager.GetInstance().CreateWood(true, function(wood){
            SceneManager.GetInstance().rootCanvas.addChild(wood)
            wood.width = databus.woodWidth
            wood.height = databus.woodHeight
            wood.x = databus.xRightWood
            wood.y = databus.gameRegion.y * 0.5 - databus.gameRegion.y * (new MissionConfig().GetMissionMyWoodStartPos(databus.mission))
            var comWood = wood.getComponent("Wood")
            comWood.Init(true, -1, new MissionConfig().GetMissionMyWoodDirection(databus.mission))

            UnitManager.GetInstance().CreateWood(false, function(wood){
                SceneManager.GetInstance().rootCanvas.addChild(wood)
                wood.width = databus.woodWidth
                wood.height = databus.woodHeight
                wood.x = databus.xLeftWood
                wood.y = (databus.gameRegion.y + databus.adHeight) * 0.5 - databus.gameRegion.y * (new MissionConfig().GetMissionEnemyWoodStartPos(databus.mission))
                var comWood = wood.getComponent("Wood")
                comWood.Init(false, 1, new MissionConfig().GetMissionEnemyWoodDirection(databus.mission))
                callback()
            })
        })
    }

    FireBullet(reflect, x, y, angle){
        UnitManager.GetInstance().CreateBullet(function(bullet){
            bullet.reflect = reflect
            bullet.angle = angle
            bullet.node.x = x
            bullet.node.y = y
            bullet.ySpeed = databus.bulletSpeed * Math.cos(bullet.angle * Math.PI / 180);
            bullet.xSpeed = databus.bulletSpeed * Math.sin(bullet.angle * Math.PI / 180);
        })
    }

    CheckHitBrick(wood){
        for(var i = 0; i < UnitManager.GetInstance().bricks.length; i++)
        {
            var brick = UnitManager.GetInstance().bricks[i];
            if(MathUtil.HitTest(wood, brick.node))
            {
                console.log("CheckHitBrick true")
                var comWood = wood.getComponent("Wood")
                brick.MoveStep(comWood.xDirection)
                return true
            }
        }
        return false
    }

    CheckHitWall(wood){
        for(var i = 0; i < UnitManager.GetInstance().walls.length; i++)
        {
            var wall = UnitManager.GetInstance().walls[i];
            if(MathUtil.HitTest(wood, wall))
            {
                console.log("CheckHitWall true")
                return true
            }
        }
        return false
    }

    CheckBrickAlignWood(wood){
        for(var i = 0; i < UnitManager.GetInstance().bricks.length; i++)
        {
            var brick = UnitManager.GetInstance().bricks[i];
            if(Math.abs(brick.node.y - wood.y) <= 5)
            {
                return true
            }
        }
        return false
    }

    HitAvatar(node, xDirection){
        if(xDirection < 0 && node.y <= UnitManager.GetInstance().enemy.y + UnitManager.GetInstance().enemy.height * 0.5)
        {
            EventUtil.GetInstance().DispatchEvent("PlayWinSound")
            return true
        }
        else if(xDirection > 0 && node.y <= UnitManager.GetInstance().player.y + UnitManager.GetInstance().player.height * 0.5)
        {
            EventUtil.GetInstance().DispatchEvent("PlayLoseSound")
            return true
        }
        return false
    }

    Hit(isMe){
        if(isMe)
        {
            if(UnitManager.GetInstance().myWood)
            {
                var comWood = UnitManager.GetInstance().myWood.getComponent("Wood")
                comWood.TryHit()
            }
        }
        else
        {
            if(UnitManager.GetInstance().enemyWood)
            {
                var comWood = UnitManager.GetInstance().enemyWood.getComponent("Wood")
                comWood.TryHit()
            }
        }
    }

    Reborn(){
        databus.win = null
        ModuleManager.GetInstance().HideModule("GameResultPanel")
        EventUtil.GetInstance().DispatchEvent("Reborn")
    }

    ShowResult(win){
        databus.win = win
        EventUtil.GetInstance().DispatchEvent("MissionEnd")
        if(win && databus.mission < new MissionConfig().GetMissionCount())
        {
            EventUtil.GetInstance().DispatchEvent("PlayCutScene")
            UnitManager.GetInstance().RemoveAll()
            var _this = this
            setTimeout(function(){
                databus.mission = databus.mission + 1
                _this.Start()
            }, 500)
        }
        else
        {
            ModuleManager.GetInstance().ShowModule("GameResultPanel", true)
        }
    }

    Replay(){
        for(var row = 0; row < databus.gridRow; row++)
        {
            for(var column = 0; column < databus.gridColumn; column++)
            {
                if( this.unitList[row][column] != null &&  this.unitList[row][column].node != null)
                {
                    this.unitList[row][column].node.removeFromParent()
                    this.unitList[row][column].node.destroy()
                }
            }
        }
        this.unitList = null
        databus.win = null
        EventUtil.GetInstance().DispatchEvent("GameRestart")
    }
}