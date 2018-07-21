/**
 * Index
 * @author lijun
 **/
import LevelManager from 'LevelManager'
import Databus from 'Databus'

let databus = new Databus()
cc.Class({
    extends: cc.Component,

    update() {

    },

    onDestroy() {

    },


    onLoad() {
        wx.request({
            url: databus.cfgUrl,
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/json'
            },// 设置请求的 header
            success: function (res) {
                if (res.statusCode == 200) {
                    databus.cfgData = res.data
                    databus.guide1 = true
                    databus.guide2 = true
                    databus.passGuide = false
                    new LevelManager().SwitchLevel("preload", 0)
                } else {
                    console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode)
                }
            },
            fail: function () {
                console.log("index.js wx.request CheckCallUser fail");
            },
        })
    }
})    