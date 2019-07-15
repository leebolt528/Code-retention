//右侧工具栏展开收缩
$(".detail_item_title").click(function(){
        $(this).parent().toggleClass("open").siblings().removeClass("open");
    }
);
var zTreeObj;//请求和响应ztree对象
var allprenodes=[];//组件节点之前的所有关联节点
var $inputText=$(".form-group.mappingId").find("input");//参数映射input框
var paramadd=true;//添加参数/编辑参数
/*请求响应参数ztree-functiuon*/
var zTreeFunObj={
    //是否显示节点后删除图标
    showRemoveBtn:function (treeId, treeNode) {
        return true;
    },
    //是否显示节点后编辑图标
    showRenameBtn:function (treeId, treeNode) {
        return true;
    },
    //鼠标悬入节点事件
    addHoverDom:function (treeId, treeNode) {
        let sObj = $("#" + treeNode.tId + "_span");
        if ($("#"+treeNode.tId+"_add").length>0) return;
        $(".ztree a").each(function(){
            $(this).children(".add").remove();
            $(this).children(".edit").remove();
            $(this).children(".remove").remove();
        });
        let addStr = "<span class='button add' id='" + treeNode.tId + "_add' title='add'></span>";
        sObj.after(addStr);
        let btn = $("#"+treeNode.tId+"_add");

        if (btn) btn.bind("click", function(){
            zTreeObj.selectNode(treeNode);//选择点
            insertParams();
        });
    },
    //鼠标浮出节点事件
    removeHoverDom:function (treeId, treeNode) {
        $("#"+treeNode.tId+"_a").removeClass("curSelectedNode");
        $("#"+treeNode.tId+"_add").unbind().remove();
        $("button.edit").remove();
    },
    //点击编辑按钮事件
    beforeEditName:function (treeId, treeNode){
        zTreeObj.selectNode(treeNode);//选择点
        updateParams();
        return false;
    },
    //点击删除按钮事件
    beforeRemove:function (treeId, treeNode){
        zTreeObj.selectNode(treeNode);//选择点
        deleteParams();
        return false;
    }
};
$(function(){
        $(".detail_item_title img.down-arrow").attr("src",$resContextPath + "/plugin/raphael/img/down-arrow.png");
        $(".detail-item_content img.tadd").attr("src",$resContextPath + "/plugin/raphael/img/tadd.png");
        if(baseserNodeObj.componentsId=="componentsIdStart"){
            $("#id-paramreqstable").hide();
            //基本信息回显初始化
            $("#tagType").val("0");
           /* initBaseinfo();*/
            initParamTable("0");
        }else if(baseserNodeObj.componentsId=="componentsIdEnd"){
            /*$("#id-parambasetable").hide();*/
            $("#id-paramreqtable").hide();

            $("#tagType").val("1");
            initParamTable("1");
        }else{
            //基本信息回显初始化
            initBaseNodeinfo();
            $("#id-paramreqtable #reqdiv").click(function () {
                    $("#tagType").val("0");
                    initParamTable("0");
                }
            );
            $("#id-paramreqstable #respdiv").click(function () {
                    $("#tagType").val("1");
                    initParamTable("1");
                }
            );
        }

        //请求和响应参数- 添加
        $(".detail_add_box").unbind("click").bind("click", addParamBtn);
        $("#addParamSetBtn").unbind("click").bind("click", addParam);
        //添加参数模态框参数事件
        modalChange();
    }
);
//添加参数模态框参数事件
function modalChange(){
    //命名空间条件开启
    /*$(".nameSpace").hide();
    $(".paramPos").each(function () {
            var $dom = $(this).find('.form-control');
            var $this = $(this);
            $dom.change(function () {
                    if ($dom.val() != "7") {
                        $this.siblings(".nameSpace").hide();
                    }
                    else {
                        $this.siblings(".nameSpace").show();
                    }
                }
            );
        }
    );*/
    //最大长度条件开启
    /*$(".reqType").each(function () {
            var $dom = $(this).find('.form-control');
            var $this = $(this);
            $dom.change(function () {
                    if ($dom.val() != "String") {
                        $this.siblings(".paraRegular").hide();
                    }
                    else {
                        $this.siblings(".paraRegular").show();
                    }
                }
            );
        }
    );*/
    $(".mappingId input").unbind("click").bind("click",inputClick);
};
function initBaseinfo() {
    $("#pubname").val(baseserNodeObj.serName);//接口名称
}
function initBaseNodeinfo() {
    $("#inteName").val(baseserNodeObj.nodeName);
    //接口名称:
}

/*-----请求和响应参数-----*/

function initParamTable(tagType){
    var zNodes=getParams();
    var treeId=(tagType=="0"?"#reqTree":"#respTree");
    var setting = {
        view: {
            addHoverDom: zTreeFunObj.addHoverDom,
            removeHoverDom:zTreeFunObj.removeHoverDom,
            selectedMulti: false,
            showIcon:false
        }
        ,
        data: {
            simpleData: {
                enable: true
            }
        }
        ,
        edit: {
            enable: true,
            showRemoveBtn: zTreeFunObj.showRemoveBtn,
            showRenameBtn: zTreeFunObj.showRenameBtn,
        },
        callback: {
            beforeEditName: zTreeFunObj.beforeEditName,
            beforeRemove: zTreeFunObj.beforeRemove,
        },
    };
    zTreeObj = $.fn.zTree.init($(treeId), setting, zNodes);
}
function getParams(){
    var tagType=$("#tagType").val();
    var objdata = [];
    if (tagType == "0" && baseserNodeObj.inparameter.length>0) {
        objdata = baseserNodeObj.inparameter;
    }
    else if (tagType == "1" && baseserNodeObj.outparameter.length>0) {
        objdata = baseserNodeObj.outparameter;
    }

    let data=[];
    if (objdata != null&&objdata.length>0) {
        objdata.map(function(item,index){
            let dateC={};
            dateC["id"]=item["id"];
            dateC["pId"]=item["parentId"];
            dateC["name"]=item["name"];
            dateC["info"]={
                type: item["type"],
                ecode: item["ecode"],
                reqDesc: item["reqDesc"],
                reqType: item["reqType"],
                paraRegular: item["paraRegular"],
                paramPos: item["paramPos"],
                nameSpace: item["nameSpace"],
                paraDefault: item["paraDefault"],
                isEmpty: item["isEmpty"],
                mappingId: item["mappingId"],
                mappingRule: item["mappingRule"],
                sortId: item["sortId"]
            };
            data.push(dateC);
            }
        );
    }
    return data;
}
//添加参数模态框添加初始化
function modalAddSet(){
    //设置默认参数
    $(".param-input").val("");
    $('.reqType').find('select').val('String');
    $(".isEmpty").find('select').val("false");
   /* $(".paraRegular").show();*/
    /*$(".nameSpace").hide();*/
    let tagType=$("#tagType").val();
    let $paroption = $('.paramPos').find('select');

    $inputText.attr("initidvalue","null");
    if (tagType == "0") {
        $paroption.find('option').eq(0).show();
        $paroption.find('option').eq(1).show();
        $paroption.find('option').eq(2).show();
        $paroption.find('option').eq(3).hide();
        $paroption.find('option').eq(4).hide();
        $paroption.find('option').eq(5).show();
        $paroption.find('option').eq(6).hide();
        /*$paroption.find('option').eq(7).show();*/
        $paroption.val('0');
        baseserNodeObj.componentsId=="componentsIdStart"?
            (function(){$("#paramadd .mappingId").hide();$("#paramadd .mappingRule").hide()})()
            :(function(){$("#paramadd .mappingId").show();$("#paramadd .mappingRule").show();getMappingTree();})()
    } else if (tagType == "1") {
        $paroption.find('option').eq(0).hide();
        $paroption.find('option').eq(1).hide();
        $paroption.find('option').eq(2).hide();
        $paroption.find('option').eq(3).show();
        $paroption.find('option').eq(4).show();
        $paroption.find('option').eq(5).hide();
        $paroption.find('option').eq(6).show();
        /*$paroption.find('option').eq(7).show();*/
        $paroption.val('3');
        baseserNodeObj.componentsId=="componentsIdEnd"?
            (function(){$("#paramadd .mappingId").show();$("#paramadd .mappingRule").show();getMappingTree()})()
            :(function(){$("#paramadd .mappingId").hide();$("#paramadd .mappingRule").hide();})()
    }
}
//添加父级参数按钮
function addParamBtn() {
    let selectedNodes = zTreeObj.getSelectedNodes();
    if (selectedNodes.length>0) {
        zTreeObj.cancelSelectedNode(selectedNodes[0]);
    }
    $("#addParamSetBtn").text("保存");
    paramadd=true;

    modalAddSet();
    if ($("#allparamset").data('bootstrapValidator')) {
        $("#allparamset").data('bootstrapValidator').destroy();
    }
    formValidator_para('#allparamset');
    $('#paramadd').modal();
}
//ztree上的新增按钮
function insertParams() {
    $("#addParamSetBtn").text("保存");
    paramadd=true;

    modalAddSet();
    if ($("#allparamset").data('bootstrapValidator')) {
        $("#allparamset").data('bootstrapValidator').destroy();
    }
    formValidator_para('#allparamset');
    $('#paramadd').modal();
}
function deleteParams(){
    $("#deleteParamsModal").modal("show");
    $("#deleteParamsModal").find(".confirm-box-ok").unbind("click");
    $("#deleteParamsModal").find(".confirm-box-ok").click(function(){
        $("#deleteParamsModal").modal("hide");
        function delZtreeData(parmId,baseparamlist){
            for (let i = 0; i < baseparamlist.length; i++) {
                if (parmId == baseparamlist[i].parentId) {
                    let  parmId=baseparamlist[i].id;
                    removeByValue(baseparamlist, baseparamlist[i]);
                    delZtreeData(parmId,baseparamlist);
                }
            }
        }
        let tagType=$("#tagType").val();
        let selectedNodes=zTreeObj.getSelectedNodes();
        let parmId = selectedNodes[0].id==""?null:selectedNodes[0].id;
        let ztreeId = selectedNodes[0].tId==""?null:selectedNodes[0].tId;
        if(tagType=="0"){
            if (baseserNodeObj.inparameter.length>0) {
                let baseparamlist = baseserNodeObj.inparameter;
                for (let i = 0; i < baseparamlist.length; i++) {
                    if (parmId == baseparamlist[i].id) {
                        removeByValue(baseparamlist, baseparamlist[i]);
                        delZtreeData(parmId,baseparamlist);
                    }
                }
                baseserNodeObj.inparameter = baseparamlist;
            }
        }else if(tagType=="1"){
            if (baseserNodeObj.outparameter.length>0) {
                let baseparamlist = baseserNodeObj.outparameter;
                for (let i = 0; i < baseparamlist.length; i++) {
                    if (parmId == baseparamlist[i].id) {
                        removeByValue(baseparamlist, baseparamlist[i]);
                        delZtreeData(parmId,baseparamlist);
                    }
                }
                baseserNodeObj.outparameter = baseparamlist;
            }
        }
        zTreeObj.removeNode(zTreeObj.getNodeByTId(ztreeId));
    });
}
function updateParams(){
    $("#addParamSetBtn").text("修改");
    paramadd=false;

    modalAddSet();
    if ($("#allparamset").data('bootstrapValidator')) {
        $("#allparamset").data('bootstrapValidator').destroy();
    }
    formValidator_para('#allparamset');
    $('#paramadd').modal();
    let tagType=$("#tagType").val();
    //参数回显
    let baseparam;
    let baseparamlist;
    let selectedNodes=zTreeObj.getSelectedNodes();
    let parmId = selectedNodes[0].id==""?null:selectedNodes[0].id;
    if (tagType == "0") {
        baseparamlist = baseserNodeObj.inparameter;

    } else if (tagType == "1") {
        baseparamlist = baseserNodeObj.outparameter;
    }
    for (let i = 0; i < baseparamlist.length; i++) {
        if (parmId == baseparamlist[i].id) {
            baseparam = baseparamlist[i];
        }
    }
    $(".name .form-control").val(baseparam.name);
    $(".ecode .form-control").val(baseparam.ecode);
    $(".reqDesc .form-control").val(baseparam.reqDesc);
    $(".reqType .form-control").val(baseparam.reqType);
    $(".paraRegular .form-control").val(baseparam.paraRegular);
    $(".paramPos .form-control").val(baseparam.paramPos);
   /* $(".nameSpace .form-control").val(baseparam.nameSpace);*/
    $(".paraDefault .form-control").val(baseparam.paraDefault);
    $(".isEmpty .form-control").val(baseparam.isEmpty);
    $(".mappingId .form-control").attr("initidvalue",baseparam.mappingId);
    $(".mappingRule .form-control").val(baseparam.mappingRule);
    $(".sortId .form-control").val(baseparam.sortId);
    /*if ($(".reqType .form-control").val() == 'String') {
        $(".paraRegular").show();
    } else {
        $(".paraRegular").hide();
    }*/
    /*if ($(".paramPos .form-control").val() == '7') {
        $(".nameSpace").show();
    } else {
        $(".nameSpace").hide();
    }*/
    let mappingParamId=baseparam.mappingId;
    let data=getMappingTree(mappingParamId);
    data.map(function(item,index){
        if(item.id == baseparam.mappingId){
            $(".mappingId .form-control").val(item.name);
        }
    });
}
//参数添加和修改确认
function addParam(){
    $("#allparamset").data('bootstrapValidator').validate();
    if($('#allparamset').data('bootstrapValidator').isValid()){
        let tagType = $("#tagType").val();
        let selectedNodes=zTreeObj.getSelectedNodes();
        let parentId = selectedNodes.length==0||selectedNodes[0].id==""?null:selectedNodes[0].id;
        let ztreeId = selectedNodes.length==0||selectedNodes[0].tId==""?null:selectedNodes[0].tId;
        let name = $(".name .form-control").val();
        let ecode = $(".ecode .form-control").val();
        let reqDesc = $(".reqDesc .form-control").val();
        let reqType = $(".reqType .form-control").val();
        let paraRegular = $(".paraRegular .form-control").val();
        let paramPos = $(".paramPos .form-control").val();
        let nameSpace = "";
        let paraDefault = $(".paraDefault .form-control").val();
        let isEmpty = $(".isEmpty .form-control").val();
        let mappingId = $inputText.attr("initidvalue");
        let mappingRule = $(".mappingRule input").val();
        let sortId = $(".sortId .form-control").val();
        let codeMap = [];
        //添加
        if (paramadd) {
            let reqobj = new reqObj(getuuid(),tagType,parentId,name,ecode,reqDesc,reqType,paraRegular,paramPos,nameSpace,paraDefault,isEmpty,mappingId,mappingRule,sortId,codeMap);
            if (reqobj.parentId == "" && reqobj.paramPos == "6") {
                $.message({
                    message: '请在xml属性参数设置父参数节点！',
                    type: 'warning'
                });
                return;
            }
            let reqobjstr = JSON.stringify(reqobj);
            let listobj = JSON.parse(reqobjstr);
            //请求参数设置
            if (tagType == "0") {
                if (baseserNodeObj.inparameter.length==0) {
                    baseserNodeObj.inparameter = [listobj];
                } else {
                    let baseparamlist = baseserNodeObj.inparameter;
                    baseparamlist.push(listobj);
                    baseserNodeObj.inparameter = baseparamlist;
                }
            }
            //响应参数设置
            else if (tagType == "1"){
                if (baseserNodeObj.outparameter.length==0) {
                    baseserNodeObj.outparameter = [listobj];
                } else {
                    let baseparamlist = baseserNodeObj.outparameter;
                    baseparamlist.push(listobj);
                    baseserNodeObj.outparameter = baseparamlist;
                }
            }
            let newNode={
                id:reqobj.id,
                pId:reqobj.parentId,
                name:reqobj.name,
                info:{
                    type:reqobj.type,
                    ecode:reqobj.ecode,
                    reqDesc:reqobj.reqDesc,
                    reqType:reqobj.reqType,
                    paraRegular:reqobj.paraRegular,
                    paramPos:reqobj.paramPos,
                    nameSpace:reqobj.nameSpace,
                    paraDefault:reqobj.paraDefault,
                    isEmpty:reqobj.isEmpty,
                    mappingId:reqobj.mappingId,
                    mappingRule:reqobj.mappingRule,
                    sortId:reqobj.sortId,
                    codeMap:reqobj.codeMap
                }
            };
            zTreeObj.addNodes(zTreeObj.getNodeByTId(ztreeId), [newNode]);
        }
        //修改
        else{
            let baseparam;
            let baseparamlist;
            if (tagType == "0") {
                baseparamlist = baseserNodeObj.inparameter;
            } else if (tagType == "1") {
                baseparamlist = baseserNodeObj.outparameter;
            }

            for (let i = 0; i < baseparamlist.length; i++) {
                if (parentId == baseparamlist[i].id) {
                    baseparam = baseparamlist[i];
                    baseparam.type = tagType;
                    baseparam.name = name;
                    baseparam.ecode = ecode;
                    baseparam.reqDesc = reqDesc;
                    baseparam.reqType = reqType;
                    baseparam.paraRegular = paraRegular;
                    baseparam.paramPos = paramPos;
                    baseparam.nameSpace = nameSpace;
                    baseparam.paraDefault = paraDefault;
                    baseparam.isEmpty = isEmpty;
                    baseparam.mappingId = mappingId;
                    baseparam.mappingRule = mappingRule;
                    baseparam.sortId = sortId;
                    baseparam.codeMap = codeMap;
                    baseparamlist.splice(i,1,baseparam);
                    /* updateParamsRelation(baseparam);//修改和参数有关的线上的映射*/
                }
            }
            if (tagType == "0") {
                baseserNodeObj.inparameter = baseparamlist;
            } else if (tagType == "1") {
                baseserNodeObj.outparameter = baseparamlist;
            }
            let node=zTreeObj.getNodeByTId(ztreeId);
            node.name=name;
            zTreeObj.updateNode(node);
        }
        $('#paramadd').modal("hide");
    }
}

/*-----参数映射-----*/
//获取前几个服务节点的请求和响应参数
function getTreeNodes(mappingParamId){
    allprenodes=[];
    allprenodes=Array.from(new Set(getAllPreNodes(currentNode)));

    let param_zNodes = [];
    for (let i = 0; i < serNodeArray.length; i++) {
        for (let k = 0; k < allprenodes.length; k++) {
            if (allprenodes[k].data("nodeId") == serNodeArray[i].nodeId) {
                let dataname = "";
                    dataname = serNodeArray[i].nodeName;

                let paramNode = {
                    id: serNodeArray[i].nodeId,
                    pId: "ROOT",
                    name: dataname,
                    param:false
                };
                param_zNodes.push(paramNode);

                if (serNodeArray[i].componentsId == "componentsIdStart" && serNodeArray[i].nodeName == "开始") {
                    let inparameter = serNodeArray[i].inparameter;
                    if (inparameter != null && inparameter.length > 0) {
                        for (let j = 0; j < inparameter.length; j++) {
                            let pId = serNodeArray[i].nodeId;
                            if (inparameter[j].parentId != "" && inparameter[j].parentId != undefined) {
                                pId = inparameter[j].parentId;
                            }
                            let in_paramnode = {
                                id: inparameter[j].id,
                                pId: pId,
                                name: inparameter[j].name,
                                param:true
                            };
                            param_zNodes.push(in_paramnode);
                        }
                    } else {
                        param_zNodes.pop();
                    }
                } else {
                    /*let inparameter = serNodeArray[i].inparameter;*/
                    let outparameter = serNodeArray[i].outparameter;
                   /* if(inparameter != null && inparameter.length > 0){
                        let paramNode = {
                            id: serNodeArray[i].nodeId+"in",
                            pId: serNodeArray[i].nodeId,
                            name: "请求参数",
                            param:false
                        };
                        param_zNodes.push(paramNode);
                        for (let j = 0; j < inparameter.length; j++) {
                            let pId = paramNode.id;
                            if (inparameter[j].parentId != "" && inparameter[j].parentId != undefined) {
                                pId = inparameter[j].parentId;
                            }
                            let in_paramnode = {
                                id: inparameter[j].id,
                                pId: pId,
                                name: inparameter[j].name,
                                param:true
                            };
                            param_zNodes.push(in_paramnode);
                        }
                    }*/
                    if(outparameter != null && outparameter.length > 0){
                       /* let paramNode = {
                            id: serNodeArray[i].nodeId+"out",
                            pId: serNodeArray[i].nodeId,
                            name: "响应参数",
                            param:false
                        };
                        param_zNodes.push(paramNode);*/
                        for (let j = 0; j < outparameter.length; j++) {
                            let pId = paramNode.id;
                            if (outparameter[j].parentId != "" && outparameter[j].parentId != undefined) {
                                pId = outparameter[j].parentId;
                            }
                            let in_paramnode = {
                                id: outparameter[j].id,
                                pId: pId,
                                name: outparameter[j].name,
                                param:true
                            };
                            param_zNodes.push(in_paramnode);
                        }
                    }
                    if(/*(inparameter == null || inparameter.length == 0)&&*/(outparameter == null || outparameter.length == 0)){
                        param_zNodes.pop();
                    }
                }
            }
        }
    }
    /*得到映射树所选映射级联父级id数组*/
    let MappingIdArray=[];
    function getMappingIds(mappingParamId){
        param_zNodes.map(function(item,index){
            if(item.id == mappingParamId){
                MappingIdArray.push(item.id);
                getMappingIds(item.pId)
            }
        });
    }
    getMappingIds(mappingParamId);

    MappingIdArray.map(function(paramId,index){
        param_zNodes.map(function(item,index){
            if(paramId==item.id){
                item.open=true;
            }
        });
    });
    return param_zNodes;
}
//获取节点之前所有节点
function getAllPreNodes(node) {
    let prenode;
    let startSet = node.data("startSet");
    if (startSet != null && startSet.length > 0 && startSet != undefined) {
        for(let i=0;i<startSet.length;i++){
            prenode = tag.getNodeById(startSet[i]);
            allprenodes.push(prenode);
            getAllPreNodes(prenode);
        }
    }
    return allprenodes;
}
function getMappingTree(mappingParamId){
    let data=getTreeNodes(mappingParamId);
    let setting = {
        view: {
            selectedMulti: false,
            showIcon:false
        }
        ,
        data: {
            simpleData: {
                enable: true
            }
        }
        ,
        edit: {
            enable: false
        },
        callback: {
            beforeClick: beforeClick,
            onClick: onTreeClick,
        }
    };
    $.fn.zTree.init( $("#treeMapping"), setting, data);
    return data;
}
//点击input框展示树形
function inputClick() {
    //获取到当前的input对象
    let x = 0;
    let y = 35;
    $("#menuContent").css({left: x + "px", top: y + "px"}).slideDown("fast");
    $("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
    if ($(event.target).parents("#menuContent").length==0) {
        hideMenu();
    }
}
//设置树的父节点不能点击
function beforeClick(treeId, treeNode) {
    if(!treeNode.param){
        $.message({
            message: '请选择参数！',
            type: 'warning'
        });
    }
    return treeNode.param;
}
//树点击事件给每行数据赋值
function onTreeClick(e, treeId, treeNode) {
    let treeObj = $.fn.zTree.getZTreeObj("treeMapping");
    let node = treeObj.getSelectedNodes();
    $inputText.val(node[0].name);
    $inputText.attr("initidvalue", node[0].id);

    $("#menuContent").fadeOut("fast");
}
