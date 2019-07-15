<%@ page language="java" contentType="text/html;charset=UTF-8"
	pageEncoding="UTF-8"%>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>流程图</title>
	<%@ include file="../../../common/base.jsp"%>
</head>
<style>
	textarea {
		border-radius: 3px;
		border: 1px solid #000;
	}

	#org-panel .panel-heading {
		border-top: 3px solid #0070d2;
	}

	#org-panel .panel-heading i {
		color: #0070d2;
	}

</style>
<body class="body-bg">
	<div class="page-container">
		<%@ include file="../../../common/navigation.jsp"%>
		<div class="page-content">
			<div class="page-wrap bcloud-part">
				<div class="bcloud-header">
					<div class="bcloud-header-operation pull-left">
						<form class="form-inline" id="serLayoutForm">
							<div class="input-group bcloud-input-search">
								<input type="text" class="form-control search-serName" placeholder="服务名称">
								<span class="input-group-btn" id="searchBtn">
									<button class="btn btn-bcloud-gray" type="button"><i class="fa fa-search"></i></button>
								</span>
							</div>
						</form>
					</div>
					<div class="bcloud-header-operation pull-right">
						<div class="bcloud-btn-operation">
							<a class="btn btn-link btn-xs" id="id-layoutaddBtn">
								<img src="${resContextPath}/img/icon/plus-square-s-o.svg">新建
							</a>
							<a class="btn btn-link btn-xs" id="property-add-btn">
								<img src="${resContextPath}/img/icon/plus-square-import.svg" style="width: 35px;height:15px;margin-top: -2px;">导入
							</a>
						</div>
					</div>
				</div>
				<div class="bcloud-content">
					<%--列表--%>
					<div class="table-responsive">
						<table class="table table-hover" id="floechart-table"></table>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade bs-example-modal-sm" id="deleteConfirmModal" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-sm">
			<div class="modal-content bcloud-confirm-content">
				<div class="modal-header bcloud-confirm-header">
					删除信息
				</div>
				<div class="modal-body bcloud-confirm-body">
					请问是否删除该应用？
				</div>
				<div class="modal-footer bcloud-confirm-footer">
					<button class="btn btn-bcloud-blue active confirm-box-ok">确定</button>
					<button class="btn  btn-bcloud-white confirm-box-cancel" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade bs-example-modal-sm" id="dbConfirmModal" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-sm">
			<div class="modal-content bcloud-confirm-content">
				<div class="modal-header bcloud-confirm-header">
					发布信息
				</div>
				<div class="modal-body bcloud-confirm-body">
					请问是否发布该应用？
				</div>
				<div class="modal-footer bcloud-confirm-footer">
					<button class="btn btn-bcloud-blue active confirm-box-ok">确定</button>
					<button class="btn  btn-bcloud-white confirm-box-cancel" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="importFilediv" tabindex="-1" role="dialog"
		 aria-labelledby="myModalLabel" data-backdrop="static">
		<div class="modal-dialog" role="document" style="width:650px;">
			<div class="modal-content bcloud-params-content">
				<div class="bconsole-params-close" data-dismiss="modal" aria-label="Close" onclick="">
					<a><img src="${resContextPath}/img/common/close.png"></a>
				</div>
				<div class="bconsole-params-title">
					<span class="title">请选择上传文件</span>
				</div>
				<div class="bconsole-params-body" style="padding-left: 69px;padding-right: 118px;">
					<input id="lefile" type="file" style="display: none" name="file">
						<input id="importFileinput" class="form-control" type="text" style="width:calc(100% - 92px);display: inline-block;">
						<button type="button" class="btn btn-bcloud-gray" style="margin-top: -3px;"
								onclick="$('input[id=lefile]').click();">选择文件</button>
				</div>
				<div class="bconsole-params-footer">
					<button type="button" class="btn btn-bcloud-blue active btn-confirm" id="addParamSetBtn">保存</button>
					<button type="button" class="btn btn-bcloud-white btn-cancel" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>
<script>
	var typeId = '${ typeId }';
	var typeName = '${ typeName }';
</script>
<script src="${resContextPath}/js/model/servflow/serlayout/ajaxfileupload.js"></script>
<script src="${resContextPath}/js/model/servflow/serlayout/serlayout-list.js" type="text/javascript"></script>
</body>
</html>