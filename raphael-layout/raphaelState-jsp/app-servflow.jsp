<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>

<head>
    <title>${appName}</title>
    <meta http-equiv="content-type" content="text/html;charset=UTF-8">
    <%@ include file="../../../common/base.jsp"%>
    <style>
        .page-list .btn-group>.btn:first-child {
            margin: 0;
        }

        .pagination>li.jumpto {
            margin-right: 0;
        }

        .app-details {}

        .app-details .dedail-item {
            margin-bottom: 15px;
        }

        .app-details .d-key {
            color: #999999;
        }

        .app-details .d-value {
            color: #333333;
        }

        .app-details .d-value .s-d {
            margin-right: 15px;
        }

        .app-details .d-value .s-d .s-name {
            margin-right: 5px;
        }

        .app-details .d-value .s-d .s-value {
            margin-right: 2px;
        }

        .show-pass {
            display: none;
        }

        .dedail-item:hover .hide-pass {
            display: none;
        }

        .dedail-item:hover .show-pass {
            display: inline-block;
        }
    </style>
</head>

<body>
    <div class="page-container">
        <%@ include file="../../../common/navigation.jsp"%>
        <div class="page-content">
            <div class="page-wrap bcloud-part">
                <div class="bcloud-header">
                    <div class="bcloud-header-operation pull-left">
                        <form class="form-inline">
                            <div class="bcloud-dropdown-operation" id="applicationSelect">
                                <select name="applicationId" class="form-control selectpicker">
                                    <!-- <option value="">请选择应用名称</option> -->
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="bcloud-header-operation pull-right">

                        <div class="btn-group">
                            <button type="button" class="btn btn-bcloud-blue active btn-sm list">列表</button>
                            <button type="button" class="btn btn-bcloud-blue btn-sm topology">拓扑</button>
                            <!-- <button type="button" class="btn btn-bcloud-blue btn-sm">事件</button> -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="page-content list">
                <div class="page-wrap bcloud-all service-wrap" style="margin-bottom: 20px;min-height: 150px;">
                    <div class="bcloud-content app-state-wrap">
                        <!-- 启动中 -->
                        <div class="row app-state" app-state="1010">
                            <div class="col-md-2 col-lg-3 s-1-wrap">
                                <img class="s-1-img" src="${resContextPath}/img/common/loading.gif"
                                    style="width: 36px; height: 36px;">
                                <span class="service-status"></span>
                                <br>
                                <span class="default-block">-
                                    <!-- 应用启动中，可能消耗时间很长，请耐心等待；您可以进入
                                    <a href="javascript:void(0);" class="create-block">拓扑</a>
                                    查看启动过程<%--或者进入<a href="javascript:void(0);" class="create-block topology_a">事件</a>查看启动事件详情--%> -->
                                </span>
                            </div>
                            <div class="divider-vertical"></div>
                            <div class="col-md-3 col-lg-3" style="padding-left: 20px;">
                                <div class="app-details">
                                    <div class="dedail-item">
                                        <span class="d-key">应用版本：</span>
                                        <span class="d-value a-version"></span>
                                    </div>
                                    <div class="dedail-item">
                                        <span class="d-key">应用描述：</span>
                                        <span class="d-value a-desc"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="divider-vertical"></div>
                            <div class="visite-url-container">
                                <!-- <div class="col-md-4 col-lg-4 " style="padding-left: 20px;">

                                </div>
                                <div class="divider-vertical"></div> -->
                            </div>
                            <div class="divider-vertical"></div>
                            <div class="col-md-3 col-lg-3 p-1-wrap" style="padding-left: 20px;">
                                <div class="app-details">
                                    <div class="dedail-item">
                                        <div class="dedail-item d-cpu">
                                            <span class="d-key">CPU：</span>
                                            <span class="d-value s-value" style="margin-right: 5px;"></span>
                                            <span class="s-unit">核</span>
                                        </div>
                                        <div class="dedail-item d-memory">
                                            <span class="d-key">内存：</span>
                                            <span class="d-value s-value" style="margin-right: 5px;"></span>
                                            <span class="s-unit">GB</span>
                                        </div>
                                        <div class="dedail-item d-storage">
                                            <span class="d-key">存储：</span>
                                            <span class="d-value s-value" style="margin-right: 5px;"></span>
                                            <span class="s-unit">GB</span>
                                        </div>
                                        <!-- <span class="d-key">应用规格：</span>
                                        <span class="d-value">
                                            <span class="d-cpu s-d">
                                                <span class="s-name">CPU</span><span class="s-value">-</span><span
                                                    class="s-unit">核</span>
                                            </span>
                                            <span class="d-memory s-d">
                                                <span class="s-name">内存</span><span class="s-value">-</span><span
                                                    class="s-unit">GB</span>
                                            </span>
                                            <span class="d-storage s-d">
                                                <span class="s-name">存储</span><span class="s-value">-</span><span
                                                    class="s-unit">GB</span>
                                            </span>
                                        </span> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="page-wrap bcloud-all service-wrap">
                    <div class="bcloud-content">
                        <%--列表--%>
                        <div class="table-responsive services-wrap">
                            <table class="table table-hover" id="servflowTable">
                                <thead>
                                    <tr>
                                        <th style="text-align: left; vertical-align: middle; " data-field="serviceName">
                                            <div class="th-inner ">服务名称</div>
                                            <div class="fht-cell"></div>
                                        </th>
                                        <th class="status" style="text-align: center; vertical-align: middle; "
                                            data-field="1">
                                            <div class="th-inner ">服务状态</div>
                                            <div class="fht-cell"></div>
                                        </th>
                                        <th style="text-align: center; vertical-align: middle; " data-field="2">
                                            <div class="th-inner ">服务配额</div>
                                            <div class="fht-cell"></div>
                                        </th>
                                        <th style="text-align: center; vertical-align: middle; " data-field="">
                                            <div class="th-inner ">版本</div>
                                            <div class="fht-cell"></div>
                                        </th>
                                        <th style="text-align: right; vertical-align: middle; "
                                            data-field="description">
                                            <div class="th-inner ">启动时长</div>
                                            <div class="fht-cell"></div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="page-content topology" style="height:750px;display:none;position:relative">
                <div class="page-content page-mg" style="height:100%">
                    <div class="page-wrap bcloud-part" style="height:100%">
                        <div class="bcloud-content" style="height:100%">
                            <div id="stateType_canvas" style="height:50px;"></div>
                            <div id="state_canvas" style="height:calc(100% - 50px);overflow: auto;">
                                <div class="loading-table" style="height:100%">
                                    <div><img src="${resContextPath}/img/common/loading.gif"
                                            style="width:50px;height: 50px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-content bcloud-all right-content-log">
                    <div class="bcloud-header">
                        <div class="bcloud-header-title">日志信息</div>
                    </div>
                    <div class="bcloud-content">
                        <div class="loading-table" style="height:100%">
                            <div><img src="${resContextPath}/img/common/loading.gif" style="width:40px;height: 40px;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--流程图需要引入四个文件 -->
        <script src="${resContextPath}/plugin/raphael/js/raphael.js" type="text/javascript"></script>
        <script src="${resContextPath}/plugin/raphael/js/mousetrap.min.js" type="text/javascript"></script>
		//<script src="${resContextPath}/plugin/raphael/js/jquery.taglib2.js" type="text/javascript"></script>
        <script src="${resContextPath}/plugin/raphael/js/jquery.taglib.js" type="text/javascript"></script>

        <script src="${resContextPath}/js/model/console/application/app-raphaelState.js"></script>
        <script src="${resContextPath}/js/model/console/application/app-servflow.js"></script>
        <script src="${resContextPath}/js/model/console/application/topology-data.js"></script>
        //<script src="${resContextPath}/js/model/console/application/app-servflow2.js"></script>
		 <script src="${resContextPath}/js/model/console/application/app-servflow1.js"></script>
</body>

</html>