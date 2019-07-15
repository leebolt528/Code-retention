<% /**
 ----------- 本页面描述右侧面板api的详细信息（设置参数ifream） ----------------
 */%>

<%@ page language="java" contentType="text/html;charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>开始结束 详细信息</title>
    <style>
        .form-control{
            display: block;
            width: 100%;
        }
    </style>
</head>
<body>
<div class="row row-fluid" id="serInfoLayer">
    <div class="col-md-12 column force drop-helper" data-uuid="4e9b8d1648">
        <input type="hidden" id="tagType" name="type">
        <%--<div class="carmary_detail_item" id="id-parambasetable">
            <div class="detail_item_title" id="baseinfo" style="cursor: auto">
                基本信息
            </div>
            <div class="detail-item_content" style="display: block;">
                <div class="form-group">
                    <label>
                        接口名称
                    </label>
                    <input type="text" name="pubname" class="form-control" id="pubname" autocomplete="off">
                </div>
            </div>
        </div>--%>
        <div class="carmary_detail_item" id="id-paramreqtable">
            <div class="detail_item_title" id="reqdiv" style="cursor: auto">
                请求参数
            </div>
            <div class="detail-item_content" style="display: block;">
                <div class="detail_add_box">
                    <img class="tadd">
                </div>
                <ul id="reqTree" class="ztree">
                </ul>
            </div>
        </div>
        <div class="carmary_detail_item" id="id-paramreqstable">
            <div class="detail_item_title" id="respdiv" style="cursor: auto">
                响应参数
            </div>
            <div class="detail-item_content" style="display: block;">
                <div class="detail_add_box">
                    <img class="tadd">
                </div>
                <ul id="respTree" class="ztree">
                </ul>
            </div>
        </div>
    </div>
</div>
<%--<script type="text/javascript">
    var nodeId = '${nodeId}';
    var nodeName = '${nodeName}';
    nodeName = unescape(unescape(nodeName));
    var nodeStyle = '${nodeStyle}';
    var nodeType = '${nodeType}';
    var serTypesTreedata = '${serviceTypes}';
    var serTypesObjs = JSON.parse(serTypesTreedata);
</script>--%>
<script src="${resContextPath}/js/model/servflow/serlayout/serlayout-apiparam.js"></script>
</div>
</body>
</html>


