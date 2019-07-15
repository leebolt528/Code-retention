/*var url, tag;*/
var tag;//定义全局的tag
$(function () {
    /*可视化编辑器左侧菜单*/
    $(".shape_list").menuList();

    //添加顶部工具提示
    $("#btn_back").popover({
        "animation": true,
        "container": '.designer_body',
        "content": '返回',
        "trigger": 'hover',
        "placement": 'bottom'
    });
    $("#save_btn").popover({
        "animation": true,
        "container": 'body',
        "content": '保存',
        "trigger": 'hover',
        "placement": 'bottom'
    });
    $("#shortcutDesc").popover({
        "animation": true,
        "container": 'body',
        "content": '快捷说明',
        "trigger": 'hover',
        "placement": 'bottom'
    });
    $(".conHref").popover({
        "animation": true,
        "container": 'body',
        "content": 'confluence说明文档',
        "trigger": 'hover',
        "placement": 'bottom'
    });
    $(".enlarge-btn").popover({
        "animation": true,
        "container": 'body',
        "content": '全屏',
        "trigger": 'hover',
        "placement": 'bottom'
    });
    $(".narrow-btn").popover({
        "animation": true,
        "container": 'body',
        "content": '退出全屏',
        "trigger": 'hover',
        "placement": 'bottom'
    });

    // 宽高参数定义
    var panelWidth = 186;//组件工具栏的宽度
    var winWidth = $(window).width();
    var canvasWidth = winWidth - panelWidth;

    $('#canvas_container').css({'width': canvasWidth});//最下面的一层
    //流程图节点的回显
    var url=idflowChartId?$webpath + '/servflow/findNode/'+idflowChartId:"";
    tag = $("#designer_canvas").raphael().init({
        // cwidth: canvasWidth, //画布宽度
        // cheight: canvasHeight, //画布高度,
        cwidth: 1900, //画布宽度
        cheight: 1500, //画布高度,
        /*url: $webpath + '/serprocess/findNode',  //url 获取该画布流程图信息*/
        url: url,
        newProcess:newProcess,
        parms: {
            "flowChartId": idflowChartId,   //流程图ID
            "serVerId": serVerId,
            "serFlowType": serFlowType
        },
        base: '../resources/plugin/raphael/img',
        componentsImgMap:componentsImgMap,
        onContextMenu: (function (node) {
        }),
        onClickline: (function (line) {
            /*lineClickBolt(line);*/
        }),
        onClick: (function (node) {
            /*nodeClickBolt(node);*/
        }),
        onClose: (function (element) {
            nodeClose(element)
        }),
        onNodeDblclick: function (node) {
            nodeClickBolt(node);
        },
        afterDrawLine: function (line) {
            afterDrawLine(line);
        },
        changeLine: function (line,oldEndNodeId) {
            changeLine(line,oldEndNodeId);
        },
        nodataTips: function(){
            var noDataHtml = '<div style="height: 100%;"><div class="nodata-table" style="height: 100%;">' +
                '    <div style="top: 25%;"><img src="'+ $resContextPath +'/img/common/nodata.png">' +
                '    <span class="nodata-text">暂无数据</span></div>' +
                '</div></div>';
            $("#designer_canvas").html(noDataHtml);
        }
    });

    //tag 初始化之后  重新设计画布的宽高
  /*  tag.afterLoad = function () {
        tag.changeCanvasSize();
       /!* initLineText();*!/
    };*/

    //返回事件
    $("#btn_back").click(function () {
        var typeflag = iscasType(serFlowType);
        if (typeflag) {
            window.location.href = $webpath + "/serspLogin/index";
        } else {
            window.location.href = $webpath + "/processTable/index2";
        }
    });
    //快捷键说明
    $('#shortcutDesc').bind('click', function () {
        $("#shortcutKeysModal").modal("show");
    });

    //快捷键ctrl+s
    Mousetrap.bind(['ctrl+s', 'command+s'], function () {
        $("#save_btn").trigger("click");
        return false;
    });
    //快捷键backspace
    Mousetrap.bind('del', function () {
        var element = tag.getSelectedNode();
        if (element != null) {
            if (!nodeClose(element)) {
                return;
            }
            tag.closeElement(element);
        }
        return true;
    });

});