/**
* @class milo.biz.LoginManager 登陆管理器
* @author cathzhang
* @version 0.1.0.0 2011-12-08
* 手机终端版登陆管理器，此为跳出新链接让用户登陆与pc端浮层不同
* @demo http://gameact.qq.com/milo_mobile/biz/login.htm
*/
document.domain="qq.com";
//add by marsboyding  增加djc支持方案
var loginRequireModules = (milo.cookie.get('djc_appVersion') != null && milo.cookie.get('djc_appVersion') >=62)? ['util.base64','ams.atm','daoju.hx.loginapp'] : ['util.base64','ams.atm'];
define("biz.login",loginRequireModules,function(Base64,ATM,loginInDjApp){
	//add by marsboyding  增加djc支持方案
    if(typeof loginInDjApp != 'undefined'){
        return loginInDjApp;
    }
	var APPID={
		'game' : 21000115,
		'default' : 21000115
	},
	LOGO = {
		'sgn' : 'sgn',
		'default' : 'sy'
	};
	
	var option = {
		/**
		 * @cfg {string} loginBtn 登陆按钮ID
		 */
		loginBtn : 'ptLoginBtn',
		
		/**
		 * @cfg {string} wxloginBtn 微信登陆按钮ID
		 */
		wxloginBtn:"wxloginBtn",
		/**
		 * @cfg {string} logoutBtn 注销按钮ID
		 */
		logoutBtn : 'ptLogoutBtn',
		/**
		 * @cfg {string} loginedDiv 登陆显示区DIV的ID
		 */
		loginedDiv : 'logined',
		/**
		 * @cfg {string} unloginDiv 注销显示区DIV的ID
		 */
		unloginDiv : 'unlogin',
		/**
		 * @cfg {string} userinfoSpan 显示用户登陆信息如q号等的ID
		 */
		userinfoSpan : 'userinfo',
		/**
		 * @cfg {method} loginCallback 用户已登陆的回调方法
		 */
		loginCallback : null,
		/**
		 * @cfg {method} unloginCallback 用户未登陆时的回调方法
		 */
		unloginCallback : null,
		/**
		 * @cfg {method} logoutCallback 用户注销时的回调方法
		 */
		logoutCallback : null,
		
		sData:null,  //透传的参数
		
	
		
		
		//业务的配置参数
		appConfig:{
			"QQBrowserAppId":"106",  //在QQ浏览器端申请的APPID，
			"WxAppId":"",  //需要在微信申请openLink权限，
			"AppName":"",  //业务的中文名称
			"LogoUrl":"",   //业务在授权时需要显示的正方形标准Logo，
			"scope":"snsapi_base",   //默认是 snsapi_base 静默授权，如果游戏无静默权限，就需要手动改成snsapi_userinfo
			"avoidConflict":""//是否检查串号逻辑，默认值为空
		}, 
		
		
		logo : ''
	};
	
	function getUrl(){
		return window.location.href;
	}
	
	function getAppId(gameId){		
		return (isUndefined(APPID[gameId])) ? APPID['default'] : APPID[gameId];
	}
	
	function getGameId(s_url){
		var url = s_url || window.location.host,
			gameId = url.replace(/(\w+?)\.qq\.com/ig,"$1");
		return (gameId == url) ? "" : gameId;
	}
	
	function getLogo(gameId){
		return (isUndefined(LOGO[gameId])) ? LOGO['default'] : LOGO[gameId];
	}
	
	function objectJoin(obj,sep){
		var arr = new Array();
		for(var key in obj){
			arr.push(key+"="+obj[key])				
		}	
		return arr.join(sep);
	}



	
	/**
	* modify by dickma 2015.03.26
	* opt.sData 响应用户输入的登录定制信息，并透传给ptlogin
	* pt文档：http://platform.server.com/ptlogin/param.html
	* pt_no_onekey=1 去掉一键登录
	*/
	function login(opt){
		
		extend(option,opt);
		
		//有acctype： wx/qq  说明是手机登陆，不会跳转到登录页
		/* Modify by dickma 2015.9.14 当在游戏里直接传值登陆态的时候，不允许登陆态切换*/
        if (milo.request("acctype") && milo.request("openid") && milo.request("access_token")  ){
            return;
        }
		
		var s_data =  opt == undefined ? "" : (opt.sData == undefined ? "" : encodeURIComponent(objectJoin(opt.sData,"&")));
			
		var param = {
			//s_url : encodeURIComponent(jumpUrl),
			sData : s_data
		};
		
		//add by dickma 2015.09.14
		//如果在微信里直接跳转了微信授权后，页面没跳转到redirect_uri, 再注销后点击QQ登陆，要回到原始的页面
		if (document.location.host=="open.weixin.qq.com"){
			var originalUrl=decodeURIComponent(milo.request("redirect_uri"));
			
			param.s_url=originalUrl.split("?")[0]+"?logtype=qq";
			if (originalUrl.indexOf("mconsole")>-1){
				param.s_url=param.s_url+"&mconsole=1";
			}
			
		}else{
			var jumpUrl=getUrl();
			param.s_url=encodeURIComponent(jumpUrl);
		}
		if(g(option.loginBtn)){
			g(option.loginBtn).href = location.protocol+"//"+window.location.host+"/comm-htdocs/milo_mobile/login.html?"+objectJoin(param,"&");
			g(option.loginBtn).click();
		}
	}
	
	
	
	function logout(opt){
		extend(option,opt);
		
		//删除Cookie
		milo.cookie.clear('p_skey', 'qq.com', '/');
		milo.cookie.clear('p_uin', 'qq.com', '/');
		milo.cookie.clear('uin', 'qq.com', '/');
		milo.cookie.clear('skey', 'qq.com', '/');
		//window.sessionStorage.setItem("IED_LOG_INFO2",window.JSON.stringify({}))
		
		milo.cookie.clear("IED_LOG_INFO2");
		milo.cookie.clear('IED_LOG_INFO2', 'qq.com', '/');
		
		milo.cookie.clear("openid", 'qq.com', '/');
		milo.cookie.clear("access_token", 'qq.com', '/');
		milo.cookie.clear("acctype", 'qq.com', '/');
		milo.cookie.clear("appid", 'qq.com', '/');
		milo.cookie.clear("lg_source",'qq.com', '/');
		milo.cookie.clear("wxnickname",'qq.com', '/');
		
		milo.cookie.clear("openid");
		milo.cookie.clear("access_token");
		milo.cookie.clear("acctype");
		milo.cookie.clear("appid");
		
		//保证登录回调只执行一次
		var logoutCallbackLock=2;
		
		//登录层隐藏显示控制
		if(g(option.loginedDiv)){
			g(option.loginedDiv).style.display="none";
		}
		
		if(g(option.unloginDiv)){
			g(option.unloginDiv).style.display="";
		}
		
		
		// 清除apps.game.qq.com下的cookie
		window["logoutWxCallback"] = function(){
			logoutCallbackLock--;//锁住,减少一次只有当两个域名下的cookie都清玩了才执行，防止logout执行2次
			if (isFunction(option.logoutCallback) && 0==logoutCallbackLock){
				option.logoutCallback();
			}
		}
		
		// dickma：再用iframe再清除了cookie一次 
		// iframe清除： p_skey  p_uin uin seky IED_LOG_INFO2 openid access_token acctype appid  
		//  seky 有错，需要修改
		
		var oWxIFrame = document.createElement("iframe");
		oWxIFrame.id = "loginWxIframe";
		oWxIFrame.name = "loginWxIframe";
		oWxIFrame.scrolling="no";
		oWxIFrame.frameBorder ="0";
		oWxIFrame.style.display ="none";
		document.body.appendChild(oWxIFrame);
        oWxIFrame.src=location.protocol+"//apps.game.qq.com/ams/logout_wx.html";
		
		
		// 登出qq并且清除game.qq.com下的cookie  和上面的apps.game.qq.com域名下执行回调一致
		window["logoutCallback"] = window["logoutWxCallback"];
		
		// dickma：又用iframe再清除了cookie一次 只清除了 p_uin  p_skey  pt4_token  domain=game.qq.com; path=/;
		var oIFrame = document.createElement("iframe");
		oIFrame.id = "loginIframe";
		oIFrame.name = "loginIframe";
		oIFrame.scrolling="no";
		oIFrame.frameBorder ="0";
		oIFrame.style.display ="none";
		document.body.appendChild(oIFrame);
        oIFrame.src= location.protocol+"//game.qq.com/act/logout.html?t=1";
    }
	
	
	
	
	var LoginManager = {
		getAppId : function(gameId){
			return getAppId(gameId);
		},
		/**
		 * 获取用户Q号
		 * @public 
		 * @return {string} q号，如不存在则为空
		 */
		getUin : function(){
		//var t =  window.sessionStorage.getItem("IED_LOG_INFO2"),
			var t =  milo.cookie.get("IED_LOG_INFO2"),
				IED_LOG_INFO2 = (t==null) ? null : milo.unSerialize(t);
			if(IED_LOG_INFO2 == null){
				return '';
			}
			uin = IED_LOG_INFO2.userUin;
			return (!isNaN(uin)) ? uin : milo.cookie.get("uin");
		},

		getUserUin: function(){
			return this.getUin();
		},
		
        getNickName: function(){
            //var t =  window.sessionStorage.getItem("IED_LOG_INFO2"),
			var t =  milo.cookie.get("IED_LOG_INFO2"),
                IED_LOG_INFO2 = (t==null) ? null : milo.unSerialize(t);
            if(IED_LOG_INFO2 == null){
                return '';
            }
			
			
			
            return decodeURIComponent(IED_LOG_INFO2.nickName);
        },

		/**
		 * 判断用户是否登陆
		 * @public 
		 * @return {bool} 是/否
		 */
		isLogin : function(){

			var openid = milo.request("openid") ? milo.request("openid") : milo.cookie.get("openid"),
				openkey = milo.request("openkey");

			// appid获取方式及名字兼容
			if(!appid && milo.request("appid")){
				var appid =  milo.request("appid");
			}
			if(!appid && milo.cookie.get("appid")){
				var appid =  milo.cookie.get("appid");
			}

			// 判断MSDK带登录态
			if(milo.request('msdkEncodeParam')){
				return true;
			}

			// access_token获取方式及名字兼容 
			if(milo.request("access_token")){
				var access_token =  milo.request("access_token");
			}

			// openkey
			if(milo.request("openkey")){		
	            var access_token = milo.request("openkey");		
	        }
			
			// access_token 不存在
			if(!access_token && milo.request("token")){
				var access_token =  milo.request("token");
			}

			if(!access_token && milo.cookie.get("access_token")){
				var access_token =  milo.cookie.get("access_token");
			}
			if(!access_token && milo.cookie.get("token")){
				var access_token =  milo.cookie.get("token");
			}
			

			// acctype获取方式及名字兼容 
			if(!acctype && milo.request("acctype")){
				var acctype =  milo.request("acctype");
			}
			if(!acctype && milo.cookie.get("acctype")){
				var acctype =  milo.cookie.get("acctype");
			}
			if(!!acctype && acctype == 'weixin'){
				acctype = 'wx';
			}
			
			if(openid && access_token){
				//如果不是QQ浏览器,则把URL传来的值写入Cookie IED_LOG_INFO2（一般是APP直接登陆的情况）
				if (!LoginManager.isQQBrowser()){
					
					milo.cookie.set("IED_LOG_INFO2",milo.serialize({'openid' : openid, 'loginType' : acctype}),3600,"qq.com","/");								
				}
				
				if (acctype=="wx"){
					LoginManager.getWxNickName({"openid":openid,"access_token":access_token},function(wxnickname){

					});
				}
				
				if(acctype){
					milo.cookie.set("acctype",acctype,600,"qq.com","/");
				}
				
				milo.cookie.set("openid",openid,600,"qq.com","/");
				
				milo.cookie.set("access_token", access_token, 600, "qq.com","/");
				
				milo.cookie.set("appid",appid,600,"qq.com","/");
			}
			
			//var t =  window.sessionStorage.getItem("IED_LOG_INFO2"),
			var t =  milo.cookie.get("IED_LOG_INFO2"),
                IED_LOG_INFO2 = (t==null) ? null : milo.unSerialize(t);
			
            if(IED_LOG_INFO2 == null){
                return false;
            }
            var uin = IED_LOG_INFO2.userUin,
				intervalTime = this.getAcctype() ? 480 : 3000,
                expire = (Math.floor(((new Date().getTime())/1000)) - IED_LOG_INFO2.userLoginTime) > intervalTime ? true : false;

            if (!isNaN(uin) && uin != "" && !expire){
                return true;
            }
			
			// 判断游戏内带登录态
			if(openid && access_token && !expire){				
				return true;
			}
			
            return false;
        },

        getAcctype: function(){
            var acctype = milo.request("acctype");
            if(acctype == "weixin"){
                acctype = "wx";
            }
            return acctype;
        },
		
		getCurrLoginType:function(){
			if (milo.cookie.get("access_token") && milo.cookie.get("p_skey") ){
				return "error";
			}else if (milo.cookie.get("access_token") && !milo.cookie.get("p_skey") ){
				return "openid";
			}else if (!milo.cookie.get("access_token") && milo.cookie.get("p_skey") ){
				return "pt";
			}else if (!milo.cookie.get("access_token") && !milo.cookie.get("p_skey") ){
				return "none";
			}
		
		},
		getUserFace : function(b){
			if ("function" == typeof b) {
				var a = {
					isLogin: !1,
					userFace: location.protocol+"//imgcache.qq.com/ptlogin/v4/style/0/images/1.gif"
				};
				var self = this;
				self.checkLogin(function(){
					a.isLogin = !0;
					var d = getGameId(),
						d = getAppId(d),
						c = self.getUserUin();
					window.pt = {};
					pt.setHeader = function(d) {
						d[c] && (a.userFace = d[c]);
						b(a)
					};
					var getUrl = "http://ptlogin2.qq.com/getface?appid=" + d + "&imgtype=3&encrytype=0&devtype=0&keytpye=0&uin=" + c;
					if(location.protocol == "https:"){
						getUrl = "https://ssl.ptlogin2.qq.com/getface?appid=" + d + "&imgtype=3&encrytype=0&devtype=0&keytpye=0&uin=" + c;
					}
					loadScript(getUrl, function(){
						b(a);
					});
				}, function(){
					b(a)
				});
			}
		},
		/*
		codeToOpenId加锁机制
		1.因为checkLogin异步，防止一个code用多次
		*/
		codeToOpenIdCache:{},
		codeToOpenIdLock:function(opts,callback){
			var self=this;
			var id=[opts.appid,opts.wxcode,opts.sServiceType].join('-');
			if(!self.codeToOpenIdCache[id]){
				self.codeToOpenIdCache[id]={
					callbacks:[callback],
					data:null,//数据默认空
					state:0//0默认表示等待中，1表示成功，2表示失败
				}
				//发起请求
				var wxcodeToOpenidUrl = location.protocol+'//apps.game.qq.com/ams/ame/codeToOpenId.php?appid='+ opts.appid + '&wxcode='+ opts.wxcode + '&sServiceType=' + opts.sServiceType + '&wxcodedomain=' + window.location.host + '&acctype=wx';
				
				var xhr = new XMLHttpRequest();
		        xhr.onload = function(e) {
		        	try{
						eval('var objData = ' + xhr.responseText);
						if(objData.iRet === 0){
		            		eval('var openidInfo = ' + objData.sMsg);
		            		milo.cookie.set("wxcode",opts.wxcode,600,"qq.com","/");
		            		milo.cookie.set("openid",openidInfo.openid,600,"qq.com","/");
		            		milo.cookie.set("access_token",openidInfo.access_token,600,"qq.com","/");
		            		milo.cookie.set("acctype",openidInfo.acctype,600,"qq.com","/");
		            		self.codeToOpenIdCache[id].state=1;
		            		self.codeToOpenIdCache[id].data=openidInfo;
		            		for(var i=0;i<self.codeToOpenIdCache[id].callbacks.length;i++){
			            		var cb=self.codeToOpenIdCache[id].callbacks[i];
			            		"function"==typeof cb && cb();
			            	}
		            	}else{
		            		self.codeToOpenIdCache[id].state=2;
		            	}
						//add susahuang 2017/6/24 code to openid reportatm
						ATM.reportATM({
							toappid: 1,
							tomoduletype: 32,
							tointer: 2,
							toreturncode: objData.iRet === 0 ? 0 : 1,
							businesstype: getGameId(),
							result: objData.iRet,
							serialnum: objData.sLogSerialNum,
							cgi: location.href,
							errormsg: objData.sMsg
						});
						
		            }catch(e){
		            	alert("获取登录态失败，请重新点击微信公众号里的链接！谢谢!");
		            	return;
		            }
		        }
		        xhr.open("GET", wxcodeToOpenidUrl, true);
		        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		        xhr.withCredentials = true;
		        xhr.send();
			}else{
				var obj=self.codeToOpenIdCache[id];
				if(1==obj.state){
					var obj=self.codeToOpenIdCache[id];
					milo.cookie.set("wxcode",opts.wxcode,600,"qq.com","/");
	        		milo.cookie.set("openid",obj.data.openid,600,"qq.com","/");
	        		milo.cookie.set("access_token",obj.data.access_token,600,"qq.com","/");
	        		milo.cookie.set("acctype",obj.data.acctype,600,"qq.com","/");
					callback();
				}else if(0==obj.state){
					obj.callbacks.push(callback);
				}
			}

		},
		/**
		 *微信防串号逻辑 【只在微信登录态下才会有防串号逻辑】
		 *综合当前webview环境，当前用户传参，当前cookie中appid等多种情况进行判断
		 *如果判定串号则返回true,如果判定非串号则返回false
		*/
		isTrueLoginStatus:function(){
			var self=this;
			var avoidConflict=option.appConfig && option.appConfig.avoidConflict;

			/*白名单逻辑判断 ————Start*/
			/*当前白名单防止串号逻辑在灰度测试阶段，默认不校验，白名单需要校验。*/
			var isWhiteList=false;
			/*1.关荣使命--移动端*/
			if(/^(http|https)\:\/\/grsm.qq.com\/cp\/a20171024code\/m\/index.htm/.test(location.href)){
				isWhiteList=true;
			}
			/*2.cfm测试用*/
			if(/^(http|https)\:\/\/cfm\.qq\.com\/cp\/a20170925ktv\/index_2\.htm/.test(location.href)){
				isWhiteList=true;
			}
			/*3.全局变量判断是否白名单*/
			if(window.ams_login_avoid_conflict && true == window.ams_login_avoid_conflict){
				isWhiteList=true;
			}
			//不在白名单
			if(!isWhiteList){
				avoidConflict=false;
			}
			/*白名单逻辑判断 ----End*/
			if(""===avoidConflict){//用户没有传值
				avoidConflict=self.isWxApp();
			}
			if(!avoidConflict){//如果不需要检测串号
				return true;//没串号
			}
			//需要判断
			var appidUrl=milo.request("appid");
			var appidCookie=milo.cookie.get("appid");
			var access_tokenUrl=milo.request("access_token");
			var access_tokenCookie=milo.cookie.get("access_token");
			var openidUrl=milo.request("openid");
			var openidCookie=milo.cookie.get("openid");

			//url带登录态
			if(access_tokenUrl && openidUrl){
				if(appidUrl){
					//如果url上同时传了appid 则更新到全局和cookie
					option.appConfig.appid=appidUrl;
					milo.cookie.set("appid", appidUrl, 600, "qq.com","/");
				}
/*				milo.cookie.set("access_token", access_tokenUrl, 600, "qq.com","/");
				milo.cookie.set("openid", openidUrl, 600, "qq.com","/");*/
				return true;//没串号
			}

			//url不带登录态
			//如果有登录态
			if(access_tokenCookie && openidCookie){
				if(option.appConfig && option.appConfig.WxAppId){
					if(appidCookie != option.appConfig.WxAppId){
						return false;//和cookie中的appid不同则串号
					}
				}
			}else{
				//没有微信登录态，则不串号
				return true;
			}
			return true;//默认不串号
		},
        /**
		 * 检查用户是否登陆并执行对应对应回调
		 * 如在init过程中已设loginCallback&unloginCallback，则直接对应执行
		 * 也可以本方法中传入属性。
		 * @public
		 * @param {method}	logincallback  check成功的回调
		 * @param {method}	unlogincallback  check失败的回调
		 * @param {object}	opt  参数详见配置cfg
		 * @return {undefined} undefined
		 */
		checkLogin : function(logincallback, unlogincallback, opt){
			var self = this;
			
			extend(option, opt);
			/*//add susahuang 2017/7/31 增加appid校验 防止串号
			if(milo.cookie.get('appid') != null && milo.cookie.get('appid') != "" && (typeof opt == "object")){
				if(typeof opt.appConfig == "object"){
					if(opt.appConfig.WxAppId){
						if(milo.cookie.get('appid') != opt.appConfig.WxAppId){
							milo.cookie.clear("appid",'qq.com', '/');
							milo.cookie.clear("openid",'qq.com', '/');
							milo.cookie.clear("access_token",'qq.com', '/');
							milo.cookie.clear("IED_LOG_INFO2",'qq.com', '/');
						}
					}
				}
			}*/
			//判断微信串号逻辑
			if(!self.isTrueLoginStatus()){
				//串号了，则注销登录态返回未登录,执行未登录回调
				self.logout({
					logoutCallback:function(){
						if(isFunction(unlogincallback)){
							unlogincallback();
						}
					}
				});
				return;
			}
					
			var _checkLogin = function(){
			
				
				 
				if(self.isLogin()){
					
					//如果是QQ浏览器微信授权登陆的时候，就显示微信的nickname
				
					
					//如果页面有登陆条，就显示用户登陆名称
					if (g(option.userinfoSpan)){
						if(self.getUin()=="" && LoginManager.isQQBrowser() ){
							g(option.userinfoSpan).innerHTML = self.getNickName();
						}
						
						
						if( (self.getUin()==""  || self.getUin()==null )    && milo.cookie.get("acctype")=="wx"  ){
							
							LoginManager.getWxNickName({"openid":milo.cookie.get("openid"),"access_token":milo.cookie.get("access_token") },function(wxnickname){
								LoginManager.initLoginbar();
							});
							
							
						}
					}
					
				
			
				  
					 if (isFunction(logincallback)){
						 // 判断如果是MSDK就直接执行回调函数
						 if (milo.request('msdkEncodeParam') || milo.request('wxcode')){							 
							 logincallback(milo.cookie.get("IED_LOG_INFO2") ? milo.unSerialize(milo.cookie.get("IED_LOG_INFO2")) : {});
						 }else{
							//milo.unSerialize(milo.cookie.get("IED_LOG_INFO2"));
							logincallback(milo.unSerialize(milo.cookie.get("IED_LOG_INFO2")));
						 }
					 }
					 
					
				}else{
					
					var callbackName = 'jsonp' + Math.floor(Math.random() * 100);
					
					
					// 如果是移动端跳转但参数不全，提示参数不全
					if (self.getAcctype()){
						
						if (self.getAcctype()=="wx" || self.getAcctype()=="qq"){
						
							if (!milo.request("openid") || (!milo.request("access_token") && !milo.request("openkey"))){
						
								//如果不是微信授权进入的
								if (!milo.request('wxcode') &&  !milo.request('code') ){
									//alert("非法的登录参数！");
									milo.cookie.clear("acctype",'qq.com', '/');
									milo.cookie.clear("openid",'qq.com', '/');
									milo.cookie.clear("access_token",'qq.com', '/');
									if (unlogincallback){
										unlogincallback();
									}
									return;
								}
							}
						}
					}
					
					if(milo.request("openkey") == '' && milo.request("access_token")){
						var openkey = milo.request("access_token");
					}else{
						var openkey = milo.request("openkey");
					}
					
					if(milo.request("acctype") == 'weixin'){
						var acctype = 'wx';
					}else{
						var acctype = milo.request("acctype");
					}
					
					if(milo.request("openid")){
						milo.cookie.set("openid",milo.request("openid"),600,"qq.com","/");
					}
					
					if(milo.request("appid")){
						milo.cookie.set("appid",milo.request("appid"),600,"qq.com","/");
					}
					
					if(openkey){
						milo.cookie.set("access_token",openkey,600,"qq.com","/");
					}
					
					if(acctype){
						milo.cookie.set("acctype",acctype,600,"qq.com","/");
					}
						
					window[callbackName] = function(IED_LOG_INFO2){
						//add susahuang 2017/6/24 get reportatm inter number
						var __tointer = 1;
						if(loginUrl.indexOf('//commwebgame.game.qq.com/comm-cgi-bin/login/LoginReturnInfo.cgi') > -1){
							__tointer = 2;
						}else if(loginUrl.indexOf('//mapps.game.qq.com/lian/login/MobileLoginReturnInfo.php') > -1){
							__tointer = 3;
						}
						if(IED_LOG_INFO2.errorCode != 0 && IED_LOG_INFO2.errorCode != -1){
							//add susahuang 2017/6/24 check login
							ATM.reportATM({
								toappid: 1,
								tomoduletype: 100,
								tointer: __tointer,
								toreturncode: 1,
								businesstype: getGameId(),
								result: IED_LOG_INFO2.errorCode,
								cgi: location.href,
								errormsg: IED_LOG_INFO2.errorStr
							});
							return;
						}
												
						if(IED_LOG_INFO2.isLogin){
							
							var loginInfo = {},
								openkey = milo.request("openkey"),
								access_token = milo.request("access_token") ? milo.request("access_token") : openkey,
								acctype = milo.request("acctype") == 'weixin' ? 'wx' : milo.request("acctype");
											
							loginInfo.userUin = IED_LOG_INFO2.userUin;
							loginInfo.nickName = IED_LOG_INFO2.nickName;
							loginInfo.userLoginTime = IED_LOG_INFO2.userLoginTime;						
							loginInfo.openid = IED_LOG_INFO2.openid;
							loginInfo.loginType =  IED_LOG_INFO2.loginType;
							//window.sessionStorage.setItem("IED_LOG_INFO2",window.JSON.stringify(loginInfo));
							
							
							milo.cookie.set("IED_LOG_INFO2",milo.serialize(loginInfo),3600,"qq.com","/");

							if (IED_LOG_INFO2.loginType == 'wx' || IED_LOG_INFO2.loginType == 'qq' ){
							
								milo.cookie.set("acctype",IED_LOG_INFO2.loginType,600,"qq.com","/");
								milo.cookie.set("openid",IED_LOG_INFO2.openid,600,"qq.com","/");
								milo.cookie.set("access_token", access_token, 600, "qq.com","/");
								milo.cookie.set("appid",milo.request("appid"),600,"qq.com","/");
								
								//LoginManager.initLoginbar();
								
								if (IED_LOG_INFO2.loginType == 'wx'){
									LoginManager.getWxNickName({"openid":IED_LOG_INFO2.openid,"access_token":access_token},function(wxnickname){
										 LoginManager.initLoginbar();
									});
									
								}else{
									 LoginManager.initLoginbar();
								}
							}else{
								 LoginManager.initLoginbar();
								
							}

							if(typeof(logincallback) == 'function'){
								logincallback(IED_LOG_INFO2);
							}
						}else{
							
							
							milo.cookie.clear('IED_LOG_INFO2', 'qq.com', '/');
							milo.cookie.clear("acctype",'qq.com', '/');
							milo.cookie.clear("openid",'qq.com', '/');
							milo.cookie.clear("access_token",'qq.com', '/');
							
							if(typeof(unlogincallback) == 'function'){
								unlogincallback(IED_LOG_INFO2);
							}
						}

						//add susahuang 2017/6/24 check login
						var checkurl = location.href.indexOf('/comm-htdocs/milo_mobile/login.html');
						var loginReportUrl =  checkurl > -1 ? decodeURIComponent(milo.request("s_url")) : location.href;

						ATM.reportATM({
							toappid: 1,
							tomoduletype: 100,
							tointer: __tointer,
							toreturncode: IED_LOG_INFO2.errorCode == 0 ? 0 : 1,
							businesstype: getGameId(),
							result: IED_LOG_INFO2.errorCode,
							cgi: loginReportUrl,
							errormsg: IED_LOG_INFO2.errorStr
						});
						
					};
					
					

					var loginUrl = location.protocol+'//login.game.qq.com/comm-cgi-bin/login/LoginReturnInfo.cgi?callback=' + callbackName;
					
					//即通给的正则表达式
					var sUserAgent = navigator.userAgent; 
					var REGEXP_IOS_QQ = new RegExp("(iPad|iPhone|iPod).*? (IPad)?QQ\\/([\\d\\.]+)");
					var REGEXP_ANDROID_QQ =  new RegExp("\\bV1_AND_SQI?_([\\d\\.]+)(.*? QQ\\/([\\d\\.]+))?","ig");
					//判断是否是IOSQQ 或者 AndroidQQ打开
					var isIphoneOs_QQ = REGEXP_IOS_QQ.test(sUserAgent) ;
					var isAndroid_QQ = REGEXP_ANDROID_QQ.test(sUserAgent);  
					
					// 如果有带有渠道类型走mobile校验的cgi，sid是手q渠道带来的参数
					// MobileLoginReturnInfo.cgi samsonsheng维护  http://apps.game.qq.com/cgi-bin/lian/login/MobileLoginReturnInfo.cgi
					// add by dickma:samsonsheng 2014.8.2 更换接口为：  http://mapps.game.qq.com/lian/login/MobileLoginReturnInfo.php
					
										
					if (self.getAcctype() || isIphoneOs_QQ || isAndroid_QQ ){
						loginUrl = location.protocol+"//mapps.game.qq.com/lian/login/MobileLoginReturnInfo.php?callback=" + callbackName;
						var acctype = milo.request("acctype");
						if(acctype == "weixin"){
							acctype = "wx";
						}
						loginUrl = loginUrl  + "&acctype=" + acctype + "&openid=" + milo.request("openid") + "&access_token=" + ((acctype == 'wx') ? milo.request("access_token") : openkey) + "&appid=" +  milo.request("appid");
					}
					
				    
					
					
					//如果没有传acctype，并且是手Q
					if (!milo.request("acctype") && (isIphoneOs_QQ || isAndroid_QQ)  ){	
						//qqapi_url是兼容Define的方式，所以必须用need加载
						var qqapi_url =location.protocol+"//pub.idqqimg.com/qqmobile/qqapi.js";
						
						need(qqapi_url,function(loaded){
							//add susahuang 解决新业务没有setPskeyDomain权限问题
							var urls="|tt2.qq.com|mxd2.qq.com|xx.qq.com|ztj.qq.com|hlddz.qq.com|eafifa.qq.com|wt.qq.com|xxsy.qq.com|lpl.qq.com";
							if(1){
								loadScript(loginUrl, function(loaded2){ });
							}else{
								if (mqq){
									if ( mqq.compare('5.4')>=0 ){
										mqq.invoke('data', 'setPskeyByDomain', {
											domain: 'game.qq.com',
											callback: mqq.callback(function(ret){
												//alert(JSON.stringify(ret));
												loadScript(loginUrl, function(loaded2){
												});
											})
										});
									}else{
										loadScript(loginUrl, function(loaded2){ });
									}

								}else{
									loadScript(loginUrl, function(loaded2){ });
								}
							}
						
						});
						
						
						
					}else{
						//如果是openID授权，直接获取登录状态
					    //测试
				    
						 
						loadScript(loginUrl, function(loaded){
							
						});
					
					}
					
				
					
				}
			};

		


		//=================
		// 判断微信带登录态
			
			if(milo.request('wxcode')){
				var wxcode = milo.request('wxcode');
			}else if(milo.request('code') && milo.request('state') && (milo.request("h5sdkqqconnect") == "" || milo.request("h5sdkqqconnect") == null)){
				var wxcode = milo.request('code');
			}
			
			//判断当前code和已对换的code是否是同一个
		
			
			if(wxcode && !isUndefined(wxcode) && (milo.cookie.get('wxcode') != wxcode)){
			    
				// appid获取方式及名字兼容
				
				if(!appid && milo.request("appid")){
					var appid =  milo.request("appid");
				}
				if(!appid && milo.cookie.get("appid")){
					var appid =  milo.cookie.get("appid");
				}
				
				// sServiceType获取方式及名字兼容
				
				if(!sServiceType && milo.request("sServiceType")){
					var sServiceType =  milo.request("sServiceType");
				}
				if(!sServiceType && milo.cookie.get("sServiceType")){
					var sServiceType =  milo.cookie.get("sServiceType");
				}
			
				self.codeToOpenIdLock({
					wxcode:wxcode || "",
					appid:appid || "",
					sServiceType:sServiceType
				},function(){
					_checkLogin();
				})
			}else{
				_checkLogin();
			}
		},
		
		
		
		
		
		//判断是否是QQ浏览器
		isQQBrowser:function(){		

			//add by dickma 2015.08.28 
			// 太坑爹了！！！ 在小米3等Android手机里，微信的浏览器里，会显示 MicroMessenger + MQQBrowser，所要先排除微信
			 // Modify by dickma 2015.12.03 QQ改版，手Q的内置浏览器，也改成了 MQQBrowser 的内核，需要先排除
			 
			 if (LoginManager.isWxApp() || LoginManager.isQQApp() || LoginManager.isTBS() ){   
				return false;
			 }else{
				return /MQQBrowser/ig.test(navigator.userAgent);
			 }
			
		},
		
		
		//判断是否是QQ浏览器内核的TBS
		isTBS:function(){
			return /TBS/ig.test(navigator.userAgent);
		
		},
		
		//判断是否是微信浏览器
		isWxApp:function(){
			return /MicroMessenger/ig.test(navigator.userAgent);
		
		},
		
		//判断是否是微信浏览器
		isQQApp:function(){
			var sUserAgent = navigator.userAgent; 
					var REGEXP_IOS_QQ = new RegExp("(iPad|iPhone|iPod).*? (IPad)?QQ\\/([\\d\\.]+)");
					var REGEXP_ANDROID_QQ =  new RegExp("\\bV1_AND_SQI?_([\\d\\.]+)(.*? QQ\\/([\\d\\.]+))?","ig");
					//判断是否是IOSQQ 或者 AndroidQQ打开
					var isIphoneOs_QQ = REGEXP_IOS_QQ.test(sUserAgent) ;
					var isAndroid_QQ = REGEXP_ANDROID_QQ.test(sUserAgent);  
					
			if (isIphoneOs_QQ ||isAndroid_QQ ){
				return true;
			}else{
				return false;
			}
		},
		
		
		//QQ浏览器登陆成功后的回调
		loginCallbackByQQBrowser:function(data){
			
			if (data.type==1){ //QQ授权登陆
				
				
			}else if (data.type==2){ //微信授权登陆		
				milo.cookie.set("openid",data.uin,600,"qq.com","/");
				milo.cookie.set("access_token",data.token,600,"qq.com","/");
				milo.cookie.set("acctype","wx",600,"qq.com","/");
				
				$("#userinfo").html(data.nickname);
				$("#unlogin").hide();
				$("#logined").show();
				
				
				LoginManager.doGetLogInfo2({
					"acctype":"wx",
					"openid":data.uin,
					"access_token":data.token,
					"appid":option.appConfig.WxAppId,
					"nickname":data.nickname
				});
				
				
				
			}
			
		},
		
		//QQ浏览器登陆成功后的回调
		loginCallbackByWxBrowser:function(data){
			
			
		},
		
		
		doGetLogInfo2:function(opt){
					
			var callbackName = 'jsonp' + Math.floor(Math.random() * 100);
			
			var loginUrl = location.protocol+"//mapps.game.qq.com/lian/login/MobileLoginReturnInfo.php?callback=" + callbackName;				
			loginUrl = loginUrl  + "&acctype=" + opt.acctype + "&openid=" + opt.openid + "&access_token=" +opt.access_token + "&appid=" + opt.appid;
			
			
			var access_token=opt.access_token;
			var appid=opt.appid;
			var  nickname=opt.nickname;
			window[callbackName] = function(IED_LOG_INFO2){
				
				
				if(IED_LOG_INFO2.isLogin){
							var loginInfo = {};
							loginInfo.userUin = IED_LOG_INFO2.userUin;
							//loginInfo.nickName = IED_LOG_INFO2.nickName;
							loginInfo.nickName = nickname;
							loginInfo.userLoginTime = IED_LOG_INFO2.userLoginTime;						
							loginInfo.openid = IED_LOG_INFO2.openid;
							loginInfo.loginType =  IED_LOG_INFO2.loginType;
							//window.sessionStorage.setItem("IED_LOG_INFO2",window.JSON.stringify(loginInfo));
							
							
							
							milo.cookie.set("IED_LOG_INFO2",milo.serialize(loginInfo),3600,"qq.com","/");
							
							if (IED_LOG_INFO2.loginType == 'wx' || IED_LOG_INFO2.loginType == 'qq' ){
							
								milo.cookie.set("acctype",IED_LOG_INFO2.loginType,600,"qq.com","/");
								milo.cookie.set("openid",IED_LOG_INFO2.openid,600,"qq.com","/");
								milo.cookie.set("access_token",access_token, 600, "qq.com","/");
								milo.cookie.set("appid",appid,600,"qq.com","/");
								
								milo.cookie.set("lg_source","wx_qqbrowser",600,"qq.com","/");
								
								if (IED_LOG_INFO2.loginType == 'wx'){
									LoginManager.getWxNickName({"openid":IED_LOG_INFO2.openid,"access_token":access_token},function(wxnickname){
										LoginManager.initLoginbar();
									});
								}else{
									LoginManager.initLoginbar();
								}
							}else{
								LoginManager.initLoginbar();
							}

							if(typeof(logincallback) == 'function'){
								logincallback(IED_LOG_INFO2);
							}
						}else{
							//window.sessionStorage.setItem("IED_LOG_INFO2",window.JSON.stringify({}));
							milo.cookie.clear('IED_LOG_INFO2', 'qq.com', '/');
							milo.cookie.clear("acctype",'qq.com', '/');
							milo.cookie.clear("openid",'qq.com', '/');
							milo.cookie.clear("access_token",'qq.com', '/');
							
							milo.cookie.clear("lg_source",'qq.com', '/');
							milo.cookie.clear("wxnickname",'qq.com', '/');
							
							if(typeof(unlogincallback) == 'function'){
								unlogincallback(IED_LOG_INFO2);
							}
						}

				//add susahuang 2017/6/24 check login
				ATM.reportATM({
					toappid: 1,
					tomoduletype: 100,
					tointer: 3,
					toreturncode: IED_LOG_INFO2.errorCode == 0 ? 0 : 1,
					businesstype: getGameId(),
					result: IED_LOG_INFO2.errorCode,
					cgi: location.href,
					errormsg: IED_LOG_INFO2.errorStr
				});
						
				
			}
			loadScript(loginUrl, function(loaded){ });
			
			
			
				
		},

		

		

		/**
		 * 初始化登陆器
		 * 在此过程中为页面dom中的关于登陆的各元素添加方法，处理显示
		 * @public
		 * @param {object}	opt  参数详见配置cfg
		 * @return {undefined} undefined
		 */
		init : function(opt){
			extend(option, opt);
			
			//如果在微信浏览器里，而且logtype=wx，并且没有code，就跳转到微信授权后再跳转回来。
			
			if(LoginManager.isWxApp() && milo.request("logtype")=="wx" &&  milo.request('code')=="") {
				var  href=document.location.href;
				href=href+  ( /\?/.test(href) ? '&' : '?' ) + 'acctype=wx&appid='+option.appConfig.WxAppId;
				window.location.href= location.protocol+'//open.weixin.qq.com/connect/oauth2/authorize?appid='+option.appConfig.WxAppId+'&redirect_uri='+encodeURIComponent(href)+'&response_type=code&scope='+option.appConfig.scope+'&state=STATE#wechat_redirect';
				
			}
					
			
			
			if (g(option.loginBtn)){
				
				//点击QQ登陆，做QQ授权跳转
				milo.addEvent(g(option.loginBtn),"click",function(){					
					login();
				});
				//如果是QQ浏览器
				need(["util.zepto"],function($){
					//如果是QQ浏览器,直接用
					
					if (LoginManager.isQQBrowser()){
						
						$("#"+option.wxloginBtn).click(function(){
							
							browser.login.authorize(function(data){
								LoginManager.loginCallbackByQQBrowser(data);
							},function(data){
								
							}, {
							   "authorizeAppID":option.appConfig.QQBrowserAppId,
							   "authorizeAppName":option.appConfig.AppName,
							   "authorizeAppIconURL":option.appConfig.LogoUrl,
							   "authorizeType":4  //应用申明的授权类型。1：QQ手动输入授权，2：QQ快速授权，3：QQ授权（手动或者快速），4：微信快速授权，7：QQ或微信授权
							});
						
						});
					}else{
						//如果不是QQ浏览器的情况
						
						//点击微信登陆，拉起微信的OpenLink，进入微信的Webview
						if(g(option.wxloginBtn)){
							milo.addEvent(g(option.wxloginBtn),"click",function(){	
								//如果不是微信浏览器，使用openlink授权
								var returnUrl=document.location.href;
								returnUrl=returnUrl+( /\?/.test(returnUrl) ? '&' : '?' )+"logtype=wx";
								if (!milo.request("appid") && option.appConfig.WxAppId ){
									returnUrl=returnUrl+"&appid="+option.appConfig.WxAppId;
								}
								//noticeid=90106247  AMS专用的noticeid
								 var openlinkJumpUrl="https://apps.game.qq.com/ams/wxlogin_redirect.html?s_url="+Base64.encode(returnUrl)+"#wechat_redirect";
								 var myurl= location.protocol+"//game.weixin.qq.com/cgi-bin/comm/openlink?noticeid=90106247&appid=wxc79049cb5a57fefb&url="+encodeURIComponent(openlinkJumpUrl);
								
								//如果在微信浏览器里，使用微信的oauth授权	
								 if (LoginManager.isWxApp()){
									var  href=document.location.href;
									href=href+  ( /\?/.test(href) ? '&' : '?' ) + 'acctype=wx&appid='+option.appConfig.WxAppId;
									myurl= location.protocol+'//open.weixin.qq.com/connect/oauth2/authorize?appid='+option.appConfig.WxAppId+'&redirect_uri='+encodeURIComponent(href)+'&response_type=code&scope='+option.appConfig.scope+'&state=STATE#wechat_redirect';
								}
								g(option.wxloginBtn).href = myurl;
								g(option.wxloginBtn).click();	
							});	
							
							
						}
						
						
					}
				});
			
			
				g(option.loginBtn).style.cursor="pointer";
				//判断是否存在logoutBtn，并绑定事件
				if(g(option.logoutBtn)){
					milo.addEvent(g(option.logoutBtn),"click",function(){
						logout();
					});
				}
				
				this.initLoginbar();
			}
			
		},
		
		initLoginbar:function(){
			if (g(option.loginedDiv)){
				 g(option.logoutBtn) && (g(option.logoutBtn).style.cursor="pointer");
				
				if (this.isLogin()){
					g(option.loginedDiv) && (g(option.loginedDiv).style.display="");
					g(option.unloginDiv) && (g(option.unloginDiv).style.display="none");
					g(option.userinfoSpan) && (g(option.userinfoSpan).innerHTML = this.getUin());
					
					//如果是QQ浏览器微信授权登陆的时候，就显示微信的nickname
					if( (this.getUin()=="" || this.getUin()==null ) && (LoginManager.isQQBrowser()|| milo.cookie.get("acctype")=="wx")  ) {
						g(option.userinfoSpan) && (g(option.userinfoSpan).innerHTML = LoginManager.getNickName());
						
						if (milo.cookie.get("wxnickname") && milo.cookie.get("wxnickname")!=""){
							g(option.userinfoSpan) && (g(option.userinfoSpan).innerHTML = milo.cookie.get("wxnickname"));
						}
					}
					
					/*
					if (isFunction(option.loginCallback)){
						option.loginCallback();
					}
					*/
					
				}
				else{
					g(option.loginedDiv) && (g(option.loginedDiv).style.display="none");
					g(option.unloginDiv) && (g(option.unloginDiv).style.display="");
					
					/*
					if (isFunction(option.unloginCallback)){
						option.unloginCallback();
					}*/
					
				}
			}
			
			
			
			
			
			
		},
		
		getWxNickName:function(opt,callback){
		    var defopt={openid:null,access_token:null};
			extend(defopt,opt);
			
			if (milo.cookie.get("wxnickname")!="" && milo.cookie.get("wxnickname")!=null){
				
				callback(milo.cookie.get("wxnickname"));
			}else{
				if (milo.cookie.get("openid") && milo.cookie.get("access_token")){
					this.getUserInfoByWxOpenId({
						"openid":defopt.openid ? defopt.openid : milo.cookie.get("openid"),
						"access_token":defopt.openid ? defopt.access_token : milo.cookie.get("access_token")
					},function(wxuser){
						
						milo.cookie.set("wxnickname",wxuser.nickname, 600, "qq.com","/");
						callback(wxuser.nickname);
					})
					
				}
			}
			
		},
		
		//根据微信的OpenId获取用户信息，昵称，头像等
		getUserInfoByWxOpenId:function(opt,callback){
			//var wxuserapi_url="https://api.weixin.qq.com/sns/userinfo?access_token="+opt.access_token+"&openid="+opt.openid;
			var self=this;
			
			
			//apps的微信代理接口
			var wxuserapi_url= location.protocol+"//apps.game.qq.com/ams/ame/getWXUser.php?access_token="+opt.access_token+"&openid="+opt.openid;	
			var emojicss= location.protocol+"//ossweb-img.qq.com/images/js/milo/biz/widget/emoji/emoji.css";
			
			//缓存中有用户信息数据
			if(opt.openid && opt.access_token && self.getWxUserInfo(opt.openid,opt.access_token)){
				callback && callback(self.getWxUserInfo(opt.openid,opt.access_token));
				return;
			}
			need(["util.zepto"],function($){
				$.ajax({
					"url":wxuserapi_url,
					"dataType":"jsonp",
					"success":function(wxUserData){					
						if (wxUserData.iRet===0){
							var  userinfo= wxUserData.data;
							self.storeWxUserInfo(opt.openid,opt.access_token,userinfo);
							if ($("head").find("link[href='"+emojicss+"']").length==0){
								loadCSS(emojicss,function(){
									if (callback){
										callback(userinfo);
									}
								});
							}else{
								if (callback){
										callback(userinfo);
								}
							}

							//add susahuang 2017/6/24 获取微信用户基本信息 reportatm
							ATM.reportATM({
								toappid: 1,
								tomoduletype: 32,
								tointer: 3,
								toreturncode: 0,
								businesstype: getGameId(),
								result: wxUserData.iRet,
								serialnum: wxUserData.sLogSerialNum || "",
								cgi: location.href,
								errormsg: wxUserData.sMsg
							});
								
						}else{
							//add susahuang 2017/6/24 获取微信用户基本信息 reportatm
							ATM.reportATM({
								toappid: 1,
								tomoduletype: 32,
								tointer: 3,
								toreturncode: 1,
								businesstype: getGameId(),
								result: wxUserData.iRet,
								serialnum: wxUserData.sLogSerialNum || "",
								cgi: location.href,
								errormsg: wxUserData.sMsg
							});

							if (wxUserData.sErrMsg){
								if (wxUserData.sErrMsg.indexOf("48001")<0){
									// LoginManager.logout();
								}
							}
							//LoginManager.logout();
						}
					}
					
				});
			});
				
		},

		
		/**
		 * 显示ptlogin登陆框
		 * @private
		 * @return {undefined} undefined
		 */
		show : function(sdata){
			var s_url = decodeURIComponent(milo.request("s_url")),
				sUserAgent = navigator.userAgent.toLowerCase(),  
				isIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os",
				isAndroid = sUserAgent.match(/android/i) == "android";   
			
			if(s_url == "") {
				history.go(-1);
				return;
			}

			var s_data = decodeURIComponent(sdata);

			var loginParam = {
				daid : 8,
				appid : getAppId(getGameId()),
				s_url : encodeURIComponent(window.location.href),
				hln_css : location.protocol+"//ossweb-img.qq.com/images/js/milo_mobile/biz/login/"+getLogo(milo.request("logo"))+".png",
				style : isIphoneOs ? 8 : (isAndroid ? 9 : 8),
				low_login_enable : 1,
				pt_ttype : 1, //增加sid登录测试
				hln_u_tips: "\u8BF7\u8F93\u5165\u60A8\u7684QQ\u53F7\u7801"
			}

			//支持safari登陆
			if(1==milo.request('support_safari')){
				location.href= location.protocol+"//ui.ptlogin2.qq.com/cgi-bin/login?" + objectJoin(loginParam,"&") +'&'+ s_data;
				g("back").href = s_url;
			}else{
				g("loginFrame").src = location.protocol+"//ui.ptlogin2.qq.com/cgi-bin/login?" + objectJoin(loginParam,"&") +'&'+ s_data;
				g("back").href = s_url;
			}
			
			
		},
		/**
		 * 跳转登陆页显示登陆框 
		 * @public
		 * @param {object} opt 登陆参数
		 * @return {undefined} undefined
		 */
		login :function(opt){
			if(typeof(popLoginBox) == "function"){
				popLoginBox();
			}else{
				if((this.getAcctype() === "qq" || this.getAcctype() === "wx") && !this.isLogin()){
					alert("很抱歉您的登录态已过期，请重新登录游戏点击活动链接，谢谢您的关注！");
					return;
				}

				// 微信类型参与登录态过期被动调登录，有supportGame参数 不让调QQ登录，直接提示登录态过期
				if(milo.request("supportGame") || milo.cookie.get("supportGame")){
					alert("很抱歉您的登录态已过期，请重新登录游戏点击活动链接，谢谢您的关注！");
					return;
				}
				/*
				 if(this.isLogin()){
				 return;
				 }
				 */
				if(milo.cookie.get("IED_LOG_INFO2")){
					milo.cookie.clear("IED_LOG_INFO2");
					milo.cookie.clear('IED_LOG_INFO2', 'qq.com', '/');
				}

				extend(option,opt);

				//add by dickma 2015.03.27
				var jumpUrl= option.s_url ? option.s_url : getUrl();

				var s_data =opt == undefined ? "" : (opt.sData == undefined ? "" : encodeURIComponent(objectJoin(opt.sData,"&")));
				var param = {
					s_url :  encodeURIComponent(jumpUrl),
					sData : s_data,
					logo : option.logo
				};
				//支持safari登陆
				if(true==window["ams_login_safari_support"]){
					param.support_safari=1;
				}
				window.location = location.protocol+"//"+window.location.host+"/comm-htdocs/milo_mobile/login.html?"+objectJoin(param,"&");
			}
		},
		/**
		 * 跳转登陆页显示登陆框 
		 * @public
		 * @return {undefined} undefined
		 */
		logout :function(opt){
           logout(opt);
		},

        reloadLogin: function(callback, unLoginCallback){
			var self = this;
            if (!isFunction(callback)) {callback = function(){};}
            if (!isFunction(unLoginCallback)) {unLoginCallback = function(){location.reload();};}
            self.checkLogin(function(){
                callback();
            }, function(){
                self.login(function(){
                    unLoginCallback();
                });
            });
        },
        submitLogin :function(callback){
			var self = this;
            if (!isFunction(callback)) {callback = function(){};}
            self.checkLogin(function(){
                callback();
            }, function(){
                self.login(function(){
                    callback();
                });
            });
        },
		/*
		**desc: 微信移动端登录
		 */
		loginByWX: function(opt){
			var self=this;
			if("undefined" == typeof opt){
				opt={};
			}
			extend(option, opt);
			//跳转地址
			var redirect_uri=opt.redirect_wx_url || document.location.href;
			/*开始判断环境
			1.微信内
			2.QQ浏览器内
			3.其它浏览器内*/
			//如果在微信浏览器里，而且logtype=wx，并且没有code，就跳转到微信授权后再跳转回来。
			if(LoginManager.isWxApp() &&  milo.request('code')=="") {
				var  href= redirect_uri.replace(/\#.*/,"");
				var  hrefHash= (redirect_uri.match(/\#.*/) && redirect_uri.match(/\#.*/)[0]) || "";
				href=href+  ( /\?/.test(href) ? '&' : '?' ) + 'acctype=wx&appid='+option.appConfig.WxAppId;
				window.location.href= location.protocol+'//open.weixin.qq.com/connect/oauth2/authorize?appid='+option.appConfig.WxAppId+'&redirect_uri='+encodeURIComponent(href+hrefHash)+'&response_type=code&scope='+option.appConfig.scope+'&state=STATE#wechat_redirect';
			}else if(LoginManager.isQQBrowser()){
				//QQ浏览器里面
				var loginInQQBrowserFunc=function(){
					browser.login.authorize(function(data){
						self.loginCallbackByQQBrowser(data);
					},function(data){
						
					},{
					   "authorizeAppID":option.appConfig.QQBrowserAppId,
					   "authorizeAppName":option.appConfig.AppName,
					   "authorizeAppIconURL":option.appConfig.LogoUrl,
					   "authorizeType":4  //应用申明的授权类型。1：QQ手动输入授权，2：QQ快速授权，3：QQ授权（手动或者快速），4：微信快速授权，7：QQ或微信授权
					});
				}
				/*首先判断是否有browser*/
				if("object"==typeof browser){
					loginInQQBrowserFunc();
				}else{
					loadScript("//jsapi.qq.com/get?api=login.*",function(){
						if("object" == typeof browser){
							loginInQQBrowserFunc();
						}
					})
				}
			}else{
				//其它浏览器里面,用openlink
				var returnUrl=redirect_uri.replace(/\#.*/,"");
				var returnUrlHash=(redirect_uri.match(/\#.*/) && redirect_uri.match(/\#.*/)[0]) || "";
				returnUrl=returnUrl+( /\?/.test(returnUrl) ? '&' : '?' )+"logtype=wx";
				if (!/(\?|\&)appid\=.*/.test(returnUrl) && option.appConfig.WxAppId ){
					returnUrl=returnUrl+"&appid="+option.appConfig.WxAppId;
				}
				//noticeid=90106247  AMS专用的noticeid
				 var openlinkJumpUrl="https://apps.game.qq.com/ams/wxlogin_redirect.html?s_url="+Base64.encode(returnUrl+returnUrlHash)+"#wechat_redirect";
				 var myurl= location.protocol+"//game.weixin.qq.com/cgi-bin/comm/openlink?noticeid=90106247&appid=wxc79049cb5a57fefb&url="+encodeURIComponent(openlinkJumpUrl);
				 window.location.href=myurl;
			}
		},
		//=========缓存getWxUser接口数据，避免重复请求=========
		//add by marsboyding 2017-08-15
		wxUserInfoCache:{},
		getWxUserInfo:function(openid,access_token){
			var id=openid+"_"+access_token;
			if(this.wxUserInfoCache[id]){
				return this.wxUserInfoCache[id];
			}else{
				return null;
			}
		},
		storeWxUserInfo:function(openid,access_token,info){
			var id=openid+"_"+access_token;
			this.wxUserInfoCache[id]=info;
		}
	}
	return LoginManager;
});


/*  |xGv00|3c841abfa26ad98b63e2f0a78619b776 */
