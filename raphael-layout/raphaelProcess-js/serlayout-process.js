//存储所有节点对象
var serNodeArray = [];
//存储所有线对象
var serJoinArray = [];

//更新和添加标识
var updateflag = "";

//节点的临时信息
var baseInfo = null;
var baseserNodeObj={};

//右侧模态框对象
var sideModalObj;
//当前点击的组件
var currentNode;
var currentLine;

var allprenodes1=[];
var allafternodes=[];
$(function(){
    //添加右侧模态框和背景阴影
    var options={
        headText:"资源配置",
        btnSwitch:true,
        classList:"",
        callback:{
            clickConfirm:function($rightModel){
                sideModalObj.hideSideModal();
                if(currentNode){
                    serInfoNodeYes(currentNode);
                }else{
                    serInfoLineYes(currentLine);
                }
            },
            clickCancel:function($rightModel){},
            clickMask:function($rightModel){}
        }
    };
    sideModalObj=$.sideModalFun(options);

    if (idflowChartId == null || idflowChartId == "") {
        updateflag = "";
        //先添加服务
        initStartLayout();
        idflowChartId = tag.getData(idflowChartId).flowChartId;//生成idflowChartId
        var data = tag.getData(idflowChartId);
        var nodearray = data.nodearray;
        for (var i = 0; i < nodearray.length; i++) {
            var edgeNode = nodearray[i];

            //serNodeArray中添加开始结束节点
            if (edgeNode.nodeName == "开始" && edgeNode.componentsId == "componentsIdStart") {
                var startSerNode = new startSerNodeObj(data.flowChartId, serVerId, edgeNode.nodeId, "开始", "circle", "1",edgeNode.componentsId,edgeNode.img,
                    edgeNode.clientX, edgeNode.clientY, edgeNode.nodeWidth, edgeNode.nodeHeight, edgeNode.nodeRadius, "", "", "", edgeNode.setline,
                    "开始", "", "", "", "", "", "", "", [], [], "", "", "Start");
                serNodeArray.push(startSerNode);
            }
            if (edgeNode.nodeName == "结束" && edgeNode.componentsId == "componentsIdEnd" ) {
                var endSerNode = new startSerNodeObj(data.flowChartId, serVerId, edgeNode.nodeId, "结束", "circle", "4",edgeNode.componentsId,edgeNode.img,
                    edgeNode.clientX, edgeNode.clientY, edgeNode.nodeWidth, edgeNode.nodeHeight, edgeNode.nodeRadius, "", "", "", edgeNode.setline,
                    "结束", "", "", "", "", "", "", "", [], [], "", "", "End");
                serNodeArray.push(endSerNode);

            }
        }
    }else{
        updateflag = "update";
        serNodeArray = JSON.parse(initserNodeArray);
        serJoinArray = JSON.parse(initserJoinArray);
    }
    //保存按钮
    $("#save_btn").click(function () {
        var data = tag.getData(idflowChartId);
        //更新每个节点的最终的位置
        var finalnodearray = data.nodearray;
        for (var i = 0; i < finalnodearray.length; i++) {
            for (var j = 0; j < serNodeArray.length; j++) {
                if (finalnodearray[i].nodeId == serNodeArray[j].nodeId) {
                    serNodeArray[j].clientX = finalnodearray[i].clientX;
                    serNodeArray[j].clientY = finalnodearray[i].clientY;
                    serNodeArray[j].nodeHeight = finalnodearray[i].nodeHeight;
                    serNodeArray[j].nodeRadius = finalnodearray[i].nodeRadius;
                    serNodeArray[j].nodeWidth = finalnodearray[i].nodeWidth;
                    serNodeArray[j].endSet = finalnodearray[i].endSet;
                    serNodeArray[j].startSet = finalnodearray[i].startSet;
                }
            }
        }
        //修改线节点的基本信息
        if (data.joinarray != null) {
            for (var i = 0; i < (data.joinarray).length; i++) {
                var join = (data.joinarray) [i];
                for (var j = 0; j < serJoinArray.length; j++) {
                    if (join.joinId == serJoinArray[j].joinId) {
                        serJoinArray[j].startNodeId = join.startNodeId;
                        serJoinArray[j].endNodeId = join.endNodeId;
                        serJoinArray[j].joinType = join.joinType;
                        serJoinArray[j].joinDirection = join.joinDirection;
                        serJoinArray[j].path = join.path;
                    }
                }
            }
        }

        saveBtnLayer();
    });
});
//初始化开始节点和结束节点
function initStartLayout() {
    let startoptions = {
        "x": 100,
        "y": 200,
        "nodeName": "开始",
        "componentsId":"componentsIdStart",
        "img":$resContextPath + '/plugin/raphael/img/icon-begin.png'
    };
    tag.addNode(startoptions,"create");
    let endoptions = {
        "x": 1000,
        "y": 200,
        "nodeName": "结束",
        "componentsId":"componentsIdEnd",
        "img":$resContextPath + '/plugin/raphael/img/icon-finish.png'
    };
    tag.addNode(endoptions,"create");

}
//图形拖拽增加节点
function addShapNode(ui) {
    var obj = ui.draggable;
    var offset = ui.offset;
    var x = offset.left - $("#designer_canvas").offset().left;
    var y = offset.top - $("#designer_canvas").offset().top;
    var img = $(obj).attr("img");
    var componentsId=$(obj).attr('componentsId');
    var nodeName=$(obj).attr('nodeName');
    var nodeId = getuuid();
    var options = {
        "nodeId": nodeId,
        "x": x,
        "y": y,
        "nodeName": nodeName,
        "componentsId":componentsId,
        "img":img
    };

    tag.addNode(options,"create");
    var data = tag.getData(idflowChartId);
    var nodearray = data.nodearray;
    var inparameter = [];
    var outparameter = [];
    for (var i = 0; i < nodearray.length; i++) {
        //拖拽过来添加接口节点
        if (nodeId == nodearray[i].nodeId) {
            var internode = nodearray[i];
            var componentType = '0';//组件类型 1自定义组件 0普通
            var interSerNode = new interfaceSerNodeObj(data.flowChartId, serVerId, internode.nodeId, nodeName, "rectangle", "3",internode.componentsId,"",
                internode.clientX, internode.clientY, internode.nodeWidth, internode.nodeHeight, internode.nodeRadius, "",internode.startSet, internode.endSet, internode.setline,
                "", "", "", "", "", "", "", "", "", "", "", "", [], [], "", "", componentType,true,nodeName);
            serNodeArray.push(interSerNode);
            /*继承模板返回的参数*/
            $.ajax({
                url: $webpath + '/servflow/v1/component/singleComponent',
                method: 'GET',
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: {
                    componentsId: componentsId
                },
                success: function (dataInfo) {
                    JSON.parse(dataInfo.data.inputResume).map(function (item) {
                        item.type="0";
                        if(item.parentId=="0"){
                            item.parentId=null;
                        }
                    });
                    JSON.parse(dataInfo.data.outputResume).map(function (item) {
                        item.type="1";
                        if(item.parentId=="0"){
                            item.parentId=null;
                        }
                    });
                    
                    serNodeArray[serNodeArray.length-1].inparameter= JSON.parse(dataInfo.data.inputResume);
                    serNodeArray[serNodeArray.length-1].outparameter= JSON.parse(dataInfo.data.outputResume);
                    serNodeArray[serNodeArray.length-1].firstBoolean=false;
                }
            });
        }
    }
}
//节点单击Bolt
function nodeClickBolt(node) {
    var nodeName = node.data("nodeName");
    var nodeId = node.data("nodeId");
    var componentsId=node.data("componentsId");

    for (var k = 0; k < serNodeArray.length; k++) {
        var serNoode = serNodeArray[k];
        if (serNoode.nodeId == nodeId) {
            componentsId = serNoode.componentsId;
        }
    }
    currentNode=node;
    /* if (serNodeArray != null && serNodeArray.length > 0) {
        for (var i = 0; i < serNodeArray.length; i++) {
            if (serNodeArray[i].nodeId == currentNode.data("nodeId")) {
                baseserNodeObj=$.extend(true,{}, serNodeArray[i]);
            }
        }
    } */
    //开始节点
    if ((componentsId == "componentsIdStart" && nodeName == "开始")||(componentsId == "componentsIdEnd" && nodeName == "结束")) {
        serInfoLayerBolt(node);
    }/*else if(componentsId == "componentsIdEnd" && nodeName == "结束"){

    }*/else{
        serInfoLayerRequest(node);
    }
}
//点击开始节点弹框
function serInfoLayerBolt(node) {
    var nodeName = node.data("nodeName");
    var nodeId = node.data("nodeId");
    sideModalObj.showSideModal();
    $.ajax({
        type: "GET",
        url: $webpath + '/processlayer/apiparam2',
        data: {
            "nodeId": nodeId,
            "nodeType": "",
            "nodeName": escape(escape(nodeName)),
            "serFlowType": serFlowType,
            "nodeStyle": "",
            "typeName": typeName,
        },
        success: function (page) {
           /* setTimeout(function(){*/
                sideModalObj.addHtml(page);
           /* },200);*/

        }
    });
}
//点击组件节点弹框
function serInfoLayerRequest(node){
    sideModalObj.showSideModal();
    $.ajax({
        url: $webpath + '/servflow/v1/component/singleComponent',
        method: 'GET',
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {
            componentsId: node.data("componentsId")
        },
        success: function (dataInfo) {
           /* setTimeout(function(){*/
                let page='<!DOCTYPE html>' +
                    '<html lang="en">' +
                    '<head><script>' +
                    dataInfo.data.componentJs+'</script><style>'+
                    dataInfo.data.componentStyle+'</style>'+
                    '</head>' +
                    '<body>' +
                    dataInfo.data.componentText+
                    '</body>' +
                    '</html>';

                /*继承模板返回的参数*/
                for (var i = 0; i < serNodeArray.length; i++) {
                    if (/*updateflag != "update"&&*/ (serNodeArray[i].firstBoolean ==true||serNodeArray[i].firstBoolean =="true") && serNodeArray[i].nodeId == currentNode.data("nodeId")) {//新建编排时,拖拽组件后的相同ajax未完成/修改编排时，新建编排保存前未完成相同ajax的继承
                        JSON.parse(dataInfo.data.inputResume).map(function (item) {
                            item.type="0";
                            if(item.parentId=="0"){
                                item.parentId=null;
                            }
                        });
                        JSON.parse(dataInfo.data.outputResume).map(function (item) {
                            item.type="1";
                            if(item.parentId=="0"){
                                item.parentId=null;
                            }
                        });
                        serNodeArray[i].inparameter= JSON.parse(dataInfo.data.inputResume);
                        serNodeArray[i].outparameter= JSON.parse(dataInfo.data.outputResume);
                        serNodeArray[i].firstBoolean=false;

                        baseserNodeObj=$.extend(true,{}, serNodeArray[i]);
                    }else if(serNodeArray[i].nodeId == currentNode.data("nodeId")){
                        baseserNodeObj=$.extend(true,{}, serNodeArray[i]);
                    }
                }
                sideModalObj.addHtml(page);
           /* },200);*/
        }
    });

    /*var nodeName = node.data("nodeName");
    var nodeId = node.data("nodeId");
    sideModalObj.showSideModal();
    $.ajax({
        type: "GET",
        url: $webpath + '/processlayer/apiparamCom2',
        data: {
            "nodeId": nodeId,
            "nodeType": "",
            "nodeName": escape(escape(nodeName)),
            "serFlowType": serFlowType,
            "nodeStyle": "",
            "typeName": typeName,
        },
        success: function (page) {
            setTimeout(function(){
                sideModalObj.addHtml(page);
            },200);

        }
    });*/
}
//节点信息保存事件
function serInfoNodeYes(node) {
    if (node.data("componentsId") == "componentsIdStart") {
        for (var i = 0; i < serNodeArray.length; i++) {
            if (serNodeArray[i].nodeId == node.data("nodeId")) {
                removeByValue(serNodeArray, serNodeArray[i]);
            }
        }

        serNodeArray.push(baseserNodeObj);
    }else{
        var body = $("#id-parambasetable");
        for (var i = 0; i < serNodeArray.length; i++) {
            if (serNodeArray[i].nodeId == node.data("nodeId")) {
                removeByValue(serNodeArray, serNodeArray[i]);
            }
        }

        baseserNodeObj.nodeName = body.find("#inteName").val();
        serNodeArray.push(baseserNodeObj);
        tag.updateName(baseserNodeObj.nodeId, baseserNodeObj.nodeName);
    }
}
//判断服务名称是否被占用
function checkSerName(serName){
    var flag = "";
    $.ajax({
        "url": $webpath + "/servflow/v1/api/ruleChain/check",
        "type": "GET",
        data: {
            "name": serName,
        },
        async: false,
        success: function (data) {
            if(data.code == '200'){
                flag = true;
            }else{
                flag = false;
            }
        }
    });
    return flag;
}
//线连接事件after
function afterDrawLine(line) {
    var startSet = line.data('startSet');
    var endSet = line.data('endSet');

    var join_serviceType = "";

    var nodejoinObj = new serJoinObj(idflowChartId, serVerId, line.data('joinId'), startSet.data('nodeId'), endSet.data('nodeId'), line.data('joinType'), "2", line.data('joinDirection'), line.data('path'),
        startSet.data('nodeId'), endSet.data('nodeId'), join_serviceType, "", "");

    serJoinArray.push(nodejoinObj);
}

//保存所有信息
function addAll() {
    var modalName=$(".designer_viewport .modalName input").val();

    if (modalName.length==0) {
        $.message({
            message: '请添加编排模型名称',
            type: 'warning'
        });
       return false;
   }
    var flag = checkSerName(modalName);
    if (!flag) {
        $.message({
            message: '该名称已被占用！请修改后重试',
            type: 'warning'
        });
        return false;
    }

    var startNodeId="";
    serNodeArray.map(function(item,index){
        if(item.componentsId == "componentsIdStart"){
            startNodeId=item.nodeId;
        }
    });
    var publishStatus = "0";
    /*保存编排名称*/
    var paramsName ={
        id:idflowChartId,
        name:modalName,
        firstRuleNodeId:startNodeId,
        publishStatus:publishStatus
    };
    $.ajax({
        url: $webpath + '/servflow/v1/api/ruleChain/add',
        method: 'POST',
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: JSON.stringify(paramsName),
        success: function (dataInfo) {

        }
    });
    /*保存编排信息*/
    var paramsData ={
        ruleChainId: idflowChartId,
        ruleNodeConfigurations:serNodeArray,
        ruleRelationConfigurations:serJoinArray
    };
    $.ajax({
        url: $webpath + "/servflow/v1/api/ruleChain/metadata/add",
        method: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: JSON.stringify(paramsData),
        async: false,
        success: function (data) {
            if (data == "success") {
                $.message({
                    message: '添加成功',
                    type: 'success'
                });
            }
        }
    });
    /*跳转到列表页面*/
    window.location.href = $webpath + "/processTable/index2/" + typeId +"/" + typeName;
}
//更新流程图
function updateAll() {
    var modalName=$(".designer_viewport .modalName input").val();

    var startNodeId="";
    serNodeArray.map(function(item,index){
        if(item.componentsId == "componentsIdStart"){
            startNodeId=item.nodeId;
        }
    });
    /*保存编排名称*/
    var paramsName ={
        id:idflowChartId,
        name:modalName,
        firstRuleNodeId:startNodeId
    };
    $.ajax({
        url: $webpath + '/servflow/v1/api/ruleChain/update',
        method: 'POST',
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: JSON.stringify(paramsName),
        success: function (dataInfo) {

        }
    });
    /*保存编排信息*/
    var paramsData ={
        ruleChainId: idflowChartId,
        /*serNodeArray: JSON.stringify(serNodeArray),
        serJoinArray: JSON.stringify(serJoinArray),*/
        ruleNodeConfigurations:serNodeArray,
        ruleRelationConfigurations:serJoinArray
    };
    $.ajax({
        url: $webpath + "/servflow/v1/api/ruleChain/metadata/update",
        method: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: JSON.stringify(paramsData),
        async: false,
        success: function (data) {
            if (data == "success") {
                $.message({
                    message: '添加成功',
                    type: 'success'
                });
            }
        }
    });
}

//保存时弹框
function saveBtnLayer() {

    serNodeArray.map(function(node,index){
        if(node.hasOwnProperty("inparameter")){
            node.inparameter.map(function(inParam,index){
                inParam.codeMap = [];
            });
        }
        if(node.hasOwnProperty("outparameter")){
            node.outparameter.map(function(outParam,index){
                outParam.codeMap = [];
            });
        }
    });

    console.log("0-0-0-0-0-");
    console.log(JSON.stringify(serNodeArray));
    console.log(JSON.stringify(serJoinArray));
    console.log(updateflag);
    if (updateflag == "update") {
        $("#versionCoverModal").modal("show");
        $("#versionCoverModal").find(".confirm-box-ok").unbind("click");
        $("#versionCoverModal").find(".confirm-box-ok").click(function(){
            $("#versionCoverModal").modal("hide");
            updateAll("");
            window.location.href = $webpath + "/processTable/index2/" + typeId +"/" + typeName;
        });
    }
    else {
        addAll();
    }
}
//删除组件或连线
function nodeClose(element) {
    preparamDel(element);

    let select_node = tag.getSelectedNode();
    let select_nodeId;
    if (select_node.data('nodeId') != null) {
        select_nodeId = select_node.data('nodeId');
        for (let i = 0; i < serNodeArray.length; i++) {
            let serNoode = serNodeArray[i];
            if (serNoode.nodeId == select_nodeId) {
                serNodeArray.splice(i, 1);
            }
        }

        let startSet = select_node.data("startSet");
        if (startSet != null && startSet.length > 0 && startSet != undefined) {
            for (let i = 0; i < startSet.length; i++) {
                let preNode = tag.getNodeById(startSet[i]);
                if (preNode.data("setline") != null) {
                    let setline = preNode.data("setline");
                    for (let i = 0; i < setline.length; i++) {
                        if(setline[i].data('endNodeNum')==select_nodeId){
                            let joinId = setline[i].data('joinId');
                           for (let j = 0; j < serJoinArray.length; j++) {
                               if (joinId == serJoinArray[j].joinId) {
                                   serJoinArray.splice(j, 1);
                               }
                           }
                        }
                    }
                }
            }
        }

        let nextArr = select_node.data("setline");
        if (nextArr != null && nextArr.length > 0) {
            for (let i = 0; i < nextArr.length; i++) {
                let nextJoinId = nextArr[i].data('joinId');
                for (let j = 0; j < serJoinArray.length; j++) {
                    if (nextJoinId == serJoinArray[j].joinId) {
                        serJoinArray.splice(j, 1);
                    }
                }
            }
        }
    } else {
        select_nodeId = select_node.data('joinId');
        for (let i = 0; i < serJoinArray.length; i++) {
            let serJoin = serJoinArray[i];
            if (serJoin.joinId == select_nodeId) {
                serJoinArray.splice(i, 1);
            }
        }
    }
    return true;
}
//线修改位置后处理映射关系
function changeLine(line,oldEndNodeId){
    preparamDel(line,oldEndNodeId);

    if(serJoinArray != null){
        for(let i=0;i<serJoinArray.length;i++){
            if(serJoinArray[i].joinId == line.data("joinId")){
                removeByValue(serJoinArray, serJoinArray[i]);
                break;
            }
        }
    }
}

//获取节点之后所有节点
function getAllAfterNodes(node) {
    let afternode;
    let endSet = node.data("endSet");
    if (endSet != null && endSet.length > 0 && endSet != undefined) {
        for(let i=0;i<endSet.length;i++){
            afternode = tag.getNodeById(endSet[i]);
            allafternodes.push(afternode);
            getAllAfterNodes(afternode);
        }
    }
    return allafternodes;
}
//获取节点之前所有节点
function getAllPreNodes1(node) {
    let prenode;
    let startSet = node.data("startSet");
    if (startSet != null && startSet.length > 0 && startSet != undefined) {
        for(let i=0;i<startSet.length;i++){
            prenode = tag.getNodeById(startSet[i]);
            allprenodes1.push(prenode);
            getAllPreNodes1(prenode);
        }
    }
    return allprenodes1;
}
//获取当前节点前几个服务节点的请求和响应参数
function getTreeNodes1(nodeId){
    allprenodes1=[];
    allprenodes1=Array.from(new Set(getAllPreNodes1(tag.getNodeById(nodeId))));
    let paramIds = [];
    for (let i = 0; i < serNodeArray.length; i++) {
        for (let k = 0; k < allprenodes1.length; k++) {
            if (allprenodes1[k].data("nodeId") == serNodeArray[i].nodeId) {
                if(serNodeArray[i].componentsId == "componentsIdStart" && serNodeArray[i].nodeName == "开始"){
                    let inparameter = serNodeArray[i].inparameter;
                    if (inparameter != null && inparameter.length > 0) {
                        for (let j = 0; j < inparameter.length; j++) {
                            paramIds.push(inparameter[j].id);
                        }
                    }
                }
                let outparameter = serNodeArray[i].outparameter;
                if (outparameter != null && outparameter.length > 0) {
                    for (let j = 0; j < outparameter.length; j++) {
                        paramIds.push(outparameter[j].id);
                    }
                }
            }
        }
    }
    return paramIds;
    
}
/*删除节点数组serNodeArray中之前映射但现在不存在的*/
function preparamIdDel(allafternodes){
    for (let i = 0; i < serNodeArray.length; i++) {
        for (let k = 0; k < allafternodes.length; k++) {
            if (allafternodes[k].data("nodeId") == serNodeArray[i].nodeId) {
                /*得到该节点之前的所有请求和响应参数*/
                allprenodes1=[];
                let paramIds=getTreeNodes1(serNodeArray[i].nodeId);
                if (serNodeArray[i].componentsId == "componentsIdEnd" && serNodeArray[i].nodeName == "结束") {
                    if(serNodeArray[i].outparameter){
                        serNodeArray[i].outparameter.map(function(item,index){
                            if(paramIds.indexOf(item.mappingId)==-1){
                                item.mappingId="null";
                            }
                        });
                    }
                }else{
                    if(serNodeArray[i].inparameter){
                        serNodeArray[i].inparameter.map(function(item,index){
                            if(paramIds.indexOf(item.mappingId)==-1){
                                item.mappingId="null";
                            }
                        });
                    }
                }
            }
        }
    }
}
/*删除节点或关系线后，删除子节点的无效映射*/
function preparamDel(element,oldEndNodeId){
    /*删除节点*/
    if(element.data('nodeId') != null && oldEndNodeId == undefined){
        /*获取节点本身以及之后的所有节点*/
        allafternodes=[];
        if(element.data('endSet')){
            element.data('endSet').map(function(item,index){
                allafternodes=allafternodes.concat(Array.from(new Set(getAllAfterNodes(tag.getNodeById(item)))));
                allafternodes.push(tag.getNodeById(item));

                allafternodes=Array.from(new Set(allafternodes));
            });
        }

        preparamIdDel(allafternodes);
    }else{
        /*获取关系线之后的所有节点*/
        allafternodes=[];
        if(oldEndNodeId != undefined){//改变线的结束节点
            allafternodes=Array.from(new Set(getAllAfterNodes(tag.getNodeById(oldEndNodeId))));
            allafternodes.push(tag.getNodeById(oldEndNodeId));
        }else{//删除关系线
            allafternodes=Array.from(new Set(getAllAfterNodes(tag.getNodeById(element.data('endNodeNum')))));
            allafternodes.push(tag.getNodeById(element.data('endNodeNum')));
        }

        preparamIdDel(allafternodes);

    }
}
//表单校验
function formValidator_para(id) {
    $(id).bootstrapValidator({
        live: 'enabled',
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: '请输入参数中文名'
                    },
                    /*regexp: {
                        regexp: /[\u4e00-\u9fa5]+$/,
                        message: '以中文命名'
                    }*/
                }
            },
            ecode: {
                validators: {
                    notEmpty: {
                        message: '请输入参数名称'
                    },
                    regexp: {
                        regexp: /[a-zA-Z]+$/,
                        message: '以大小写字母组合命名'
                    }
                }
            },
            reqType: {
                validators: {
                    notEmpty: {
                        message: '请选择参数类型'
                    }
                }
            },
            paramPos: {
                validators: {
                    notEmpty: {
                        message: '请选择参数位置'
                    }
                }
            },
            // paraRegular: {
            //     validators: {
            //         // regexp: {
            //         //     regexp: /[\u4e00-\u9fa5]+$/,
            //         //     message: '不支持中文'
            //         // }
            //         callback: {
            //             message: '不支持中文',
            //             callback: function (value, validator) {
            //                 console.log(value);
            //                 let inputRegular = $(".paraRegular .form-control").val();
            //                 let reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
            //                 if(reg.test(inputRegular)){value = 0;}
            //                 if(value == 0){
            //                     return false;
            //                 }else {
            //                     return true;
            //                 }
            //             }
            //         }
            //     }
            // },
            isEmpty: {
                validators: {
                    notEmpty: {
                        message: '请选择是否为必传项'
                    }
                }
            },
            // mapping: {
            //     validators: {
            //         notEmpty: {
            //             message: '请选择映射值'
            //         }
            //     }
            // }
            sortid: {
                validators: {
                    // notEmpty: {
                    //     message: '请输入序号'
                    // },
                    regexp: {
                        regexp: /^[0-9]+$/,
                        message: '请输入数字'
                    }
                }
            }
        }
    });
}
