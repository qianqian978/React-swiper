# React-swiper
React swiper轮播组件

<div>调用示例：</div>
  
```jsx
var SwipeInit = React.createClass({
        animateStop:function(){
           this.refs.swipe.animateStop();
        },
        render: function(){
            return (
              <div>
                <h2 onClick={this.animateStop}>Swipe：</h2>      
                <Swipe data={{height:"280px"}} ref="swipe" >
                  <div className="swiper" style={{background:"#000"}}>1</div>
                   <div className="swiper" style={{background:"red"}}>2</div>
                   <div className="swiper" style={{background:"pink"}}>3</div>
                </Swipe>
              </div>
            )
        }
});
ReactDOM.render(
         <SwipeInit/>,
        document.getElementById('swipe')
);
```

<div><br></div><div><br></div><div>对外暴露方法：</div><div>animateStop()</div><div>animateStart()</div><div>animateNext()</div><div>animatePre()</div><div>setPos(n)</div><div>getNow()</div><div><br></div><div>参数：</div><div>data.dataid：组件id</div><div>data.now： 1(默认),从第几项开始播放，序号从1开始</div><div>data.interval： 2000（默认），动画结速后的停顿时间，单位毫秒</div><div>data.speed：300（默认），动画速度，单位毫秒</div><div>data.noAnimate：false（默认），是否取消动画效果</div><div>data.height：自适应（默认），强制定义组件高度</div><div>data.opType：（默认），操作按钮是否在右侧</div><div>data.nobottom：false（默认），是否不显示操作按钮</div><div>data.children："jsx结构说明，要求拥有相同结构的子节点序列，eg:</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;div style={{background:""#000""}}&gt;1&lt;/div&gt;</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;div style={{background:""red""}}&gt;2&lt;/div&gt;</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;div style={{background:""pink""}}&gt;3&lt;/div&gt;"</div>
