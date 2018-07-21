cc.Class({
    extends: cc.Component,
    name: "RankTop",
    properties: {
        backSprite: cc.Node,
        rankLabel: cc.Label,
        avatarImgSprite: cc.Sprite,
        //nickLabel: cc.Label,
        missionLabel: cc.Label,
    },

    init: function(rank, data){
        if (rank % 2 == 0) {
            this.backSprite.setOpacity(255)
        }
        else
        {
            this.backSprite.setOpacity(125)
        }
        let avatarUrl = data.avatarUrl;
        this.createImage(avatarUrl);
        this.rankLabel.string = (rank + 1).toString();
        //let nick = data.nickname;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        if(grade == "undefined") grade = 0
        //this.nickLabel.string = nick;
        var first = Math.floor((grade - 1) / 3) + 1
        var second = (grade - 1) % 3 + 1
        this.missionLabel.string = "第" + first + "-" + second + "关"
    },

    createImage(avatarUrl) {
        if (CC_WECHATGAME) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        cc.log(e);
                        this.avatarImgSprite.node.active = false;
                    }
                };
                image.src = avatarUrl;
            }catch (e) {
                cc.log(e);
                this.avatarImgSprite.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }
})