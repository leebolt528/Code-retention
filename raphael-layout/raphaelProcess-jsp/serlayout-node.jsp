<% /**
 ----------- 本页面描述右侧面板api的详细信息（设置参数ifream） ----------------
 */%>

<%@ page language="java" contentType="text/html;charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>组件 详细信息</title>
    <style>
        .form-control{
            display: block;
            width: 100%;
        }
    </style>
</head>
<body>
<div class="row row-fluid">
    <div class="col-md-12 column force drop-helper" data-uuid="4e9b8d1648">
        <input type="hidden" id="tagType" name="type">
        <div class="carmary_detail_item open" id="id-parambasetable">
            <div class="detail_item_title" id="baseinfo">
                基本信息
                <img class="down-arrow">
            </div>
            <div class="detail-item_content">
                <div class="form-group">
                    <label>
                        节点名称
                    </label>
                    <input type="text" name="inteName" class="form-control" id="inteName" autocomplete="off">
                </div>
               <%-- <div class="form-group">
                    <label>
                        服务类型
                    </label>
                    <input type="text" name="serviceType" class="form-control" id="serviceType" autocomplete="off">
                </div>
                <div class="form-group">
                    <label>
                        请求协议
                    </label>
                    <select name="reqAgree" class="form-control" id="reqAgree">
                        <option value="http">
                            http
                        </option>
                        <option value="webService">
                            webService
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        请求格式
                    </label>
                    <select name="reqFormat" class="form-control" id="reqFormat">
                        <option disabled="disabled">
                            ------------请选择-------------
                        </option>
                        <option value="application/json">
                            application/json
                        </option>
                        <option value="application/xml">
                            application/xml
                        </option>
                        <option value="application/x-www-form-urlencoded">
                            application/x-www-form-urlencoded
                        </option>
                        <option value="application/soap+xml">
                            application/soap+xml
                        </option>
                        <option value="text/xml">
                            text/xml
                        </option>
                        <option value="其他">
                            其他
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        响应格式
                    </label>
                    <select name="respFormat" class="form-control" id="respFormat">
                        <option disabled="disabled">
                            ------------请选择-------------
                        </option>
                        <option value="application/json">
                            application/json
                        </option>
                        <option value="application/xml">
                            application/xml
                        </option>
                        <option value="application/soap+xml">
                            application/soap+xml
                        </option>
                        <option value="text/xml">
                            text/xml
                        </option>
                        <option value="其他">
                            其他
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        请求值类型:
                    </label>
                    <select name="reqdatatype" id="reqdatatype" class="form-control">
                        <option value="Object" selected="">
                            Object
                        </option>
                        <option value="List">
                            List
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        返回值类型:
                    </label>
                    <select name="returndatatype" id="returndatatype" class="form-control">
                        <option value="Object" selected="">
                            Object
                        </option>
                        <option value="List">
                            List
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        请求参数字符集
                    </label>
                    <select id="inCharset" class="form-control">
                        <option selected="" value="UTF-8">
                            UTF-8
                        </option>
                        <option value="UTF-16">
                            UTF-16
                        </option>
                        <option value="GBK">
                            GBK
                        </option>
                        <option value="ISO-8859-1">
                            ISO-8859-1
                        </option>
                        <option value="US-ASCII">
                            US-ASCII
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        响应参数字符集
                    </label>
                    <select id="outCharset" class="form-control">
                        <option selected="" value="UTF-8">
                            UTF-8
                        </option>
                        <option value="UTF-16">
                            UTF-16
                        </option>
                        <option value="GBK">
                            GBK
                        </option>
                        <option value="US-ASCII">
                            ISO-8859-1
                        </option>
                        <option value="US-ASCII">
                            US-ASCII
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        描述
                    </label>
                    <textarea class="form-control form-textarea" name="desc" id="desc" rows="3">
        </textarea>
                </div>--%>
            </div>
        </div>
        <div class="carmary_detail_item" id="id-paramreqtable">
            <div class="detail_item_title" id="reqdiv">
                请求参数
                <img class="down-arrow">
            </div>
            <div class="detail-item_content">
                <div class="detail_add_box">
                    <img class="tadd">
                </div>
                <ul id="reqTree" class="ztree">
                </ul>
            </div>
        </div>
        <div class="carmary_detail_item" id="id-paramreqstable">
            <div class="detail_item_title" id="respdiv">
                响应参数
                <img class="down-arrow">
            </div>
            <div class="detail-item_content">
                <div class="detail_add_box">
                    <img class="tadd">
                </div>
                <ul id="respTree" class="ztree">
                </ul>
            </div>
        </div>
    </div>
</div>

<script src="${resContextPath}/js/model/servflow/serlayout/serlayout-apiparam.js"></script>
</div>
</body>
</html>