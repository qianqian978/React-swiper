# React-swiper
React swiper组件

调用示例：
<Swipe data={{height:"280px"}} >
            <div className="swiper" style={{background:"#000"}}>1</div>	
            <div className="swiper" style={{background:"red"}}>2</div>	
            <div className="swiper" style={{background:"pink"}}>3</div>	
</Swipe>


对外暴露方法：
animateStop()
animateStart()
animateNext()
animatePre()
setPos(n)
getNow()

参数：
data.dataid：组件id
data.now： 1(默认),从第几项开始播放，序号从1开始
data.interval： 2000（默认），动画结速后的停顿时间，单位毫秒
data.speed：300（默认），动画速度，单位毫秒
data.noAnimate：false（默认），是否取消动画效果
data.height：自适应（默认），强制定义组件高度
data.opType：（默认），操作按钮是否在右侧
data.nobottom：false（默认），是否不显示操作按钮
data.children："jsx结构说明，要求拥有相同结构的子节点序列，eg:
                <div style={{background:""#000""}}>1</div>
                <div style={{background:""red""}}>2</div>
                <div style={{background:""pink""}}>3</div>"
