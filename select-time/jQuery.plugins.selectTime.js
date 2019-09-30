(function($){
    $.fn.selectTime=function(options1){
        if (arguments.length === 0) {
            options1={};
        }
        var options0={
            deTime:"5m",
            listArr:["5m","20m","1h","3h","6h","12h","1d","2d"],
            switch:true,
            serverTime:"null",
            callback:{}
        };
        var options=$.extend(true,{},options0,options1);
        var selectTimeDiv=`<div class="btn-group calendarPa">
						<button type="button" class="btn calendar btn-bcloud-blue"><i class="fa fa-calendar" aria-hidden="true"></i></button>
                        <input type="text" class="layui-input" id="test10" value="" placeholder="选择时间段进行监控" style="width:300px;">
					</div>
					<div class="btn-group listPa">
						<button type="button" class="btn list btn-bcloud-blue"><i class="fa fa-th-list" aria-hidden="true"></i></button>`+
                        (function(){
                            var listString="";
                            options.listArr.map(function(item,index){
                                listString+='<button type="button" class="btn btn-bcloud-blue timeTag" data-tag="'+item+'">'+(index==0?'Last'+item:item)+'</button>';
                            });
                            return listString;
                        })()
                        +
                    `</div>`;

        //初始化组件
        $(this).empty();
        $(this).addClass("selectTimeBolt").append(selectTimeDiv);
        if(!options.switch){
            $(".calendarPa .calendar").css("pointer-events","none");
            $(".listPa .list").css("pointer-events","none");
        }
        let keep=false;
        let keepValue="";
        if(options.deTime.indexOf("-")==-1){
            $(".listPa").css("display","inline-block");
            $(".calendarPa").css("display","none");

            $(".listPa button").each(function(){
                if($(this).attr('data-tag')==options.deTime){
                    $(this).addClass("active");
                }
            });
        }else{
            var startTime=formatDate("yyyy/MM/dd hh:mm:ss", options.deTime.split("-")[0]);
            var endTime=formatDate("yyyy/MM/dd hh:mm:ss", options.deTime.split("-")[1]);
            keep=true;
            keepValue=startTime+" - "+endTime;
            $(".listPa").css("display","none");
            $(".calendarPa").css("display","inline-block");

            $(".selectTimeBolt .layui-input").val(keepValue);
        }
        //生成layui
        layui.use('laydate', function(){
            var laydate = layui.laydate;
            laydate.render({
                elem: '#test10',
                type: 'datetime',
                format:'yyyy/MM/dd HH:mm:ss',
                btns:['clear', 'now', 'confirm'],
                range: true,
                done: function(value, date, endDate){
                    if(value.length > 0){//时间范围确认按钮
                        keep=true;
                        keepValue=value;
                        $(".listPa button").removeClass("active");
                        if(options.callback.hasOwnProperty("onClickSearch")){//时间范围搜索
                            var timeFrom=new Date(keepValue.split(" - ")[0]).getTime();
                            var timeTo=new Date(keepValue.split(" - ")[1]).getTime();
                            options.callback.onClickSearch(timeFrom,timeTo);
                        }
                    }
                }
            })
        });
        //清空时间选择插件输入框
        function clearTime(){
            $(".selectTimeBolt .layui-input").val("");
        }
        //时间戳转换日期格式
        function formatDate(fmt,timeStamp) {
            var date=new Date(parseInt(timeStamp));
            var o = {
                "M+" : date.getMonth()+1,                 //月份
                "d+" : date.getDate(),                    //日
                "h+" : date.getHours(),                   //小时
                "m+" : date.getMinutes(),                 //分
                "s+" : date.getSeconds(),                 //秒
                "q+" : Math.floor((date.getMonth()+3)/3), //季度
                "S"  : date.getMilliseconds()             //毫秒
            };
            if(/(y+)/.test(fmt))
                fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o)
                if(new RegExp("("+ k +")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            return fmt;
        }
        //Last时间转换时间戳
        function formatStamp(dateTag){
            var unit=dateTag.split('')[dateTag.length-1];
            var now=new Date().getTime();
            if(options.serverTime!=="null"){
                $.ajax({
                    url:options.serverTime,
                    async:false,
                    success:function(data){
                        if(data.hasOwnProperty("serverTime")&&data.serverTime.length>0){
                            now=data.serverTime;
                        }
                    }
                });
            }
            let gap;
            switch(unit)
            {
                case "m":
                    gap=Number(dateTag.replace(/[^0-9]+/g, ''))*60*1000;
                    break;
                case "h":
                    gap=Number(dateTag.replace(/[^0-9]+/g, ''))*60*60*1000;
                    break;
                case "d":
                    gap=Number(dateTag.replace(/[^0-9]+/g, ''))*24*60*60*1000;
                    break;
            }
            return now-gap+"-"+now;
        }
        //日期时间切换
        $(".listPa .list").on("click",function(){
            $(".listPa").css("display","none");
            $(".calendarPa").css("display","inline-block");
            if(keep){
                $(".selectTimeBolt .layui-input").val(keepValue);
            }
        });
        $(".calendarPa .calendar").on("click",function(){
            $(".listPa").css("display","inline-block");
            $(".calendarPa").css("display","none");
        });
        //时间列表搜索
        $(".listPa button:not(.list)").click(function(){
            keep=false;
            $(this).addClass("active").siblings().removeClass("active");
            clearTime();
            var time=formatStamp($(this).data("tag"));
            var timeFrom=time.split("-")[0];
            var timeTo=time.split("-")[1];
            if(options.callback.hasOwnProperty("onClickTimeTag")){
                options.callback.onClickTimeTag(timeFrom,timeTo);
            }
        });
        var selectTimeTools={
            getSelectedTime:function(){
                var time;
                if(keep){
                    var startTime=new Date(keepValue.split("-")[0]).getTime();
                    var endTime=new Date(keepValue.split("-")[1]).getTime();
                    time=startTime+"-"+endTime;
                }else{
                    $(".listPa .timeTag").each(function(){
                        if($(this).hasClass("active")){
                            time=formatStamp($(this).data("tag"));
                        }
                    })
                }
                return {
                    from:time.split("-")[0],
                    to:time.split("-")[1]
                };
            },
            getSelectedElem:function(){
                var $this;
                if(keep){
                    $this=null;
                }else{
                    $(".listPa .timeTag").each(function(){
                        if($(this).hasClass("active")){
                            $this=$(this);
                        }
                    })
                }
                return $this;
            }
        }
        return selectTimeTools;
    }
})(jQuery)