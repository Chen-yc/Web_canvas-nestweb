!function(){
    //获取设置值
    function get_attribute(obj, att, defaut){
        return obj.getAttribute(att) || defaut;
    }
    var scripts = document.getElementsByTagName("script"),
    script = scripts[0],
    scriptN = get_attribute(script, "count", 150),
    scriptC = get_attribute(script, "color", "54, 212, 228"),
    scriptZ = get_attribute(script, "zIndex", -1),
    scriptO = get_attribute(script, "opacity", 0.5);
    //鼠标位置
    var mousePoint = {
        x: null,
        y: null,
        max: 32400,
        s: 2,
    };
    //鼠标位置赋值
    window.onmousemove = function(e){
        e = e || window.event;
        mousePoint.x = e.clientX;
        mousePoint.y = e.clientY;
    },window.onmouseout = function(){     //释放鼠标位置
        mousePoint.x = null;
        mousePoint.y = null;
    };
    //canvas准备
    var canvas = document.createElement("canvas");
    var body = document.getElementsByTagName("body");//添加画布canvas
    body[0].appendChild(canvas);                     //添加画布canvas
    var context = canvas.getContext("2d");
    //canvas大小
    var canvasWidth, canvasHeigth;
    function canvas_size(){
        canvasWidth = canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        canvasHeigth = canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }
    window.onresize = canvas_size();//屏幕大小
    //产生随机点
    var size=[1,1,1,1,1,2,2,2,2,2,2,2,2,2,3,4];
    for (dot=[],i=0;i<scriptN;i++){
        var x = canvasWidth*Math.random(),
            y = canvasHeigth*Math.random(),
            dx = 2*Math.random()-1,
            dy = 2*Math.random()-1,
            max = 14400;
            s = size[Math.floor(size.length*Math.random())];//随机点大小
        dot.push({x : x, y : y, dx : dx, dy : dy, max : max, s : s});
    }
    //总数组
    var allDot = dot.concat([mousePoint]);
    //画图
        //动画更新函数
    var frame_func = window.requestAnimationFrame || window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(func) {
    window.setTimeout(func, 1000 / 60);};
        //设置属性
    canvas.style.cssText = "position:fixed;top:0;left:0;z-index:"+scriptZ+";opacity:"+scriptO;
    canvas.id = "cs";
    function drawCanvas (){
        window.onresize = canvas_size();//屏幕大小
        context.clearRect(0, 0, canvasWidth, canvasHeigth);
        for(i=0;i<scriptN;i++){
            //单点
            dot[i].x+=dot[i].dx;
            dot[i].y+=dot[i].dy;
            dot[i].dx*= (dot[i].x<0 || dot[i].x>canvasWidth ? -1:1);//碰壁 则换向
            dot[i].dy*= (dot[i].y<0 || dot[i].y>canvasHeigth ? -1:1);//碰壁 则换向
            context.fillRect(dot[i].x-dot[i].s/2,dot[i].y-dot[i].s/2,dot[i].s,dot[i].s);    //绘制点
            //多点间连结
            for(j=i+1;j<=scriptN;j++){
                if (allDot[j].x != null && allDot[j].y != null) {
                    var Dx = allDot[i].x - allDot[j].x;
                    var Dy = allDot[i].y - allDot[j].y;
                    var Ds = Dx*Dx+Dy*Dy;
                    var Ss = allDot[i].s < allDot[j].s ? allDot[i].s : allDot[j].s;//线宽系数
                        Ss = Math.round(Ss/1.4);//线宽系数概率调整
                    Ds<allDot[j].max && (allDot[j]===mousePoint && Ds>14400 && (allDot[i].x-=0.02*Dx,allDot[i].y-=0.02*Dy),//鼠标点一定范围内加速靠近
                                    w = Ss*(1-1*Ds/allDot[j].max),  //连线的线宽及其透明度 参数
                                    context.beginPath(),
                                    context.lineWidth = 2*w,
                                    context.strokeStyle = "rgba("+scriptC+","+w+")",
                                    context.moveTo(allDot[i].x,allDot[i].y),
                                    context.lineTo(allDot[j].x,allDot[j].y),
                                    context.stroke()
                                    )
                }            
            }   
        }
        frame_func(drawCanvas);//回调重绘
    }

    //运行
    setTimeout(drawCanvas(),200);
}();
