$(function(){
    var app=new Vue({
		el:"#app",
		data:{
            startShow:false,    //初始第一页的显示
            endShow:true,     //末尾页的显示
            contentShow:true, //做题内容页的显示
            questionList:[],   //lists对象数组
            question_type:[],  //问题种类type的标题
            listsId:1876,      //显示id页码
            annId:-1,          //当前选题做出的选项
            select:'ok',       //答题的结果对错
            finish:{}          //结尾页json数据
		},
        mounted:function(){
			this.getQuestionList();
		},
        methods:{
            /*初始数据ajax请求*/
            getQuestionList:function(){
            	$.ajax({
                    url: "http://test.zhituteam.com/index.php/home/api/getquestion",
                    // url: "./json/first.json",
                    type: "get",
                    dataType: "json",
                    data:{
                        type:1,
						level:79,
						lesson:1339,
						question_flag:1
                    },
                    success:function(res){
                        app.questionList=res.result.lists; //题目列表
                        app.question_type = res.result.question_type; //题型列表
					},
                    error:function(){
                        alert("请求错误");
                    }
				})
			},
            /*初始页点击start*/
            starBtn:function(){
                this.startShow=true;  //初始页隐藏
                this.contentShow=false; //做题也出现
                this.listsId=1857;  //开始页码调整到第一页
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
            /*点击选中四个选项*/
            fourOptionClick:function(index){
                $('.fourOption').eq(index).css('border','1px solid #59ba77').siblings().css('border','1px solid rgba(255,255,255,0)')
                this.annId=index;   //当前做出的选项
            },
            /*点击上一题*/
            prveClick:function(){
                if (this.listsId==1857){
                    this.startShow=false;
                    this.contentShow=true;
                }else{
                    this.listsId-=1  //页码减一
                }
            },
            /*点击下一题*/
            nextClick:function(){
                if(this.listsId>1863&&this.annId==-1){ //如果未选择
                    alert('请选择一项');
                }else{
                    if(this.listsId<1864){  //如果是第一部分无需选择
                        this.listsId+=1;    //页码加1
                        this.select='ok';
                        this.ajaxPost(this.listsId-1,this.select,0);
                    }else if(this.listsId>=1876) {  //如果到了最后一页选题有两个请求
                        this.listsId+=1;
                        this.thatTrue();
                        this.ajaxPost(this.listsId-1,this.select,1);
                        this.finishget();

                        this.endShow=false;//使末尾页出现
                        this.contentShow=true;//做题页隐藏
                    } else{ //如果是有选择的部分
                        this.listsId+=1;    //页码加1
                        this.thatTrue();
                        this.ajaxPost(this.listsId-1,this.select,1);
                    }
                }
            },
            /*判断本题选中选项是否正确*/
            thatTrue:function(){
                if(this.questionList[this.listsId-1858].data.stem[this.annId].istrue==1){
                    this.select='ok';//判断当前页你所选择的选项下有istrue属性并等于1
                }else{
                    this.select='error';
                }
                this.annId=-1;  //下一题后选项设为初始-1
            },
            /*每次答完题提交结果信息的post请求*/
            ajaxPost:function(id,select,selected){
                $.ajax({
                    url: "http://test.zhituteam.com/index.php/home/api/ajaxHandle",
                    type: "post",
                    dataType: "json",
                    data:{
                        id:id,
                        select:select,
                        selected:selected
                    },
                    success:function(){
                        // console.log('提交本题post请求');
                    },
                    error:function(){
                        alert("本题POST数据提交出错！");
                    }
                })
            },
            /*答题结果数据请求*/
            finishget:function(){
                $.ajax({
                    url: "http://test.zhituteam.com/index.php/home/api/finish",
                    // url: "./json/finish.json",
                    type: "get",
                    dataType: "json",
                    data:{
                        type:1,
                        level:79,
                        lesson:1339,
                        question_flag:1
                    },
                    success:function(res){
                        app.finish=res.result //答题结果数据
                    },
                    error:function(){
                        alert("结束页请求错误");
                    }
                })
            },
            /*再做一遍按钮*/
            btnAgain:function(){
                this.endShow=true;  //末尾页隐藏
                this.startShow=false;  //初始页出现
            }

		}


















    });
});
