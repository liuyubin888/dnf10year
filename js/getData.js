var getResoutObj = {
	url_prefix : '//svip.game.qq.com/dnf10year/DnfTenYear/getUserInfo',
	token:'',
	init : function(){
		var _this = this;
		_this.token = common.getQueryString('token');
		if(isLogin !== 1){ //没有登录
			
			if(_this.token){ //有token可以不登录，用token换UIN
				_this.getUserInfo(_this.token);
				
			}else{
				Index.loader();
				Index.event();
			}
		}else{
			_this.getUserInfo();
		}
		
	},
	//获取用户信息
	getUserInfo:function(token){
		
		var _this = this;
		var url = '';
		var nickname = '';
		if(token){
			url = _this.url_prefix+'?uin='+''+'&token='+token;
		}else{
			var uin = G_USER_INFO.userUin ? G_USER_INFO.userUin : '';
			nickname = G_USER_INFO.nickName ? G_USER_INFO.nickName : '';
			url = _this.url_prefix+'?uin='+uin+'&nickname='+encodeURIComponent(nickname);
		}
		
		
		common.postAjax(url,'',function(ret){
			if(ret.err_code == '0'){
				if(ret.result.data.is_not_vip == 1){
					$('.wrap').css('opacity', '1');
					$('.btn-open').addClass('none');
					$('.loading').css('display', 'none');
					$('.tips').addClass('fadeIn');
					$('.tips').addClass('noVacancy');
				}else{
					var share_token = '';
					if(token){
						nickname = ret.result.data.nickname;
						share_token = token;
					}else{
						share_token = ret.result.data.token;
					}
					var data = ret.result.data;
					Index.init(data,nickname);
					_this.loginReady();
					
					TGMobileShare({
						shareTitle:'管家晓菲带你开启专属DNF回忆之旅', //不设置或设置为空时，页面有title，则调取title
						shareDesc:'专属回忆', //不设置或设置为空时，页面有Description，则调取Description
						shareImgUrl:'http://dnf10year.miits.cn/images/share.jpg', //分享图片尺寸200*200，且填写绝对路径
						shareLink:'http://dnf10year.miits.cn/index.html?token='+share_token, //分享链接要跟当前页面同域名(手Q分享有这个要求) ,不设置或设置为空时，默认调取当前URL
						actName:'a20151127tgmsdemo' //点击流命名，用于统计分享量，专题一般采用目录名称如a20151029demo
					});
				}
			}
		},'jsonp',function(){
			alert('网络错误');
		});
	},
	//已经登录的状态
	loginReady:function(){
		$('.wrap').css('opacity', '1');
		$('.btn-open').addClass('none');
		$('.loading').css('display', 'none');
		$('.tips').addClass('fadeIn');
		$('.present1').addClass('fadeIn');
		$('.icon-next').css('opacity', '1');
		$('.page-loading').on('touchend', function(){
			goToPage('page1');
		});
		
		
	}
};

