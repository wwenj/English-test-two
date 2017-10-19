$(function () {
    var app = new Vue({
        el: "#app",
        data: {
            startShow: false,    //初始第一页的显示
            endShow: true,      //末尾页的显示
            contentShow: true, //做题内容页的显示
            questionList: [],   //lists对象数组
            question_type: [],  //问题种类type的标题
            listsId: 0,         //当前做题页码第一页是0
            select: '',       //答题的结果对错
            finish: {},         //结尾页json数据
            judgeTrue: 0,        //判断题对勾选项
            judgeFalse: 0,       //判断题叉选项
            annId: -1,          //单选选中答案索引
            answer: [],           //多选答案顺序数组
            vacancyCon: '',       //单选填空显示单词
            vacancyArr: []        //多选填空显示单词
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
            prveClick: function () {
                if (this.listsId == 0) {
                    this.startShow = false;  //初始页出现
                    this.contentShow = true; //做题也隐藏
                } else {
                    this.listsId -= 1;
                }
            },
            /*下一题点击*/
            nextClick: function () {
                if (this.listsId == this.questionList.length - 1) {  //到达最后一页
                    this.contentShow = true; //做题页隐藏
                    this.endShow = false;//末尾页出现
                    this.selectAnswer();//最后一页多选
                    this.finishget();//最后一页get提交获取成绩评分
                } else {
                    if (this.questionList[this.listsId].type == 4) { //判断题答案
                        this.judgeAnswer();
                        this.clearAll();    //清除选中
                    } else if (this.questionList[this.listsId].type == 5) {//单选答案
                        this.RadioAnswer();
                        this.clearAll();    //清除选中
                    } else if (this.questionList[this.listsId].type == 6) {//多选答案
                        this.selectAnswer();
                    }
                }
            },
            /*清除判断/单选/多选的选中状态*/
            clearAll: function () {
                this.judgeFalse = 0; //清空判断选中状态
                this.judgeTrue = 0; //清空判断选中状态
                this.answer = [];  //清空多选答案数组
                this.annId = -1;   //恢复单选选项
                this.vacancyCon = '';//单选填空清空
                this.vacancyArr = [];//多选的填空清空
                this.select = ''    //本题post请求对错清除
            },
            /*判断题答案验证*/
            judgeAnswer: function () {
                if (this.judgeTrue == 1 && this.judgeFalse == 0) {  //所选答案
                    judgeAn(0); //选√时传0，
                    this.listsId += 1; //页码加1
                } else if (this.judgeTrue == 0 && this.judgeFalse == 1) {
                    judgeAn(1);
                    this.listsId += 1; //页码加1
                } else {
                    alert('您未作出判断');
                }

                function judgeAn(stemIndex) {  //判断答案验证stemIndex为选择的√×
                    var thisId = app.questionList[app.listsId].data.id; //获取当前题的id
                    if (app.questionList[app.listsId].data.stem[stemIndex].istrue == 1) {
                        app.select = 'ok'; //判断当前选择答案是否正确
                        app.answerPost(thisId, app.select, stemIndex);//本题信息post
                    } else {
                        app.select = 'error';
                        app.answerPost(thisId, app.select, stemIndex)

                    }
                }
            },
            /*单选题答案验证*/
            RadioAnswer: function () {
                if (this.annId == -1) {
                    alert('您未作出选择');
                } else {
                    var thisId = this.questionList[this.listsId].data.id; //获取当前题的id
                    var selected = (this.annId + 1) + '=' + this.vacancyCon;//获取当前选择答案的索引+内容
                    if (this.questionList[this.listsId].data.stem[this.annId].istrue == 1) {
                        this.select = 'ok';
                        this.answerPost(thisId, this.select, selected);
                    } else {
                        this.select = 'error';
                        this.answerPost(thisId, this.select, selected);
                    }
                    this.listsId += 1; //页码加1
                }
            },
            /*多选题答案验证*/
            selectAnswer: function () {
                if (this.answer.length < 6) {
                    alert('填空未填满');
                } else {
                    var answerNum = this.answer.join('');   //把数组元素拼接成字符串
                    var thisId = this.questionList[this.listsId].data.id; //获取当前题的id
                    //把索引数组与内容数组遍历取出，对象字符串拼接重组数组，对数组join()分割-----
                    var selected = [];
                    for (var i = 0; i <= 5; i++) {
                        selected[i] = (this.answer[i] - 1) + '=' + this.vacancyArr[i]
                    }
                    var selected2 = selected.join('&');
                    //--------------------------------------------------------------------
                    if (this.questionList[this.listsId].data.answer == answerNum) {
                        this.select = 'ok';
                        this.answerPost(thisId, this.select, selected2)
                    } else {
                        this.select = 'error';
                        this.answerPost(thisId, this.select, selected2)
                    }
                    this.listsId += 1; //页码加1
                    this.clearAll();    //多选题确定能到下一页是才清除选中
                }
            },
            /*单选点击选项*/
            type5Click: function (index) {
                $('.type5-option').eq(index).addClass('type5Click').siblings().removeClass('type5Click');
                this.annId = index;   //当前单选的索引
                this.vacancyCon = $('.type5-option').eq(index).html();//单选选中内容赋值
            },
            /*多选点击选项*/
            type6Click: function (index) {
                var option = $('.type5-option');
                var index2 = option.eq(index).html(); //当前点击的选项内容
                if (option.eq(index).hasClass('type5Click')) { //判断是否选中
                    option.eq(index).removeClass('type5Click');

                    this.answer.splice($.inArray(index + 1, this.answer), 1);//删除内容为index的元素
                    this.vacancyArr.splice($.inArray(index2, this.vacancyArr), 1);
                } else {
                    option.eq(index).addClass('type5Click');
                    this.answer.push(index + 1); //把当前选中的索引放到数组里
                    this.vacancyArr.push(index2)  //把当前选中的内容放到数组里
                }
                $('.vacancy').html('');  //填空前先清空填空的内容
                $.each(this.vacancyArr, function (index, val) {
                    $('.vacancy').eq(index).html(val);  //遍历内容数组并复制给相应个填空
                })
            },
            /*判断点击选项*/
            judgeClick1: function () {
                this.judgeTrue = 1;
                this.judgeFalse = 0;
            },
            judgeClick2: function () {
                this.judgeFalse = 1;
                this.judgeTrue = 0;
            },
            /*回到首页*/
            btnAgain: function () {
                this.endShow = true;  //末尾页出现
                this.startShow = false; //首页出现
                this.listsId = 0;     //页码恢复初始
            },
            /*点击下一题对当前答题信息post提交*/
            answerPost: function (id, select, selected) {
                $.ajax({
                    url: "http://test.zhituteam.com/index.php/home/api/ajaxHandle",
                    type: "post",
                    dataType: "json",
                    data: {
                        id: id,
                        select: select,
                        selected: selected
                    },
                    success: function () {
                        // console.log('提交本题post请求');
                    },
                    error: function () {
                        alert("本题POST信息请求出错！");
                    }
                })
            },
            /*答题结束请求最后结果成绩*/
            finishget: function () {
                $.ajax({
                    url: "http://test.zhituteam.com/index.php/home/api/finish",
                    // url: "./json/finish.json",
                    type: "get",
                    dataType: "json",
                    data: {
                        type: 2,
                        level: 94,
                        lesson: 1360,
                        question_flag: 2
                    },
                    success: function (res) {
                        app.finish = res.result //答题结果数据
                    },
                    error: function () {
                        alert("成绩信息请求错误");
                    }
                })
            }
        }
    });
});
