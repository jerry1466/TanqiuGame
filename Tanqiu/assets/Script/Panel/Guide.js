/**
 * Guide
 * @author lijun
 **/
import BasePanel from 'BasePanel'
import Databus from 'Databus'
import TweenAlpha from 'TweenAlpha'
import PrefabUtil from "../Lib/PrefabUtil";

let databus = new Databus()

cc.Class({
    extends: BasePanel,
    properties: {
        lbContent: {
            default: null,
            type: cc.Label
        }
    },

    update() {

    },

    onDestroy() {
        databus.gamePause = false
    },


    Init(index) {
        if(index == 1)
        {
            var _this = this
            PrefabUtil.GetPrefabInstance("GuideFrame", function(success, instance){
                if(success)
                {
                    instance.parent = _this.node
                    instance.width = (databus.gameRegion.x - databus.wallWidth) * 0.5// - ((databus.screenWidth - databus.gameRegion.x) * 0.5)
                    instance.height = databus.gameRegion.y + 30
                    instance.x = instance.width * 0.5 + 0.5 * databus.wallWidth
                    instance.y = 0.5 * databus.adHeight
                    var tweenAlpha = TweenAlpha.begin(instance, 255, 20, 20, 30)
                    tweenAlpha.onFinishCallBack = function()
                    {
                        instance.active = false
                    }
                }
            })

            var hand = new cc.Node();
            hand.name = 'HandAnim';

            hand.addComponent(cc.Sprite);
            hand.parent = this.node;
            hand.x = databus.gameRegion.x * 0.25

            var animation = hand.addComponent(cc.Animation);

            /* 添加SpriteFrame到frames数组 */
            var frames = [];
            frames[0] = new cc.SpriteFrame(cc.url.raw('resources/AnimClip/hand_1.png'));
            frames[1] = new cc.SpriteFrame(cc.url.raw('resources/AnimClip/hand_2.png'));
            frames[2] = new cc.SpriteFrame(cc.url.raw('resources/AnimClip/hand_3.png'));

            var clip = cc.AnimationClip.createWithSpriteFrames(frames, 3);
            clip.name = 'click';
            clip.wrapMode = cc.WrapMode.Loop;

            animation.addClip(clip);
            animation.play('click');

            this.lbContent.string = "点击屏幕，控制木条撞向砖块"
        }
        else
        {
            this.lbContent.string = "把砖块撞到对方区域内\n获得胜利"
        }
    }
})    