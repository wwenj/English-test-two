$(function () {
    var app = new Vue({
        el: "#app",
        data: {
            message: 1,
            startShow: true,  //初始第一页的显示
            endShow: true,     //末尾页的显示
            contentShow: false, //做题内容页的显示
            questionList: [],   //lists对象数组
            question_type: [],  //问题种类type的标题
            listsId: 0,      //显示id页码
            annId: -1,          //当前选题做出的选项
            select: 'ok',       //答题的结果对错
            finish: {}          //结尾页json数据
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
                this.listsId = 1857;  //开始页码调整到第一页
            },
        }
    });


});
