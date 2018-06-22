/**
 * Created by Grayson Rex on 2015/4/9.
 * Version: 2.02
 * Modify: 2015/5/26
 */
~function (window) {
    var _console = null, SimpleLogger = {};

    var listBox = null, list = null, btn = null;

    var indent = 0, countNum = 0;

    var initOK = false,
        cachedItems = [];

    var block = {
        info: '<span style="width: 8px; height: 8px; display: inline-block; background-color: blue; margin: 0 3px -1px 0;"></span>',
        warn: '<span style="width: 8px; height: 8px; display: inline-block; background-color: yellow; margin: 0 3px -1px 0;"></span>',
        error: '<span style="width: 8px; height: 8px; display: inline-block; background-color: red; margin: 0 3px -1px 0;"></span>'
    };

    // ��ʼ��
    function init() {
        if (initOK) {
            return;
        }
        if (window.innerHeight && document.createElement && document.body && document.body.appendChild) {
            // ����DOM
            createDOMs();
            // ���¼�
            bindEvents();
            // ���DOM�������ǰ�Ƿ��л���
            handleCachedItems();

            initOK = true;

            window.removeEventListener('resize', init);
        } else {
            window.setTimeout(init, 10);
        }
    }

    // ������־��DOMδ������ʱ��
    function cacheItem(itemObj) {
        cachedItems.push(itemObj);
    }

    // ���������־
    function handleCachedItems() {
        if (cachedItems && cachedItems.length) {
            for (var i = 0, cachedItem; cachedItem = cachedItems[i]; i++) {
                addLogItem(cachedItem);
            }
            cachedItems = [];
        }
    }

    // ����־�б�λ����׶�
    function locateToEnd() {
        var item = list.hasChildNodes() ? list.lastChild : null;
        if (!item) {
            return;
        }
        var listRect = list.getBoundingClientRect(),
            itemRect = item.getBoundingClientRect();
        if (itemRect.bottom > listRect.bottom) {
            list.scrollTop += itemRect.bottom - listRect.bottom;
        }
    }

    // ����������־
    function clearLogItem() {
        list.innerHTML = '';
    }

    // document.bodyδ������ǰ������������־
    function addLogItem(itemObj) {
        var loh = list.offsetHeight,
            olsh = list.scrollHeight;

        var item = document.createElement('li');
        item.innerHTML = itemObj.text;
        if (itemObj.style) {
            item.style.cssText = itemObj.style;
        }
        item.style.borderBottom = '1px solid #A0A0A0';
        if (itemObj.addIndent) {
            indent += itemObj.addIndent();
        }
        item.style.paddingLeft = (indent * 8) + 'px';
        list.appendChild(item);

        var nlsh = list.scrollHeight; // iOS���϶�����
        if (olsh <= loh && nlsh > loh) {
            list.scrollTop = 1;
        }
    }

    // ��¼��־
    function log(text, style, addIndent) {
        var itemObj = {
            text: text,
            style: style,
            addIndent: addIndent
        };
        if (!initOK || !list) {
            cacheItem(itemObj);
        } else {
            addLogItem(itemObj);
        }
    }

    // ���þɵ�window.console���
    function applyOldConsole(func, arguments) {
        if (!_console) {
            return;
        }
        func = _console[func];
        if (!func) {
            return;
        }
        func.apply(_console, arguments);
    }

    // ��ʽ���ַ���
    function format(args) {
        var formatStr = args[0];
        if (typeof(formatStr) != 'string') {
            formatStr = JSON.stringify(formatStr);
        }
        var res = [];
        var formats = formatStr.split('%');
        res.push(formats[0]);
        var offset = 1;
        if (formats.length > 1) {
            for (var i = offset, f; f = formats[i]; i++, offset++) {
                var type = f[0];
                var arg = args[offset];
                switch (type) {
                    case '%':
                        res.push('%');
                        break;
                    case 'c':
                        res.push('</span><span style="' + arg + '">');
                        break;
                    case 'd':
                    case 'i':
                        try {
                            res.push(String(parseInt(arg)));
                        } catch (ex) {
                            res.push('NaN');
                        }
                        break;
                    case 'f':
                        try {
                            res.push(String(parseFloat(arg)));
                        } catch (ex) {
                            res.push('NaN');
                        }
                        break;
                    case 's':
                        try {
                            res.push(String(arg));
                        } catch (ex) {
                            res.push('');
                        }
                        break;
                    case 'O':
                    case 'o':
                        try {
                            res.push(JSON.stringify(arg));
                        } catch (ex) {
                            res.push('');
                        }
                        break;
                }
                res.push(f.substr(1));
            }
        }
        for (var len = args.length; offset < len; offset++) {
            res.push(' ' + JSON.stringify(args[offset]));
        }
        res = '<span>' + res.join('') + '</span>';
        res = res.replace(/\n/g, '<br/>');
        return res;
    }

    var DragOrClick = function (obj) {
        if (obj && obj.addEventListener && obj.classList && obj.classList.add) {
            var _this = this;
            obj.addEventListener('touchstart', function (e) {
                _this.touchStart(e);
            });
            obj.addEventListener('touchmove', function (e) {
                _this.touchMove(e);
            });
            obj.addEventListener('touchend', function (e) {
                _this.touchEnd(e);
            });
            this.obj = obj;
            this.callbacks = {};
        }
    };
    DragOrClick.getTouchPos = function (e) {
        var t = e.touches ? e.touches[0] : e;
        if (!t) {
            return null;
        }
        var x = t.pageX || (t.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
        var y = t.pageY || (t.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
        return {
            x: x,
            y: y
        };
    };
    DragOrClick.getViewportDimension = function () {
        var e = window, a = 'inner';
        if (!( 'innerWidth' in window )) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return {w: e[a + 'Width'], h: e[a + 'Height']};
    };
    DragOrClick.prototype.touchStart = function (e) {
        var obj = this.obj;
        var pos = DragOrClick.getTouchPos(e);
        if (!pos) {
            return;
        }
        this.touchEndPos = pos;
        this.touchStartTime = new Date().getTime();
        this.touchStartPos = this.touchEndPos = pos;

        this.oldPos = {
            x: parseInt(getComputedStyle(obj).left, 10),
            y: parseInt(getComputedStyle(obj).top, 10)
        };
        var dim = DragOrClick.getViewportDimension(),
            rect = obj.getBoundingClientRect();
        this.limit = {
            x: dim.w - (rect.right - rect.left),
            y: dim.h - (rect.bottom - rect.top)
        };
        e.preventDefault();
    };
    DragOrClick.prototype.setObjPos = function (newPos) {
        var obj = this.obj;
        if (newPos.x < 0) {
            newPos.x = 0;
        }
        if (newPos.x > this.limit.x) {
            newPos.x = this.limit.x;
        }
        if (newPos.y < 0) {
            newPos.y = 0;
        }
        if (newPos.y > this.limit.y) {
            newPos.y = this.limit.y;
        }
        obj.style.left = newPos.x + 'px';
        obj.style.top = newPos.y + 'px';
    };
    DragOrClick.prototype.touchMove = function (e) {
        var pos = DragOrClick.getTouchPos(e);
        if (!pos) {
            return;
        }
        this.touchEndPos = pos;

        var dx = this.touchEndPos.x - this.touchStartPos.x,
            dy = this.touchEndPos.y - this.touchStartPos.y;
        var newPos = {
            x: this.oldPos.x + dx,
            y: this.oldPos.y + dy
        };
        this.setObjPos(newPos);
    };
    DragOrClick.prototype.touchEnd = function (e) {
        this.touchEndTime = new Date().getTime();

        var touchTimeSpan = this.touchEndTime - this.touchStartTime;
        if (touchTimeSpan > 25 && touchTimeSpan < 250) {
            this.trigger('click', e);
        }
    };
    DragOrClick.prototype.on = function (type, callback) {
        var callbacks = this.callbacks[type];
        if (Object.prototype.toString.call(callbacks) != '[object Array]') {
            this.callbacks[type] = callbacks = [];
        }
        callbacks.push(callback);
    };
    DragOrClick.prototype.trigger = function (type, e) {
        var callbacks = this.callbacks[type];
        if (Object.prototype.toString.call(callbacks) != '[object Array]') {
            return;
        }
        for (var i = 0, callback; callback = callbacks[i]; i++) {
            if (typeof(callback) == 'function') {
                callback(e);
            }
        }
    };

    // ����ҳ������Ķ���
    function createDOMs() {
        var dim = DragOrClick.getViewportDimension();

        listBox = document.createElement('div');
        listBox.style.cssText = 'position: fixed; z-index: 2147483647; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,.8);' +
        'transition: opacity 400ms; -webkit-transition: opacity 400ms;';
        listBox.style.transform = listBox.style.webkitTransform = 'translate3d(0,0,0)';
        listBox.style.opacity = 0;
        listBox.style.display = 'none';

        list = document.createElement('ul');
        list.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 80%; box-sizing: border-box; background-color: rgba(255,255,255,.7); color: black; ' +
        'margin: 0; padding: 2px 6px; text-align: left; font-size: 12px; line-height: 20px; list-style: none; word-break: break-all; overflow-y: scroll; -webkit-overflow-scrolling: touch;' +
        'transition: transform 400ms; -webkit-transition: -webkit-transform 400ms;';
        list.style.transform = list.style.webkitTransform = 'translate3d(0,-100%,0)';

        btn = document.createElement('a');
        btn.style.cssText = 'position: fixed; z-index: 2147483647; top: 60px; left: 20px; width: 50px; height: 50px; display: block;' +
        'box-sizing: border-box; background-color: rgba(0,0,0, .6); border: 4px solid rgba(255,255,255, .2); border-radius: 12px; color: white;';
        btn.style.transform = btn.style.webkitTransform = 'translate3d(0,0,0)';

        document.body.addEventListener('touchstart', function () {
            /* For bug: QQ������У���ָ�Ƴ���������޷��ٴ��������touchstart�¼����� */
            //btn.innerHTML = ~~btn.innerHTML + 1;
        });

        document.body.appendChild(btn);
        listBox.appendChild(list);
        document.body.appendChild(listBox);

        if (SimpleLogger._hideBtn) {
            SimpleLogger.hideBtn();
        }
    }

    // �󶨶�������¼�
    function bindEvents() {
        var btnDOC = new DragOrClick(btn);
        btnDOC.on('click', function () {
            SimpleLogger.expand();
        });

        // ��������ʱ����͸��������������
        var listBoxTransitionEnd = function () {
            if (listBox.style.opacity == 0) {
                listBox.style.display = 'none';
            }
        };
        listBox.addEventListener('webkitTransitionEnd', listBoxTransitionEnd);
        listBox.addEventListener('transitionend', listBoxTransitionEnd);

        // ��ֹ�ڲ��߶Ȳ���ʱ������ҳ�汻�϶���iOS��
        var checkScrollable = function (e) {
            if (list.scrollHeight <= list.offsetHeight) {
                e.preventDefault();
            }
            e.stopPropagation();
        };
        list.addEventListener('touchstart', checkScrollable);
        list.addEventListener('touchmove', checkScrollable);

        // ��ֹ�����������϶�ʱ����ҳ��Ĺ���
        var stopAndPrevent = function (e) {
            e.stopPropagation();
            e.preventDefault(); // ��ֹ�Ŵ�ҳ������Ȳ���
        };
        listBox.addEventListener('touchstart', function (e) {
            var listRect = list.getBoundingClientRect();
            var touchPos = DragOrClick.getTouchPos(e);
            if (touchPos && (touchPos.x < listRect.left || touchPos.x > listRect.right ||
                touchPos.y < listRect.top || touchPos.y > listRect.bottom)) {
                SimpleLogger.collapse();
            }
            stopAndPrevent(e);
        });
        listBox.addEventListener('touchmove', stopAndPrevent);
    }

    // չ����־�б�
    SimpleLogger.expand = function () {
        listBox.style.display = 'block';
        listBox.offsetWidth = listBox.offsetWidth;
        locateToEnd();

        listBox.style.opacity = 1;
        list.style.transform = list.style.webkitTransform = 'translate3d(0,0%,0)';
    };

    // �۵���־�б�
    SimpleLogger.collapse = function () {
        listBox.style.opacity = 0;
        list.style.transform = list.style.webkitTransform = 'translate3d(0,-100%,0)';
    };

    // ���ذ���
    SimpleLogger.hideBtn = function () {
        if (btn) {
            btn.style.display = 'none';
        } else {
            SimpleLogger._hideBtn = true;
        }
    };

    // ���ԭ����console
    SimpleLogger.replaceConsole = function () {
        _console = window.console != SimpleLogger ? window.console : _console;
        window._console = _console;
        window.console = SimpleLogger;
    };

    // ������������ԭwindow.console
    SimpleLogger.aliasAndRestoreConsole = function (alias) {
        if (_console) {
            window.console = _console;
        }
        if (window[alias] && window[alias] != SimpleLogger) {
            throw '������ͻ��window.' + alias + ' �Ѵ��ڣ�';
            return;
        }
        window[alias] = SimpleLogger;
    };

    // ���������Ŀ���̨��Ϣ
    SimpleLogger.clear = function () {
        clearLogItem();
        applyOldConsole('clear');
    };

    // �����־��Ϣ
    SimpleLogger.log = function (formatStr) {
        var res = format(arguments);
        log(res);
        applyOldConsole('log', arguments);
    };

    // �����ʾ��Ϣ
    SimpleLogger.info = function () {
        var res = format(arguments);
        log(block.info + res);
        applyOldConsole('info', arguments);
    };

    // ���������Ϣ
    SimpleLogger.warn = function () {
        var res = format(arguments);
        log(block.warn + res);
        applyOldConsole('warn', arguments);
    };

    // �����¼����
    SimpleLogger.error = function () {
        var res = format(arguments);
        log(block.error + res, 'color: red;');
    };

    SimpleLogger.group = function () {
        var res = format(arguments);
        log(block.info + res, 1);
        applyOldConsole('group', arguments);
    };

    SimpleLogger.groupEnd = function () {
        var res = format(arguments);
        log(block.info + res, -1);
        applyOldConsole('groupEnd', arguments);
    };

    SimpleLogger.assert = function (exp) {
        if (exp) {
            return;
        }
        var args = [];
        for (var i = 1, len = arguments.length; i < len; i++) {
            args.push(arguments[i]);
        }
        var res = format(args);
        log(block.error + 'Assertion failed: ' + res, 'color: red;');
        applyOldConsole('assert', arguments);
    };

    SimpleLogger.count = function () {
        var res = format(arguments);
        log(res + ': ' + (++countNum));
        applyOldConsole('count', arguments);
    };

    SimpleLogger.dir = function () {
        var res = format(arguments);
        log(res);
        applyOldConsole('dir', arguments);
    };

    SimpleLogger.profile = function (profile) {
        log('Profile \'' + profile + '\' started.');
        applyOldConsole('profile', profile);
    };

    SimpleLogger.profileEnd = function (profile) {
        log('Profile \'' + profile + '\' finished.');
        applyOldConsole('profileEnd', profile);
    };

    //init();
    window.addEventListener('load', init);      // ���ֿͻ����������������
    window.addEventListener('resize', init);    // ���ֿͻ���WebView��setTimeout��Ч����
    window.addEventListener('error', function (error) {
        var line = error ['lineno'];
        var file = error['filename']
        var posStr = '(' + line + ')';
        if (file) {
            file = file.substring(0, ((file.indexOf('?') + 1) || (file.indexOf('#') + 1) || (file.length + 1)) - 1);
            var page = window.location.href;
            page = page.substring(0, ((page.indexOf('?') + 1) || (page.indexOf('#') + 1) || (page.length + 1)) - 1);
            var path = page.substring(0, page.lastIndexOf('/') + 1);
            if (file.indexOf(path) == 0) {
                file = file.length > path.length ? file.substring(path.length) : '(index)';
            }
            posStr = !file ? posStr : '</span><span style="float:right; color: #555555; text-decoration: underline;">' + file + ': ' + line + '</span><span style="clear: both; display: block; height: 0;">';
        }
        SimpleLogger.error(error['message'] + posStr);
    });

    window['SimpleLogger'] = SimpleLogger;

    // �滻ԭ��console
    SimpleLogger.replaceConsole();
}(window);