    function getParam(paramName) {
        paramValue = "", isFound = !1;
        if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
            arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
            while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
        }
        return paramValue == "" && (paramValue = null), paramValue
    }

// screen
~function(){
    var psdHeightInWechat = 724,
        psdHeight = 812,
        _scaleHeight = 760,
        winHeight = $(window).height(),
        _zoom = winHeight / psdHeight,
        _scale = winHeight / _scaleHeight;

    if(_zoom < 1){
        if(winHeight != psdHeightInWechat && winHeight != psdHeight){
            console.log('缩放以后，原有高度' + $(window).height() + ',缩放' + _scale + ', 缩放参照：' + _scaleHeight);
            $('.screen').css({
                'transform' : 'scale(0.9)'
            });
        }else{
            $('.screen').css({
                'transform' : 'scale(1)'
            });
        }
    }else{
        $('.screen').css({
            'transform' : 'scale(1)'
        });
    }


    $(window).on('resize', function(){
        winHeight = $(window).height();
        _zoom = winHeight / psdHeight;
        _scale = winHeight / _scaleHeight;
        if(_zoom < 1){
            if(winHeight != psdHeightInWechat && winHeight != psdHeight){
                $('.screen').css({
                    'transform' : 'scale(0.9)'
                });
            }else{
                $('.screen').css({
                    'transform' : 'scale(1)'
                });
            }
        } else{
            $('.screen').css({
                'transform' : 'scale(1)'
            });
        }
    })

    var $mask = $('.lmask');
    function screenTips(){
        var orientation = window.orientation;
        if(orientation == 90 || orientation == -90){
            $mask.addClass('show');
        }
        if(orientation == 0 || orientation == 180){
            $mask.removeClass('show');
        }
    }
    screenTips();
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", screenTips, false);
}();

// video
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
var music = $('#bgm')[0];
var Music = {
    init: function(){
        this.btnPlay = $('.music');
        this.event();
        this.play();
        // if(music.paused){
        //     this.btnPlay.addClass('pause');
        // }

    },
    event: function(){
        var self = this;
        self.btnPlay.on('click', function(){
            var _this = $(this);
            if(_this.is('.pause')){
                self.play();
            }else{
                self.pause();
            }
        })
        if(music.paused){
            $('body').one('click', function(){
                Music.play();
            })
        }
    },
    play: function(){
        music.play();
        if(!music.paused){
            this.btnPlay.removeClass('pause');
        }
    },
    pause: function(){
        music.pause();
        if(music.paused){
            this.btnPlay.addClass('pause');
        }
    }
};
Music.init();


var oIndex = 1,
    fadeInClassName = 'fadeIn',
    fadeOutClassName = 'fadeOut',
    page1NumArr1 = ['n2', 'n0', 'n0', 'n8'],
    page1NumArr2 = ['n2', 'n0', 'n1', 'n0'],
    page1NumArr3 = ['n2', 'n0', 'n1', 'n5'],
    page1NumArr4 = ['n2', 'n0', 'n1', 'n7'],
    page2NumArr = ['n2', 'n0', 'n0', 'n9'],
    page3NumArr = ['n5', 'n8'];
var resetPage = function(type){
    if(type == 'page1'){
        $('.present2').removeClass(fadeInClassName).find('.content').removeClass(fadeOutClassName);
        $('.box1 .item').removeClass(fadeInClassName);
        $('.box1 .item .content').removeClass(fadeOutClassName);
        $('.box1 .number span').attr('class', '');
    }
    if(type == 'page2'){
        $('.present3').removeClass(fadeInClassName).find('.content').removeClass(fadeOutClassName);
        $('.profession').removeClass(fadeInClassName).find('.content').removeClass(fadeOutClassName);
        $('.create_time').removeClass(fadeInClassName);
        $('.page2 .animate_write').removeClass(fadeInClassName);
        
    }
    if(type == 'page3'){
        $('.present4').removeClass(fadeInClassName).find('.content').removeClass(fadeOutClassName);
        $('.experience').removeClass(fadeInClassName).find('.content').removeClass(fadeOutClassName);
        $('.page3_number1').removeClass(fadeInClassName);
    }
    if(type == 'page4'){
        $('.present5').removeClass(fadeInClassName).find('.content').removeClass(fadeOutClassName);
        $('.change').removeClass(fadeInClassName).find('.content').removeClass(fadeOutClassName);
        $('.box4 .elm1').removeClass(fadeInClassName).children().removeClass(fadeOutClassName);
        $('.page4 .animate_write').removeClass(fadeInClassName);
    }
    if(type == 'page5'){
        $('.epilogue p').removeClass(fadeInClassName);
        $('.present6').removeClass(fadeInClassName);
    }
}
var goToPage = function(type){
    if(type == 'page1'){
        $('.page-loading').addClass(fadeOutClassName);
        setTimeout(function(){
            $('.page-loading').css('display', 'none');
        }, 1000);
        setTimeout(function(){
            $('.page1_number1').children().each(function(i){
                $(this).attr('class', page1NumArr1[i]);
            })
            setTimeout(function(){
                $('.page1_number2').children().each(function(i){
                    $(this).attr('class', page1NumArr2[i]);
                })
            }, 200)
            setTimeout(function(){
                $('.page1_number3').children().each(function(i){
                    $(this).attr('class', page1NumArr3[i]);
                })
            }, 400)
            setTimeout(function(){
                $('.page1_number4').children().each(function(i){
                    $(this).attr('class', page1NumArr4[i]);
                })
            }, 600)

        }, 500)
        $('.present2').addClass(fadeInClassName);
        $('.box1 .item').addClass(fadeInClassName);
    }
    if(type == 'page2'){
        $('.present3').addClass(fadeInClassName);
        $('.profession').addClass(fadeInClassName);
        $('.create_time').addClass(fadeInClassName);
        setTimeout(function(){
            $('.page2 .animate_write').addClass(fadeInClassName);
        }, 500)
    }
    if(type == 'page3'){
        $('.present4').addClass(fadeInClassName);
        $('.experience').addClass(fadeInClassName);
        $('.page3_number1').addClass(fadeInClassName);
    }
    if(type == 'page4'){
        $('.present5').addClass(fadeInClassName);
        $('.change').addClass(fadeInClassName);
        $('.elm1').addClass(fadeInClassName);
        setTimeout(function(){
            $('.page4 .animate_write').addClass(fadeInClassName);
        }, 500)
    }
    if(type == 'page5'){
        $('.epilogue p').addClass(fadeInClassName);
        $('.present6').addClass(fadeInClassName);
    }
}
var goOutPage = function(type){
    if(type == 'page1'){
        $('.present2 .content').addClass('fadeOut');
        $('.box1 .item .content').addClass('fadeOut');
    }
    if(type == 'page2'){
        $('.present3 .content').addClass('fadeOut');
        $('.profession .content').addClass('fadeOut');
    }
    if(type == 'page3'){
        $('.present4 .content').addClass('fadeOut');
        $('.experience .content').addClass('fadeOut');
    }
    if(type == 'page4'){
        $('.present5 .content').addClass('fadeOut');
        $('.change .content').addClass('fadeOut');
        $('.box4 .elm1-child').addClass('fadeOut');
    }
}
var speed = 1000;
var swiper = new Swiper('.swiper-container', {
    direction : 'vertical',
    followFinger : false,
    speed: speed,
    effect: "fade",
    virtualTranslate: true,
    on : {
        transitionStart: function(){
            goOutPage('page' + oIndex);
            if(this.activeIndex == 4){
                $('.icon-next').css('display', 'none');
            }else{
                $('.icon-next').css('display', 'block');
            }
        },
        transitionEnd: function(){
            var _activeIndex = swiper.activeIndex + 1;
            goToPage('page' + _activeIndex);
            resetPage('page' + oIndex);
            oIndex = _activeIndex;
        }
    }
});

var loadingEnd = false,
    timer;
var Index = {
    init: function(data,nickname){
		var job_name = data.FirstcInfo.job_type; //职业名称
        var ch_name = data.FirstcInfo.ch_name; //角色名称
		var jobid = data.FirstcInfo.jobid; //职业编号
		var create_time = data.FirstcInfo.create_time; //创建角色时间
		create_time = create_time.split('-'); // 0 -- 年份 1--月份 2--日
		var year_time = create_time[0].split('');
		var moth_time = create_time[1].split('');
		var day_time = create_time[2].split('');
		var role_create_time_html = "<div class='number'>"+
						"<span class="+ 'n' + year_time[0] +"></span>"+
						"<span class="+ 'n' + year_time[1] +"></span>"+
						"<span class="+ 'n' + year_time[2] +"></span>"+
						"<span class="+ 'n' + year_time[3] +"></span>"+
					"</div>"+
					"<div class='month'>"+
						"<span class="+ 'n' + moth_time[0] +"></span>"+
						"<span class="+ 'n' + moth_time[1] +"></span>"+
						"<span class='of'></span>"+
						"<span class="+ 'n' + day_time[0] +"></span>"+
						"<span class="+ 'n' + day_time[1] +"></span>"+
					"</div>";
		$('#role_create_time').html(role_create_time_html);
		var past_time = data.FirstcInfo.past_time;//过去多少天
		past_time = past_time.toString();
		past_time = past_time.split('');
		var role_past_time_html = '';
		for(var i in past_time){
			role_past_time_html += "<span class="+ 'n' + past_time[i] +"></span>";
		}
		$('#role_past_time').html(role_past_time_html);
		$('#role_job_id').addClass('pro'+jobid);
		
		var enter_count = data.EnterdeepInfo.enter_count?data.EnterdeepInfo.enter_count:0; //深渊派对次数
		var epic_num = data.EpicInfo.epic_num?data.EpicInfo.epic_num:0; //近半年获取史诗次数
		if(enter_count != 0){
			var enter_count_str = enter_count.toString();
			var enter_count_arr = enter_count_str.split('');
			var enter_count_html = '';
			for(var i in enter_count_arr){
				enter_count_html += "<span class="+ 'n' + enter_count_arr[i] +"></span>";
			}
			$('#abyss_num').html(enter_count_html);
		}
		
		if(epic_num != 0){
			var epic_num_str = epic_num.toString();
			var epic_num_arr = epic_num_str.split('');
			var epic_num_html = '';
			for(var i in epic_num_arr){
				epic_num_html += "<span class="+ 'n' + epic_num_arr[i] +"></span>";
			}
			$('#epic_num').html(epic_num_html);
		}
		
		var partyCountSmall = '';
		if(epic_num < 500){
			partyCountSmall = false; // 不符合欧皇附体
		}else{
			partyCountSmall = true; // 符合欧皇附体
		}
		
		var userName = nickname; //用户QQ昵称
		
		var userSelf = data.is_self; //是否自己查看 0自己查看，1他人查看
		var maxlevel = data.EnhanceInfo.maxlevel ? data.EnhanceInfo.maxlevel : 0; //强化最高级
		var itemname = data.EnhanceInfo.itemname ? data.EnhanceInfo.itemname : ''; //装备名称
		
		var strengGradeSmall = ''; // 强化等级少于10级
		var textVersion = ''; // 尾页文案版本索引
		if(maxlevel < 10){
			strengGradeSmall = false; 
			textVersion = 1;
		}else{
			strengGradeSmall = true; 
			textVersion = 0;
		}
		
		
		var dataText = {
		"page2" : [
			'<p><span class="sp1">'+job_name+'</span>是你创建的第一个职业</p><p>你敲下了<span class="sp2">'+ ch_name +'</span></p><p>作为TA的角色名,当时的那一份热爱，<br/>或许仍记忆犹新.</p>',
			'<p><span class="sp1">'+job_name+'</span>是'+ userName + '创建的第一个职业</p><p>ta敲下了<span class="sp2">'+ ch_name +'</span></p><p><span class="sp2">作为第一个角色名</span>,当时的那一份热爱，<br/>或许仍记忆犹新.</p>'
		],
		"page3" : [
			'<p>近一年，</p><p>你进入了<span class="sp1">'+enter_count+'</span>次深渊派对</p> <p>半年内获得<span class="sp2">'+epic_num+'</span>件史诗</p><p>可以说是欧皇附体了！</p>',
			'<p>近一年，</p><p>'+ userName + '进入了<span class="sp1">'+enter_count+'</span>次深渊派对</p> <p>半年内获得<span class="sp2">'+epic_num+'</span>件史诗</p><p>可以说是欧皇附体了！</p>',
			'<p>近一年，</p><p>你进入了<span class="sp1">'+enter_count+'</span>次深渊派对，</p><p>获得<span class="sp2">'+epic_num+'</span>件装备</p> <p>革命尚未成功，勇士，仍需努力哦~</p>',
			'<p>近一年，</p><p>' + userName +'进入了<span class="sp1">'+enter_count+'</span>次深渊派对，</p><p>获得<span class="sp2">'+epic_num+'</span>件装备</p> <p>革命尚未成功，勇士，仍需努力哦~</p>'
		],
		"page4" : [
			'<p>还是这句熟悉的对白，</p><p>至今强化或增幅装备最高等级：<span class="sp1">'+maxlevel+'</span></p><p>TA的名字是：<span class="sp1">'+itemname+'</span></p><p>这件装备还在么？</p>',
			'<p>还是这句熟悉的对白，</p><p>'+ userName + '至今强化或增幅装备最高等级：<span class="sp1">'+maxlevel+'</span></p><p>TA的名字是：<span class="sp1">'+itemname+'</span></p><p>这件装备还在么？</p>',
			'<p>还是那句熟悉的对白，</p><p>至今强化或者增幅装备最高等级：<span class="sp1">0</span></p><p>在阿拉德大陆征战的过程中</p><p>装备的提升，可以减少征战难度</p>',
			'<p>还是这句熟悉的对白，</p><p>'+ userName + '至今强化或增幅装备最高等级：<span class="sp1">0</span></p>'
		],
		"page7" : [
			'<p>对于阿拉德勇士来说</p><p class="padding-bottom">DNF是一个时代，一种经典</p><p>感谢你这10年的守护!</p><p>Fight！让我们一起再战十年！</p>',
			'<p>对于阿拉德勇士来说</p><p class="padding-bottom">DNF是一个时代，一种经典</p>' +
			'<p>十年是一个阶段，TA是一种新的开始</p><p class="padding-bottom">新副本  新玩法  新装备</p>' +
			'<p>晓菲陪你一起成长</p><p>Fight！ 让我们一起再战10年~</p>'
		]
		};
		$('#ch_name').html(ch_name);

        var typeIndex = 0;
        if(userSelf){
            typeIndex = 1;
        }else{
            typeIndex = 0;
        }
        $('.present_text').each(function(){
            var _type = $(this).attr('data-type');

            if(_type == 'page3'){
                var _i = typeIndex;
                if(!partyCountSmall){
					_i = _i + 2;
					$('.experience').addClass('expect');
				} 
                $(this).html(dataText[_type][_i]);
            } else if(_type == 'page4'){
                var _i = typeIndex;
                if(!strengGradeSmall) _i = _i + 2;
                $(this).html(dataText[_type][_i]);
            }
            else{
                $(this).html(dataText[_type][typeIndex]);
            }
        });

        $('.epilogue').html(dataText['page7'][textVersion])
    },
    event: function(){
        var animateEndEvent = 'oTransitionEnd transitionend webkitTransitionEnd';
        $('body').one('touchstart', function(){
            if(!$('.music').is('.pause')){
                Music.play();
            }
        })
        $('.icon-next').on('click', function(){
            swiper.slideNext();
        })
        $('.schedule span').eq(19).on(animateEndEvent, function(){
            loadingEnd = true;
        })
		$("#open_memory").click(function(){qqlogin();})
    },
    loader: function(){
        var _imgPath = 'http://dnf10year.miits.cn/images/',
            arrImg = [
                _imgPath + 'abyss_border.png',
                _imgPath + 'account.png',
                _imgPath + 'bg2.jpg',
                _imgPath + 'caption.png',
                _imgPath + 'change.png',
                _imgPath + 'change_elm1.png',
                _imgPath + 'change_elm2.png',
                _imgPath + 'change_elm3.png',
                _imgPath + 'checkpoint1.png',
                _imgPath + 'checkpoint2.png',
                _imgPath + 'checkpoint3.png',
                _imgPath + 'checkpoint4.png',
                _imgPath + 'dnf.png',
                _imgPath + 'epic_border.png',
                _imgPath + 'experience.png',
                _imgPath + 'experience1.png',
                _imgPath + 'gear.png',
                _imgPath + 'heading_font.png',
                _imgPath + 'heading_light.png',
                _imgPath + 'heading_shadow.png',
                _imgPath + 'icon_date.png',
                _imgPath + 'loading.png',
                _imgPath + 'logo.png',
                _imgPath + 'open.png',
                _imgPath + 'password.png',
                _imgPath + 'portrait.png',
                _imgPath + 'present1.png',
                _imgPath + 'present2.png',
                _imgPath + 'present3.png',
                _imgPath + 'present4.png',
                _imgPath + 'present5.png',
                _imgPath + 'profession.png',
                _imgPath + 'profession_border.png',
                _imgPath + 'profession1.png',
                _imgPath + 'scr_img_write_font.png',
                _imgPath + 'src_img_yellow_font.png',
                _imgPath + 'tips.png',
                _imgPath + 'wh_n0.png',
                _imgPath + 'wh_n1.png',
                _imgPath + 'wh_n2.png',
                _imgPath + 'wh_n3.png',
                _imgPath + 'wh_n4.png',
                _imgPath + 'wh_n5.png',
                _imgPath + 'wh_n6.png',
                _imgPath + 'wh_n7.png',
                _imgPath + 'wh_n8.png',
                _imgPath + 'wh_n9.png',
            ],
            loader = new resLoader({
                resources : arrImg,
                onStart : function(total){
                    console.log('start:'+ total);
                },
                onProgress : function(current, total){
                    var percent = Math.ceil(current/total*100),
                        _percentF = percent + '%',
                        $load = $('.schedule');
                        oddCount = parseInt(percent / 5);

                    if(_percentF == '100%'){
                        timer = setInterval(function(){
                            if(loadingEnd){
                                // $('.status2').css('display', 'block');
                                $('.wrap').css('opacity', '1');
                                setTimeout(function(){
                                    $('.loading').addClass('fadeOut');
                                    $('.btn-open').css('display', 'block');
                                    setTimeout(function(){
                                        $('.btn-open').addClass('fadeIn');
                                    }, 100)
                                    // $('.present1').addClass('fadeIn');
                                }, 500)
                            }
                        }, 20);
                    }

                    $('.schedule span').each(function(i){
                        if(i >= oddCount) return;
                        if(!$(this).is('.show')){
                            $(this).addClass('show');
                        }
                    })
                },
                onComplete : function(total){
                    console.log(total);
                }
            });

        loader.start();
    }
}

//





