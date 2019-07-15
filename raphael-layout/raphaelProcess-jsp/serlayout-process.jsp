<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ page language="java" contentType="text/html;charset=UTF-8"
         pageEncoding="UTF-8"%>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>流程图</title>
    <%@ include file="../../../common/base.jsp"%>

    <link href="${resContextPath}/plugin/raphael/css/serlayout-process.css" type="text/css" rel="stylesheet" />
    <link href="${resContextPath}/plugin/jquery/jquery-ui-1.12.1/jquery-ui.css" rel="stylesheet" />
    <link href="${resContextPath}/plugin/jquery/jquery-left-menu/css/reset.css" rel="stylesheet" />
    <link href="${resContextPath}/plugin/jquery/jquery-left-menu/css/style.css" rel="stylesheet" />
    <link href="${resContextPath}/plugin/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" />
    <link href="${resContextPath}/plugin/zTree/css/metroStyle/metroStyle.css" rel="stylesheet" />
    <link href="${resContextPath}/plugin/raphael/css/serlayout-processTree.css" type="text/css" rel="stylesheet" />
    <%
        String skinPath = "blue";
    %>
    <link rel="stylesheet" type="text/css" href="${resContextPath}/css/skin/<%=skinPath%>/blue-skin.css?v=010">
    <style>
        .shape_groups  .shape_img img{
            width: 22px;
            height: 22px;
            margin-top: 9px;
            float: left;
        }
        .shape_groups  .shape_img .tooltips{
            margin-left: 10px;
            font-family: MicrosoftYaHei;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            color: #333333;
            padding: 0;
            height: 40px;
            line-height: 40px;
        }
        .shape_groups  .shape_img span{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            display: block;
            width: 121px;
            float: left;
        }
    </style>
</head>
<body>
    <div class="page-container" style="padding:0px">
        <%--<%@ include file="../../../common/navigation.jsp"%>--%>
        <div id="process" class="page-content">
            <div class="designer" id="designer">
                <div class="designer_body">
                    <div class="shape_panel">
                        <div class="shape_header"><div class="title">可视化编辑器</div></div>
                        <div class="shape_search"></div>

                        <div class="shape_list" ></div>
                        <div class="imgtips"></div>
                    </div>
                    <div class="designer_viewport">
                        <div class="designer_header">
                            <div class="toolbar" style="display: inline-block;">
                                <div id="btn_back">
                                    <img src="${resContextPath}/plugin/raphael/img/tool-return.png" class="toolimg" style="width:8px;height:14px;">
                                </div>
                                <div id="save_btn">
                                    <img src="${resContextPath}/plugin/raphael/img/tool-save.png" class="toolimg">
                                </div>
                                <div id="shortcutDesc">
                                    <img src="${resContextPath}/plugin/raphael/img/tool-help.png" class="toolimg">
                                </div>
                                <div class="conHref">
                                    <a href="https://code.bonc.com.cn/confluence/pages/viewpage.action?pageId=14581995"
                                       target="_blank">
                                        <img src="${resContextPath}/plugin/raphael/img/tool-note.png" class="toolimg">
                                    </a>
                                </div>
                                <div class="enlarge-btn">
                                    <img src="${resContextPath}/plugin/raphael/img/tool-enlarge.png" class="toolimg">
                                </div>
                                <div class="narrow-btn" style="display: none">
                                    <img src="${resContextPath}/plugin/raphael/img/tool-narrow.png" class="toolimg">
                                </div>

                            </div>
                            <div style="display: inline-block;border-left: 1px dashed #ccc">
                                <div class="form-group modalName">
                                    <label class="pull-left control-label" style="padding:7px 15px 0px 15px;"><span>名称:</span></label>
                                    <div class="pull-left">
                                        <input type="text" class="form-control" name="" value="${flowChartName}">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="designer_layout">
                            <div id="canvas_container">
                                <div id="designer_canvas" style="width: 1900px;height: 1500px;">
                                    <div class="loading-table" style="height:100%">
                                        <div style="top:25%"><img src="${resContextPath}/img/common/loading.gif"
                                                  style="width:50px;height: 50px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <%--请求和响应参数添加model--%>
    <div class="modal fade" id="paramadd" tabindex="-1" role="dialog"
         aria-labelledby="myModalLabel" data-backdrop="static">
        <div class="modal-dialog" role="document" style="width:650px;">
            <div class="modal-content bcloud-params-content">
                <div class="bconsole-params-close" data-dismiss="modal" aria-label="Close" onclick="">
                    <a><img src="${resContextPath}/img/common/close.png"></a>
                </div>
                <div class="bconsole-params-title">
                    <span class="title">参数设置</span>
                </div>
                <div class="bconsole-params-body" style="padding-left: 69px;padding-right: 118px;">
                    <form class="form-horizontal" id="allparamset">
                        <div class="form-group name">
                            <label class="col-lg-3 col-md-3 control-label"><span class="name">参数中文名:</span></label>
                            <div class="col-lg-9 col-md-9">
                                <input type="text" class="form-control param-input" name="name" autocomplete="off">
                            </div>
                        </div>
                        <div class="form-group ecode">
                            <label class="col-lg-3 col-md-3 control-label"><span class="name">参数名:</span></label>
                            <div class="col-lg-9 col-md-9">
                                <input type="text" class="form-control param-input" name="ecode" autocomplete="off">
                            </div>
                        </div>
                        <div class="form-group reqDesc">
                            <label class="col-lg-3 col-md-3 control-label"><span class="name">说明:</span></label>
                            <div class="col-lg-9 col-md-9">
                                <input type="text" class="form-control param-input" name="reqDesc">
                            </div>
                        </div>
                        <div class="form-group reqType">
                            <label class="col-lg-3 col-md-3 control-label"><span class="name">参数类型:</span></label>
                            <div class="col-lg-9 col-md-9">
                                <select class="form-control" name="reqType">
                                    <option value="String" selected="selected">String</option>
                                    <option value="int">int</option>
                                    <option value="boolean">boolean</option>
                                    <option value="Object">Object</option>
                                    <option value="List">List</option>
                                    <option value="List_Object">List_Object</option>
                                    <option value="List_List">List_List</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group paraRegular">
                            <label class="col-lg-3 col-md-3 control-label">正则规范:</label>
                            <div class="col-lg-9 col-md-9">
                                <input type="text" class="form-control param-input" name="paraRegular">
                            </div>
                        </div>
                        <div class="form-group paramPos">
                            <label class="col-lg-3 col-md-3 control-label"><span class="name">参数位置:</span></label>
                            <div class="col-lg-9 col-md-9">
                                <select class="form-control" name="paramPos">
                                    <option value="0">请求体</option>
                                    <option value="4">请求头</option>
                                    <option value="1">url上的参数</option>
                                    <option value="2">响应头</option>
                                    <option value="3">响应体</option>
                                    <option value="5">xml请求体属性</option>
                                    <option value="6">xml响应体属性</option>
                                    <%--<option value="7">命名空间</option>--%>
                                </select>
                            </div>
                        </div>
                        <%--<div class="form-group nameSpace">
                            <label class="col-lg-3 col-md-3 control-label">命名空间:</label>
                            <div class="col-lg-9 col-md-9">
                                <input type="text" class="form-control param-input" name="nameSpace">
                            </div>
                        </div>--%>
                        <div class="form-group paradefault">
                            <label class="col-lg-3 col-md-3 control-label">默认值:</label>
                            <div class="col-lg-9 col-md-9">
                                <input type="text" class="form-control param-input" name="paradefault">
                            </div>
                        </div>
                        <div class="form-group isEmpty">
                            <label class="col-lg-3 col-md-3 control-label">是否必传项:</label>
                            <div class="col-lg-9 col-md-9">
                                <select class="form-control" name="isEmpty">
                                    <option value="false" selected="selected">否</option>
                                    <option value="true">是</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group mappingId">
                            <label class="col-lg-3 col-md-3 control-label"><span class="name">参数映射:</span></label>
                            <div class="col-lg-9 col-md-9">
                                <input type="text" class="form-control param-input" initidvalue="" name="mappingId">
                                <div id="menuContent" class="menuContent" style="display:none; position: absolute;z-index:1;width: calc(100% - 15px);">
                                    <ul id="treeMapping" class="ztree" style="border:solid 1px #d9d9d9;background-color:#fff;overflow-y:auto;height:200px"></ul>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mappingRule">
                            <label class="col-lg-3 col-md-3 control-label"><span class="name">映射规则:</span></label>
                            <div class="col-lg-9 col-md-9">
                                <input type="text" class="form-control param-input" name="mappingRule">
                            </div>
                        </div>
                        <div class="form-group sortId">
                            <label class="col-lg-3 col-md-3 control-label">序号:</label>
                            <div class="col-lg-9 col-md-9">
                                <input type="text" class="form-control param-input" name="sortId">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="bconsole-params-footer">
                    <button type="button" class="btn btn-bcloud-blue active btn-confirm" id="addParamSetBtn">保存</button>
                    <button type="button" class="btn btn-bcloud-white btn-cancel" data-dismiss="modal">取消</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade bs-example-modal-sm" id="versionCoverModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-sm">
            <div class="modal-content bcloud-confirm-content">
                <div class="modal-header bcloud-confirm-header">
                    保存修改
                </div>
                <div class="modal-body bcloud-confirm-body">
                    是否保存本次修改？
                </div>
                <div class="modal-footer bcloud-confirm-footer">
                    <button class="btn btn-bcloud-blue active confirm-box-ok">确认</button>
                    <button class="btn  btn-bcloud-white confirm-box-cancel" data-dismiss="modal">取消</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade bs-example-modal-sm" id="deleteParamsModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-sm">
            <div class="modal-content bcloud-confirm-content">
                <div class="modal-header bcloud-confirm-header">
                    删除信息
                </div>
                <div class="modal-body bcloud-confirm-body">
                    删除该参数？（删除后不可恢复）
                </div>
                <div class="modal-footer bcloud-confirm-footer">
                    <button class="btn btn-bcloud-blue active confirm-box-ok">确定</button>
                    <button class="btn  btn-bcloud-white confirm-box-cancel" data-dismiss="modal">取消</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade bs-example-modal-sm" id="shortcutKeysModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-sm">
            <div class="modal-content bcloud-confirm-content">
                <div class="modal-header bcloud-confirm-header">
                    快捷键说明
                </div>
                <div class="modal-body bcloud-confirm-body" style="font-size: 14px;">
                    <div>保存 ctrl+s</div>
                    <div>删除 backspace</div>
                    <div>节点上移 up</div>
                    <div>节点左移 left</div>
                    <div>节点下移 down</div>
                    <div>节点右移 right</div>
                </div>
                <div class="modal-footer bcloud-confirm-footer">
                    <button class="btn btn-bcloud-blue active confirm-box-ok" data-dismiss="modal">确定</button>
                </div>
            </div>
        </div>
    </div>
</body>
<script>
    var flowChartId = '${flowChartId}';
    var serVerId = '${serVerId}';
    //var flowChartName = '${serName}';
    //var flowType = '${flowType}';
    //var tenantId = '${tenantId}';
    var initserNodeArray = '${serNodeArray}';
    var initserJoinArray = '${serJoinArray}';
    var serFlowType = '${serFlowType}';
    //var serFlowTypeName= '${serFlowTypeName}';

    var typeId = '${ typeId }';
    var typeName = '${ typeName }';

    var idflowChartId = flowChartId;//定义全局的idflowChartId
    var componentsImgMap=new Map();//存放组件图片
    var newProcess = '${newProcess}';

</script>
<script type="text/javascript"
        src="${resContextPath}/plugin/utils/json.js"></script>
<script type="text/javascript"
        src="${resContextPath}/plugin/zTree/js/jquery.ztree.all.js"></script>
<script type="text/javascript"
        src="${resContextPath}/plugin/zTree/js/jquery.ztree.exedit.js"></script>

<!--流程图需要引入四个文件 -->
<script
        src="${resContextPath}/plugin/raphael/js/raphael.js"
        type="text/javascript"></script>
<script
        src="${resContextPath}/plugin/raphael/js/mousetrap.min.js"
        type="text/javascript"></script>
<script
        src="${resContextPath}/plugin/raphael/js/jquery.taglib.js"
        type="text/javascript"></script>
<!--流程图引入文件结束 -->
<!--flowchartInit.js用于定制流程图 -->
<script src="${resContextPath}/plugin/jquery/jquery-ui-1.12.1/jquery-ui.min.js"></script>
<script
        src="${resContextPath}/js/model/servflow/serlayout/serlayout-menuList.js"
        type="text/javascript"></script>
<script
        src="${resContextPath}/js/model/servflow/serlayout/serlayout-processtInit.js"
        type="text/javascript"></script>
<script
        src="${resContextPath}/js/model/servflow/serlayout/serlayout-fullScreen.js"
        type="text/javascript"></script>
<script
        src="${resContextPath}/js/model/servflow/serlayout/serlayout-newobj.js"
        type="text/javascript"></script>
<script
        src="${resContextPath}/js/model/servflow/serlayout/serlayout-process.js"
        type="text/javascript"></script>
<script
        src="${resContextPath}/js/util/util_common.js"
        type="text/javascript"></script>
<script
        src="${resContextPath}/plugin/jquery/jquery-left-menu/js/main.js"
        type="text/javascript"></script>
</html>