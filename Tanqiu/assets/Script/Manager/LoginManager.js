let instance
export default class LoginManager{
    constructor(){

    }

    static GetInstance(){
        if(instance == null){
            instance = new LoginManager()
            instance.domain = "https://2zhuji.cn"
            instance.token = "fktd1531820173"
            instance.login_data={}
            instance.host={}
            instance.login_flag=false
            instance.callback=null
            instance.data={}
            instance.key_login="game_userinfo"

        }
        return instance
    }

    WxLogin(res,callback){
        let that = this;
        if(this.login_flag||this.callback){
            return;
        }
        this.login_flag=true;
        if(callback){
            this.callback=callback;
        }
        wx.login({
            success: function (login_res) {
                that.login_data["encryptedData"] = res.encryptedData;
                that.login_data["iv"] = res.iv;
                that.host = {
                    name: res.userInfo.nickName,
                    portrait: res.userInfo.avatarUrl,
                    unionid: "",
                    wecha_id: "",
                    province: res.userInfo.province,
                    city: res.userInfo.city,
                    sex: res.userInfo.gender
                }
                that.sendSession(login_res.code);
            },
            fail: function (res) {

            },
            complete: function (res) {

            },
        });
    }
    sendSession(code) {
        var _this = this;
        console.log("sendSession", this.token, code)
        var url = _this.domain+'/index.php?g=Wap&m=Wxaapi&a=login&token=' + this.token + '&code=' + code;
        var xhr = new XMLHttpRequest()
        xhr.open('get', url, true);
        xhr.responseType = "text"
        xhr.onload =  function(){
            var status = xhr.status;
            console.log(xhr)
            if (status == 200) {
                _this.data.session_3rd = xhr.session_3rd;
                if(xhr.userinfo&&xhr.userinfo.wecha_id&&xhr.userinfo.wechaname&&xhr.userinfo.portrait){
                    //服务器存有当前用户的信息，就用这个信息，授权登陆结束
                    var info=xhr.userinfo;
                    _this.host={
                        name:info.wechaname,
                        sex: info.sex,
                        portrait:info.portrait,
                        unionid:"",
                        wecha_id:info.wecha_id,
                        local_wecha_id:info.wecha_id,
                        province: info.province,
                        city: info.city,
                        id:info.id
                    }
                    console.log("^^^^^^", _this.data.session_3rd)
                    wx.setStorage({
                        key: _this.key_login,
                        data: {
                            session_3rd: _this.data.session_3rd,
                            host:_this.host
                        }
                    });
                    if(_this.callback){
                        _this.callback();
                        _this.callback=null;
                    }
                    _this.login_flag=false;
                }else {
                    //新用户首次授权
                    wx.getUserInfo({
                        success: function (res) {
                            var userInfo = res.userInfo;
                            _this.host = {
                                name: userInfo.nickName,
                                sex: userInfo.gender,
                                portrait: userInfo.avatarUrl,
                                unionid: "",
                                wecha_id: "",
                                local_wecha_id: "",
                                province: userInfo.province,
                                city: userInfo.city
                            }
                            wx.getUserInfo({
                                withCredentials: true,
                                success: function (res) {
                                    _this.data.encryptedData = res.encryptedData;
                                    _this.data.iv = res.iv;
                                    _this.getUserBySession(true);
                                },
                                fail: function (res) {
                                    _this.login_flag = false;
                                    _this.loginFail();
                                }
                            });
                        },
                        fail: function (res) {
                            _this.login_flag = false;
                            _this.loginFail();
                        }
                    });
                }
            }else {
                _this.loginFail();
            }
        };
        xhr.send();
    }
    getUserBySession() {
        var _this = this;
        //获取unionid
        wx.request({
            url: _this.domain + '/index.php?g=Wap&m=Wxaapi&a=getunionid',
            method: 'GET',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                session_3rd: _this.data.session_3rd,
                encrypted: _this.data.encryptedData,
                iv: _this.data.iv
            },
            success: function (res) {
                if (res.data && res.data.wecha_id) {
                    _this.host.wecha_id=res.data.wecha_id;
                    _this.host.local_wecha_id=res.data.wecha_id;
                    _this.host.unionid=res.data.unionid;
                    wx.setStorage({
                        key: _this.key_login,
                        data: {
                            session_3rd: _this.data.session_3rd,
                            host:_this.host
                        }
                    });
                    _this.data.auth="success";
                    console.log("getUserBySession success")
                    if(_this.callback){
                        _this.callback();
                        _this.callback=null;
                    }
                    _this.login_flag=false;
                }else{
                    _this.loginFail();
                }
            }
        })
    }
    loginFail(){
        //授权登陆失败
        if(this.callback){
            this.callback("fail");
            this.callback=null;
        }
    }
}