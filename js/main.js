$(function () {
    var app = new Vue({
        el: "#app",
        data: {
            message: 1,
            startShow: true,    //初始第一页的显示
            endShow: true,      //末尾页的显示
            contentShow: false, //做题内容页的显示
            questionList: [],   //lists对象数组
            question_type: [],  //问题种类type的标题
            listsId: 1,         //当前做题页码第一页是0
            select: 'ok',       //答题的结果对错
            finish: {},         //结尾页json数据
            judgeTrue:0,        //判断题对勾选项
            judgeFalse:0,       //判断题叉选项
            annId: -1,          //单选答案索引
            answer:[],           //多选答案顺序数组
            vacancyCon:'',       //单选填空显示单词
            vacancyArr:[]
        },
        mounted: function () {
            this.getQuestionList();
        },
        methods: {
            /*初始数据ajax请求*/
            getQuestionList: function () {
                $.ajax({
                    url: "http://test.zhituteam.com/index.php/home/api/getquestion",
                    // url: "./json/first.json",
                    type: "get",
                    dataType: "json",
                    data: {
                        type: 2,
                        level: 94,
                        lesson: 1360,
                        question_flag: 2
                    },
                    success: function (res) {
                        app.questionList = res.result.lists; //题目列表
                        app.question_type = res.result.question_type; //题型列表
                    },
                    error: function () {
                        alert("请求错误");
                    }
                })
            },
            /*初始页点击start*/
            starBtn: function () {
                this.startShow = true;  //初始页隐藏
                this.contentShow = false; //做题也出现
                this.listsId = 0;  //开始页码调整到第一页
            },
            /*上一题点击*/
            prveClick:function(){
                if(this.listsId==0){
                    this.startShow = false;  //初始页出现
                    this.contentShow = true; //做题也隐藏
                }else{
                    this.listsId-=1;
                }
            },
            /*下一题点击*/
            nextClick:function(){
                if(this.listsId==this.questionList.length-1){  //到达最后一页
                    this.contentShow = true; //做题页隐藏
                    this.endShow=false;//末尾页出现
                }else{
                    this.listsId+=1;
                }
                this.judgeFalse=0; //清空判断选中状态
                this.judgeTrue=0;
                this.answer=[];  //清空多选答案数组
                this.annId=-1;   //恢复单选选项
                this.vacancyCon='';//单选填空清空
                this.vacancyArr=[];//多选的填空清空
            },
            /*单选*/
            type5Click:function(index){
                $('.type5-option').eq(index).addClass('type5Click').siblings().removeClass('type5Click');
                this.annId=index;   //当前单选的索引
                this.vacancyCon=$('.type5-option').eq(index).html();//单选选中内容赋值
            },
            /*多选*/
            type6Click:function(index){
                var option=$('.type5-option');
                var index2=option.eq(index).html();
                if(option.eq(index).hasClass('type5Click')){ //判断是否选中
                    option.eq(index).removeClass('type5Click');

                    this.answer.splice($.inArray(index,this.answer),1);//删除内容为index的元素
                    this.vacancyArr.splice($.inArray(index2,this.vacancyArr),1);
                }else{
                    option.eq(index).addClass('type5Click');
                    this.answer.push(index); //把当前选中的索引放到数组里
                    this.vacancyArr.push(index2)  //把当前选中的内容放到数组里
                }
                $('.vacancy').html('');  //填空前先清空填空的内容
                $.each(this.vacancyArr,function(index,val){
                    $('.vacancy').eq(index).html(val);  //遍历内容数组并复制给相应个填空
                })
            },
            /*回到首页*/
            btnAgain:function(){
                this.endShow=true;  //末尾页出现
                this.startShow=false; //首页出现
                this.listsId=0;     //页码恢复初始
            },
            /*点击判断正误*/
            judgeClick1:function(){
                this.judgeTrue=1;
                this.judgeFalse=0;
            },
            judgeClick2:function(){
                this.judgeFalse=1;
                this.judgeTrue=0;
            }
        }
    });


});
