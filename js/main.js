$(function(){
    var app=new Vue({
		el:"#app",
		data:{
            startShow:false,    //初始第一页的显示
            contentShow:true,   //做题内容页的显示
            questionList:[],     //lists对象数组
            question_type:[],     //问题种类type的标题
            listsId:1857          //显示id页码
		},
        mounted:function(){
			this.getQuestionList();
		},
        methods:{
            getQuestionList:function(){
            	$.ajax({
                    url: "http://test.zhituteam.com/index.php/home/api/getquestion",
                    type: "get",
                    dataType: "json",
                    data:{
                        type:1,
						level:79,
						lesson:1339,
						question_flag:1
                    },
                    success:function(res){
                        app.questionList=res.result.lists;
                        app.question_type = res.result.question_type;
					},
                    error:function(){
                        alert("请求错误");
                    }
				})
			},
            /*初始页点击start*/
            starBtn:function(){
                this.startShow=true;
                this.contentShow=false;
            },
            /*点击变换按钮外形*/
            playChage:function(){
                $(".playTop").css("background-position","-326px -115px")
                $("audio")[0].play();
            },
            prveClick:function(){
                if (this.listsId==1857){
                    this.startShow=false;
                    this.contentShow=true;
                }else{
                    this.listsId-=1
                }
            },
            nextClick:function(){
                this.listsId+=1
            }

		}


















    });
});
