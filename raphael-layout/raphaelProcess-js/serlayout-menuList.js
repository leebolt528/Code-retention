(function($){
    $.fn.menuList=function(){
        $(this).html(`<ul class="cd-accordion-menu animated shape_groups"><img style="width:50px;height: 50px;margin:100px auto;display: block;" src=`+$resContextPath+`/img/common/loading.gif></ul>`);
        $this=$(this);
        var typeIdArray=[];
        //查询组件类型列表
        var typeAjax=$.ajax({
            url: $webpath + '/servflow/v1/component/componentsType',
            method: 'GET',
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: {},
            async: false,
            success: function (dataAll) {
                $this.children("ul").empty();
                dataAll.data.map(function(item,index) {
                    typeIdArray.push(item.componentsTypeId);
                    let typeHtml=
                        '<li class="not-children">'+
                        '<input type="checkbox" name ="group-'+index+'" id="group-'+index+'" style="height: 0px; "'+(index == 0?'checked':'')+' >'+
                        '<label for="group-'+index+'">'+item.componentsTypeName+'</label>'+
                        '<ul class='+item.componentsTypeId+'>'+
                        '<img style="width:30px;height: 30px;margin:50px auto;display: block;" src='+$resContextPath+'/img/common/loading.gif>'+
                        '</ul>'+
                        '</li>';
                    $this.children("ul").append(typeHtml);
                })
            }
        });
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
                $.when(typeAjax).done(function () {
                    let matchAjax;
                    dataAll.data.data.map(function (item, index) {
                        componentsImgMap.set(item.componentsId,[item.componentsImg,item.componentsName]);
                        matchAjax=$.ajax({
                            url: $webpath + '/servflow/v1/component/getComponentTypeByComponentsId',
                            method: 'GET',
                            contentType: "application/json;charset=utf-8",
                            dataType: "json",
                            data: {
                                componentsId: item.componentsId
                            },
                            success: function (dataInfo) {
                                if(dataInfo.data&&dataInfo.data.hasOwnProperty("componentsTypeId")){
                                    let index=typeIdArray.indexOf(dataInfo.data.componentsTypeId);
                                    if($this.find("."+typeIdArray[index]).find("img").length>0){
                                        $this.find("."+typeIdArray[index]).children("img").remove();
                                    }
                                    let listDom =
                                        '<li>'+
                                        '<a href="#0" class="shape_img" img='+item.componentsImg+' componentsId='+item.componentsId+' nodeName='+item.componentsName+'>'+
                                         '<img src='+item.componentsImg+'>'+
                                        '<span class="tooltips" title="'+item.componentsName+'">'+item.componentsName+'</span>'+
                                        '</a>'+
                                        '</li>';
                                    $this.find("."+typeIdArray[index]).append(listDom).closest("li").removeClass("not-children").addClass("has-children");
                                    //图标允许移动到流程图
                                    $(".shape_img").draggable({
                                        appendTo: "body",
                                        helper: "clone",
                                        cursor: "move",
                                        opacity: 0.8,
                                        revert: "invalid",//不放到目标址地就会返回
                                        scroll: false
                                    });
                                    //流程图接收图标 并且做出对应的事件
                                    $(".designer_layout").droppable({
                                        accept: ".shape_img",
                                        drop: function (event, ui) {
                                            var offset = ui.offset;
                                            addShapNode(ui);
                                            var x = offset.left - $("#designer_canvas").offset().left;
                                            if (x > $("#designer_canvas").width()) {
                                                tag.changeCanvasSize(x);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        $.when(matchAjax).done(function () {
                            $this.find("ul li ul").each(function(){
                                if( $(this).children("img").length>0){
                                    $(this).children("img").remove();
                                }
                            });
                        })
                    });
                });
            }
        });
    };
})(jQuery);