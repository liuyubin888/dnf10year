var isLogin = 0;
var G_USER_INFO;
var ROLE_KEY;

milo.ready(function(){
    need('biz.login', function (LoginManager) {
		
        // ¼ì²éÊÇ·ñÒÑµÇÂ¼
        LoginManager.checkLogin(function(userinfo){
			isLogin = 1;
			ROLE_KEY = milo.cookie.get('uin');
			G_USER_INFO = userinfo;
			G_USER_INFO.nickName = decodeURIComponent(userinfo.nickName);
			getResoutObj.init();
        },function(){
            getResoutObj.init();
        });//checkLogin
    });//need
}); // milo.ready


// ÒÆ¶¯¶Ë
function isMobile() {
    return /iphone|ios|android|mini|mobile|mobi|Nokia|Symbian|iPod|iPad|Windows\s+Phone|MQQBrowser|wp7|wp8|UCBrowser7|UCWEB|360\s+Aphone\s+Browser|blackberry/i.test(navigator.userAgent);
}



//ÒÆ¶¯¶ËqqµÇÂ¼
function qqlogin(){
    need(['biz.login'], function(LoginManager){
        LoginManager.logout({
            logoutCallback: function(){
                LoginManager.login();
            }
        });
    });
}

//ÒÆ¶¯¶Ë×¢Ïú
function loginout(){
    need(['biz.login'], function(LoginManager){
        LoginManager.logout({
            logoutCallback: function () {
                milo.cookie.clear('PERSONAL_DATA_' + ROLE_KEY);
                milo.cookie.clear('G_USER_INFO');
                milo.cookie.clear('PERSONAL_DATA_' + ROLE_KEY, "qq.com", "/");
                milo.cookie.clear('G_USER_INFO', "qq.com", "/");
                document.location.reload(); //Ë¢ÐÂÒ³Ãæ
            }
        });
    });
}

function setLgSource(){
    milo.cookie.clear("lg_source");
    milo.cookie.clear("ams_game_appid");
    milo.cookie.clear("lg_source", "qq.com", "/");
    milo.cookie.clear("ams_game_appid","qq.com","/");
    milo.cookie.set("lg_source","wx_txyxzs",600,"qq.com","/");
    milo.cookie.set("ams_game_appid",appid_wx,600,"qq.com","/");
}
