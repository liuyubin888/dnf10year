(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //AMD
        define(factory);
    } else if (typeof exports === 'object') {
        //Node, CommonJS֮���
        module.exports = factory();
    } else {
        //�����ȫ�ֱ���(root �� window)
        root.resLoader = factory(root);
    }
}(this, function () {
    var isFunc = function(f){
        return typeof f === 'function';
    }
    //����������
    function resLoader(config){
        this.option = {
            resourceType : 'image', //��Դ���ͣ�Ĭ��ΪͼƬ
            baseUrl : './', //��׼url
            resources : [], //��Դ·������
            onStart : null, //���ؿ�ʼ�ص��������������total
            onProgress : null, //���ڼ��ػص��������������currentIndex, total
            onComplete : null //������ϻص��������������total
        }
        if(config){
            for(i in config){
                this.option[i] = config[i];
            }
        }
        else{
            alert('��������');
            return;
        }
        this.status = 0; //��������״̬��0��δ����   1�����ڼ���   2���������
        this.total = this.option.resources.length || 0; //��Դ����
        this.currentIndex = 0; //��ǰ���ڼ��ص���Դ����
    };

    resLoader.prototype.start = function(){
        this.status = 1;
        var _this = this;
        var baseUrl = this.option.baseUrl;
        for(var i=0,l=this.option.resources.length; i<l; i++){
            var r = this.option.resources[i], url = '';
            if(r.indexOf('http://')===0 || r.indexOf('https://')===0){
                url = r;
            }
            else{
                url = baseUrl + r;
            }

            var image = new Image();
            image.onload = function(){_this.loaded();};
            image.onerror = function(){_this.loaded();};
            image.src = url;
        }
        if(isFunc(this.option.onStart)){
            this.option.onStart(this.total);
        }
    }

    resLoader.prototype.loaded = function(){
        if(isFunc(this.option.onProgress)){
            this.option.onProgress(++this.currentIndex, this.total);
        }
        //�������
        if(this.currentIndex===this.total){
            if(isFunc(this.option.onComplete)){
                this.option.onComplete(this.total);
            }
        }
    }

    //��¶��������
    return resLoader;
}));