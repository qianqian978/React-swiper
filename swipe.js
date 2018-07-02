/**
 * React Swipe轮播基础组件
 *
 **@author liuyutong
 *
 **@props
 	-data
    	-dataid : {Number} | 组件id
    	-now : {Number} | 1(默认),从第几项开始播放，序号从1开始
    	-interval : {Number} | 2000（默认），动画结速后的停顿时间，单位毫秒
    	-speed: {Number} | 300（默认），动画速度，单位毫秒
    	-noAnimate: {Boolean} | false（默认），是否取消动画效果
    	-height: {String} | 自适应（默认），强制定义组件高度
    	-opType: {"right",""} | ""（默认），操作按钮是否在右侧
    	-nobottom: {Boolean} | false（默认），是否不显示操作按钮
 	-children|jsx结构说明
		要求拥有相同结构的子节点序列
		eg:
		<div style={{background:"#000"}}>1</div>
    	<div style={{background:"red"}}>2</div>
    	<div style={{background:"pink"}}>3</div>
 **@return
	-method {Function} (对外开放的方法.必选参数前面带＊，非必选项目请备注默认值）
    	-animateStop  | 动画停止
    	-animateStart  | 动画开始
    	-animateNext  | 下一页
    	-animatePre  | 上一页
    	-setNow(n) | 修改当前展示的项为序号n
    	-getNow | 获得当前展示项的序号
 **@example
  	<Swipe data={{height:"280px"}} >
            <div className="swiper" style={{background:"#000"}}>1</div>
            <div className="swiper" style={{background:"red"}}>2</div>
            <div className="swiper" style={{background:"pink"}}>3</div>
    </Swipe>
**/
require("./swipe.scss");
var Swipe = (function(){
		var data,dataid;
		var support_css3 = (function() {//判定是否支持css3
			var div = document.createElement('div'),
				vendors = 'Ms O Moz Webkit'.split(' '),
				len = vendors.length;

			return function(prop) {
				if ( prop in div.style ) return true;

				prop = prop.replace(/^[a-z]/, function(val) {
					return val.toUpperCase();
				});

				while(len--) {
					if ( vendors[len] + prop in div.style ) {
						return true;
					}
				}
				return false;
			};
		})();
		var onlyRandom = function ()  {
			var ran =Math.ceil(Math.random() * 1000);
			if (window[ran]){
				return onlyRandom();
			}else{
                window[ran + "ran"] = true;
				return ran;
			}
        };
		var buttonClick =function(event){
			var that = this;
			var target = event.target,data=S.get(this.state.dataid);
			var id = Number($(target).attr("data-b-id"));
            $(this.refs.touchswipe).css("transition","all "+ this.state.speed/1000 +"s");
            moreTime = this.state.speed*2;
			this.animateStop();
			this.setState({now:id});
			setTimeout(function () {
                animate.setPos.call(that,(id-1)*data.width);
                console.log((id-1)*data.width);
            }, 20);
			if (!this.state.noAnimate){
                this.animateStart();
			}

			//data._initState =true;
		}
		var clear = function(ani,poll){
			clearTimeout(poll[ani]);
			clearInterval(poll[ani]);
			poll[ani] = "";

		}
		var isSupport = support_css3("animation")&&support_css3("transition")&&support_css3("transform");//是否支持css3

	    var moreTime = 0 ;//片段动画时间

		var dragEvent = {
				touchstart : function(e){
					var data = S.get(this.state.dataid);
					data.touchstate = "start";//touch事件状态，start，move，end
                    this.animateStop();
					data.touchmode = {
						x :e.changedTouches[0].pageX,
						y:e.changedTouches[0].pageY,
						xs : data.x
					}

				},
				touchmove:function(e){
					var data = S.get(this.state.dataid);
					if(data.touchstate != "move"){
						var moveY = data.touchmode.y - e.changedTouches[0].pageY;
						var moveX = data.touchmode.x - e.changedTouches[0].pageX;
						if(moveY<5&&moveY>-5&&(moveX>5||moveX<-5)) {
							data.touchstate="move";
							e.preventDefault();
							//this.animateStop();
						}
					}
					if(data.touchstate == "move"){

						data.x = data.touchmode.xs-(e.changedTouches[0].pageX-data.touchmode.x);
						if(data.x<0){
							data.x = this.state.length*data.width+data.x;
						}
						this.setPos(data.x);
						this.setState({now:this.getNow()})
					}
				},
				touchend:function(e){
					var data = S.get(this.state.dataid);

					if(data.touchstate == "move"){
						data.touchstate = "end";//touch事件状态，start，move，end
						var xd = data.touchmode.xs-data.x;
						if(xd>10||xd<-(data.width*(this.state.length-1))){
							this.animatePre(!this.state.noAnimate);
						}else{
							this.animateNext(!this.state.noAnimate);
						}
						data._initState = true;
					}

				}
			}
		var animate ={
			getNow : function(){
				var data = S.get(this.state.dataid),now;
				now = Math.ceil((data.x+1)/data.width);
				if(now>this.state.length){now=1}
				if(data.x<0){now = this.state.length}
				return now;
			},
			setNow:function(n){
				var data =S.get(this.state.dataid);
				this.animateStop();
				this.setState({now:n})
				animate.setPos.call(this,(n-1)*data.width);
				data._initState =true;
				this.animateStart();
			},
			stop : function(){//console.log("stop");
				var me = this,data=S.get(this.state.dataid);
				for(var key in data.poll){
					clear(key,data.poll);
				}
				if (isSupport){
					$(this.refs.touchswipe).css("animation-play-state","paused");
                    //console.log(this.refs.touchswipe.getBoundingClientRect().left);
                    me.setPos(-this.refs.touchswipe.getBoundingClientRect().left);
                    $(this.refs.touchswipe).css("animation-play-state","");
                    $(this.refs.touchswipe).css("animation","");
				}

			},

			setPos:function(x){//更新位置
				S.set(this.state.dataid,{x:x});//记录当前的位置
				this.setState({translateText : "translateX(-"+x+"px)"});//
			},
			next : function(nostop){
                var me=this,data = S.get(this.state.dataid),now,speed;
                data._initState = false;
                data._animateS = new Date;
                now = me.state.now;
                speed = this.state.speed/1000;
					if (isSupport){
                        $(this.refs.touchswipe).css("transition","");
						//console.log(now);
						var nowPlace = (now-1)*data.width;
                        var newPlace = now*data.width;
						if (data.x-5 > nowPlace && data.x - 5 < newPlace){
                            speed = Math.abs(speed*(data.x - newPlace)/data.width) ;
                            moreTime = speed *1000;
                        }
                        if (now == 1 && data.x - 5 > newPlace){
                            nowPlace = data.x - me.state.length*data.width;
                            speed = Math.abs(speed*(nowPlace - newPlace)/data.width);
                            moreTime = speed *1000;
						}else{
                            nowPlace = data.x-5 > nowPlace ? data.x : nowPlace;
						}
						var keyframeString = "@keyframes next"+ now + me.ran +" {" +
                            "            from {" +
                            "                transform: translateX(-"+ nowPlace +"px);" +
                            "            }" +
                            "            to{" +
                            "                transform: translateX(-"+ newPlace +"px);" +
                            "            }" +
                            "        }",
                            animationString = "next" + now + me.ran +" "+ speed +"s linear";
                        me.styleTag.innerHTML = keyframeString;
                        $(this.refs.touchswipe).css("animation",animationString);
                        //console.log(newPlace)
                        me.setPos(newPlace);
                        if (now==me.state.length){
                            me.setState({now:1});
						}else {
                            me.setState({now:now+1});
						}
                       if(nostop) {me.animateStart();}


					}else {
                        data.poll.nextInterval = setInterval(function(){
                            if(data.x+data.perD>now*data.width||new Date-data._animateS>data.config.speed){
                                if(me.state.now==me.state.length){
                                    me.setState({now:1});
                                    data.x = 0;

                                }else{
                                    me.setState({now:me.state.now+1});
                                    data.x = now*data.width;
                                }
                                clear("nextInterval",data.poll);
                                if(nostop) {me.animateStart();}
                            }else{
                                data.x += data.perD;
                            }

                            me.setPos(data.x);
                        },25)
					}
					return false;
			},
			pre : function(nostop){
				var now = this.state.now,me = this,data = S.get(this.state.dataid);
				animate.stop.call(this);
				data._animateS = new Date;
                var speed = this.state.speed/1000;
				if (isSupport){
                    $(this.refs.touchswipe).css("transition","");
					var nowPlace = (now-1)*data.width;
                    var newPlace = (now-2)*data.width;
                    if (data.x-5 > nowPlace ){
                        newPlace = nowPlace;
                        nowPlace = data.x;
                        speed = Math.abs(speed*(data.x - newPlace)/data.width) ;
                        moreTime = speed *1000;
                    }else if (now == 1){
                        nowPlace = me.state.length*data.width;
                        newPlace = (me.state.length - 1)*data.width;
					}

                    var keyframeString = "@keyframes next"+ now + me.ran +" {" +
                        "            from {" +
                        "                transform: translateX(-"+ nowPlace +"px);" +
                        "            }" +
                        "            to{" +
                        "                transform: translateX(-"+ newPlace +"px);" +
                        "            }" +
                        "        }",
                        animationString = "next" + now + me.ran +" "+ speed +"s linear";

                    me.styleTag.innerHTML = keyframeString;
                    $(this.refs.touchswipe).css("animation",animationString);
                    //console.log(newPlace)
                    me.setPos(newPlace);
                    if (data.x-5 > nowPlace){
                        me.setState({now:now});
                    }else {
                        me.setState({now:now-1});

                    }
                    if(nostop) {me.animateStart();}
				}else{
                    if(data.x == (now-1)*data.width){
                        if(now == 1){
                            now = me.state.length+1;
                            data.x = me.state.length*data.width;
                            me.setPos(data.x);
                            data._output = true;
                        }
                        data.poll.preInterval = setInterval(function(){
                            if(data.x-data.perD<(now-2)*data.width||new Date-data._animateS>data.config.speed){
                                data.x = (now-2)*data.width;
                                me.setState({now:now-1});
                                clear("preInterval",data.poll);
                                if(nostop) {me.animateStart();}
                            }else{
                                data.x -= data.perD;
                            }
                            me.setPos(data.x);
                        },25)
                    }else{
                        data.poll.preInterval = setInterval(function(){
                            if(data.x-data.perD<(now-1)*data.width||new Date-data._animateS>data.config.speed){
                                data.x = (now-1)*data.width;
                                clear("preInterval",data.poll);
                                if(nostop) {me.animateStart();}
                            }else{
                                data.x -= data.perD;
                            }
                            me.setPos(data.x);
                        },25)
                    }
				}
			},
			start : function(){//console.log("start");
				var me = this,
				data=S.get(this.state.dataid);
				var interval = Number(data.config.interval)+Number(data.config.speed),initInterval;
                isSupport||animate.stop.call(this);

				if(data._initState ){
					data._initState = false;
					initInterval = data.config.interval;

				}else{
					initInterval = 0;
					if (isSupport){
                        initInterval = data.config.interval +  moreTime ;
					}
				}
				data.poll.start = setTimeout(function(){
					//me.setState({transformText:"transform "+data.config.speed+"ms linear"});
					animate.next.call(me);

					data.poll.interval = setInterval(function(){
						clear("nextInterval",data.poll);
						animate.next.call(me);
					},interval)
				},initInterval);
			}
		}
		return  React.createClass({
			config : {//组件默认参数
				now : 1,//从第几项开始轮播
				speed : 300 ,//默认轮播速度
				interval:2000//默认停留时间
			},
			initData : function(){
				var obj = new Object();
				return obj = {
					touchstate : "end",//touch状态，start,end,moving
					_initState: true,//计数器
					_num1:0,//计数器
					_num2:0,//计数器
					config : {
						interval : this.props.data.interval?this.props.data.interval:this.config.interval,
						now : this.props.data.now?this.props.data.now:this.config.now,
						speed : this.props.data.speed?this.props.data.speed:this.config.speed,
						length :this.props.children.length
					},
					poll :{}
				}
			},
			getInitialState : function(){
                	this.ran = onlyRandom();
					if(isSupport){//如果支持css3 就生成一个用来动态生成动画的style标签
						var styleTag = document.createElement("style");
						styleTag.id = "animateStyle" + this.ran;
						styleTag.type = "text/css";
						document.body.appendChild(styleTag);
						this.styleTag = styleTag;
					}

					var dataid = this.props.data.dataid?this.props.data.dataid:S.add(),
					data = S.set(dataid,this.initData());
					data.plugin = this;
					$(window).bind("resize",this.resize);
					return {
						//transformText : "",
						dataid:dataid,
						translateText : "translateX(0px)",
						speed :data.config.speed,
						now : data.config.now,
                        length:data.config.length,
						interval : data.config.interval,
						dragxid : S.add(),
						noAnimate : this.props.data.noAnimate?true:false,
                        children:this.props.children
					};
			},
			animatePre:animate.pre,
			animateStop:animate.stop,
			animateNext:animate.next,
			animateStart:animate.start,
			setNow : animate.setNow,
			setPos : animate.setPos,
			getNow : animate.getNow,
			componentWillUpdate : function(){
				var data = S.get(this.state.dataid);
				data.config.interval = this.state.interval;
				data._num1=0;
				data._num2=0;
			},
			componentDidMount:function(){
				if(!this.props.data.noAnimate)this.animateStart.call(this);
				var me = this;
				setTimeout(function(){
					me.resize();
					me.setPos(S.get(me.state.dataid).x);
				},1)
			},
            componentWillReceiveProps:function(newProps){
                if(newProps.children){
                    this.setState({
                        length:newProps.children.length,
                        children:newProps.children



                    });
                }

            },
			resize:function(){
				var data = S.get(this.state.dataid);
				if(!data.x) data.x = 0;
				data.trans = data.width?$(this.refs.touchswipe).width()/data.width:1;
				// 宽度取值精准到小数位-王吉
				// data.width= $(this.refs.touchswipe).width();
				data.width= parseFloat($(this.refs.touchswipe).css('width'));
				data.perD= data.width*(25+3)/data.config.speed;//每次位移,矫正速度
				data.x = data.width*(this.state.now-1)+data.x*data.trans;
			},
			render : function(){
				//React.initializeTouchEvents(true);
				if(this.state.length==1){
					return <div className="cmr-swipe">
				<div  className="cmr-swipe-main" data-id={this.state.dataid}>
					<div className="cmr-swipe-body" ref="touchswipe" style={{
					height:this.props.data.height
					}}>
						{
							React.Children.map(this.state.children,(function(child){
								var data=S.get(this.state.dataid);
								data._num1++;
								return  <div className="cmr-swipe-box"   data-b-id={data._num1} >{child}</div>
							}).bind(this))

						}
						</div>

					</div>
				</div>
				}
				return (<div className="cmr-swipe">
				<div  className="cmr-swipe-main" data-id={this.state.dataid}
				onTouchStart={dragEvent.touchstart.bind(this)}
				onTouchMove={dragEvent.touchmove.bind(this)}
				onTouchEnd={dragEvent.touchend.bind(this)}
				onResize= {this.resize}
				>
					<div className="cmr-swipe-body" ref="touchswipe" style={{
					height:this.props.data.height,
					WebkitTransform:this.state.translateText
					}}>
						{
							React.Children.map(this.state.children,(function(child){
								var data=S.get(this.state.dataid);
								data._num1++;
								return  <div className="cmr-swipe-box"   data-b-id={data._num1} >{child}</div>
							}).bind(this))

						}
						{
							React.Children.map(this.state.children,(function(child){
								var data=S.get(this.state.dataid);
								data._num1++;
								return  <div className="cmr-swipe-box"  data-b-id={data._num1}>{child}</div>
							}).bind(this))
						}
					</div>

				</div>
				<div className={(this.props.data.nobottom?"cmr-swipe-op cmr-swipe-nobottom":"cmr-swipe-op")+(this.props.data.opType=="right"?" cmr-swipe-op-right":"")}>
					{
						 React.Children.map(this.state.children,(function(child){
							var className ;
							var data=S.get(this.state.dataid);
							data._num2++;
							if(this.state.now==data._num2||this.state.now-this.state.length==data._num2){
									className = "cmr-swipe-button cmr-swipe-button-cur";
								}else{
									className = "cmr-swipe-button"
								}
							return  <div className={className}  data-b-id={data._num2} onTouchEnd={buttonClick.bind(this)}></div>
						}).bind(this))
					}
				</div>
				</div>);
			}
		})

})();

module.exports =Swipe;
