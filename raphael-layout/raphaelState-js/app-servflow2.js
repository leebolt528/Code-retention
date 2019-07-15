$(function(){
    var logsInfo = [];//记录请求上次请求返回的日志信息
    var refreshState = null;//拓扑页面定时刷新任务
    var tag;
    var componentsImgMap=new Map();//存放组件图片
    var firstClick=true;//第一次点击拓扑按钮触发事件
    var createSetInterval=true;//点击拓扑创建定时任务
    //转换状态信息为状态图需要的数据
    function getFitStateData(ajaxData){
        topologyData.map(function(nodeInfo,index){
            if(nodeInfo.hasOwnProperty("nodeId")){
                ajaxData.map(function(nodeState){
                    if(nodeInfo.nodeName == nodeState.nodeId){
                        topologyData[index].nodeStatus = nodeState.serState;
                        topologyData[index].startTime = nodeState.startTime;
                        topologyData[index].endTime = nodeState.endTime;
                    }
                });
            }
        });
        return topologyData;
    }
    //时间转换
    function add0(m){
        return m<10?'0'+m:m
    }
    function dateFormat(times){
        var time = new Date(times);
        var y = time.getFullYear().toString()/* .slice(2) */;
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
    }
    function getFitLogsFormat(logs){
        var addLogs = logs.slice(logsInfo.length,logs.length);
        var addLogsText="";
        addLogs.map(function(log,index){
            addLogsText += "<div class='bcloud-item-log'>"+
                "<div class='item-title'>"+dateFormat(log.createTime)+"</div>"+
                "<div class='item-content'>"+log.logInfo+"</div>"+
                "</div>"+
                "<hr>";
        });
        return addLogsText;
    }
    function raphaelState(componentsImgMap,raphaelData){
        tag = $("#state_canvas").raphael().init({
            cwidth: 1900, //画布宽度
            cheight: 1500, //画布高度,
            model:"state",
            //url: $webpath + '/servflow/findNode/appId/' + urlParams.applicationId,  //url 获取该画布流程图信息
            urlData:raphaelData,
            newProcess:false,
            componentsImgMap:componentsImgMap,
            nodataTips: function(){
                var noDataHtml = '<div style="height: 100%;"><div class="nodata-table" style="height: 100%;">' +
                    '    <div><img src="'+ $resContextPath +'/img/common/nodata.png">' +
                    '    <span class="nodata-text">暂无数据</span></div>' +
                    '</div></div>';
                $(".page-content.topology #state_canvas").html(noDataHtml);
            }
        });
        //tag 初始化之后  重新设计画布的宽高
        /* tag.afterLoad = function () {
             tag.changeCanvasSize();
             /!* initLineText();*!/
         };*/
    }
    //绘制拓扑页面
    function drawPages(boolean){
        //请求状态数据
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            dataType: "json",
            data: {
                appId:urlParams.applicationId
            },
            url: $webpath + "/v1/serflow/states",
            success: function (data) {
                if(data != null && data.length > 0){
                    var raphaelData= getFitStateData(data);
                    if(boolean){
                        raphaelState(componentsImgMap,raphaelData);
                    }else{
                        tag.updateState("update",raphaelData);
                    }
                }else{
                    var noDataHtml = '<div style="height: 100%;"><div class="nodata-table" style="height: 100%;">' +
                        '    <div><img src="'+ $resContextPath +'/img/common/nodata.png">' +
                        '    <span class="nodata-text">暂无数据</span></div>' +
                        '</div></div>';
                    $(".page-content.topology #state_canvas").html(noDataHtml);
                }
            },
            error: function(){
                var noDataHtml = '<div style="height: 100%;"><div class="nodata-table" style="height: 100%;">' +
                    '    <div><img src="'+ $resContextPath +'/img/common/nodata.png">' +
                    '    <span class="nodata-text">暂无数据</span></div>' +
                    '</div></div>';
                $(".page-content.topology #state_canvas").html(noDataHtml);
            }
        });

        //请求日志数据
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            dataType: "json",
            data: {
                appId:urlParams.applicationId
            },
            url: $webpath + "/v1/serflow/logs",
            success: function (logs) {
                var $logsDiv = $(".topology .right-content .bcloud-content");
                if(logs != null && logs.length > 0){
                    var logsHtml = getFitLogsFormat(logs);
                    if($logsDiv.children(".loading-table").length > 0){
                        $logsDiv.html(logsHtml);
                    }else{
                        $logsDiv.append(logsHtml);
                    }
                    $logsDiv.scrollTop($logsDiv[0].scrollHeight);
                }else{
                    var noDataHtml = '<div style="height: 100%;"><div class="nodata-table" style="height: 100%;">' +
                        '    <div><img src="'+$resContextPath+'/img/common/nodata.png">' +
                        '    <span class="nodata-text">暂无数据</span></div>' +
                        '</div></div>';
                    $logsDiv.html(noDataHtml);
                }
                logsInfo = logs;
            },
            error: function(){
                var $logsDiv = $(".topology .right-content .bcloud-content");
                var noDataHtml = '<div style="height: 100%;"><div class="nodata-table" style="height: 100%;">' +
                    '    <div><img src="'+$resContextPath+'/img/common/nodata.png">' +
                    '    <span class="nodata-text">暂无数据</span></div>' +
                    '</div></div>';
                $logsDiv.html(noDataHtml);
            }
        });
    }
    //计算拓扑图页面高度
    function setTopologyH(){
        var topologyH = $("body").height() - Number($(".page-container").css("padding-top").replace('px',''))*2
            - $(".page-container .breadcrumb-bcloud").outerHeight(true) - $(".page-container .page-content .bcloud-header").outerHeight(true);
        $(".page-content.topology").height(topologyH);
    }
    //点击拓扑按钮执行的操作
    function topologyFun(){

        //查询所有组件库
        var params ={
            pageNo:1,
            pageSize:1000,
            searchComp:""
        };
        $.ajax({
            url: $webpath + '/servflow/v1/component/components',
            method: 'POST',
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify(params),
            async: false,
            success: function (dataAll) {
                dataAll.data.data.map(function (item, index) {
                    componentsImgMap.set(item.componentsId, [item.componentsImg, item.componentsName]);
                });

                drawPages(true);
            }
        });
    };


    $(window).resize(function(){
        setTopologyH();
    });
    $(document).click(function(e){
        if($(e.target).hasClass("topology_a")){
            $(".bcloud-header-operation button.topology").trigger("click");
        }
    });
    $(".bcloud-header-operation button").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        if($(this).hasClass("list")){
            $(".page-content.list").siblings(".page-content").hide().end().show();
            if(refreshState){
                window.clearInterval(refreshState);
            }
            createSetInterval = true;
        }else if($(this).hasClass("topology")){
            $(".page-content.topology").siblings(".page-content").hide().end().show();
            setTopologyH();
            if(firstClick){
                setTimeout(function(){
                    topologyFun();
                },0.001);
                firstClick=false;
            }else{
                drawPages(false);
            }
            if(createSetInterval){
                var appStateBoolean = false;
                var lastAddOne = false;
                refreshState = setInterval(function () {
                    $.ajax({
                        type: "GET",
                        url: $webpath + "/bcos/v1/appModel/findInfosById/" + urlParams.applicationId,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (res){
                            if(res.appState == "1010"){
                                drawPages(false);

                                appStateBoolean=true;
                            }else if(appStateBoolean && lastAddOne){
                                window.clearInterval(refreshState);
                            }else if(appStateBoolean){
                                lastAddOne = true;
                                createSetInterval=false;
                                drawPages(false);
                            };
                        }
                    });
                }, 5000);
            }
            createSetInterval=false;
        }
    });
});