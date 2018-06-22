window.playerInfo = {};
var common = {
	/**
     * @todo 【通用】获取url参数
     * @param name 参数名
     * @returns {null} 返回对象
     */
    getQueryString : function (name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
    /**
     * @todo 设置cookie
     * @param name 名称
     * @param value 值
     */
    setCookie:function (name, value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + 60 * 60 * 2000);//过期时间 2分钟
        document.cookie = name + "=" + escape(value) + ";domain=.qq.com;expires=" + exp.toGMTString()+";path=/";
    },
    /**
     * @todo 【通用】获取cookie值
     * @param {type} name
     */
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return '';
    },
	//【通用】浏览器设备类型判定
	browser: function () {
		var u = navigator.userAgent, app = navigator.appVersion;
		return {//移动终端浏览器版本信息
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
			iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
		};
	}(),
	postAjax: function (url, params, callBack, date_type,errorCallBack) {
		date_type = (date_type == 'json') ? date_type : 'jsonp';
		var _this = this;
		_this.ajax_request = $.ajax({
			url: url,
			type: 'POST',
			data: params,
			dataType: date_type,
			async: true, //异步请求
			timeout: 120000, //毫秒，这里最好能减少时间，精确报异常出来
			success: function (ret) {
				if(typeof (callBack) == 'function'){
					callBack(ret);
				}
			},
			error: function (XMLhttpsRequest, textStatus, errorThrown) {
				if(typeof (errorCallBack) == 'function'){
					errorCallBack();
				}else{
					alert('网络繁忙，请稍后再试！');
				}
				return;
			}
		});
	},
	//
    setCookieTime:function(name,value,time)
    {
        var getsec = function(str){
             var str1=str.substring(1,str.length)*1;
            var str2=str.substring(0,1);
            if (str2=="s") {
                return str1*1000;
            } else if (str2=="h") {
                return str1*60*60*1000;
            } else if (str2=="d") {
                return str1*24*60*60*1000;
            }
        }
        var strsec = getsec(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec*1);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
        //这是有设定过期时间的使用示例：
        //s20  20秒
        //h12  12小时
        //d30  30天
        //setCookie("name","hayden","s20");
    },
}