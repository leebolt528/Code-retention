function operateFormatter(value,row,index){
    let html = '<div class="expand-option"><span class="expand-option-btn"></span><div class="option-btn-container">';
    html +=
        '<button type="button" class="btn btn-default btn-xs xiaxian btn-beconsole-small updateSerProcess" style="margin-right: 5px;">修改</button>'+
        '<button type="button" class="btn btn-default btn-xs xiaxian btn-beconsole-small deleteSerProcess" style="margin-right: 5px;">删除</button>'+
        '<button type="button" class="btn btn-default btn-xs xiaxian btn-beconsole-small dbToxml" style="margin-right: 5px;">导出xml</button>'+
        '<button type="button" class="btn btn-default btn-xs xiaxian btn-beconsole-small dbToApiStore" style="margin-right: 5px;">发布到商店</button>';
    html += '</div></div>';
    return html;
}

window.operateEvents = {
    'click .dbToApiStore': function (e, value, row, index) {
        let serVerId = row.serVerId;
        // let serId = row.serId;
        let serId = row.id;
        // let pushState = row.pushState;
        let pushState = row.publishStatus;
        dbToApiStore(serId, serVerId, pushState);
    },
    'click .dbToxml': function (e, value, row, index) {
        let serVerId = row.serVerId;
        let serId = row.serId;
        let serName = row.serName;
        dbToxml(serVerId, serId, serName);
    },
    'click .deleteSerProcess': function (e, value, row, index) {
        let id = row.id;
        let pushState = row.publishStatus;
        deleteSerProcess(id,pushState);
    },
    'click .updateSerProcess': function (e, value, row, index) {
        let id = row.id;
        updateSerProcess(id);
    }
};

$(document).ready(function () {
    initFlowchartBootStrapTable();
    /*刷新编排流程列表*/
    $(".btn-refresh").click(function(e){
        $('#floechart-table').bootstrapTable('refresh');
    });
    /* 新建编排流程 */
    $("#id-layoutaddBtn").click(function () {
        location.href = $webpath + "/servflow/index2/add";
    });
    /*导入编排流程*/
    $("#property-add-btn").bind("click", xmlTodb);
    /*搜索编排流程*/
    $("#searchBtn").click(function(){
        $('#floechart-table').bootstrapTable('refresh');
	});
    //搜索-回车
    $("body").on("keydown", "#serLayoutForm input", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $('#floechart-table').bootstrapTable('destroy');
            initFlowchartBootStrapTable();
        }
    });
    $('input[id=lefile]').change(function () {
        $('#importFileinput').val($(this).val());
    });
});

/**
 * 初始化编排服务列表
 */
function initFlowchartBootStrapTable() {
    let $table = $("#floechart-table");
	let requestUrl="";
    requestUrl +=$webpath + "/servflow/v1/api/ruleChain";
    $table.bootstrapTable({
        url: requestUrl,
        method: "GET",
        contentType: "application/json",
        dataType: "json",
        classes: 'table-no-bordered',
        cache: false,
        striped: false,
        pagination: true,
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        paginationDetailHAlign: 'left',
        showJumpto: true,
        paginationPreText: '<i class="fa fa-angle-left left-bcloud-arrow" aria-hidden="true"></i>',
        paginationNextText: '<i class="fa fa-angle-right left-bcloud-arrow" aria-hidden="true"></i>',
        formatRecordsPerPage: function (pageNumber) {
            // return '每页显示 ' + pageNumber + ' 条记录';
            return '' + pageNumber + '';
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            // return '显示第 ' + pageFrom + ' 到第 ' + pageTo + ' 条记录，总共 ' + totalRows + ' 条记录';
            return '共' + totalRows + '条';
        },
        queryParams: function (params) {
            var temp = {
                pageNo:(params.offset / params.limit),
                pageSize:params.limit,
                name:$(".search-serName").val()
            };
            return temp;
        },
        queryParamsType: 'limit',
        responseHandler: function (res) {
            let list = res.list;
            let finalList = [];

            function getFinalList(list){
                for( let i = 0; i < list.length; i++ ){
                    if( list[i].parentId == "ROOT" ){
                        list[i].parentId = 0;
                    }
                    // list[i].id = list[i].serVerId;
                    finalList.push( list[i] );
                    if( list[i].children && list[i].children.length > 0 ){
                        let child = list[i].children;
                        getFinalList( child );
                    }
                }
            }
            if( list ){
                getFinalList(list);
            }
            return {
                "total": res.totalCount,
                "rows": finalList
            }
        },
        sidePagination: "server",
        clickToSelect: true,
        // uniqueId: "productId",
        columns: [{
            field: 'sortId',
            title: '序号',
            align: 'left',
            width: '50px',
            valign: 'middle',
            formatter: function (value,row,index) {
                //return index+1; //序号正序排序从1开始
                let pageSize=$('#floechart-table').bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
                let pageNumber=$('#floechart-table').bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
                return  (pageSize * (pageNumber - 1) + index + 1);   //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
            }
        }, {
            field: 'name',
            title: '名称',
            align: 'center',
            valign: 'middle'
        }, {
            field: 'createUser',
            title: '创建者',
            align: 'center',
            valign: 'middle'
        }, {
            field: 'createTime',
            title: '创建时间',
            align: 'center',
            valign: 'middle'
        },{
            field: '',
            title: '操作',
            align: 'middle',
            width: '100px',
            events: operateEvents,
            formatter: operateFormatter
        }],
    })
}

//流程图更新
function updateSerProcess(id) {
    let url = $webpath + "/servflow/index2/"+id;
    window.location.href = url;
}

//流程图删除
function deleteSerProcess(id,pushState) {
    if (pushState == "1"){
        $.message({
            message: '该服务已推送,不可删除！',
            type: 'warning'
        });
    }else {
        $("#deleteConfirmModal").modal("show");
        $("#deleteConfirmModal").find(".confirm-box-ok").unbind("click");
        $("#deleteConfirmModal").find(".confirm-box-ok").click(function(){
            $("#deleteConfirmModal").modal("hide");
            $.ajax({
                url: $webpath + "/servflow/v1/api/ruleChain/delete",
                type: "POST",
                data: {
                    ruleChainId: id,
                    _method:"DELETE"
                },
                success: function( res ){
                    if( res.code == 200 ){
                        $.message(res.message);
                        $("#floechart-table").bootstrapTable("refresh");
                    }else{
                        $.message({
                            message: res.message,
                            type: 'error'
                        });
                    }
                }
            });
        });
    }
}

//------------------------------流程图导入导出--------------------------------
//导出
function dbToxml(serVerId, serId, serName) {
    $.ajax({
        url: $webpath + "/serProcessXmlSys/dbToXmlSyc",
        type: 'POST',
        data: {
            "serVerId": serVerId,
            "serId": serId,
            "serName": serName
        },
        success: function (data) {
            if (data.result == "success") {
                window.location.href = $webpath + "/serProcessXmlSys/downLoadFile?serName=" + getEncodeStr(data.fileName);
            } else {
                $.message({
                    message: '导出失败！请重试',
                    type: 'error'
                });
            }
        }
    })
}

//导入
function xmlTodb() {
    $("#importFilediv").modal("show");
    $("#importFilediv").find(".btn-confirm").unbind("click");
    $("#importFilediv").find(".btn-confirm").click(function(){
        $("#importFilediv").modal("hide");
        uploadFile();
    });
}

//下载
function uploadFile() {
    let file = $("#importFileinput").val();
    let fileName = getFileName(file);
    $.ajaxFileUpload({
        url: $webpath + "/serProcessXmlSys/xmlTodbSyc?fileName=" + fileName,
        fileElementId: 'lefile',//文件上传空间的id属性
        dataType: 'json',//返回值类型一般设置为json
        success: function (data) {
            if (data.result == 'success') {
                reloadTableData();
            } else {
                $.message({
                    message: '导入失败！请重试',
                    type: 'error'
                });
            }
        }
    });
}

//获取文件名称
function getFileName(o) {
    let pos = o.lastIndexOf("\\");
    return o.substring(pos + 1);
}

//------------------------------发布到APIManager商店--------------------------------
//发布至api商店
function dbToApiStore(id, serVerId, pushState) {
    if (pushState == "1"){
        $.message({
            message: '该服务已推送!请不要重复推送',
            type: 'warning'
        });
    }else{
        $("#dbConfirmModal").modal("show");
        $("#dbConfirmModal").find(".confirm-box-ok").unbind("click");
        $("#dbConfirmModal").find(".confirm-box-ok").click(function(){
            $("#dbConfirmModal").modal("hide");
            pushApi(id, serVerId, "");
        });
    }

}

//推送
function pushApi(idflowChartId, serVerId, flowType) {
    if (flowType == "docker" || flowType == "openstack") {
    } else {
        $.ajax({
            // url: $webpath + '/dockingController/pushESB',
            url: $webpath + '/servflow/v1/api/ruleChain/cloudMarket/'+idflowChartId,
            type: "POST",
            // data: {
            //     "serId": idflowChartId,
            //     "serVerId": serVerId
            // },
            success: function (data) {
                $.message({
                    message: '推送成功',
                    type: 'success'
                });
                reloadTableData(idflowChartId);
            },
            error: function () {
                $.message({
                    message: '推送失败',
                    type: 'error'
                });
            }
        })
    }
}

//刷新数据  true  整个刷新      false 保留当前页刷新
function reloadTableData(idflowChartId) {
    //更新规则链属性
    var paramsName ={
        id:idflowChartId,
        publishStatus:'1'
    };
    $.ajax({
        url: $webpath + '/servflow/v1/api/ruleChain/update',
        method: 'POST',
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: JSON.stringify(paramsName),
        success: function (dataInfo) {
            window.location.reload();
        }
    });
}

