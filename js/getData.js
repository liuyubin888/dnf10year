var getResoutObj = {
	url_prefix : '//svip.game.qq.com/dnf10year/DnfTenYear/getUserInfo',
	token:'',
	init : function(){
		var _this = this;
		_this.token = common.getQueryString('token');
		if(isLogin !== 1){ //û�е�¼
			
			if(_this.token){ //��token���Բ���¼����token��UIN
				_this.getUserInfo(_this.token);
				
			}else{
				Index.loader();
				Index.event();
			}
		}else{
			_this.getUserInfo();
		}
		
	},
	//��ȡ�û���Ϣ
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
						shareTitle:'�ܼ����ƴ��㿪��ר��DNF����֮��', //�����û�����Ϊ��ʱ��ҳ����title�����ȡtitle
						shareDesc:'ר������', //�����û�����Ϊ��ʱ��ҳ����Description�����ȡDescription
						shareImgUrl:'http://dnf10year.miits.cn/images/share.jpg', //����ͼƬ�ߴ�200*200������д����·��
						shareLink:'http://dnf10year.miits.cn/index.html?token='+share_token, //��������Ҫ����ǰҳ��ͬ����(��Q���������Ҫ��) ,�����û�����Ϊ��ʱ��Ĭ�ϵ�ȡ��ǰURL
						actName:'a20151127tgmsdemo' //���������������ͳ�Ʒ�������ר��һ�����Ŀ¼������a20151029demo
					});
				}
			}
		},'jsonp',function(){
			alert('�������');
		});
	},
	//�Ѿ���¼��״̬
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

