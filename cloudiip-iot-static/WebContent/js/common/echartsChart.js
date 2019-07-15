(function( $ ){
    //科学计数法
    function scienceNum(num){
        var p = Math.floor(Math.log(Math.abs(num))/Math.LN10);
        var n = parseFloat((num * Math.pow(10, -p)).toFixed(2));
        return n + 'e' + p;
    }
    //保留两位小数并去除小数点后无用的0
    function decimal(number){
        number=Number(number);
        if((Math.abs(number)>=100000||Math.abs(number)<0.1)&&Math.abs(number)!=0){
            return scienceNum(number);
        }else{
            return parseFloat(number.toFixed(2));
        }
    }
    $.fn.areaChart = function(data){
        data.map(function(times){
           times[0]=Number(times[0])*1000;
        });
        //时间转换
        function add0(m){
            return m<10?'0'+m:m
        }
        function dateFormat(times){
            var time = new Date(times);
            var y = time.getFullYear().toString()/* .slice(2) */;
            var m = time.getMonth()+1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
        }
        var formatterY=function(value) {
            if(Math.abs(value)>=100000){
                return decimal(value);
            }else if(Math.abs(value)>=1000){
                return decimal(value/1000) + 'k';
            }else{
                return decimal(value);
            }
        };
         // 基于准备好的dom，初始化echarts实例
         var id=$(this).attr("id");
         var myChart = echarts.init(document.getElementById(id));
        // 指定图表的配置项和数据
        option = {
            grid:{
                left:60,
                top:10,
                right:15
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#ccc',
                        borderColor: '#aaa',
                        borderWidth: 1,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        textStyle: {
                            color: '#222'
                        }
                    }
                },
                formatter: function (params) {
                    var xValue=dateFormat(params[0].value[0]);
                    var yValue=params[0].value[1];
                    return xValue + '<br />' + yValue;
                }
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 5,
                    end: 95
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 5,
                    end: 95,
                    zoomOnMouseWheel: true
                }
            ],
            xAxis: {
                type: 'time',
                boundaryGap: false
            },
            yAxis: {
                type: 'value',
               /*  min:"dataMin", */
                axisLabel:{
                    formatter: function (value, index) {
                        return formatterY(value);
                    }
                }
            },
            series: [{
                data:data,
                type: 'line',
                lineStyle:{
                    color:"#4ec67f"
                },
                symbolSize: 7,
                itemStyle:{
                    borderColor:"#4ec67f",
                    borderWidth:2
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: '#c8eed5' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#e8faee' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    }
                }
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.clear();
        myChart.setOption(option);
        window.onresize = function(){
            myChart.resize();
        }
    }
    $.fn.ringChart = function(data1,color1){
        var color0=['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
        var color=$.extend(true,[],color0,color1);
        var data={
            legendData:[],
            seriesData:[]
        };
        data1.map(function(elem){
            data.legendData.push({name:elem[0],icon:"circle"});
            data.seriesData.push({name:elem[0],value:Number(elem[1])});
        });
        var formatterLabel=function(value){
            if(Math.abs(value)>=100000){
                return decimal(value);
            }else if(Math.abs(value)>=1000){
                return decimal(value/1000) + 'k';
            }else{
                return decimal(value);
            }
        }
        // 基于准备好的dom，初始化echarts实例
        var id=$(this).attr("id");
        var myChart = echarts.init(document.getElementById(id));
        // 指定图表的配置项和数据
        option = {
            color:color,
            tooltip : {
                trigger: 'item',
                formatter: function (params) {
                    return params.name+"<br/>"+ formatterLabel(params.value)+"&nbsp;&nbsp;("+params.percent+"%)"
                }
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: "middle",
                left:"60%",
                data: data.legendData,
            },
            series : [
                {
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['40%', '50%'],
                    hoverOffset:0,
                    selectedMode:"single",
                    selectedOffset:5,
                    label:{
                        formatter: function(params){
                            return formatterLabel(params.value);
                        }
                    },
                    labelLine:{
                        length:7,
                        length2:5
                    },
                    data: data.seriesData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = function(){
            myChart.resize();
        }
    }
})( jQuery );