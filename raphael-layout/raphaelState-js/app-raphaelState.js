(function($){
    var _setting, _consts, _tool;
    _setting = {
        options:null,
        canvas:null,
        raphaelData:null
    };
    _tool = {
        //获取节点状态颜色
        getNodeStateColor(state){
            var state_color;
            switch(state){
                case "1":
                    state_color = _setting.options.style.state_color[0];
                    break;
                case "2":
                    state_color = _setting.options.style.state_color[1];
                    break;
                case "3":
                    state_color = _setting.options.style.state_color[2];
                    break;
                case "4":
                case "5":
                case "6":
                case "7":
                case "20":
                case "21":
                    state_color = _setting.options.style.state_color[3];
                    break;
            }
            return  state_color;
        },
        //得到节点文字的位置
        getTextPosition(bgnode){
            var nodeBoxInfo = bgnode.getBBox();
            var x = nodeBoxInfo.x + nodeBoxInfo.width/2;
            var y = nodeBoxInfo.y + nodeBoxInfo.height/2;
            return {'x': x, 'y': y};
        },
        //得到状态文本
        getStateText(nodeData){
            var state_text;
            switch(nodeData.serState){
                case "1":
                    state_text = "未启动";
                    break;
                case "2":
                    state_text = "启动中";
                    break;
                case "3":
                    state_text = "运行中";
                    break;
                case "4":
                    state_text = "停止";
                    break;
                case "5":
                    state_text = "升级中";
                    break;
                case "6":
                    state_text = "启动失败";
                    break;
                case "7":
                    /*state_text = "升级失败";*/
                    state_text = "异常";
                    break;
                case "20":
                    state_text = "异常";
                    break;
                case "21":
                    state_text = "停止中";
                    break;
            }
            return  state_text;
        },
        //得到时间文本
        getTimeText(nodeData){
            var time ="";
            if(nodeData.startTime != null && nodeData.endTime != null
                &&  nodeData.startTime != "null" && nodeData.endTime !="null"
                &&  nodeData.startTime != undefined && nodeData.endTime !=undefined
                &&  nodeData.startTime.length > 0 && nodeData.endTime.length > 0
            ){
                time = _tool.getDiffTime(Number(nodeData.startTime),Number(nodeData.endTime));
            }
            return time == ""? "" : "耗时  " + time;
        },
        //获取组成箭头的三条线段的路径
        getArr(x1, y1, x2, y2, size) {
            var angle = Raphael.angle(x1, y1, x2, y2);//得到两点之间的角度
            var a45 = Raphael.rad(angle - 45);//角度转换成弧度
            var a45m = Raphael.rad(angle + 45);
            var x2a = x2 + Math.cos(a45) * size;
            var y2a = y2 + Math.sin(a45) * size;
            var x2b = x2 + Math.cos(a45m) * size;
            var y2b = y2 + Math.sin(a45m) * size;
            var result = ["M", x1, y1, "L", x2, y2, "L", x2a, y2a, "L", x2b, y2b, "L", x2, y2];
            return result;
        },
        //得到关系线path
        getLinePath(lineData){
            var nodesData = _setting.raphaelData.nodes;
            var startPosition,endPosition,path,endData;
            nodesData.map(function(nodeData,index){
                if(nodeData.nodeId == lineData.startNodeId){
                    startPosition = {"x":nodeData.x,"y":nodeData.y};
                }else if(nodeData.nodeId == lineData.endNodeId){
                    endPosition = {"x":nodeData.x,"y":nodeData.y};
                    endData = nodeData;
                }
            });
            endPosition = _tool.getEndEdgePosition(startPosition.x,startPosition.y,endPosition.x,endPosition.y);
            path=_tool.getArr(startPosition.x,startPosition.y,endPosition.x,endPosition.y,_setting.options.size.arrow_size);
            return path;
        },
        //得到关系线与被指向节点的交叉点
        getEndEdgePosition(x1, y1, x2, y2){
            var br = _setting.options.size.node_r + _setting.options.size.node_b;//圆形半径+边框宽度
            var angle = 180 - Raphael.angle(x1, y1, x2, y2);
            var gap_y = Math.abs(Math.sin(Raphael.rad(angle))*br);
            var gap_x = Math.sqrt(Math.pow(br,2) - Math.pow(gap_y,2));

            edge_x = x1 < x2?(x2 - gap_x):(x2 + gap_x);
            edge_y = y1 < y2?(y2 - gap_y):(y2 + gap_y);
            return {"x":edge_x,"y":edge_y}
        },
        //时间单位转换
        getDiffTime(startDate, endDate) {
            var diff=endDate - startDate;//时间差的毫秒数

            //计算出相差天数
            var days=Math.floor(diff/(24*3600*1000));

            //计算出小时数
            var leave1=diff%(24*3600*1000);    //计算天数后剩余的毫秒数
            var hours=Math.floor(leave1/(3600*1000));
            //计算相差分钟数
            var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
            var minutes=Math.floor(leave2/(60*1000));

            //计算相差秒数
            var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
            var seconds=Math.round(leave3/1000);

            var returnStr = seconds + "s";
            if(minutes>0) {
                returnStr = minutes + "m" + returnStr;
            }
            if(hours>0) {
                returnStr = hours + "h" + returnStr;
            }
            if(days>0) {
                returnStr = days + "d" + returnStr;
            }
            return returnStr;
        }
    };
    _consts = {
        //创建底层图形
        createBaseNode(nodeData){
            var node,
                x = nodeData.x,
                y = nodeData.y,
                state = nodeData.serState,
                r = _setting.options.size.node_r,
                canvas = _setting.canvas;
            var attr = {
                'stroke': _tool.getNodeStateColor(state),
                'stroke-width': _setting.options.size.node_b,
                'fill': '#fff'
            };
            node = canvas.circle(x, y, r);
            node.attr(attr);
            return node;
        },
        //创建节点文字
        createNodeText(nodeData, bgnode){
            var nodeName = nodeData.nodeName,
                nodeState = _tool.getStateText(nodeData),
                nodeTime = _tool.getTimeText(nodeData),
                position = _tool.getTextPosition(bgnode),
                canvas = _setting.canvas,
                nameText = canvas.text(position.x, position.y - 12, nodeName).attr({
                    'text-anchor': 'middle',
                    'font-size': '12px',
                    'font-family': 'MicrosoftYaHei-Bold',
                    /* 'font-weight': 'bolder', */
                    'fill': '#3f3f3f'
                }),
                stateText = canvas.text(position.x, position.y + 5, nodeState).attr({
                    'text-anchor': 'middle',
                    'font-size': '12px',
                    'font-family': 'MicrosoftYaHei-Bold',
                    /* 'font-weight': 'bolder', */
                    'fill': '#3f3f3f'
                }),
                timeText = canvas.text(position.x, position.y + 24, nodeTime).attr({
                    'text-anchor': 'middle',
                    'font-size': '12px',
                    'font-family': 'MicrosoftYaHei-Bold',
                    /* 'font-weight': 'bolder', */
                    'fill': '#a8a8a8'
                });
            /*  return shapeText; */
        }
    };
    $.fn.raphaelState=function(options1,getData){
        if (arguments.length === 1) {
            getData=options1;
            options1={};
        }
        var canvasid=this.attr("id");
        if (canvasid == null)return;
        var options=$.extend(true,{},$.fn.raphaelState.defaults,options1);
        if(options.size.canvas_w == "100%"){
            this.css({"overflow-x":"hidden","box-sizing":"content-box"});
        }else{
            this.css("overflow-x","auto");
        }
        if(options.size.canvas_h == "100%"){
            this.css({"overflow-y":"hidden","box-sizing":"content-box"});
        }else{
            this.css("overflow-y","auto");
        }
        var raphaelData=$.isFunction(getData) ? getData() : getData;
        if(raphaelData.nodes == null || raphaelData.nodes == undefined || raphaelData.nodes.length == 0 ){
            return;
        }
        _setting.options=options;
        _setting.canvas = new Raphael(canvasid, options.size.canvas_w, options.size.canvas_h);
        _setting.raphaelData = raphaelData;
        var tagOperation={
            /* 创建节点 */
            addNodes:function(nodesData){
                nodesData.map(function(nodeData,index){
                    nodeData.x=Number(nodeData.x);
                    nodeData.y=Number(nodeData.y);
                    nodeData.serState=String(nodeData.serState);
                    nodeData.startTime=String(nodeData.startTime);
                    nodeData.endTime=String(nodeData.endTime);
                    var bgnode = _consts.createBaseNode(nodeData);
                    var tnNode = _consts.createNodeText(nodeData, bgnode);
                });
            },
            /* 创建关系线 */
            addLines:function(linesData){
                linesData.map(function(lineData,index){
                    var path=  _tool.getLinePath(lineData);
                    var cline = _setting.canvas.path(path).attr({
                        'stroke-width': _setting.options.size.line_w,
                        'stroke': _setting.options.style.color_arrow,
                        'fill': _setting.options.style.color_arrow,
                        'stroke-opacity': 0.6,
                        'fill-opacity': 0.6,
                    }).toBack();
                });
            },
        };

        tagOperation.addNodes(raphaelData.nodes);
        if(raphaelData.lines != null || raphaelData.lines != undefined || raphaelData.lines.length > 0 ){
            tagOperation.addLines(raphaelData.lines);
        }
    };
    $.fn.raphaelState.defaults = {
        size:{
            canvas_w: 1900, //画布宽度
            canvas_h: 1500, //画布高度,
            node_r: 50,//节点半径
            node_b: 4,//节点边框宽度
            line_w: 3,//线宽度
            arrow_size: 10//箭头大小
        },
        style:{
            state_color:["#b8b8b8","#67b1ff","#00cc00","#ff3333"],
            /* color_stop:"#b8b8b8",
            color_up:"#67b1ff",
            color_run:"#00cc00",
            color_fail:"#ff3333", */
            color_arrow:"#acb0b5"//箭头颜色
        }
    }
})(jQuery)