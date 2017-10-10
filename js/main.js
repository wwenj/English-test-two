$(function(){
    var app=new Vue({
		el:"#app",
		data:{
            startShow:true,    //初始第一页的显示
            contentShow:false,   //做题内容页的显示
            questionList:[],     //lists对象数组
            question_type:[],     //问题种类type的标题
            listsId:1864,         //显示id页码
            annId:0                //当前选题做出的选项
		},
        mounted:function(){
			this.getQuestionList();
		},
        methods:{
            getQuestionList:function(){
            	$.ajax({
                    // url: "http://test.zhituteam.com/index.php/home/api/getquestion",
                    url: "./json/first.json",
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
            playChage:function(playId,audioId,index){   //点击节点，音频节点，当前点击的index
                var playTop=$(playId);
                var audioTitle=$(audioId);
                playTop.eq(index).css("background-position","-326px -115px");   //代表点击图片
                audioTitle[index].play();   ///播放
                audioTitle.on('ended',function(e){   //播放完毕变回事件
                    playTop.css("background-position","-326px -15px");
                });
            },
            fourOptionClick:function(index){
                $('.fourOption').eq(index).css('border','1px solid #59ba77').siblings().css('border','1px solid rgba(255,255,255,0)')
                this.annId=index;   //当前做出的选项
            },

            /*点击左右*/
            prveClick:function(){
                if (this.listsId==1857){
                    this.startShow=false;
                    this.contentShow=true;
                }else{
                    this.listsId-=1
                }
            },
            nextClick:function(){
                this.listsId+=1;    //页码加1
                var inidexId=this.listsId-1858;     //当前题目页数，对应当前lists索引
                if(this.questionList[inidexId].data.stem[this.annId].istrue==1){
                    alert('正确')
                }else{
                    alert('错误')
                }


            }

		}


















    });
});
