(function ($) {
    var _setting, _tool, _consts, _ring, _line, _event;
    _setting = {
        g:null,
        canvasid: null,
        canvas: null,
        cwidth: null,
        cheight: null,
        mnode: null,
        mline: null,
        rmline: null,
        nodesData: {},
        linesData: {},
        helper: {},
        grid: [],
        nodeArray: [],
        leftpadding: 150,//流程图距离浏览器最左边的距离
        toppadding: 32,//流程图距离浏览器最上边的距离
        imgSmallSize: 14,//删除按钮的大小
        imgSize: 32,//圆形上的图片大小
        imgBigSize: 30,//矩形上的图片大小
        ringSize: 12,//helper上的大小
        tagleft: 10,//标签名称离左边位置
        base: $resContextPath+'/plugin/raphael/img',
        circleFlag: true,//判断是否可以显示helper 的圆圈
        space: 5,//包围节点的图形 边距
        nodeInterval:new Map()//节点启动状态呼吸动画定时任务
    };
    _tool = {
        //创建uuid
        uuid: function () {
            var s, uuid;
            s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            uuid = s.join("").replace(/\-/g, "");
            return uuid;
        },
        //数组删除元素
        arrayRemove: function (arr, removeid) {
            if (arr != null && arr.length > 0) {
                var arr_1 = [];
                var n = 0;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != removeid) {
                        arr_1[n] = arr[i];
                        n++;
                    }
                }
                return arr_1;
            } else {
                return arr;
            }
        },
        //获取滚动条高度
        getScrollTop: function () {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        },
        numSubstring: function (num) {
            var n;
            if (num.toString().indexOf(".") != -1) {
                n = num.toString().substring(0, num.toString().indexOf(".") + 2);
                n = parseFloat(n);
            } else {
                n = num;
            }
            return n;
        },
        //获取所有的节点，并存入数组中
        getNode: function () {
            var nodesData = _setting.nodesData, nodearray = [];
            for (var nodeId in nodesData) {
                if (nodesData[nodeId] != null) {
                    nodearray.push(nodesData[nodeId]);
                }
            }
            return nodearray;
        },
        //获取节点之后的所有节点
        getNextNode: function (nodeId) {
            var t = this;
            var nextNode = [];
            var nodes = _tool.getNode();
            var currentNode = _setting.nodesData[nodeId];
            var endSet = currentNode.data("endSet");
            if (nodes.length <= 1) {
                return;
            } else if (endSet == null) {
                return;
            } else if (endSet.length <= 0) {
                return;
            } else {
                for (var i = 0; i < nodes.length; i++) {
                    for (var j = 0; j < endSet.length; j++) {
                        if (nodes[i].data("nodeId") == endSet[j]) {
                            nextNode.push(nodes[i]);
                            _setting.nodeArray.push(nodes[i]);
                        }
                    }
                }
            }
            if (nextNode.length > 0) {
                for (var k = 0; k < nextNode.length; k++) {

                    if (nextNode[k].data("endSet") != null && nextNode[k].data("endSet").length > 0) {
                        t.getNextNode(nextNode[k].data("nodeId"));
                    }
                }
            }
        },
        //改变文字的行数
        changeTextLine: function (nodeName, width) {
            var nameHtml = "";
            var num = parseInt(width * 1);
            var temp = 0;
            var currentIndex = [];
            for (var i = 0; i < nodeName.length; i++) {
                var str = nodeName.charAt(i);
                if (/^[\u3220-\uFA29]+$/.test(str)) {
                    temp = temp + 15;
                } else {
                    temp = temp + 10;
                }
                if (temp >= num) {
                    currentIndex.push(i);
                    temp = 0;
                }
            }
            for (var i = 0; i <= currentIndex.length; i++) {
                var index = currentIndex[i];
                if (i == 0) {
                    nameHtml += nodeName.substring(0, index + 1) + '\n';
                } else if (i == currentIndex.length) {
                    nameHtml += nodeName.substring(currentIndex[i - 1] + 1, nodeName.length);
                } else {
                    nameHtml += nodeName.substring(currentIndex[i - 1] + 1, index + 1) + '\n';
                }

            }
            if (currentIndex.length < 1) {
                nameHtml = nodeName;
            }
            return nameHtml;
        },
        //画网格线
        drawGrid: function (width, height, gap) {
            if(_setting.g.model != "state"){
                var grid = _setting.grid;
                for (var i = 0; i < grid.length; i++) {
                    var obj = grid[i];
                    obj.remove();
                }
                grid = _setting.grid = [];
                var canvas = _setting.canvas;
                var lineobj = {
                    'stroke-width': '0.3',
                    'stroke': '#ccc',
                    'stroke-opacity': '0.8',
                    'fill': '#eee',
                    'opacity': '1',
                    'cursor': 'pointer',
                    'z-index': '-999'
                };
                if (gap == null) {
                    gap = 10;
                }
                drawGrid(gap, gap);
                function drawGrid(stepX, stepY) {
                    for (var i = 0; i <= height; i += stepY) {
                        var path1 = 'M0,' + i + 'L' + width + ',' + i;
                        var line1 = canvas.path(path1).attr(lineobj).toBack();
                        grid.push(line1);
                    }
                    for (var j = 0; j <= width; j += stepX) {
                        var path2 = 'M' + j + ',0' + 'L' + j + ',' + height;
                        var line2 = canvas.path(path2).attr(lineobj).toBack();
                        grid.push(line2);
                    }
                }
            }
        },
        //改变画布的大小
        changeCanvasSize: function (w, h) {
            if(_setting.g.model != "state"){
                var nodearr = _tool.getNode(), xarr = [], yarr = [];
                for (var i = 0; i < nodearr.length; i++) {
                    xarr.push(nodearr[i].data("vx"));
                    yarr.push(nodearr[i].data("vy"));
                }
                sort(xarr);
                sort(yarr);
                var maxWidth = xarr.pop() + 200;
                var maxHeight = yarr.pop() + 200;
                var canvas = _setting.canvas;
                var canvasid = _setting.canvasid;
                var endx = maxWidth > w ? maxWidth : w;
                var endy = maxHeight > h ? maxHeight : h;

                endx += 2 * _setting.leftpadding;
                endy += 2 * _setting.leftpadding;

                _setting.cwidth = endx;
                _setting.cheight = endy;

                //改变画布大小
                canvas.setSize(endx, endy);
                //改变网格大小
                _tool.drawGrid(endx, endy);
                $('#' + canvasid).css({
                    'width': endx,
                    'height': endy
                });
            }
            function sort(elements) {
                for (var i = 0; i < elements.length; i++) {
                    for (var j = 0; j < elements.length - 1; j++) {
                        if (elements[i] > elements[j + 1]) {
                            var temp = elements[j];
                            elements[j] = elements[j + 1];
                            elements[j + 1] = temp;
                        }
                    }
                }
            }
        },
        //移动节点改变文字的位置
        changeTextPosition: function (node) {
            var ringSize = _setting.ringSize;
            var nodeBoxInfo = node.getBBox();
            var x = nodeBoxInfo.x + nodeBoxInfo.width/2;
            var y = nodeBoxInfo.y + nodeBoxInfo.height/2 +15;
            return {'x': x, 'y': y};
        },
        //移动节点改变图片的位置
        changeImgPosition: function (node) {
            var nodeBoxInfo = node.getBBox();
            var x = nodeBoxInfo.x + nodeBoxInfo.width / 2 - _setting.imgBigSize/2;
            var y = nodeBoxInfo.y + nodeBoxInfo.height / 4 - _setting.imgBigSize/3;
            return {'x': x, 'y': y};
        },
        //移动节点改变close图标的位置
        changeClosePosition: function (node) {
            var imgSize = _setting.imgSmallSize;
            var nodeBoxInfo = node.getBBox();
            var cx = nodeBoxInfo.x2 - imgSize / 2;
            var cy = nodeBoxInfo.y + imgSize / 2;
            var x = nodeBoxInfo.x2 - imgSize;
            var y = nodeBoxInfo.y;
            return {'x': x, 'y': y, 'cx': cx, 'cy': cy};
        },
        //移动节点改变tips的位置
        changeTipsPosition: function (node) {
            var nodeBoxInfo = node.getBBox();
            var cx = nodeBoxInfo.x + _setting.padding;
            var cy = nodeBoxInfo.y + nodeBoxInfo.height + _setting.padding;
            var x = nodeBoxInfo.x + _setting.padding;
            var y = nodeBoxInfo.y + nodeBoxInfo.height + _setting.padding;
            return {'x': x, 'y': y, 'cx': cx, 'cy': cy};
        },
        //移动节点改变pathshape 的位置
        changePathShapePosition: function (node) {
            var nodeBoxInfo = node.getBBox();
            var q = {
                x: nodeBoxInfo.x,
                y: nodeBoxInfo.y,
                width: nodeBoxInfo.width,
                height: nodeBoxInfo.height
            };
            var space = _setting.space;
            var path = "M " + (q.x - space) + "," + (q.y - space) +
                " H " + ( q.x + q.width + space) +
                " V" + (q.y + q.height + space) +
                " H " + (q.x - space) +
                " V" + (q.y + q.height - space) +
                " H " + ( q.x + q.width - space) +
                " V" + (q.y + space) +
                " H " + (q.x + space) +
                " V" + (q.y + q.height - space) +
                " H " + ( q.x - space) + "z";
            return path;
        },
        //移动线改变线上面文字的位置
        changeLineTextPosition: function (line, font) {
            var path = line.data('path');
            var axis = _tool.getLineAxis(path);
            var length = _tool.getLineLength(axis);
            var pointObj = line.getPointAtLength(length / 2);
            var x, y;
            if (font != null) {
                _setting.tagleft = (font.length) * 12 / 2;
            } else if (line.data('text') != null) {
                _setting.tagleft = (line.data('text').attr('text').length) * 12 / 2;
            }
            x = pointObj.x - _setting.tagleft;
            y = pointObj.y;
            if(isNaN(x)){
                x=0;
            }
            if(isNaN(y)){
                y=0;
            }
            return {'cx': x, 'cy':y};
        },
        //获取字符串中某个字符的位置
        searchSubStr: function (str, subStr) {
            var positions = new Array();
            var pos = str.indexOf(subStr);
            while (pos > -1) {
                positions.push(pos);
                pos = str.indexOf(subStr, pos + 1);
            }
            return positions;
        },
        //获取线的坐标
        getLineAxis: function (path) {
            var MArr = _tool.searchSubStr(path, 'M');
            var LArr = _tool.searchSubStr(path, 'L');
            var AxisArray = [];

            for (var i = 0; i < MArr.length; i++) {
                var Axis = path.substring(MArr[i] + 1, LArr[i]);
                AxisArray.push(Axis);
            }
            return AxisArray;
        },
        //获取线的长度
        getLineLength: function (AxisArray) {
            var xNum = 0, yNum = 0;
            for (var i = 0; i < AxisArray.length; i++) {
                if (i + 1 < AxisArray.length) {
                    var obj1 = AxisArray[i];
                    var obj2 = AxisArray[i + 1];
                    xNum += obj2.substring(0, obj2.indexOf(',')) - obj1.substring(0, obj1.indexOf(','));
                    yNum += obj2.substring(obj2.indexOf(',') + 1, obj2.length) - obj1.substring(obj1.indexOf(',') + 1, obj1.length);
                }
            }
            return Math.abs(xNum) + Math.abs(yNum);
        },
        //获取线的开始节点和结束节点
        getStartEndAxis: function (path) {
            var axis = _tool.getLineAxis(path);
            var sx, sy, ex, ey;
            for (var i = 0; i < axis.length; i++) {
                var axisobj = axis[i];
                if (i == 0) {
                    sx = axisobj.substring(0, axisobj.indexOf(','));
                    sy = axisobj.substring(axisobj.indexOf(',') + 1, axisobj.length)

                } else if (i == axis.length - 1) {
                    ex = axisobj.substring(0, axisobj.indexOf(','));
                    ey = axisobj.substring(axisobj.indexOf(',') + 1, axisobj.length);
                }
            }
            return {'sx': parseFloat(sx), 'sy': parseFloat(sy), 'ex': parseFloat(ex), 'ey': parseFloat(ey)};
        },
        //重置线的路径
        resetLinePath: function (line, _path) {
            line.attr({path: _path});
            line.data('line').attr({path: _path});
            var textPosition = _tool.changeLineTextPosition(line);
            if (line.data('text') != null && textPosition.cx!=null && textPosition.cy!=null) {
                line.data('text').attr({'x': textPosition.cx, 'y': textPosition.cy});
            }
        },
        getDirection: function (x, y, node) {
            var nodeBoxInfo = node.getBBox();
            var width = nodeBoxInfo.width;
            var height = nodeBoxInfo.height;
            var cx = nodeBoxInfo.x;
            var cy = nodeBoxInfo.y;
            var space = _setting.space;
            var direction;
            if (x > cx - space && x < cx + width + space && y > cy - space && y < cy + space) {
                direction = 't';
            } else if (x > cx + width - space && x < cx + width + space && y > cy - space && y < cy + height + space) {
                direction = 'r';
            } else if (x > cx - space && x < cx + width + space && y > cy + height - space && y < cy + height + space) {
                direction = 'b';
            } else {
                direction = 'l';
            }
            return direction;

        },
        //时间单位转换
        getDiffTime(startDate, endDate) {
            startDate == ""?0:Number(startDate);
            endDate == ""?0:Number(endDate);
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
        },
        //获取节点状态颜色
        getNodeStateColor(state){
            var state_color;
            switch(String(state)){
                case "10":
                case "1":
                    state_color = _setting.g.stateColor[0];
                    break;
                case "1010":
                    state_color = _setting.g.stateColor[1];
                    break;
                case "20":
                case "2":
                    state_color = _setting.g.stateColor[2];
                    break;
                case "40":
                    state_color = _setting.g.stateColor[3];
                    break;
            }
            return  state_color;
        },
        //得到状态文本
        getStateText(state){
            var state_text;
            switch(state){
                case "10":
                case "1":
                    state_text = "未启动";
                    break;
                case "1010":
                    state_text = "启动中";
                    break;
                case "20":
                    state_text = "运行中";
                    break;
                case "40":
                    state_text = "启动失败";
                    break;
            }
            return  state_text;
        },
        //得到状态时间文本
        getStimeText(n){
            var nodeTime;
            if(n.upState == "20" || n.upState == "2"){
                nodeTime = n.ruleNodeType == "Start"? "" :
                    n.ruleNodeType == "End"?"完成" : "耗时  " + n.upTime;

            }else{
                nodeTime = (n.upState == "1" && n.ruleNodeType == "End")?
                    "未完成" :
                    (n.upState == "1" && n.ruleNodeType == "Start")?"未运行" :_tool.getStateText(n.upState);
            }
            return nodeTime;
        },
        //设置启动状态节点高亮
        setUpAnimation(setting, bgnode){
            if(setting.upState == "1010"){
                if(!_setting.nodeInterval.get(setting.nodeId)){
                    bgnode.animate(
                        {
                            'stroke-width': 4,
                            'stroke':'#087bf5'
                        },
                        400,
                        "linear"
                    );
                    bgnode.animate(
                        {
                            'stroke-width': 2,
                            'stroke':'#67b1ff'
                        },
                        400,
                        "linear"
                    );
                    var node_Interval =
                        setInterval(function(){
                            bgnode.animate(
                                {
                                    'stroke-width': 4,
                                    'stroke':'#087bf5'
                                },
                                400,
                                "linear",
                                function(){
                                    bgnode.animate(
                                        {
                                            'stroke-width': 2,
                                            'stroke':'#67b1ff'
                                        },
                                        400,
                                        "linear"
                                    );
                                }
                            );
                        },800);
                    _setting.nodeInterval.set(setting.nodeId, node_Interval);
                }
            }else{
                if(_setting.nodeInterval.get(setting.nodeId)){
                    window.clearInterval(_setting.nodeInterval.get(setting.nodeId));
                    _setting.nodeInterval.delete(setting.nodeId);
                }
            }
        },
        //创建流动线
        createFlowPath(joinId){
            var flowBoolean = _setting.linesData[joinId].data("flowLine");
            var startNodeId = _setting.linesData[joinId].data("startNodeNum");
            var nodeUpState = _setting.nodesData[startNodeId].data("upState");
            var pathArrow = _setting.linesData[joinId].data("path");
            var re = /L[\d\.\,]+M[\d\.\,]+L[\d\.\,]+L[\d\.\,]+$/;
            var path = pathArrow.replace(re,"").replace(/(?<!^)[M]/g,'L');
            if(nodeUpState == "20" && !flowBoolean){

                var flowLine = _setting.canvas.path(path).attr({
                    'stroke-width': 4,
                    'stroke': _setting.g.stateColor[2],
                });
                var dashoffset = 0;
                flowLine.node.style.strokeDashoffset = 0;
                flowLine.node.style.cssText = "stroke-dasharray:"+1 + ' ' +70;
                flowLine.node.style.strokeLinecap = "round";
                flowLine.node.style.transition = "stroke-dashoffset 0.1s linear";
                flowLine.node.style.WebkitTransition = "stroke-dashoffset 0.1s linear";

                setTimeout(function(){
                    flowLine.node.style.strokeDashoffset = dashoffset - 4;
                    dashoffset = dashoffset - 4;
                },0.001);
                setInterval(function(){
                    flowLine.node.style.strokeDashoffset = dashoffset - 4;
                    dashoffset = dashoffset - 4;
                },100);

                _setting.linesData[joinId].data("flowLine",flowLine)
            }
        },
        //合并状态信息数据
        getFitStateData(topologyData,stateUrl){
            $.ajax({
                type: 'GET',
                url: stateUrl,
                /*data: param,*/
                async: false,
                 dataType: 'json',
                success: function (stateData) {
                    if(!(stateData == [] || stateData.length < 0||stateData == null)){
                        topologyData.map(function(nodeInfo,index){
                            if(nodeInfo.hasOwnProperty("nodeId")){
                                stateData["data"].map(function(nodeState){
                                    if(nodeInfo.nodeId == nodeState.ruleNodeId){
                                        topologyData[index].nodeState = nodeState.nodeState;
                                        topologyData[index].startTime = nodeState.startTime;
                                        topologyData[index].endTime = nodeState.endTime;
                                    }
                                });
                            }
                        });
                    }else{
                        topologyData = false;
                    }
                },
                error:function(){
                    _setting.g.nodataTips();
                    topologyData = false;
                }
            });
            console.log(topologyData);
            return topologyData;
        }
    };
    _consts = {
        //创建底层图形
        createBaseNode: function (scan) {
            var node;
            var w = scan.width,
                h = scan.height,
                x = scan.x,
                y = scan.y,
                r = scan.radius,
                canvas = _setting.canvas;
            var attr = {
                'stroke': _setting.g.model != "state"?"#cccccc":_tool.getNodeStateColor(scan.upState),
                'stroke-width': 2,
                'fill': '#ffffff'
            };
            node = canvas.rect(x, y, w, h, r );
            node.attr(attr);
            _tool.setUpAnimation(scan, node);
            return node;
        },
        //创建最上面图形
        createFontNode: function (scan) {
            var node;
            var w = scan.width,
                h = scan.height,
                x = scan.x,
                y = scan.y,
                canvas = _setting.canvas;
            var attr = {
                'fill': "#fff",
                'stroke': "#000",
                'stroke-width': 1,
                'opacity': 0,
                'cursor': _setting.g.model == "state"?"pointer":"move",
                'stroke-opacity': 0

            };
            node = canvas.rect(x, y, w, h, 1);
            node.attr(attr);
            return node;
        },
        //创建节点文字
        createNodeText: function (n, node) {
            var nodeId = n.nodeId,
                nodeName = n.nodeName,
                width = n.width;
            var position = _tool.changeTextPosition(node);
            var canvas = _setting.canvas;
            var shapeText, text, timeText, nodeTime;
            text = _tool.changeTextLine(nodeName, width);
            shapeText = canvas.text(position.x, position.y, text).attr({
                'text-anchor': 'middle',
                'font-size': '12px',
                'font-family': "MicrosoftYaHei",
                'fill': '#333333'
            });
            //添加状态信息/启动时间
            if(_setting.g.model == "state"){
                var nodeTime =_tool.getStimeText(n);
                timeText = canvas.text(position.x, position.y + 14 , nodeTime).attr({
                    'text-anchor': 'middle',
                    'font-size': '10px',
                    'font-family': "MicrosoftYaHei",
                    'fill': '#a8a8a8'
                });
            }

            /*shapeText.data("nodeWidth", width);*/
            //初始化文本元素的文本编辑
          /*  canvas.inlineTextEditing(shapeText);*/
            // 双击开始编辑
           /* shapeText.dblclick(function () {
                // 创建的<input type=text>文本>字段
                var input = this.inlineTextEditing.startEditing();
                input.addEventListener("blur", function () {
                    //离开焦点后停止编辑
                    shapeText.inlineTextEditing.stopEditing();
                    _setting.nodesData[nodeId].data("nodeName", shapeText.attr("text"));
                }, true);
            });
            shapeText.data("text", shapeText.attr("text"));
            shapeText.data("nodeId", nodeId);*/
            return [shapeText,timeText];
        },
        //创建节点上的图形标志
        createNodeImg: function (n, node) {
            var canvas = _setting.canvas;
            var nodeBoxInfo = _tool.changeImgPosition(node);
           /* var base = _setting.base;*/
            var imgBigSize = _setting.imgBigSize;
            /*var nodeStyle = n.nodeStyle;*/
            var imgUrl=n.img;
            /*switch (nodeStyle) {
                case '1'://开始
                    // imgUrl = base + '/icon-start.png';
                    imgUrl = base + '/icon-begin.png';
                    break;
                case '3'://设置
                    // imgUrl = base + '/icon-setting.png';
                    imgUrl = base + '/icon-api.png';
                    break;
                case '4'://结束
                    // imgUrl = base + '/icon-end.png';
                    imgUrl = base + '/icon-finish.png';
                    break;
                case '5'://聚合开始
                    imgUrl = base + '/icon-aggregationStart.png';
                    break;
                case '6'://聚合结束
                    imgUrl = base + '/icon-aggregationEnd.png';
                    break;
            }*/
            img = canvas.image(imgUrl, nodeBoxInfo.x, nodeBoxInfo.y, imgBigSize, imgBigSize);
            return img;
        },
        //创建包围节点的图形
        createPathShape: function (n, node) {
            var canvas = _setting.canvas;
            var path = _tool.changePathShapePosition(node);
            var pathShape = canvas.path(path).attr({
                'stroke-width': 1,
                'fill': "#000",
                'stroke': "#000",
                // 'cursor': "crosshair",
                'stroke-opacity': 1,
                'opacity': 0
            });
            return pathShape;
        },
        //创建线
        createLine: function (x, y, circleType) {
            var canvas = _setting.canvas;
            var x1, y1, x2, y2, sline;
            x1 = x;
            y1 = y;
            switch (circleType) {
                case "t":
                    x2 = x;
                    y2 = y - 2;
                    break;
                case "l":
                    x2 = x - 2;
                    y2 = y;
                    break;
                case "r":
                    x2 = x + 2;
                    y2 = y;
                    break;
                case "b":
                    x2 = x;
                    y2 = y + 2;
                    break;
            }
            var path = "M" + x1 + "," + y1 + "L" + x2 + "," + y2 + _line.getArr(x1, y1, x2, y2, 8);
            sline = canvas.path(path).attr({
                'stroke-width': 2,
                'stroke': "#cccccc",
                'fill': "#cccccc",
                'stroke-opacity': 1
            });
            sline['pathWithoutArrow'] = "M" + x1 + "," + y1 + "L" + x2 + "," + y2;
            return sline;
        },
        //找到指定字符出现的位置
        findIndexOfString :function (str,cha,num){
            var x=str.indexOf(cha);
            for(var i=0;i<num;i++){
                x=str.indexOf(cha,x+1);
            }
            return x;
        },
        //创建比线大的透明矩形
        createBgLine: function (line) {
            var bbox = line.getBBox();
            if (bbox.y2 > bbox.y) {
                y1 = bbox.y;
                y2 = bbox.y2;
            } else {
                y1 = bbox.y2;
                y2 = bbox.y;
            }

            var bgpath = line.data('path');
            // var pathWithoutArrow = bgpath.substring(0, _consts.findIndexOfString(bgpath,'M','1'));
            // console.log(bgpath);
            // console.log(pathWithoutArrow);
            var bgline = _setting.canvas.path(bgpath).attr({
                'stroke-width': 5,
                'stroke': "#fff",
                'fill': "#ddd",
                'stroke-opacity': 0.5,
                'opacity': 0,
            });
            return bgline;
        },
        //创建线上面的文字
        createLineText: function (line, font) {
            var lineText;
            var canvas = _setting.canvas;
            var position = _tool.changeLineTextPosition(line, font);
            lineText = canvas.text(position.cx, position.cy, font).attr({
                'text-anchor': 'start',
                'font-size': '12px',
                'font-family': "宋体",
                'fill': '#000'
            });
            return lineText;
        },
        //创建顶部状态类型说明
        createStateType: function(paper){
            var stateType = ["未启动","启动中","运行中","启动失败"];
            stateType.map(function(typeText,index){
                paper.circle(39 + index*81, 25, 9).attr({
                    'fill': "#ffffff",
                    'stroke': _setting.g.stateColor[index],
                    "opacity": 1,
                    'stroke-width': 2,
                });
                paper.text(76 + index*81, 25, typeText).attr({
                    'text-anchor': 'middle',
                    'font-size': '12px',
                    'font-family': "MicrosoftYaHei",
                    'fill': '#666666'
                });
            });
        }
    };
    _ring = {
        //创建环节点Ring（用于编辑矩形框大小）
        createRing: function (g) {
            var constant = 16, helper = _setting.helper;
            var x = 0, y = 0, w = 100, h = 100;
            helper.t = this.drawCircle(x + w / 2, y, "t", constant, g);//位置x,位置y,方向，属性，圆半径，g
            helper.l = this.drawCircle(x, y + h / 2, "l", constant, g);
            helper.r = this.drawCircle(x + w, y + h / 2, "r", constant, g);
            helper.b = this.drawCircle(x + w / 2, y + h, "b", constant, g);

            // helper.lb = this.drawRect(x, y + h, constant, "sw-resize", "lb");//左下
            // helper.lt = this.drawRect(x, y, constant, "nw-resize", "lt");//左上
            // helper.rb = this.drawRect(x + w, y + h, constant, "se-resize", "rb");//右下
            // helper.rt = this.drawRect(x + w, y, constant, "ne-resize", "rt");//右上
            helper.path = _setting.canvas.path("m0,0l0.10").attr({
                'stroke-width': 3,
                // 'stroke': "#45cfda",
                'stroke': "#da3610",
                'stroke-opacity': 1
            }).hide();

            helper.sl = this.drawLineCircle(x + w / 2, y, "sl", constant, g);//线两端的圆圈，位置x,位置y,方向，属性，圆半径，g
            helper.el = this.drawLineCircle(x, y + h / 2, "el", constant, g);
        },
        //画上下左右四个圆，
        drawCircle: function (x, y, type, diameter, G) {
            var attr = {
                fill: "#ffffff",
                // stroke: "#45cfda",
                'stroke': "#0098f4",
                cursor: "crosshair",
                "opacity": 1,
                'stroke-width': 2,
            };
            var canvas = _setting.canvas;
            var circleNode = canvas.circle(x, y, diameter / 2).attr(attr).hide();
            // var circleNode = canvas.circle(x, y, 8).attr(attr).hide();
            circleNode.data('type', type);
            _ring.eventCircle(circleNode, G);
            return circleNode;
        },
        //画线上面开始结束两个圆点，
        drawLineCircle: function (x, y, type, diameter, G) {
            var attr = {
                fill: "#fff",
                stroke: "#45cfda",
                opacity:0,
                cursor: "move"
            };
            var canvas = _setting.canvas;
            var circleNode = canvas.circle(x, y, diameter / 2).attr(attr).hide();
            circleNode.data('type', type);
            _ring.eventLineCircle(circleNode, G);
            return circleNode;
        },
        //画边框上的四个方框
        drawRect: function (x, y, width, cursor, type) {
            var attr = {
                fill: "#fff",
                // stroke: "#45cfda",
                stroke: "#da3610",
                cursor: cursor
            };
            var canvas = _setting.canvas;
            var rectNode = canvas.rect(x, y, width, width).attr(attr).hide();
            rectNode.data('type', type);
            _ring.eventRect(rectNode);
            return rectNode;
        },
        //圆事件
        eventCircle: function (circleNode, G) {
            var g = this;
            var radius = circleNode.attr('r');
            var type = circleNode.data('type');
            circleNode.drag(function (dx, dy) {
                //拖动中,改变线的path
                var x = _sx + dx, y = _sy + dy;
                var snode = _setting.nodesData[_nodeId];
                var obj = _line.getLineNode(snode, _xx, _yy, x, y, _type);
                line.data("direction", obj.direction);
                line.data("nodeId", obj.nodeId);
                line.attr({path: obj.path}).toBack();
            }, function () {
                //拖动开始,设置变量
                console.log(this);
                _xx = this.attr("cx");
                _yy = this.attr("cy");
                _sx = this.attr("cx");
                _sy = this.attr("cy") + 2;
                _nodeId = this.data("nodeId");
                _type = type;
                line = _consts.createLine(_xx, _yy, type);
                _setting.mline = line;
            }, function () {
                //拖动结束
                g.endMove(line, G);
            }).mouseover(function () {
                // circleNode.attr('r', radius * 2);
            }).mouseout(function () {
                // circleNode.attr('r', radius);
            });
        },
        //方框事件
        eventRect: function (rectNode) {
            var rectType = rectNode.data('type');
            var width = rectNode.attr('width');
            rectNode.drag(function (dx, dy) {
                //拖动中,改变节点的大小
                var nodeId = this.data("nodeId");
                dx += _bx;
                dy += _by;
                _ring.changeNodeSize(dx, dy, rectType, nodeId);
            }, function () {
                //拖动开始,设置变量
                _bx = this.attr("x") + width / 2;
                _by = this.attr("y") + width / 2;
            }, function () {

            }).mouseover(function () {
                rectNode.attr({"width": width * 1.3, "height": width * 1.3});
            }).mouseout(function () {
                rectNode.attr({"width": width, "height": width});
            });
        },
        //线上圆的事件
        eventLineCircle: function (circleNode, G) {
            var g = this;
            var radius = circleNode.attr('r');
            var type = circleNode.data('type');
            circleNode.drag(function (dx, dy) {
                if(dx ==null || dy == null){
                    return ;
                }

                //拖动中,改变线的path
                var x = _xx + dx, y = _yy + dy;

                if(type=="sl"){
                    lineobj = _line.getLineNode(line.data('endSet'), x, y, _sx, _sy,_type);
                }else{
                    lineobj = _line.getLineNode(line.data('startSet'), _sx, _sy,x, y,_type);
                }

                line.data("nodeId", lineobj.nodeId);
                line.data("direction", lineobj.direction);
                _tool.resetLinePath(line, lineobj.path);

                this.attr({'cx': x, 'cy': y});
            }, function () {
                line = this.data("line");

                //拖动开始,设置变量

                if(type=="sl"){
                    _sx = line.data('ex');
                    _sy = line.data('ey') + 2;
                }else{
                    _sx = line.data('sx');
                    _sy = line.data('sy') + 2;
                }

                _xx = this.data('cx');
                _yy = this.data('cy');

                lineobj = null;
                _path = line.data('path');//线在拖动之前的路径，在拖动过程中，改变路径，若连线不成功，则重置为一开始的路径
                _nodeId = line.data('startSet').data('nodeId');//开始节点的id
                _endNodeId = line.data('endSet').data('nodeId');//结束节点的id
                _type = line.data("joinType");
                $("#del_menu").detach();
            }, function () {
                //拖动结束
                g.endLineMove(G,lineobj,line,_nodeId,_endNodeId);
            }).mouseover(function () {
                // circleNode.attr('r', radius * 2);
            }).mouseout(function () {
                circleNode.attr('r', radius);
            });
        },
        //环节点拽出线的结束事件
        endMove: function (l, g) {
            var x = _xx;
            var y = _yy;
            //这段代码作用是当节点移动时，线也移动
            if (l.data("direction") != null && l.data("nodeId") != null) {
                var nodeNum = l.data("nodeId");
                var mnode = _setting.nodesData[l.data("nodeId")];
                var dNodeNum = _nodeId,
                    enode = _setting.nodesData[nodeNum],
                    snode = _setting.nodesData[dNodeNum];
                if (nodeNum != dNodeNum) {
                    var startSet = enode.data("startSet");
                    var endSet = snode.data("endSet");
                    var setline = snode.data("setline");

                    if (startSet == null) {
                        startSet = [];
                    }
                    if (endSet == null) {
                        endSet = [];
                    }
                    if (setline == null) {
                        setline = [];
                    }
                    var tagidArr = snode.data("tagidArr") + "";
                    if (!_line.chkNode(startSet, dNodeNum) && !_line.chkNode(endSet, nodeNum) && tagidArr.indexOf("," + mnode.data("tagid") + ",") == -1) {
                        startSet[startSet.length] = dNodeNum;
                        enode.data("startSet", startSet);
                        endSet[endSet.length] = nodeNum;
                        snode.data("endSet", endSet);
                        var joinType = _type;
                        var direction = l.data("direction") == null ? "t" : l.data("direction");
                        var obj = _line.getLineMvNode(snode, enode, joinType, direction);
                        var cline = _setting.canvas.path(obj.path).attr({
                            'stroke-width': 2,
                            'stroke': "#cccccc",
                            'fill': "#cccccc",
                            'stroke-opacity': 1
                        });
                        var joinId = _tool.uuid();

                        cline.data("startNodeNum", dNodeNum);
                        cline.data("endNodeNum", nodeNum);
                        cline.data("startSet", snode);
                        cline.data("endSet", enode);
                        cline.data("path", obj.path);
                        cline.data("joinId", joinId);
                        cline.data("joinType", joinType);
                        cline.data("joinDirection", direction);
                        var bgline = _consts.createBgLine(cline);
                        bgline.data("startNodeNum", dNodeNum);
                        bgline.data("endNodeNum", nodeNum);
                        bgline.data("startSet", snode);
                        bgline.data("endSet", enode);
                        bgline.data("path", obj.path);
                        bgline.data("joinId", joinId);
                        bgline.data("joinType", joinType);
                        bgline.data("joinDirection", direction);
                        bgline.data("line", cline);
                        var startEndAxis = _tool.getStartEndAxis(obj.path);
                        bgline.data('sx', startEndAxis.sx);
                        bgline.data('sy', startEndAxis.sy);
                        bgline.data('ex', startEndAxis.ex);
                        bgline.data('ey', startEndAxis.ey);

                        setline[setline.length] = bgline;
                        _setting.linesData[joinId] = bgline;

                        _setting.nodesData[dNodeNum].data("setline", setline);
                        _event.lineEvent(bgline, g);
                        _event.childLineArr(dNodeNum, tagidArr);
                        if (g.afterDrawLine != null) {
                            g.afterDrawLine(cline);
                        }
                    }
                }
            }
            //这里的意思是如果判断当前节点和要连接的节点是一个的话，返回箭头
            var lineobj = _line.getLineNode(_xx, _yy, _xx, _yy + 10);
            l.attr({path: lineobj.path}).hide();
            _setting.mline = null;
        },
        endLineMove:function(g,lineobj,line,sNodeId,_endNodeId){
            if (lineobj != null) {
                if (line.data("direction") != null && line.data("nodeId") != null) {
                    var eNodeId = line.data("nodeId");
                    var snode = _setting.nodesData[sNodeId];
                    var enode = _setting.nodesData[eNodeId];

                    if (eNodeId != sNodeId) {
                        var startSet = enode.data("startSet");
                        var endSet = snode.data("endSet");
                        var setline = snode.data("setline");
                        if (startSet == null) {
                            startSet = [];
                        }
                        if (endSet == null) {
                            endSet = [];
                        }
                        if (setline == null) {
                            setline = [];
                        }
                        var tagidArr = snode.data("tagidArr") + "";

                        if (!_line.chkNode(startSet, sNodeId) && !_line.chkNode(endSet, eNodeId) && tagidArr.indexOf("," + enode.data("tagid") + ",") == -1) {
                            line.data('joinDirection', lineobj.direction);


                            //1、当前线的结束节点的startSet增加sNodeId
                            startSet[startSet.length] = sNodeId;
                            enode.data("startSet", startSet);
                            //2、当前线的开始节点的startSet增加sNodeId，减去_endNodeId
                            for (var i = 0; i < endSet.length; i++) {
                                if (endSet[i] == _endNodeId) {
                                    endSet.splice(i, 1);
                                }
                            }
                            endSet[endSet.length] = eNodeId;
                            snode.data("endSet", endSet);
                            //3、当前线的之前结束节点的startSet减去_nodeId
                            var oldNode = _setting.nodesData[_endNodeId];
                            var setartoldSet = oldNode.data('startSet');
                            if (setartoldSet != null && setartoldSet.length > 0) {
                                for (var i = 0; i < setartoldSet.length; i++) {
                                    if (setartoldSet[i] == sNodeId) {
                                        setartoldSet.splice(i, 1);
                                    }
                                }
                            }
                            oldNode.data("startSet", setartoldSet);

                            line.data('line').data("startNodeNum", sNodeId);
                            line.data('line').data("endNodeNum", eNodeId);
                            line.data('line').data("startSet", snode);
                            line.data('line').data("endSet", enode);
                            line.data('line').data("path", lineobj.path);
                            line.data('line').data("joinDirection", lineobj.direction);

                            line.data("startNodeNum", sNodeId);
                            line.data("endNodeNum", eNodeId);
                            line.data("startSet", snode);
                            line.data("endSet", enode);
                            line.data("path", lineobj.path);
                            line.data("joinDirection", lineobj.direction);
                            var startEndAxis = _tool.getStartEndAxis(lineobj.path);
                            line.data('sx', startEndAxis.sx);
                            line.data('sy', startEndAxis.sy);
                            line.data('ex', startEndAxis.ex);
                            line.data('ey', startEndAxis.ey);
                            _setting.nodesData[sNodeId].data("setline", setline);
                            if (line.data('text') != null) {
                                line.data('text').data('text', null)
                            }
                            if (g.afterDrawLine != null) {
                                g.afterDrawLine(line);
                            }
                            if (g.changeLine != null) {
                                g.changeLine(line,_endNodeId);
                            }
                            _event.childLineArr(sNodeId, tagidArr);
                        } else {
                            if (line.data("direction") != line.data("joinDirection")) {
                                line.data('line').data("path", lineobj.path);
                                line.data('line').data("joinDirection", lineobj.direction);
                                line.data("path", lineobj.path);
                                line.data("joinDirection", lineobj.direction);
                                var startEndAxis = _tool.getStartEndAxis(lineobj.path);
                                line.data('sx', startEndAxis.sx);
                                line.data('sy', startEndAxis.sy);
                                line.data('ex', startEndAxis.ex);
                                line.data('ey', startEndAxis.ey);
                                if (line.data('text') != null) {
                                    line.data('text').data('text', null)
                                }
                                if (g.afterDrawLine != null) {
                                    g.afterDrawLine(line);
                                }
                                if (g.changeLine != null) {
                                    g.changeLine(line,_endNodeId);
                                }
                            } else {
                                _tool.resetLinePath(line, _path);
                            }

                        }
                    } else {
                        _tool.resetLinePath(line, _path);
                    }
                } else {
                    _tool.resetLinePath(line, _path);
                }
            }
        },
        //修改节点的大小
        changeNodeSize: function (dx, dy, rectType, nodeId) {
            var node = _setting.nodesData[nodeId];
            var q = {
                x: node.data("vx"),
                y: node.data("vy"),
                width: node.data("width"),
                height: node.data("height"),
                minWidth: node.data("minWidth"),
                minHeight: node.data("minHeight"),
                maxWidth: node.data("maxWidth"),
                maxHeight: node.data("maxHeight"),
            };
            var r, w, h, x, y;
            var nameHtml, tipsHtml, tnNode, left, top;

            switch (rectType) {
                case"lt" :
                    q.width += q.x - dx;
                    q.height += q.y - dy;
                    q.x = dx;
                    q.y = dy;
                    break;
                case"lb" :
                    q.height = dy - q.y;
                    q.width += q.x - dx;
                    q.x = dx;
                    break;
                case"rb" :
                    q.height = dy - q.y;
                    q.width = dx - q.x;
                    break;
                case"rt" :
                    q.width = dx - q.x;
                    q.height += q.y - dy;
                    q.y = dy;
                    break;
            }

            if (q.width < q.minWidth) {
                w = q.minWidth;
            } else if (q.width > q.maxWidth) {
                w = q.maxWidth;
            } else {
                w = q.width;
            }
            if (q.height < q.minHeight) {
                h = q.minHeight;
            } else if (q.height > q.maxHeight) {
                h = q.maxHeight;
            } else {
                h = q.height;
            }
            x = q.x, y = q.y;//在变化过程中，已经为w,h赋值
            node.attr({"width": w, "height": h, "y": y, "x": x});
            node.data('bgnode').attr({"width": w, "height": h, "y": y, "x": x});
            //修改完节点的位置后，修改节点上文字的顺序和位置
            var textPosition = _tool.changeTextPosition(node);//获取文字的移动位置
            var imgPosition = _tool.changeImgPosition(node);//获取图片的移动位置
            var closePosition = _tool.changeClosePosition(node);//获取删除按钮的移动位置
            var tipsPosition = _tool.changeTipsPosition(node);//获取提示框的移动位置
            var pathShapePath = _tool.changePathShapePosition(node);
            node.data("pathShape").attr('path', pathShapePath);
            node.data("image").attr({"x": imgPosition.x, "y": imgPosition.y});
            node.data("tnNode").attr({"x": textPosition.x, "y": textPosition.y});
            if(_setting.g.model == "state"){
                node.data("tnNode0").attr({"x": textPosition.x, "y": textPosition.y + 14});
            }
            //将修改的参数放到data 数据里面
            node.data("vx", x);
            node.data("vy", y);
            node.data("width", w);
            node.data("height", h);

            _setting.nodesData[nodeId] = node;
            _line.moveStartSetLine(node);
            _line.moveEndSetLine(node);
            this.changeLocation(nodeId);
        },
        //修改当前环节节点的隐藏的拉伸框的x,y坐标值。
        changeLocation: function (nodeId) {
            var h = _setting.ringSize, nodesData = _setting.nodesData, helper = _setting.helper, canvas = _setting.canvas;
            var node = nodesData[nodeId];
            var nodeBorderInfo = node.getBBox();
            var q = {
                x: nodeBorderInfo.x,
                y: nodeBorderInfo.y,
                width: nodeBorderInfo.width,
                height: nodeBorderInfo.height
            };
            helper.t.attr({
                cx: q.x + q.width / 2,
                cy: q.y,
                r: h / 2
            });
            // helper.lt.attr({
            //     x: q.x - h / 2,
            //     y: q.y - h / 2,
            //     width: h,
            //     height: h
            // });
            helper.l.attr({
                cx: q.x,
                cy: q.y + q.height / 2,
                r: h / 2
            });
            // helper.lb.attr({
            //     x: q.x - h / 2,
            //     y: q.y + q.height - h / 2,
            //     width: h,
            //     height: h
            // });
            helper.b.attr({
                cx: q.x + q.width / 2,
                cy: q.y + q.height,
                r: h / 2
            });
            // helper.rb.attr({
            //     x: q.x + q.width - h / 2,
            //     y: q.y + q.height - h / 2,
            //     width: h,
            //     height: h
            // });
            helper.r.attr({
                cx: q.x + q.width,
                cy: q.y + q.height / 2,
                r: h / 2
            });
            // helper.rt.attr({
            //     x: q.x + q.width - h / 2,
            //     y: q.y - h / 2,
            //     width: h,
            //     height: h
            // });
            var path =
                'M' + q.x + ',' + q.y + 'L' + (q.x + q.width/2 - h / 2) + ',' + q.y +
                'M' + (q.x + q.width/2 + h / 2) + ',' + q.y + 'L' + (q.x + q.width) + ',' + (q.y) +
                'M' + (q.x + q.width) + ',' + (q.y) + 'L' + (q.x + q.width) + ',' + (q.y + q.height / 2 - h / 2) +
                'M' + (q.x + q.width) + ',' + (q.y + q.height / 2 + h / 2) + 'L' + (q.x + q.width) + ',' + (q.y + q.height) +
                'M' + (q.x + q.width) + ',' + (q.y + q.height) + 'L' + (q.x + q.width / 2 + h / 2) + ',' + (q.y + q.height) +
                'M' + (q.x + q.width / 2 - h / 2) + ',' + (q.y + q.height) + 'L' + (q.x) + ',' + (q.y + q.height) +
                'M' + (q.x) + ',' + (q.y + q.height) + 'L' + (q.x ) + ',' + (q.y + q.height / 2 + h / 2) +
                'M' + (q.x) + ',' + (q.y + q.height / 2 - h / 2) + 'L' + (q.x) + ',' + (q.y);
            // var path =
            //     'M' + (q.x + h / 2) + ',' + q.y + 'L' + (q.x + q.width / 2 - h / 2) + ',' + q.y +
            //     'M' + (q.x + q.width / 2 + h / 2) + ',' + q.y + 'L' + (q.x + q.width - h / 2) + ',' + (q.y) +
            //     'M' + (q.x + q.width) + ',' + (q.y + h / 2) + 'L' + (q.x + q.width) + ',' + (q.y + q.height / 2 - h / 2) +
            //     'M' + (q.x + q.width) + ',' + (q.y + q.height / 2 + h / 2) + 'L' + (q.x + q.width) + ',' + (q.y + q.height - h / 2) +
            //     'M' + (q.x + q.width - h / 2) + ',' + (q.y + q.height) + 'L' + (q.x + q.width / 2 + h / 2) + ',' + (q.y + q.height) +
            //     'M' + (q.x + q.width / 2 - h / 2) + ',' + (q.y + q.height) + 'L' + (q.x + h / 2) + ',' + (q.y + q.height) +
            //     'M' + (q.x) + ',' + (q.y + q.height - h / 2) + 'L' + (q.x ) + ',' + (q.y + q.height / 2 + h / 2) +
            //     'M' + (q.x) + ',' + (q.y + q.height / 2 - h / 2) + 'L' + (q.x) + ',' + (q.y + h / 2);
            helper.path.attr("path", path);
            var set = canvas.set();
            // set.push(helper.t, helper.lt, helper.l, helper.lb, helper.b, helper.rb, helper.r, helper.rt, helper.path);
            set.push(helper.t,  helper.l,  helper.b,  helper.r, helper.path);
            set.toFront().data("nodeId", nodeId);
        },
        //显示拉伸框
        showDraw: function () {
            var helper = _setting.helper;
            if (_setting.circleFlag) {
                helper.t.show();
                helper.l.show();
                helper.r.show();
                helper.b.show();
            }
            // helper.lb.show();
            // helper.lt.show();
            // helper.rb.show();
            // helper.rt.show();
            //helper.path.show();

        },
        //隐藏拉伸框
        hideDraw: function () {
            var helper = _setting.helper;
            helper.t.hide();
            helper.l.hide();
            helper.r.hide();
            helper.b.hide();
            // helper.lb.hide();
            // helper.lt.hide();
            // helper.rb.hide();
            // helper.rt.hide();
            //helper.path.hide();
        }
    };
    _event = {
        //节点拖动事件
        nodeEvent: function (d, g) { // 事件绑定
            if (g == null) {
                g = new Object();
                g.onClick = null;
            }
            let dragClick = true;//禁止拖拽完成后触发点击事件
            if(_setting.g.model != "state"){
                d.drag(function (dx, dy) {
                    var x = _xx + dx, y = _yy + dy;
                    this.data("cx", x);
                    this.data("cy", y);
                    var vx1 = _vx + dx;
                    var vy1 = _vy + dy;
                    this.data("vx", vx1);
                    this.data("vy", vy1);
                    dragClick=false;
                    _event.changeNodePosition(d, vx1, vy1);
                }, function () {
                    _xx = this.data("cx");
                    _yy = this.data("cy");
                    _vx = this.data("vx");
                    _vy = this.data("vy");
                    _h = this.data("height");
                    dragClick=true;
                }, function () {
                    var options = d.data('options');
                    _tool.changeCanvasSize(options.cwidth, options.cheight);
                });
            }
            d.mouseover(function () {
                if(_setting.g.model != "state") {
                    if (_setting.mnode != null) {
                        _event.clearHlightState(_setting.mnode);
                    }

                    var nodeId = d.data("nodeId");
                    _ring.changeLocation(nodeId);
                    _ring.showDraw(d.data("nodeId"));
                    var fontNode = _setting.nodesData[nodeId];
                    fontNode.data("bgnode").attr({
                        'stroke': "#0098f4",
                    });

                    _setting.mnode = this;
                    /* if (g.onClick != null) {
                         g.onClick(this);
                     }*/
                    if (_setting.rmline != null) {
                        _setting.rmline.data('line').attr({
                            'fill': "#cccccc",
                            'stroke': "#cccccc",
                            'stroke-opacity': 1
                        });
                        _setting.rmline = null;
                    }
                    _event.showDeleteView('node', g, d);
                }
                var chk = true;
                var canvasid = _setting.canvasid;
                $("#" + canvasid).off("click");
                $("#" + canvasid).on("click", function () {
                    if (_setting.rmline != null) {
                        _setting.rmline.data('line').attr({
                            'fill': "#cccccc",
                            'stroke': "#cccccc",
                            'stroke-opacity': 1
                        });
                        _setting.rmline = null;
                    }
                    if (!chk) {
                        _setting.mnode = null;
                        var fontNode = _setting.nodesData[d.data("nodeId")];
                        _event.clearHlightState(fontNode);
                        $("#del_menu").detach();
                    }
                });
                chk = false;
            }).mouseout(function () {
                // this.attr("stroke", "#428bca");
                //this.attr("stroke", "#acb0b5");

            }).click(function (e) {
                if(_setting.g.model != "state"){
                    var options = d.data("options");
                    if (options.onClick != null&&dragClick) {
                        options.onClick(d);
                    }
                    dragClick=true;

                    for(var joinId in _setting.linesData){
                        if(_setting.linesData[joinId].data("startNodeNum") == d.data("nodeId") || _setting.linesData[joinId].data("endNodeNum") == d.data("nodeId")){
                            _setting.linesData[joinId].data("line").toFront().attr({
                                'stroke': "#0098f4",
                                'fill': "#0098f4",
                            });
                        }
                    }
                    _setting.helper.t.toFront();
                    _setting.helper.l.toFront();
                    _setting.helper.r.toFront();
                    _setting.helper.b.toFront();

                    Mousetrap.unbind('up');
                    Mousetrap.unbind('down');
                    Mousetrap.unbind('left');
                    Mousetrap.unbind('right');
                    Mousetrap.bind('up', function () {
                        var vy = d.data("vy") - 1;
                        var vx = d.data("vx");
                        _event.changeNodePosition(d, vx, vy);
                        d.data("vy", vy);
                    });
                    Mousetrap.bind('up', function () {
                        var vy = d.data("vy") - 1;
                        var vx = d.data("vx");
                        _event.changeNodePosition(d, vx, vy);
                        d.data("vy", vy);
                    });
                    Mousetrap.bind('down', function () {
                        var vy = d.data("vy") + 1;
                        var vx = d.data("vx");
                        _event.changeNodePosition(d, vx, vy);
                        d.data("vy", vy);
                    });
                    Mousetrap.bind('left', function () {
                        var vx = d.data("vx") - 1;
                        var vy = d.data("vy");
                        _event.changeNodePosition(d, vx, vy);
                        d.data("vx", vx);
                    });
                    Mousetrap.bind('right', function () {
                        var vx = d.data("vx") + 1;
                        var vy = d.data("vy");
                        _event.changeNodePosition(d, vx, vy);
                        d.data("vx", vx);
                    });
                }else{
                    _event.clearHlightState();
                    var upState;
                    for(var joinId in _setting.linesData){
                        if(_setting.linesData[joinId].data("endNodeNum") == d.data("nodeId")){
                            for(var nodeId in _setting.nodesData){
                                if(_setting.linesData[joinId].data("startNodeNum") == _setting.nodesData[nodeId].data("nodeId")){
                                    upState = _setting.nodesData[nodeId].data("upState");
                                    break;
                                }
                            }
                            _setting.linesData[joinId].data("line").toFront().attr({
                                'stroke': _tool.getNodeStateColor(upState),
                                'fill': _tool.getNodeStateColor(upState),
                            });
                            if(_setting.linesData[joinId].data("flowLine")){
                                _setting.linesData[joinId].data("flowLine").toFront();
                            }
                        }else if(_setting.linesData[joinId].data("startNodeNum") == d.data("nodeId")){
                            _setting.linesData[joinId].data("line").toFront().attr({
                                'stroke': _tool.getNodeStateColor(d.data("upState")),
                                'fill': _tool.getNodeStateColor(d.data("upState")),
                            });
                            if(_setting.linesData[joinId].data("flowLine")){
                                _setting.linesData[joinId].data("flowLine").toFront();
                            }
                        }
                    }
                }
                e.stopPropagation();
            }).dblclick(function (e) {
                if(_setting.g.model != "state"){
                    var options = d.data("options");
                    if (options.onNodeDblclick != null) {
                        options.onNodeDblclick(d);
                    }
                }
            });
        },
        //包围节点的图形的事件
        pathShapeEvent: function (pathShape, g) {
            /*pathShape.drag(function (dx, dy) {
             //拖动中,改变线的path
             var x = _sx + dx, y = _sy + dy;
             var snode = _setting.nodesData[_nodeId];
             var obj = _line.getLineNode(snode, _xx, _yy, x, y, _type);
             line.data("direction", obj.direction);
             line.data("nodeId", obj.nodeId);
             line.attr({path: obj.path}).toBack();
             }, function (x, y) {
             //拖动开始,设置变量
             //这里的x，y 是指鼠标的位移，所以  得去掉画布对于浏览器窗口的相对位置。
             leftpadding = _setting.leftpadding;
             toppadding = _setting.toppadding;
             _xx = x - leftpadding;
             _yy = y - toppadding;
             _sx = x - leftpadding;
             _sy = y - toppadding + 2;
             _nodeId = this.data("nodeId");
             _type = _tool.getDirection(_xx, _yy, _setting.nodesData[_nodeId]);
             line = _consts.createLine(this, _type);
             _setting.mline = line;
             }, function () {
             _ring.endMove(line, g);
             });*/

        },
        //图形移动
        changeNodePosition: function (node, vx1, vy1) {
            var left, top;
            node.attr({"x": vx1, "y": vy1});
            node.data("bgnode").attr({"x": vx1, "y": vy1});
            //位置改变后，获取节点的边缘数值
            var textPosition = _tool.changeTextPosition(node);
            var imgPosition = _tool.changeImgPosition(node);
            var closePosition = _tool.changeClosePosition(node);
            var tipsPosition = _tool.changeTipsPosition(node);
            var pathShapePath = _tool.changePathShapePosition(node);
            var imgSize = _setting.imgSmallSize;
            node.data("image").attr({"x": imgPosition.x, "y": imgPosition.y});
            node.data("tnNode").attr({"x": textPosition.x, "y": textPosition.y});
            if(_setting.g.model == "state"){
                node.data("tnNode0").attr({"x": textPosition.x, "y": textPosition.y + 14});
            }
            node.data("pathShape").attr('path', pathShapePath);
            left = tipsPosition.x + 'px';
            top = tipsPosition.y + 'px';
            if ($('#del_menu').css('dispaly') != 'none') {
                $('#del_menu').css({
                    left: closePosition.x+imgSize,
                    top: closePosition.y-imgSize
                });
            }
            vx1 = _tool.numSubstring(vx1);
            vy1 = _tool.numSubstring(vy1);
            var nodeId = node.data("nodeId");
            _ring.changeLocation(nodeId);
            _line.moveStartSetLine(node);
            _line.moveEndSetLine(node);
        },
        //删除节点
        closeNode: function (d) {
            $("#deleteNodeModal").modal("show");
            $("#deleteNodeModal").find(".confirm-box-ok").unbind("click");
            $("#deleteNodeModal").find(".confirm-box-ok").click(function(){
                $("#deleteNodeModal").modal("hide");
                var nodeId = d.data("nodeId");
                var node = _setting.nodesData[nodeId];
               /* var linenode = node.data("linenode");
                if (linenode != null) {
                    linenode.remove();
                }*/

                if (_setting.g.onClose != null) {
                    _setting.g.onClose(_setting.mnode);
                }

                var setline = node.data("setline");
                if (setline != null) {
                    for (var i = 0; i < setline.length; i++) {
                        _event.delLine(setline[i], 'node');
                    }
                }
                _line.removeStartSet(nodeId);//删除被关联的标签

                var set = node.data("set");
                set.forEach(function (el) {
                    el.remove();
                });
                d.remove();
                var helper = _setting.helper;
                for (var o in helper) helper[o].hide();
                if ($('#del_menu'))$("#del_menu").detach();
                _setting.mnode = null;
                /*_setting.nodesData[nodeId] = null;*/
                delete _setting.nodesData[nodeId];
            });
        },
        //删除连线
        delLine: function (line, type) {
            if (type == 'node') {
                deleteLine();
            } else {
                $("#deleteLineModal").modal("show");
                $("#deleteLineModal").find(".confirm-box-ok").unbind("click");
                $("#deleteLineModal").find(".confirm-box-ok").click(function() {
                    $("#deleteLineModal").modal("hide");
                    deleteLine();
                });
                $("#deleteLineModal").find(".confirm-box-cancel").unbind("click");
                $("#deleteLineModal").find(".confirm-box-cancel").click(function() {
                    $("#del_menu").show();
                });
            }
            function deleteLine() {
                var startNodeNum = line.data("startNodeNum");
                var endNodeNum = line.data("endNodeNum");
                var startnode = _setting.nodesData[startNodeNum];
                var endnode = _setting.nodesData[endNodeNum];


                if(type != 'node'){//删除节点，节点endSet保留;用于之后去除无效映射
                    startnode.data("endSet", _tool.arrayRemove(startnode.data("endSet"), endNodeNum));
                    var setline = startnode.data("setline");
                    if (setline != null) {
                        var setline_1 = [];
                        var n = 0;
                        for (var j = 0; j < setline.length; j++) {
                            if (setline[j].data("endNodeNum") != endNodeNum) {
                                setline_1[n] = setline[j];
                                n++;
                            }
                        }
                        startnode.data("setline", setline_1);
                    }
                }
                endnode.data("startSet", _tool.arrayRemove(endnode.data("startSet"), startNodeNum));

                _event.delTagLineArr(endNodeNum);
               /* _setting.linesData[line.data("joinId")] = null;*/
                delete _setting.linesData[line.data("joinId")];
                line.data('line').remove();
                if (line.data('text') != null) {
                    line.data('text').remove();
                }
                $("#del_menu").detach();

                if (type != 'node' && _setting.g.onClose != null) {
                    _setting.g.onClose(_setting.rmline);
                }

                line.remove();
                _setting.rmline = null;
            }


        },
        // 删除连线
        delTagLineArr: function (nodeId) {
            _setting.nodesData[nodeId].data("tagidArr", nodeId);
            var endSet = _setting.nodesData[nodeId].data("endSet");
            if (endSet != null) {
                var tagidArr = "";
                for (var i = 0; i < endSet.length; i++) {
                    if (endSet[i] != null) {
                        tagidArr = "," + _setting.nodesData[nodeId].data("tagid") + "," + _setting.nodesData[endSet[i]].data("tagid") + ",";
                        _setting.nodesData[endSet[i]].data("tagidArr", tagidArr);
                        _event.childLineArr(endSet[i], tagidArr);
                    }

                }
            }
        },
        //子连线链接
        childLineArr: function (nodeId, tagidArr) {
            var nodesData = _setting.nodesData;
            var endSet = _setting.nodesData[nodeId].data("endSet");
            if (endSet != null) {
                if (tagidArr.indexOf(",") == -1) {
                    tagidArr = "," + tagidArr + ",";
                }
                var tagidArr_1 = "";
                for (var i = 0; i < endSet.length; i++) {
                    if (endSet[i] != null) {
                        tagidArr_1 = tagidArr + nodesData[endSet[i]].data("nodeId") + ",";
                        nodesData[endSet[i]].data("tagidArr", tagidArr_1);
                        this.childLineArr(endSet[i], tagidArr_1);
                    }

                }
            }
        },
        //连线事件
        lineEvent: function (line, g) {
            var seld = {
                'fill': "#0098f4",
                'stroke': "#0098f4",
                'stroke-opacity':1
            };
            var noseld = {
                'fill': "#cccccc",
                'stroke': "#cccccc",
                'stroke-opacity': 1
            };
            var chk = false;
            var helper = _setting.helper;
            line.mouseover(function () {
                if(_setting.g.model != "state"){
                    if (_setting.mnode != null) {
                        _event.clearHlightState(_setting.mnode);
                        _setting.mnode = null;
                    }
                    if (_setting.rmline != null) {
                        if (_setting.rmline.data("joinId") != this.data("joinId")) {
                            _setting.rmline.data('line').attr(noseld);
                            _setting.rmline = null;
                        } else {
                            return false;
                        }
                    }

                    this.data('line').attr(seld);
                    _setting.rmline = this;
                    _setting.rmline.data("line").toFront();
                    _event.showDeleteView('line', g, this);
                    _event.showLineCircle(this);

                    var $canvasid = $("#" + _setting.canvasid);
                    chk = true;
                    $canvasid.off("click");
                    $canvasid.on("click", function () {
                        if (_setting.mnode != null) {
                            _setting.mnode = null;
                            _ring.hideDraw();

                        }
                        if (!chk) {
                            if (_setting.rmline != null) {
                                _setting.rmline.data('line').attr(noseld);
                                _setting.rmline = null;

                                helper.sl.hide();
                                helper.el.hide();
                            }

                            $("#del_menu").detach();

                        }

                    });
                    chk = false;
                }
            }).mouseout(function () {
                if(_setting.g.model != "state"){
                    if (_setting.rmline == null) {
                        this.data('line').attr(noseld);
                    }
                }
            }).click(function (e) {
                if(_setting.g.model != "state"){
                    _setting.rmline = this;
                    if (g.onClickline != null) {
                        g.onClickline(_setting.rmline);
                    }
                }
                e.stopPropagation();
            }).dblclick(function () {
                if(_setting.g.model != "state"){
                    _setting.rmline = this;
                    if (g.onClickline != null) {
                        g.onClickline(_setting.rmline);
                    }
                }
            });
        },
        //显示删除按钮
        showDeleteView: function (type, g, element) {
            var delhtml, left, top;
            var canvasid = _setting.canvasid;
            var base = _setting.base;
            var imgSize = _setting.imgSmallSize;
            delhtml = '<div id="del_menu" style="display:none;">' + '<img src = "' + base + '/cancel.png" style="width:' + imgSize + ';height:' + imgSize + ';"/>' + '</div>';
            $("#del_menu").detach();
            $("#" + canvasid).append(delhtml);
            if (type == 'node' && element != null) {
                var closeposition = _tool.changeClosePosition(element);
                left = closeposition.x+imgSize;
                top = closeposition.y-imgSize;
            } else if (type == 'line' && element != null) {
                var lineTextPosition = _tool.changeLineTextPosition(element);
                left = lineTextPosition.cx;
                top = lineTextPosition.cy + 10;
            }
            $delMenu = $("#del_menu");
            $delMenu.css({position: "absolute",cursor:"pointer", left: left, top: top});
            if (type == 'node' && element != null) {
                if (element.data('componentsId') == 'componentsIdStart' || element.data('componentsId') == 'componentsIdEnd') {
                    $delMenu.hide();
                } else {
                    $delMenu.show();
                }
            } else {
                $delMenu.show();
            }
            $delMenu.click(function (e) {
                e.stopPropagation();
                if (g == null) {
                    g = new Object();
                    g.onClose = null;
                }
                if (_setting.rmline != null) {
                    _event.delLine(_setting.rmline);
                    //_setting.rmline = null;
                } else if (_setting.mnode != null) {
                    _event.closeNode(_setting.mnode);
                }

                $("#del_menu").hide();

            });
        },
        showLineCircle:function(line){
            var helper = _setting.helper;

            var startEndAxis = _tool.getStartEndAxis(line.data("path"));

//        	var _sx = startEndAxis.sx;
//            var _sy = startEndAxis.sy;
            var _ex = startEndAxis.ex;
            var _ey = startEndAxis.ey;

//            var snode = line.data("startSet");
            var enode = line.data("endSet");

//            helper.sl.data("node",snode);
//            helper.sl.data("line",line);
//            helper.sl.data("cx",_sx);
//            helper.sl.data("cy",_sy);
//            helper.sl.data("lineType","start");
//            helper.sl.attr({'cx': _sx, 'cy': _sy}).toFront().show();

            helper.el.data("node",enode);
            helper.el.data("line",line);
            helper.el.data("cx",_ex);
            helper.el.data("cy",_ey);
            helper.sl.data("lineType","end");
            helper.el.attr({'cx': _ex, 'cy': _ey}).toFront().show();
        },
        clearHlightState:function(fontNode){
            if(_setting.g.model != "state"){
                _ring.hideDraw();
                fontNode.data("bgnode").attr({
                    'stroke': "#cccccc"
                });
            }
            for(var joinId in _setting.linesData){
                _setting.linesData[joinId].data("line").attr({
                    'stroke': "#cccccc",
                    'fill': "#cccccc",
                });
            }
        }

    };
    _line = {
        //创建箭头
        getArr: function (x1, y1, x2, y2, size) {
            var angle = Raphael.angle(x1, y1, x2, y2);//得到两点之间的角度
            var a45 = Raphael.rad(angle - 45);//角度转换成弧度
            var a45m = Raphael.rad(angle + 45);
            var x2a = x2 + Math.cos(a45) * size;
            var y2a = y2 + Math.sin(a45) * size;
            var x2b = x2 + Math.cos(a45m) * size;
            var y2b = y2 + Math.sin(a45m) * size;
            return "M" + x2 + "," + y2 + "L" + x2a + "," + y2a + "M" + x2 + "," + y2 + "L" + x2b + "," + y2b + "L" + x2a + "," + y2a;
        },
        //检测是否已经连线
        chkNode: function (set, nodeNum) {
            for (var i = 0; i < set.length; i++) {
                if (set[i] == nodeNum) {
                    return true;
                }
            }
            return false;
        },
        // 删除上一级关联标签startSet
        removeStartSet: function (nodeId) {
            var startSet = _setting.nodesData[nodeId].data("startSet");
            if (startSet != null) {
                var n = 0;
                var node, setline;
                for (var i = 0; i < startSet.length; i++) {
                    node = _setting.nodesData[startSet[i]];
                    node.data("endSet", _tool.arrayRemove(node.data("endSet"), nodeId));
                    setline = node.data("setline");
                    if (setline != null) {
                        var setline_1 = [];
                        n = 0;
                        for (var j = 0; j < setline.length; j++) {
                            if (setline[j].data("endNodeNum") == nodeId) {
                                /*_setting.linesData[setline[j].data("joinId")] = null;*/
                                delete _setting.linesData[setline[j].data("joinId")];
                                setline[j].data('line').remove();
                                if (setline[j].data('text') != null) {
                                    setline[j].data('text').remove();
                                }

                                setline[j].remove();

                            } else {
                                setline_1[n] = setline[j];
                                n++;
                            }
                        }
                        node.data("setline", setline_1);
                    }
                    _setting.nodesData[startSet[i]] = node;
                }
            }
        },
        // 移动节点前的线
        moveStartSetLine: function (node) {
            var startSet = node.data("startSet");
            var setline;
            var obj, endNode, linenode;
            var nodeId = node.data("nodeId");
            if (startSet == null) {
            } else {
                for (var i = 0; i < startSet.length; i++) {
                    var endId = startSet[i];
                    endNode = _setting.nodesData[endId];

                    setline = endNode.data("setline");
                    if (setline != null) {
                        for (var j = 0; j < setline.length; j++) {
                            linenode = setline[j];
                            if (linenode.data("endNodeNum") != nodeId) {
                            } else {
                                obj = _line.getLineMvNode(endNode, node, linenode.data("joinType"), linenode.data("joinDirection"));
                                linenode.attr({path: obj.path});
                                linenode.data('line').attr({path: obj.path});
                                var textPosition = _tool.changeLineTextPosition(linenode);
                                if (linenode.data('text') != null) {
                                    linenode.data('text').attr({'x': textPosition.cx, 'y': textPosition.cy});
                                }
                                _setting.linesData[linenode.data("joinId")].data("path", obj.path);
                                _setting.linesData[linenode.data("joinId")].data('line').data("path", obj.path);
                                var startEndAxis = _tool.getStartEndAxis(obj.path);
                                linenode.data('sx', startEndAxis.sx);
                                linenode.data('sy', startEndAxis.sy);
                                linenode.data('ex', startEndAxis.ex);
                                linenode.data('ey', startEndAxis.ey);
                            }

                        }
                    }
                }
            }
        },
        //移动节点后的线
        moveEndSetLine: function (node) {
            var setline = node.data("setline");
            var endSet = node.data("endSet");
            var enodeNum, endNode, obj, linenode;
            if (endSet != null) {
                for (var i = 0; i < endSet.length; i++) {
                    enodeNum = endSet[i];
                    endNode = _setting.nodesData[enodeNum];
                    if (setline != null) {
                        for (var j = 0; j < setline.length; j++) {
                            linenode = setline[j];
                            if (linenode.data("endNodeNum") == enodeNum) {
                                obj = _line.getLineMvNode(node, endNode, linenode.data("joinType"), linenode.data("joinDirection"));
                                linenode.attr({path: obj.path});
                                linenode.data('line').attr({path: obj.path});
                                var textPosition = _tool.changeLineTextPosition(linenode);
                                if (linenode.data('text') != null) {
                                    linenode.data('text').attr({'x': textPosition.cx, 'y': textPosition.cy});
                                }
                                _setting.linesData[linenode.data("joinId")].data("path", obj.path);
                                _setting.linesData[linenode.data("joinId")].data('line').data("path", obj.path);
                                var startEndAxis = _tool.getStartEndAxis(obj.path);
                                linenode.data('sx', startEndAxis.sx);
                                linenode.data('sy', startEndAxis.sy);
                                linenode.data('ex', startEndAxis.ex);
                                linenode.data('ey', startEndAxis.ey);
                            }
                        }
                    }
                }
            }
        },
        //创建连接线时获取连接线参数
        getLineNode: function (snode, sx, sy, ex, ey, jointype) {
            var obj = {
                path: "",
                x: 0,
                y: 0,
                direction: null,
                nodeId: null
            };
            var x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;
            var h0 = 25, w0 = 25, h2, w2;
            var direction;

            x1 = sx;
            y1 = sy;
            var
                h1 = Math.abs(ey - sy),
                w1 = Math.abs(ex - sx);
            var nodesData = _setting.nodesData;
            switch (jointype) {
                case "t":
                    if (w1 > h1) {//线的方向是左右
                        if (ey - sy < 0) {
                            w1 = (ex - sx ) / 2;
                            h1 = ey - sy;
                            h2 = 0;
                        } else {
                            h1 = -h0;
                            w1 = (ex - sx - w0);
                            h2 = (ey - sy + h0);
                        }
                    } else {//线的方向是上下
                        if (ey - sy < 0) {
                            h1 = -(sy - ey) / 2;
                            w1 = (ex - sx);
                        } else {
                            h1 = -h0;
                            w1 = (ex - sx);
                        }
                        h2 = 0;
                    }
                    x2 = x1;
                    y2 = y1 + h1;
                    x3 = x2 + w1;
                    y3 = y2;
                    x4 = x3;
                    y4 = y3 + h2;
                    x5 = x4;
                    y5 = y4;
                    x6 = ex;
                    y6 = ey;
                    break;
                case "l":
                    if (w1 > h1) {//线的方向是左右
                        if (ex - sx > 0) {
                            w1 = -w0;
                        } else {
                            w1 = -(sx - ex ) / 2;
                        }
                        w2 = 0;
                        h1 = ey - sy;
                    } else {//线的方向是上下
                        if (ex - sx < 0) {
                            if (ey - sy > 0) {
                                h1 = (ey - sy ) - h0;
                            } else {
                                h1 = (ey - sy ) + h0;
                            }
                            w1 = ex - sx;
                            w2 = 0;
                        } else {
                            w1 = -w0;
                            h1 = (ey - sy) / 2;
                            w2 = ex - sx + w0;
                        }
                    }
                    x2 = x1 + w1;
                    y2 = y1;
                    x3 = x2;
                    y3 = y2 + h1;
                    x4 = x3 + w2;
                    y4 = y3;
                    x5 = x4;
                    y5 = y4;
                    x6 = ex;
                    y6 = ey;
                    break;
                case "r":
                    if (w1 > h1) {//线的方向是左右
                        if (ex - sx > 0) {
                            w1 = (ex - sx) / 2;
                        } else {
                            w1 = w0;
                        }
                        h1 = ey - sy;
                        w2 = 0;
                    } else {//线的方向是上下
                        if (ex - sx > 0) {
                            if (ey - sy > 0) {
                                h1 = ( ey - sy  ) / 2;
                            } else {
                                h1 = (ey - sy ) / 2;
                            }
                            w1 = ex - sx;
                            w2 = 0;
                        } else {
                            w1 = w0;
                            h1 = (ey - sy) / 2;
                            w2 = -( sx - ex + w0);
                        }
                    }
                    x2 = x1 + w1;
                    y2 = y1;
                    x3 = x2;
                    y3 = y2 + h1;
                    x4 = x3 + w2;
                    y4 = y3;
                    x5 = x4;
                    y5 = y4;
                    x6 = ex;
                    y6 = ey;
                    break;
                case "b":
                    if (w1 > h1) {//线的方向是左右
                        if (ey - sy > 0) {
                            w1 = (ex - sx ) / 2;
                            h1 = ey - sy;
                            h2 = 0;
                        } else {
                            h1 = h0;
                            w1 = (ex - sx - w0);
                            h2 = ey - sy - h0;
                        }
                    } else {//线的方向是上下
                        if (ey - sy > 0) {
                            h1 = (ey - sy) / 2;
                            w1 = (ex - sx);
                            h2 = h0;
                        } else {
                            h1 = h0;
                            w1 = (ex - sx);
                            h2 = h0;
                        }
                    }
                    x2 = x1;
                    y2 = y1 + h1;
                    x3 = x2 + w1;
                    y3 = y2;
                    x4 = x3;
                    y4 = y3 + h2;
                    x5 = x4;
                    y5 = y4;
                    x6 = ex;
                    y6 = ey;
                    break;
            }

            var path = "M" + x1 + "," + y1 + "L" + x2 + "," + y2
                + "M" + x2 + "," + y2 + "L" + x3 + "," + y3
                + "M" + x3 + "," + y3 + "L" + x4 + "," + y4
                + "M" + x4 + "," + y4 + "L" + x5 + "," + y5
                + "M" + x5 + "," + y5 + "L" + x6 + "," + y6;

            path += _line.getArr(x5, y5, x6, y6, 8);
            obj.path = path;
            obj.x = x6;
            obj.y = y6;
            for (var nodeId in nodesData) {
                var currentNode = nodesData[nodeId];
                if (currentNode == null){
                    continue;
                }
                var nodeInfo = currentNode.getBBox();
                var cx = nodeInfo.x;
                var cy = nodeInfo.y;
                var cw = nodeInfo.width;
                var ch = nodeInfo.height;
                var space = _setting.space;

                var c1 = cx - space,
                    c2 = cx - space + (cw + 2 * space) / 4,
                    c3 = cx + cw / 2,
                    c4 = cx - space + (cw + 2 * space) / 4 * 3,
                    c5 = cx + cw + space,
                    d1 = cy - space,
                    d2 = cy - space + (ch + 2 * space) / 4,
                    d3 = cy - space + (ch + 2 * space) / 4 * 3,
                    d4 = cy + ch + space;
                if ((ex >= c1 && ex <= c2 && ey >= d1 && ey <= d2) || (ex >= c1 && ex <= c3 && ey >= d2 && ey <= d3) || (ex >= c1 && ex <= c2 && ey >= d3 && ey <= d4)) {
                    direction = "l";
                } else if (ex >= c2 && ex <= c4 && ey >= d1 && ey <= d2) {
                    direction = "t";
                } else if ((ex >= c4 && ex <= c5 && ey >= d1 && ey <= d2) || (ex >= c3 && ex <= c5 && ey >= d2 && ey <= d3) || (ex >= c4 && ex <= c5 && ey >= d3 && ey <= d4)) {
                    direction = "r";
                } else if (ex >= c2 && ex <= c4 && ey >= d3 && ey <= d4) {
                    direction = "b";
                }else {
                    direction = null;
                }
                if (direction != null) {
                    obj = _line.getLineMvNode(snode,currentNode, jointype, direction);
                    obj.direction = direction;
                    obj.nodeId = nodeId;
                }

            }

            return obj;
        },
        //获取移动连接线
        getLineMvNode: function (starNode, endNode, jointype, direction) {
           /* var st = starNode.data("nodeType");
            var et = endNode.data("nodeType");*/

            var sx, sy, ex, ey;

            var sw = starNode.data("width");
            var sh = starNode.data("height");

            var ew = endNode.data("width");
            var eh = endNode.data("height");
            //初始位置、终止位置全部初始化为中间底部

            sx = starNode.data("vx") + sw / 2;
            sy = starNode.data("vy") + sh;

            ex = endNode.data("vx") + ew / 2;
            ey = endNode.data("vy") + eh;


            var obj = {path: "", x: 0, y: 0};
            var x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;
            var h0 = 25, w0 = 25;
            var h1, h2, w1, w2;
            if (jointype == "b") {
                x1 = sx;
                y1 = sy;
                if (direction == "t") {//下上
                    if (ey - eh - sy > 0) {
                        w1 = ex - sx;
                        h1 = (ey - sy - eh) / 2;
                        h2 = 0;
                    } else {
                        h1 = h0;
                        h2 = -(2 * h0 - (ey - eh - sy));
                        if (ex - ew / 2 - (sx + sw / 2) > 0) {
                            w1 = sw / 2 + (ex - ew / 2 - sx - sw / 2 ) / 2;
                        } else if (ex - ew / 2 - (sx - sw / 2) > 0 && ex - ew / 2 - (sx + sw / 2) < 0) {
                            w1 = -(sw / 2 + w0);
                        } else if (ex - ew / 2 - (sx - sw / 2) < 0 && ex >= sx) {
                            w1 = -(sw / 2 + w0 - (ex - ew / 2 - (sx - sw / 2)));
                        } else if (ex < sx && ex + ew / 2 - (sx + sw / 2) > 0) {
                            w1 = -(ex - ew / 2 - sx - sw / 2 + w0 + sw / 2);
                        } else if (ex + ew / 2 - (sx + sw / 2) < 0 && ex + ew / 2 - (sx - sw / 2) > 0) {
                            w1 = sw / 2 + w0;
                        } else {
                            w1 = -(sw / 2 - ( ex + ew / 2 - (sx - sw / 2)) / 2 );
                        }
                    }
                    ex = ex;
                    ey = ey - eh;
                } else if (direction == "l") {//下左
                    if (ex - ew / 2 - sx < sw / 2 && ey - sy < eh) {
                        if (ey - sy > 0 && ey - sy < eh) {
                            h1 = ey - sy + h0;
                        } else if (ey - sy < 0) {
                            h1 = h0;
                        }
                        if (ex - ew / 2 - sx + sw / 2 < 0) {
                            w1 = ex - sx - ew / 2 - w0;
                        } else {
                            w1 = -(w0 + sw / 2);
                        }
                    } else if (ex - ew / 2 - sx > 0 && ey - sy > eh / 2) {
                        h1 = ey - sy - eh / 2;
                        w1 = (ex - sx - ew / 2) / 2;
                    } else if (ex - ew / 2 - sx < 0 && ey - sy > eh) {
                        if (ey - sy - eh < h0) {
                            h1 = (ey - sy - eh ) / 2;
                        } else {
                            h1 = h0;
                        }
                        w1 = ex - sx - ew / 2 - w0;
                    } else {
                        if (ex - ew / 2 - sx + sw / 2 > 0) {
                            w1 = (ex - ew / 2 - sx - sw / 2 ) / 2 + sw / 2;
                        } else {
                            w1 = -(sw / 2 + w0);
                        }
                        h1 = h0;
                    }
                    h2 = ey - sy - eh / 2 - h1;
                    ex = ex - ew / 2;
                    ey = ey - eh / 2;
                } else if (direction == "r") {//下右
                    if (ex + ew / 2 - sx < 0 && ey - sy > sh) {
                        h1 = (ey - sy - eh / 2);
                        w1 = ex - sx + ew / 2;
                    } else if (ex + ew / 2 - sx > 0 && ey - sy > sh / 2) {
                        h1 = h0;
                        w1 = ex + ew / 2 - sx + w0;
                    } else if (ex - sx + ew / 2 + sw / 2 < 0 && ey - sy < sh / 2) {
                        if (ey - sy < sh / 2 && ey - sy > -sh) {
                            h1 = ey - sy + h0 + sh / 2;
                        } else {
                            h1 = h0;
                        }
                        w1 = -(ex - sx + ew / 2 + sw / 2) / 2 + sw / 2;
                        w1 = -w1;
                    } else {
                        if (ey - sy < sh / 2) {
                            h1 = h0;
                        } else {
                            h1 = h0 + (ey - sy);
                        }
                        if (ex + ew / 2 - (sx - sw / 2) > 0 && ex + ew / 2 - (sx + sw / 2) < 0) {
                            w1 = sw / 2 + w0;
                        } else {
                            w1 = ex - sx + ew / 2 + w0;
                        }
                    }
                    h2 = ey - sy - eh / 2 - h1;
                    ex = ex + ew / 2;
                    ey = ey - eh / 2;

                } else if (direction == "b") {//下下
                    if (ex - sx >= -(sw / 2 + w0 ) && ex - sx <= 0) {
                        if (ey - sy > 0) {
                            w1 = ex - sx + (sw / 2 + w0);
                        } else {
                            w1 = -(sw / 2 + w0);
                        }
                    } else if (ex - sx < (sw / 2 + w0 ) && ex - sx > 0) {
                        if (ey - sy > 0) {
                            w1 = (ex - sx) - (sw / 2 + w0);
                        } else {
                            w1 = sw / 2 + w0;
                        }
                    } else {
                        w1 = ex - sx;
                    }
                    if (ex - sx <= -(sw / 2 + w0 ) || ex - sx >= sw / 2 + w0) {
                        if (ey - sy > 0) {
                            h1 = h0 + ey - sy;
                            h2 = 0;
                        } else {
                            h1 = h0;
                            h2 = 0;
                        }
                    } else {
                        h1 = h0;
                        h2 = ey - sy;
                    }
                }
                x2 = x1;
                y2 = y1 + h1;
                x3 = x2 + w1;
                y3 = y2;
                x4 = x3;
                y4 = y3 + h2;
                if (direction == "t" || direction == "b") {
                    x5 = ex;
                } else {
                    x5 = x4;
                }
                y5 = y4;
                x6 = ex;
                y6 = ey;
            }
            else if (jointype == "l") {
                x1 = sx - sw / 2;
                y1 = sy - sh / 2;
                if (direction == "t") {//左上
                    if (ex - sx < -sw / 2 && ey - eh - sy + sh / 2 > 0) {
                        w1 = ex - sx + sw / 2;
                        h1 = (ey - eh - sy + sh / 2) / 2;
                    } else if (ex - sx > -sw / 2) {
                        if (ey - eh - sy > 0) {
                            h1 = sh / 2 + (ey - eh - sy) / 2;
                        } else {
                            h1 = -(sy - sh / 2 - ey + eh + h0);
                        }
                        w1 = -w0;
                    } else {
                        if (ex - sx > -sw && ex - sx < 0) {
                            w1 = ex - sx - w0;
                        } else if (ex - sx <= -sw && sx - ex - sw <= w0) {
                            w1 = (ex + ew / 2 - sx + sw / 2) / 2;
                        } else {
                            w1 = -w0;
                        }
                        h1 = -(sy - sh / 2 - ey + eh + h0);
                    }
                    w2 = 0;
                    h2 = 0;
                    ex = ex;
                    ey = ey - eh;

                } else if (direction == "b") { //左下
                    if (ex - sx < -sw / 2 && ey - (sy - sh / 2) < 0) {
                        w1 = ex - sx + sw / 2;
                        h1 = -(sy - sh / 2 - ey) / 2;
                    } else if (ex - (sx - sw / 2) > 0) {
                        if (ey - sy < -sh) {
                            if (ey - sy + sh < -2 * h0) {
                                h1 = -(sh / 2 - (ey - sy + sh) - h0);
                            } else {
                                h1 = -sh / 2 - (sy - sh - ey) / 2;
                            }

                        } else if (ey - sy > -sh && ey - sy < 0) {
                            h1 = h0 + sh / 2;
                        } else {
                            h1 = h0 + sh / 2 + ey - sy;
                        }
                        if (ex - ew / 2 - (sx - sw / 2) < 0) {
                            w1 = -(sx - sw / 2 - (ex - ew / 2) + w0);
                        } else {
                            w1 = -w0;
                        }
                    } else {
                        w1 = -(sx - sw / 2 - (ex - ew / 2) + w0);
                        h1 = ey - (sy - sh / 2) + h0;
                    }
                    w2 = 0;
                    h2 = 0;

                } else if (direction == "l") { //左左
                    if (ey - sy > sh || ey - sy < -sh) {
                        if (ex - sx > 0) {
                            w1 = -w0;
                        } else {
                            w1 = ex - sx - w0;
                        }
                        h1 = ey - eh / 2 - sy + sh / 2;
                        w2 = 0;
                    } else {
                        if (ey - sy > 0 && ey - sy < sh) {
                            if (ex - sx > 0) {
                                h1 = h0 + sh / 2;
                                w2 = ex - sx;
                            } else {
                                h1 = ey - sy - sh;
                                w2 = ex - sx;
                            }
                        } else {
                            if (ex - sx > 0) {
                                h1 = -(h0 + sh / 2);
                                w2 = ex - sx;
                            } else {
                                h1 = sh - sy + ey;
                                w2 = ex - sx;
                            }
                        }
                        w1 = -w0;
                    }
                    h2 = 0;
                    ex = ex - ew / 2;
                    ey = ey - eh / 2;

                } else if (direction == "r") {  //左右
                    if (ex + ew / 2 - (sx - sw / 2) > 0) {
                        w1 = -w0;
                        w2 = (ex + ew / 2 + w0) - (sx - sw / 2 - w0);
                        if (ey - sy < -sh) {
                            h1 = h0 + (ey - eh - sy) / 2;
                        } else if (ey - sy >= -sh && ey - sy < 0) {
                            h1 = sh / 2 + h0;
                        } else if (ey - sy >= 0 && ey - sy < eh) {
                            h1 = -sh / 2 - h0;
                        } else {
                            h1 = h0 + (ey - eh - sy) / 2;
                        }
                    } else {
                        w1 = (ex + ew / 2 - sx + sw / 2) / 2;
                        w2 = (ex + ew / 2 - sx + sw / 2) / 2;
                        h1 = ey - eh / 2 - sy + sh / 2;
                    }
                    h2 = 0;
                    ex = ex + ew / 2;
                    ey = ey - eh / 2;
                }
                x2 = x1 + w1;
                y2 = y1;
                x3 = x2;
                y3 = y2 + h1;
                x4 = x3 + w2;
                y4 = y3 + h2;
                if (direction == "t" || direction == "b") {
                    x5 = ex;
                    y5 = y4;
                } else {
                    x5 = x4;
                    y5 = ey;
                }
                x6 = ex;
                y6 = ey;
            }
            else if (jointype == "r") {
                x1 = sx + sw / 2;
                y1 = sy - sh / 2;
                if (direction == "t") {//右上
                    if (ex - (sx + sw / 2) > 0 && ey - eh - (sy - sh / 2) > 0) {
                        w1 = ex - (sx + sw / 2);
                        h1 = (ey - eh - sy + sh / 2) / 2;
                        w2 = 0;
                    } else if (ex - ew / 2 - (sx + sw / 2) < 0 && ex + ew / 2 - (sx + sw / 2) > 0 && ey - (sy - sh / 2) < 0) {
                        w1 = ex + ew / 2 + w0 - (sx + sw / 2);
                        h1 = ey - eh - h0 - (sy - sh / 2);
                        w2 = 0;
                    } else {
                        w1 = w0;
                        w2 = -((sx + sw / 2 + w0) - ex);
                        h1 = (ey - eh - h0 - sy + sh / 2  );
                    }

                    ey = ey - eh;
                } else if (direction == "b") {//右下
                    if (ex - sx > sw / 2 && ey - sy < -sh / 2) {
                        w1 = ex - sx - sw / 2;
                        h1 = (ey - sy + sh / 2) / 2;
                        w2 = 0;
                    } else if (ex - sx < sw / 2) {
                        if (ey - sy > 0) {
                            h1 = ey - sy + sh / 2 + h0;
                        } else if (ey - sy < 0 && ey - (sy - sh) > -h0) {
                            h1 = sh / 2 + h0;
                        } else {
                            h1 = -(sy - ey - sh / 2 - h0);
                        }
                        if (ex - sx > 0) {
                            w1 = ex - sx + w0;
                        } else {
                            w1 = w0;
                        }
                        w2 = 0;
                    } else {
                        if (ex - sx > sw && ex - sx - ew / 2 - sw / 2 < w0 * 2) {
                            w1 = (ex - ew / 2 - sx - sw / 2) / 2;
                        } else if (ex - sx < sw && ex - sx > 0) {
                            w1 = ex - sx + w0;
                        }
                        else {
                            w1 = w0;
                        }
                        h1 = ey - sy + sh / 2 + h0;
                        w2 = 0;
                    }

                } else if (direction == "l") {//右左！！！！！
                    if (ex - ew / 2 > sx + sw / 2) {
                        w1 = ( ex - ew / 2 - sx - sw / 2) / 2;
                        h1 = (ey - eh / 2 - sy + sh / 2 ) / 2;
                        w2 = 0;
                    } else {
                        if (ex - sx < sw && ex - sx > 0 && ey - sy < eh && ey - sy > -eh) {
                            w1 = ex - sx + w0;
                            w2 = -(sw + 2 * w0);
                        } else {
                            w1 = w0;
                            w2 = -(sx - ex + sw / 2 + ew / 2 + 2 * w0);
                        }
                        if (ey - sy < -eh) {
                            h1 = -(sy - ey - eh ) / 2 - sh / 2;
                        } else if (ey - sy > -eh && ey - sy < 0) {
                            h1 = -(sy - ey + sh / 2 + h0);
                        } else if (ey - sy > 0 && ey - sy < eh) {
                            h1 = ey - sy + sh / 2 + h0;
                        } else {
                            h1 = (ey - sy - eh ) / 2 + sh / 2;
                        }
                    }

                    ex = ex - ew / 2;
                    ey = ey - eh / 2;

                } else if (direction == "r") {//右右
                    if (ey - sy > sh || ey - sy < -sh) {
                        if (ex - sx > 0) {
                            w1 = ex + ew / 2 + w0 - (sx + sw / 2);
                        } else {
                            w1 = w0;
                        }
                        h1 = -(sy - ey - sh / 2 + eh / 2);
                        w2 = 0;
                    } else {
                        if (ey - sy > 0 && ey - sy < sh) {
                            if (ex - sx > 0) {
                                h1 = sh - (sy - ey);

                                w2 = ex - sx;
                            } else {
                                h1 = -h0 - sh / 2;
                                w2 = ex - sx;
                            }
                        } else {
                            if (ex - sx > 0) {
                                h1 = (ey - sy ) - sh;
                                w2 = ex - sx;
                            } else {
                                h1 = h0 + sh / 2;
                                w2 = ex - sx;
                            }
                        }
                        w1 = w0;
                    }
                    ex = ex + ew / 2;
                    ey = ey - eh / 2;

                }
                h2 = 0;
                x2 = x1 + w1;
                y2 = y1;
                x3 = x2;
                y3 = y2 + h1;
                x4 = x3 + w2;
                y4 = y3 + h2;
                if (direction == "t" || direction == "b") {
                    x5 = ex;
                    y5 = y4;
                } else {
                    x5 = x4;
                    y5 = ey;
                }
                x6 = ex;
                y6 = ey;

            }
            else if (jointype == "t") {
                if (direction == "t") {//上上
                    if (ey - eh - (sy - sh) <= 0) {
                        w1 = ex - sx;
                        h1 = ey - eh - sy + sh - h0;
                        h2 = 0;
                    } else {
                        h1 = -h0;
                        h2 = (ey - eh - (sy - sh) + h0) / 2;
                        if (ex - sx >= -(sw / 2 + w0 ) && ex - sx <= 0) {
                            w1 = -(sw / 2 + w0);
                        } else if (ex - sx < (sw / 2 + w0 ) && ex - sx > 0) {
                            w1 = sw / 2 + w0;
                        } else {
                            w1 = ex - sx;
                        }
                    }
                    ey = ey - eh;
                    w2 = 0;
                } else if (direction == "b") {//上下
                    if (ey - (sy - sh - h0) < 0) {
                        h1 = -(sy - ey - sh ) / 2;
                        w1 = ex - sx;
                        h2 = 0;
                    } else {
                        h1 = -h0;
                        h2 = 2 * h0 + eh + ey - sy;
                        if (ex - sx > -sw && sx - ex < 0) {
                            w1 = -sw / 2 - w0 + (ex - sx );
                        } else if (ex - sx > 0 && ex - sx < w) {
                            w1 = -(sw / 2 + w0 + (ex - sx ));
                        } else {
                            w1 = -(sx - ex) / 2;
                        }
                    }
                    w2 = 0;
                } else if (direction == "l") {//上左
                    if (ey - sy < -sh && ex - sx < sw / 2) {
                        if (sy - ey - sh > h0) {
                            h1 = -h0;
                        } else {
                            h1 = -(sy - ey - sh ) / 2;
                        }
                        w1 = -(sw / 2 + w0 + (sx - ex));
                        w2 = 0;
                    } else if (ey - sy < -sh && ex - sx > sw / 2) {
                        h1 = -(sy - ey - sh + eh / 2);
                        w1 = ex - sx - sw / 2;
                        w2 = -w0;
                    } else {
                        w2 = 0;
                        if (ey - sy > -sh && ey - sy < 0) {
                            h1 = -(sy - ey + h0);
                        } else {
                            h1 = -h0;
                        }
                        if (ex - sx > 0 && ex - sx < sw) {
                            w1 = -(w0 + sw / 2);
                        } else if (ex - sx > 0) {
                            w1 = (ex - sx - sw ) / 2 + sw / 2;
                        } else {
                            w1 = -(sx - ex + ew / 2 + w0);
                        }
                    }
                    ex = ex - ew / 2;
                    ey = ey - eh / 2;
                    h2 = 0;
                } else if (direction == "r") {//上右
                    if (ey - sy < -sh && ex - sx > sw / 2) {
                        if (sy - ey - sh > h0) {
                            h1 = -h0;
                        } else {
                            h1 = -(sy - ey - sh ) / 2;
                        }
                        w1 = sw / 2 + w0 + (ex - sx);

                    } else if (ey - sy < -sh && ex - sx < sw / 2) {
                        if (ex - sx > -sw / 2) {
                            w1 = w0 + sw / 2 - (sx - ex);
                            if (sy - sh - ey < 2 * h0) {
                                h1 = -(sy - sh - ey ) / 2;
                            } else {
                                h1 = -h0;
                            }
                        } else {
                            w1 = -(sx - ex - ew / 2);
                            h1 = -(sy - ey - sh + eh / 2);
                        }
                    } else {
                        if (ey - sy > -sh && ey - sy < 0) {
                            h1 = -( sy - ey + h0);
                        } else {
                            h1 = -h0;
                        }
                        if (ex - sx > 0) {
                            w1 = ex - sx + ew / 2 + w0;
                        } else if (ex - sx < 0 && ex - sx > -sw) {
                            w1 = w0 + sw / 2;
                        } else {
                            w1 = (ex - sx - sw ) / 2 + sw / 2;
                        }
                    }
                    ex = ex + ew / 2;
                    ey = ey - eh / 2;
                    h2 = 0;
                    w2 = 0;
                }
                x1 = sx;
                y1 = sy - sh;
                x2 = x1;
                y2 = y1 + h1;
                x3 = x2 + w1;
                y3 = y2;
                x4 = x3 + w2;

                if (direction == "t" || direction == "b") {
                    y4 = y3 + h2;
                    x5 = ex;
                } else {
                    y4 = ey;
                    x5 = x4;
                }
                y5 = y4;
                x6 = ex;
                y6 = ey;

            }

            x1 = Math.round(x1);
            y1 = Math.round(y1);
            x2 = Math.round(x2);
            y2 = Math.round(y2);
            x3 = Math.round(x3);
            y3 = Math.round(y3);
            x4 = Math.round(x4);
            y4 = Math.round(y4);
            x5 = Math.round(x5);
            y5 = Math.round(y5);
            x6 = Math.round(x6);
            y6 = Math.round(y6);
            var path = "M" + x1 + "," + y1 + "L" + x2 + "," + y2
                + "M" + x2 + "," + y2 + "L" + x3 + "," + y3
                + "M" + x3 + "," + y3 + "L" + x4 + "," + y4
                + "M" + x4 + "," + y4 + "L" + x5 + "," + y5
                + "M" + x5 + "," + y5 + "L" + x6 + "," + y6;
            path += _line.getArr(x5, y5, x6, y6, 8);
            obj.path = path;
            obj.x = x6;
            obj.y = y6;

            return obj;
        }
    };
    function appendModal(){
        var nodeModalDiv='<div class="modal fade bs-example-modal-sm" id="deleteNodeModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog modal-sm">'+
            '<div class="modal-content bcloud-confirm-content">'+
            '<div class="modal-header bcloud-confirm-header">'+
            '删除信息'+
            '</div>'+
            '<div class="modal-body bcloud-confirm-body">'+
            '是否删除当前节点？'+
            '</div>'+
            '<div class="modal-footer bcloud-confirm-footer">'+
            '<button class="btn btn-bcloud-blue active confirm-box-ok">确定</button>'+
            '<button class="btn  btn-bcloud-white confirm-box-cancel" data-dismiss="modal">取消</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        $("body").append(nodeModalDiv);
        var lineModalDiv='<div class="modal fade bs-example-modal-sm" id="deleteLineModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog modal-sm">'+
            '<div class="modal-content bcloud-confirm-content">'+
            '<div class="modal-header bcloud-confirm-header">'+
            '删除信息'+
            '</div>'+
            '<div class="modal-body bcloud-confirm-body">'+
            '是否删除当前选中的线？'+
            '</div>'+
            '<div class="modal-footer bcloud-confirm-footer">'+
            '<button class="btn btn-bcloud-blue active confirm-box-ok">确定</button>'+
            '<button class="btn  btn-bcloud-white confirm-box-cancel" data-dismiss="modal">取消</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        $("body").append(lineModalDiv);
    }
    $.fn.raphael = function () {
        var canvasid = this.attr("id");//this指代的是我们在调用该插件时，用jQuery选择器选中的元素，一般是一个jQuery类型的集合
        var tagObj;
        tagObj = {
            init: function (options) {
                appendModal();
                if (canvasid == null)return;
                var g = $.extend({}, $.fn.raphael.defaults, options);
                _setting.g=g;
                var tagOperation = {
                    //新增节点
                    addNode: function (setting, update) {
                        if(update == "create"){
                            var n = $.extend({}, $.fn.raphael.defaults.node, setting);
                            if (n.nodeId == null) {
                                n.nodeId = _tool.uuid();
                            }
                            n.width = parseInt(n.width);
                            // n.width = 66;
                            n.height = parseInt(n.height);
                            // n.height = 66;
                            // n.width=n.height;
                            var bgnode = _consts.createBaseNode(n);
                            var tnNodeArr = _consts.createNodeText(n, bgnode)/*.toFront()*/,
                                tnNode = tnNodeArr[0],
                                tnNode0 = tnNodeArr[1];
                            var image = _consts.createNodeImg(n, bgnode).toFront();
                            var fontNode = _consts.createFontNode(n).toFront();
                            var pathShape = _consts.createPathShape(n, bgnode).toFront();
                            pathShape.data('nodeId', n.nodeId);

                            pathShape.data("x", n.x);
                            pathShape.data("y", n.y);
                            pathShape.data("width", n.width);
                            pathShape.data("height", n.height);

                            //zy
                            /* if(n.radius == undefined){
                                 // n.radius = 20;
                                 n.radius = 0;
                             }*/
                            fontNode.data("radius", n.radius);
                            //fontNode.data("radius", 0);
                            fontNode.data("options", g);
                            fontNode.data("nodeId", n.nodeId);
                            fontNode.data("nodeName", n.nodeName);
                            fontNode.data("componentsId", n.componentsId);
                            fontNode.data("img", n.img);
                            fontNode.data("nodeType", n.nodeType);
                            fontNode.data("nodeStyle", n.nodeStyle);
                            fontNode.data("cx", 0);
                            fontNode.data("cy", 0);
                            fontNode.data("vx", n.x);
                            fontNode.data("vy", n.y);
                            fontNode.data("width", n.width);
                            fontNode.data("minWidth", n.minWidth);
                            fontNode.data("maxWidth", n.maxWidth);
                            fontNode.data("height", n.height);
                            fontNode.data("minHeight", n.minHeight);
                            fontNode.data("maxHeight", n.maxHeight);
                            fontNode.data("tagidArr", n.nodeId);
                            fontNode.data("tagid", n.nodeId);
                            if(n.hasOwnProperty("upState")){
                                fontNode.data("upState", n.upState);
                            }
                            var set = _setting.canvas.set();
                            set.push(tnNode,tnNode0, bgnode, fontNode, pathShape, image);
                            fontNode.data("set", set);
                            fontNode.data("tnNode", tnNode);
                            fontNode.data("tnNode0", tnNode0);
                            fontNode.data("bgnode", bgnode);
                            fontNode.data("image", image);
                            fontNode.data("pathShape", pathShape);
                            fontNode.data("setline", null);

                            _event.nodeEvent(fontNode, g);
                            _event.pathShapeEvent(pathShape, g);
                            _setting.nodesData[n.nodeId] = fontNode;
                            return fontNode;
                        }else{
                            //跟新节点状态边框颜色
                            _setting.nodesData[setting.nodeId].data("upState",setting.upState);
                            var bgnode = _setting.nodesData[setting.nodeId].data("bgnode");

                            _tool.setUpAnimation(setting, bgnode);
                            var attr = {
                                'stroke': _tool.getNodeStateColor(setting.upState)
                            };
                            setTimeout(function(){ bgnode.attr(attr);},800);

                            //跟新节点状态时间文本显示
                            var nodeTime = _tool.getStimeText(setting);
                            var tnNode0 = _setting.nodesData[setting.nodeId].data("tnNode0");
                            tnNode0.attr({"text": nodeTime});

                        }

                    },
                    //新增线
                    addLine: function (scan, update) {
                        if(update == "create"){
                            if (scan.joinId == null) {
                                scan.joinId = _tool.uuid();
                            }
                            var path = scan.path;
                            var startNodeId = scan.startNodeId;
                            var endNodeId = scan.endNodeId;
                            var joinId = scan.joinId;
                            var joinType = scan.joinType;
                            var joinDirection = scan.joinDirection;
                            var cline = _setting.canvas.path(path).attr({
                                'stroke-width': 2,
                                'stroke': "#cccccc",
                                'fill': "#cccccc",
                                'stroke-opacity': 1
                            });

                            cline.data("startNodeNum", startNodeId);
                            cline.data("endNodeNum", endNodeId);
                            cline.data("startSet", _setting.nodesData[startNodeId]);
                            cline.data("endSet", _setting.nodesData[endNodeId]);
                            cline.data("path", path);
                            cline.data("joinId", joinId);
                            cline.data("joinType", joinType);
                            cline.data("joinDirection", joinDirection);
                            var bgline = _consts.createBgLine(cline);
                            bgline.data("startNodeNum", startNodeId);
                            bgline.data("endNodeNum", endNodeId);
                            bgline.data("startSet", _setting.nodesData[startNodeId]);
                            bgline.data("endSet", _setting.nodesData[endNodeId]);
                            bgline.data("path", path);
                            bgline.data("joinId", joinId);
                            bgline.data("joinType", joinType);
                            bgline.data("joinDirection", joinDirection);
                            bgline.data("line", cline);
                            var startEndAxis = _tool.getStartEndAxis(path);
                            bgline.data('sx', startEndAxis.sx);
                            bgline.data('sy', startEndAxis.sy);
                            bgline.data('ex', startEndAxis.ex);
                            bgline.data('ey', startEndAxis.ey);


                            var startSet = _setting.nodesData[endNodeId].data("startSet");
                            var endSet = _setting.nodesData[startNodeId].data("endSet");
                            var setline = _setting.nodesData[startNodeId].data("setline");

                            if (startSet == null) {
                                startSet = [];
                            }
                            if (endSet == null) {
                                endSet = [];
                            }
                            if (setline == null) {
                                setline = [];
                            }

                            startSet[startSet.length] = startNodeId;
                            endSet[endSet.length] = endNodeId;
                            setline[setline.length] = bgline;

                            _setting.nodesData[endNodeId].data("startSet", startSet);
                            _setting.nodesData[startNodeId].data("endSet", endSet);
                            _setting.nodesData[startNodeId].data("setline", setline);
                            _setting.linesData[joinId] = bgline;
                            _event.lineEvent(bgline, g);

                            _tool.createFlowPath(scan.joinId);
                            return bgline;
                        }else{
                            //跟新状态时初始化线的颜色
                            var cline = _setting.linesData[scan.joinId].data("line");
                            cline.attr({
                                'stroke': "#cccccc",
                                'fill': "#cccccc"
                            });
                            _tool.createFlowPath(scan.joinId);
                        }
                    },
                    //获取当前画布的信息数据
                    getData: function (flowChartId) {
                        if (flowChartId == null || flowChartId == "") {
                            flowChartId = _tool.uuid();
                        }
                        var nodesData = _setting.nodesData,
                            linesData = _setting.linesData,
                            joinarray = [],
                            nodearray = [],
                            data;
                        for (var nodeId in nodesData) {
                            if (nodesData[nodeId] == null)continue;
                            var x = nodesData[nodeId].data("vx");
                            var y = nodesData[nodeId].data("vy");
                            var nodeName = nodesData[nodeId].data("nodeName");
                            var componentsId=nodesData[nodeId].data("componentsId");
                            var img=nodesData[nodeId].data("img");
                            var nodeType = nodesData[nodeId].data("nodeType");
                            var nodeStyle = nodesData[nodeId].data("nodeStyle");
                            if (nodeStyle == '1' || nodeStyle == '4' || nodeStyle == '5' || nodeStyle == '6') {
                                nodeType = 'circle';
                            }
                            var nodeWidth = nodesData[nodeId].data("width");
                            var nodeHeight = nodesData[nodeId].data("height");
                            var nodeRadius = nodesData[nodeId].data("radius");
                            var nodeSort = nodesData[nodeId].nodeSort;
                            var startString = nodesData[nodeId].data("startSet") == null ? null : nodesData[nodeId].data("startSet").join(',');
                            var endString = nodesData[nodeId].data("endSet") == null ? null : nodesData[nodeId].data("endSet").join(',');
                            var setlineString = nodesData[nodeId].data("setline") == null ? null : nodesData[nodeId].data("setline").join(',');
                            var arr =
                                {
                                    "clientX": x,
                                    "clientY": y,
                                    "nodeWidth": nodeWidth,
                                    "nodeHeight": nodeHeight,
                                    "nodeRadius": nodeRadius,
                                    "nodeId": nodeId,
                                    "flowChartId": flowChartId,
                                    "nodeName": nodeName,
                                    "componentsId": componentsId,
                                    "img": img,
                                    "nodeType": nodeType,
                                    "nodeStyle": nodeStyle,
                                    "nodeSort": nodeSort,
                                    "startSet": startString,
                                    "endSet": endString,
                                    "setline": setlineString
                                };
                            nodearray.push(arr);
                        }
                        for (var joinId in linesData) {
                            if (linesData[joinId] == null)continue;

                            var startNodeNum = linesData[joinId].data("startNodeNum");
                            var endNodeNum = linesData[joinId].data("endNodeNum");


                            var joinId = linesData[joinId].data("joinId");
                            var joinType = linesData[joinId].data("joinType");
                            var joinDirection = linesData[joinId].data("joinDirection");
                            var path = linesData[joinId].data("path");
                            var nodeStyle = linesData[joinId].data("nodeStyle");
                            var brr = {
                                "startNodeId": startNodeNum,
                                "endNodeId": endNodeNum,
                                "joinType": joinType,
                                "joinDirection": joinDirection,
                                "flowChartId": flowChartId,
                                "joinId": joinId,
                                "path": path,
                                "nodeStyle": nodeStyle
                            };
                            joinarray.push(brr);
                        }
                        data = {
                            "joinarray": joinarray,
                            "nodearray": nodearray,
                            "flowChartId": flowChartId
                        };
                        return data;
                    },
                    //获取所有的节点
                    getNode: function () {
                        var nodesData = _setting.nodesData, nodearray = [];
                        for (var nodeId in nodesData) {
                            if (nodesData[nodeId] != null) {
                                nodearray.push(nodesData[nodeId]);
                            }
                        }
                        return nodearray;
                    },
                    //从数据库中获取保存的数据
                    getServerData: function (url,stateUrl, params ,update) {
                        var h = this;
                        var param = [];
                        if (params) {
                            var parms = $.isFunction(params) ? params() : params;
                            if (parms.length) {
                                $(parms).each(function () {
                                    param.push({name: this.name, value: this.value});
                                });
                                for (var i = parms.length - 1; i >= 0; i--) {
                                    if (parms[i].temp)
                                        parms.splice(i, 1);
                                }
                            }
                            else if (typeof parms == "object") {
                                for (var name in parms) {
                                    param.push({name: name, value: parms[name]});
                                }
                            }
                        }
                        var ajaxOptions = {
                            type: 'POST',
                            url: url,
                            /*data: param,*/
                            async: true,
                           /* dataType: 'json',*/
                            success: function (data1) {
                                data=JSON.parse(data1);
                                if((data == [] || data.length < 0||data == null) && _setting.g.model == "state"){
                                    g.nodataTips();
                                    return;
                                }
                                if(_setting.g.model == "state"){
                                    console.log("4");
                                    data = _tool.getFitStateData(data,stateUrl);
                                    if(data == false){
                                        return;
                                    }
                                }
                                if(update == "create"){
                                    g.canvas = new Raphael(canvasid, g.cwidth, g.cheight);
                                    _setting.canvas = g.canvas;
                                    _setting.canvasid = canvasid;
                                    _ring.createRing(g);
                                    _tool.drawGrid(g.cwidth, g.cheight);
                                }
                                $("#"+_setting.canvasid + " .loading-table").remove();
                                var scan;
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].nodeId !== null && data[i].nodeId !== undefined) {
                                        scan = {
                                            x: data[i].clientX,
                                            y: data[i].clientY,
                                            nodeId: data[i].nodeId,
                                            nodeType: data[i].nodeType,
                                            nodeStyle: data[i].nodeStyle,
                                            nodeName: data[i].nodeName,
                                            /*nodeName: data[i].nodeName.length>0?data[i].nodeName:g.componentsImgMap.get(data[i].componentsId)[1],*/
                                            componentsId: data[i].componentsId,
                                            /*img: data[i].img,*/
                                            img:data[i].componentsId=="componentsIdStart"? $resContextPath + "/plugin/raphael/img/icon-begin.png":
                                                data[i].componentsId=="componentsIdEnd"? $resContextPath + "/plugin/raphael/img/icon-finish.png":g.componentsImgMap.get(data[i].componentsId)[0],
                                            width: data[i].nodeWidth,
                                            height: data[i].nodeHeight,
                                            radius: data[i].nodeRadius,
                                            ruleNodeType: data[i].ruleNodeType

                                        };
                                        if(_setting.g.model == "state"){
                                            scan.upState = String(data[i].nodeState);
                                            scan.upTime = _tool.getDiffTime(data[i].startTime,data[i].endTime);
                                        }
                                        h.addNode(scan, update);
                                    }
                                }
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].joinId !== null && data[i].joinId !== undefined) {
                                        scan = {
                                            "path": data[i].path,
                                            "startNodeId": data[i].startNodeId,
                                            "endNodeId": data[i].endNodeId,
                                            "joinId": data[i].joinId,
                                            "joinType": data[i].joinType,
                                            "joinDirection": data[i].joinDirection,
                                            "nodeStyle": data[i].nodeStyle
                                        };
                                        h.addLine(scan,update);
                                    }
                                }
                                if (h.afterLoad != null) {
                                    h.afterLoad();
                                }
                            },
                            error:function(){
                                g.nodataTips();
                            }
                        };
                        if(url.length>0){
                            $.ajax(ajaxOptions);
                        }
                    },
                    //加载之后的事件
                    afterLoad: null,
                    //根据id获取节点
                    getNodeById: function (nodeId) {
                        return _setting.nodesData[nodeId];
                    },
                    //根据id获取线
                    getLineById: function (joinId) {
                        var data;
                        var linesData = _setting.linesData;
                        for (var joinnewId in linesData) {
                            if (joinnewId == joinId) {
                                data = linesData[joinnewId];
                                break;
                            }
                        }

                        return data;
                    },
                    //获取流程图的首节点 ，返回的是一个节点，这里做一个设置，当有多个开始节点时，提示只能有一个
                    getFirstNode: function () {
                        var firstNode;
                        var nodes = _tool.getNode();
                        var a = 0;
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].data("startSet") == null && nodes[i].data("endSet") != null && nodes[i].data("endSet").length > 0) {
                                a++;
                                firstNode = nodes[i];
                            }
                        }
                        if (a > 1) {
                            alert("流程图有多个首节点，请设置唯一！");
                            return null;
                        }
                        return firstNode;
                    },
                    //根据id 获取该id 节点之后的所有节点
                    getSortNodeById: function (nodeId) {
                        _setting.nodeArray = [];
                        _tool.getNextNode(nodeId);
                        return _setting.nodeArray.getNotNullNode();
                    },
                    //获取流程图的节点顺序
                    getSortNode: function () {
                        g.nodeArray = [];
                        var firstNode;
                        var nodes = _tool.getNode();
                        var a = 0;
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].data("startSet") == null && nodes[i].data("endSet") != null && nodes[i].data("endSet").length > 0) {
                                a++;
                                firstNode = nodes[i];
                                _setting.nodeArray.push(firstNode);
                            }
                        }
                        if (a > 1) {
                            alert("流程图有多个首节点，请设置唯一！");
                            return null;
                        }
                        if (firstNode != null) {
                            _tool.getNextNode(firstNode.data("nodeId"));
                        }
                        return _setting.nodeArray.method1();
                    },
                    //根据id 获取下一个节点，有可能是多个节点
                    getNextNodeById: function (nodeId) {
                        var currentNode = _setting.nodesData[nodeId];
                        var endSet = currentNode.data("endSet");
                        if (endSet == null) {
                            return [];
                        } else {
                            return endSet;
                        }
                    },
                    //根据id 获取上一个节点，有可能是多个节点
                    getBeforeNodeById: function (nodeId) {
                        var currentNode = _setting.nodesData[nodeId];
                        var startSet = currentNode.data("startSet");
                        if (startSet == null) {
                            return [];
                        } else {
                            return startSet;
                        }
                    },
                    //删除元素，在这里判断是删除线还是节点
                    closeElement: function (element) {
                        if (element.data("nodeId") != null) {
                            _event.closeNode(element);
                        }
                        if (element.data('joinId') != null) {
                            _event.delLine(element);
                        }
                    },
                    //获取选中的元素
                    getSelectedNode: function () {
                        var mnode = _setting.mnode;
                        var rmline = _setting.rmline;
                        if (mnode != null) {
                            return mnode;
                        }
                        if (rmline != null) {
                            return rmline;
                        }
                    },
                    //获取画布大小
                    getCanvas: function () {
                        return g.canvas;
                    },
                    //改变画布大小
                    changeCanvasSize: function (width) {
                        var normalWidth;
                        if (width == null) {
                            normalWidth = g.cwidth;
                        } else {
                            normalWidth = width;
                        }
                        var normalHeight = g.cheight;
                        _tool.changeCanvasSize(normalWidth, normalHeight);
                    },
                    //修改节点的文字
                    updateName: function (nodeId, aftertext) {
                        var textrect = _setting.nodesData[nodeId].data("tnNode");
                        var width = _setting.nodesData[nodeId].data("width");
                        var nameHtml = _tool.changeTextLine(aftertext, width);
                        textrect.attr({"text": nameHtml});
                        _setting.nodesData[nodeId].data("nodeName", nameHtml);
                    },
                    //添加线上的文字
                    addLineText: function (line, font) {
                        var text = _consts.createLineText(line, font);
                        line.data('text', text);
                    },
                    //添加状态类型标识
                    addStateType: function(){
                        var paper = new Raphael("stateType_canvas", "100%", "50");
                        _consts.createStateType(paper);
                    },
                    //跟新应用状态图
                    updateState: function(update){
                        console.log("g.url");
                        console.log(g.url);
                        tagOperation.getServerData(g.url, g.stateUrl, g.parms, update);
                    }
                };
                if(_setting.g.model == "state"){
                    tagOperation.addStateType();
                }

                if(g.newProcess == true || g.newProcess == "true"){
                    $("#"+canvasid).empty();
                    g.canvas = new Raphael(canvasid, g.cwidth, g.cheight);
                    _setting.canvas = g.canvas;
                    _setting.canvasid = canvasid;
                    _ring.createRing(g);
                    _tool.drawGrid(g.cwidth, g.cheight);
                }else{
                    tagOperation.getServerData(g.url, g.stateUrl, g.parms, "create");
                }


                $("#" + canvasid).unbind("contextmenu");
                $("#" + canvasid).bind("contextmenu", function () {
                    var mnode = _setting.mnode;
                    if (mnode != null) {
                        if (g.onContextMenu != null) {
                            g.onContextMenu(mnode);
                        }
                        return false;
                    } else {
                        return false;
                    }
                });
                return tagOperation;
            }
        };
        return tagObj;
    };
    $.fn.raphael.defaults = {
        cwidth: '1900',
        cheight: '1500',
        model: null,
        canvas: null,
        url: null,
        stateUrl:null,
        newProcess: true,
        parms: null,
        base:null,
        componentsImgMap:null,
        stateColor:["#b8b8b8","#67b1ff","#00cc00","#ff3333"],
        onClick: null,
        onContextMenu: null,
        onClickline: null,
        onClose: null,
        onNodeDblclick: null,
        afterDrawLine: null,
        changeLine:null,
        nodataTips:null,
        node: {
            x: 0,
            y: 0,
            nodeId: null,
            nodeName: '组件',
            componentsId:"componentsId",
            nodeType: 'rectangle',
            nodeStyle: '3',
            // width: 55,
            // height: 55,
            img:'',
            width:125,
            height: 90,
            radius:10,
            minWidth: 66,
            minHeight: 66,
            maxWidth: 130,
            maxHeight: 130
        }
    };
    (function (root, factory) {
        if (typeof define === "function" && define.amd) {
            // AMD. Register as an anonymous module.
            define(["raphael"], function (Raphael) {
                // Use global variables if the locals are undefined.
                return factory(Raphael || root.Raphael);
            });
        } else {
            // RequireJS isn't being used. Assume Raphael is loaded in <script> tag
            factory(Raphael);
        }
    }(this, function (Raphael) {
        Raphael.fn.inlineTextEditing = function (subject, options, callback) {
            // Store instance of the Raphael paper
            var paper = this;
            subject.inlineTextEditing = {
                paper: paper,
                input: null,
                /**
                 * Start text editing by hiding the current element and adding a text field at the same position
                 * @return jQuery input element
                 */
                startEditing: function () {
                    // Store Raphael container above the svg
                    var container = this.paper.canvas.parentNode;
                    var translateX = 0;
                    var translateY = 0;
                    var transformOrder = {};
                    // Retrieve element transformation
                    var rotation = subject._.deg;
                    var scaleX = subject._.sx;
                    var scaleY = subject._.sy;
                    var matrix = subject.node.getAttribute('transform');
                    // Check if the element has translations & retrieve transformations order
                    for (var i = 0, length = subject._.transform.length; i < length; i++) {
                        var matrixComponents = subject._.transform[i];
                        var transform = matrixComponents[0].toLowerCase();
                        transformOrder[transform] = transform;

                        if (transform == 't') {
                            translateX += matrixComponents[1];
                            translateY += matrixComponents[2];
                        }
                    }
                    // Check if there is implicit matrix
                    for (var k = 0, length2 = subject._.transform.length; k < length; k++) {
                        if (subject._.transform[k][0].toLowerCase() == 'm') {
                            var matrixComponents1 = subject._.transform[k].slice(1);
                            // Perform transformation from matrix elements
                            rotation += -1 * Math.asin(matrixComponents1[2]) * 180 / Math.PI;
                            scaleX *= matrixComponents1[0] / Math.cos(rotation * Math.PI / 180);
                            scaleY *= matrixComponents1[3] / Math.cos(rotation * Math.PI / 180);

                            transformOrder = {r: 'r', s: 's'};
                        }
                    }
                    // Remove transformation on the current element to retrieve original dimension
                    subject.node.removeAttribute('transform');
                    var originalBbox = subject._getBBox();
                    var width = originalBbox.width;
                    var height = originalBbox.height;
                    var x = container.offsetLeft + subject.attrs.x + translateX + _setting.padding;
                    var y = container.offsetTop + subject.attrs.y - height / 2 + +_setting.padding;
                    var sTransform = '';
                    var sOrigin = 'center center';
                    var oTransform = {
                        //        t : 'translate('+(translateX)+'px, '+(translateY)+'px)',
                        r: 'rotate(' + rotation + 'deg)',
                        s: 'scale(' + scaleX + ', ' + scaleY + ')'
                    };
                    // Build transform CSS property in the same order than the element
                    for (var transform1 in transformOrder) {
                        if (oTransform[transform1] != undefined) {
                            sTransform += oTransform[transform1] + ' ';
                        }
                    }
                    // Re-apply stored transformation to the element and hide it
                    // subject.node.setAttribute("transform", matrix);
                    subject.hide();
                    // Prepare input styles
                    var oStyles = {
                        position: 'absolute',
                        background: 'none',
                        left: x + 'px',
                        top: y + 'px',
                        width: width + 20 + 'px',
                        height: height + 20 + 'px',
                        padding: '10px',
                        // color: subject.attrs.fill,
                        color: '#000',

                        '-moz-transform-origin': sOrigin,
                        '-ms-transform-origin': sOrigin,
                        '-o-transform-origin': sOrigin,
                        '-webkit-transform-origin': sOrigin,
                        'transform-origin': sOrigin,

                        '-moz-transform': sTransform,
                        '-ms-transform': sTransform,
                        '-o-transform': sTransform,
                        '-webkit-transform': sTransform,
                        'transform': sTransform
                    };
                    // Retrieve font styles
                    var aFontAttributes = ['font', 'font-family', 'font-size', 'font-style', 'font-weight', 'font-variant'/*, 'line-height'*/];
                    for (var j = 0, length1 = aFontAttributes.length; j < length1; j++) {
                        var attribute = aFontAttributes[j];

                        if (subject.attrs[attribute] != undefined) {
                            oStyles[attribute] = subject.attrs[attribute];
                        }
                        if (subject.node.style[attribute] != undefined) {
                            oStyles[attribute] = subject.node.style[attribute];
                        }
                    }
                    var sStyles = '';
                    for (var z in oStyles) {
                        sStyles += z + ':' + oStyles[z] + ';';
                    }
                    // Create an input element with theses styles
                    this.input = document.createElement("input");
                    this.input.value = subject.attrs.text ? subject.attrs.text.replace(/\'/g, "\\\'") : '';
                    this.input.setAttribute("style", sStyles);
                    this.input.addEventListener('keyup', this._handleKeyDown.bind(this));
                    // Add the input in the container and apply focus on it
                    container.appendChild(this.input);
                    this.input.focus();
                    return this.input;
                },
                /**
                 * Apply text modification and remove associated input
                 */
                stopEditing: function () {
                    // Set the new the value
                    var width = subject.data("nodeWidth");
                    var nameHtml = _tool.changeTextLine(this.input.value, width);
                    subject.attr("text", nameHtml);
                    // Show the text element
                    subject.show();
                    // Remove text input
                    this.input.parentNode.removeChild(this.input);
                },
                _handleKeyDown: function (e) {
                    var tmp = document.createElement("span");
                    var text = this.input.value;
                    tmp.setAttribute('style', this.input.style.cssText);
                    tmp.style.height = null;
                    tmp.style.width = null;
                    tmp.style.visibility = 'hidden';
                    tmp.innerHTML = text.split('\n').join('<br />');
                    this.input.parentNode.appendChild(tmp);
                    this.input.style.width = tmp.offsetWidth + "px";
                    this.input.style.height = tmp.offsetHeight + "px";
                    tmp.parentNode.removeChild(tmp);
                }
            };
            return subject.inlineTextEditing;
        };

    }));
    Array.prototype.getNotNullNode = function () {
        var h = {};  //定义一个hash表
        var arr = []; //定义一个临时数组

        for (var i = 0; i < this.length; i++) {  //循环遍历当前数组
            //对元素进行判断，看是否已经存在表中，如果存在则跳过，否则存入临时数组
            if (!h[this[i].data("nodeId")]) {
                //存入hash表
                h[this[i].data("nodeId")] = true;
                //把当前数组元素存入到临时数组中
                arr.push(this[i]);
            }
        }
        return arr;
    };
})
(jQuery);