/**
 * Created by Administrator on 2017/4/14 0014.
 */
$(function () {
    if(!window.getI18NString){getI18NString = function(s){return s;}}
    var graph = new Q.Graph(canvas);
    function createEdge(from, to, type){
        var edge = graph.createEdge(from,to);
        edge.edgeType = type || Q.Consts.EDGE_TYPE_DEFAULT;
        return edge;
    }
    function createText(name, x, y,type,padding){
        var text = graph.createText(name,x,y);
        text.setStyle(Q.Styles.LABEL_FONT_SIZE, 10);
        text.setStyle(Q.Styles.LABEL_FONT_STYLE, "italic lighter");
        text.setStyle(Q.Styles.BORDER, 1);
        text.setStyle(Q.Styles.BORDER_COLOR, "#DDD");
        text.setStyle(Q.Styles.PADDING, 5);
        text.setStyle(Q.Styles.LABEL_PADDING, padding);
        switch(type){
            case 1:text.setStyle(Q.Styles.BACKGROUND_COLOR,"#87CEEB");
                return text;
                break;
            case 2:text.setStyle(Q.Styles.BACKGROUND_COLOR,"#FDF5E6");
                break;
            case 3:text.setStyle(Q.Styles.BACKGROUND_COLOR,"#90EE90");
                break;
            case 4:text.setStyle(Q.Styles.BACKGROUND_COLOR,"#FFC0CB");
                break;
            default:text.setStyle(Q.Styles.BACKGROUND_COLOR,"#FFFFFF");
                break;
        }
        return text;
    }
    function createGroup(name){
        var group = graph.createGroup(name);
        group.padding=7;
        group.setStyle(Q.Styles.GROUP_BACKGROUND_COLOR, "#ffffff");
        group.setStyle(Q.Styles.GROUP_BACKGROUND_GRADIENT, Q.Gradient.LINEAR_GRADIENT_HORIZONTAL);
        group.setStyle(Q.Styles.GROUP_STROKE, 2);
        group.setStyle(Q.Styles.GROUP_STROKE_STYLE, "#2898E0");
        group.setStyle(Q.Styles.GROUP_STROKE_LINE_DASH, [3,2]);
        group.setStyle(Q.Styles.LABEL_FONT_SIZE,15);
        return group;
    }
    var model = graph.graphModel;
    graph.onclick=function (evt) {
        model.forEachByTopoDepthFirstSearch(function(node){
            node.setStyle(Q.Styles.BORDER_COLOR,"#ffffff");
            node.forEachInEdge(function(edge){
                edge.setStyle(Q.Styles.EDGE_WIDTH );
                edge.setStyle(Q.Styles.EDGE_COLOR);
            });
        });
        var node = graph.getElementByMouseEvent(evt);
        node.setStyle(Q.Styles.BORDER, 1);
        node.setStyle(Q.Styles.BORDER_COLOR, 'red');
        node.setStyle(Q.Styles.PADDING, 5);

        node.forEachInEdge(function(edge){
            edge.setStyle(Q.Styles.EDGE_WIDTH, 2);
            edge.setStyle(Q.Styles.EDGE_COLOR, '#7CFC00');
        });
        node.forEachOutEdge(function(edge){
            edge.setStyle(Q.Styles.EDGE_WIDTH, 2);
            edge.setStyle(Q.Styles.EDGE_COLOR, '#FFA500');
        });

        var node0=graph.getElementByName("button");
        if(node0===node) {
            exportImage(graph,0.5);
        }
    };
    graph.moveToCenter(0.9);
    var textA =createText("应用主题服务", -600, -255,1,5);
    var textB =createText("API服务", -500, -255,2,5);
    var textC =createText("全局被依赖服务", -400, -255,3,5);
    var textD =createText("物理部署", -300, -255,4,5);
    var group1=createGroup("安全客户");
    var group2=createGroup("客户细分");
    var group3=createGroup("活动策划 ");
    var group4=createGroup("基础引擎");
    var group5=createGroup("工单中心");
    var group6=createGroup("渠道触点 ");
    var group7=createGroup("订购中心");
    var group8=createGroup("工作台");
    var group9=createGroup("报表中心");
    var title=graph.createText("大数据精准营销平台-服务依赖关系总图", 0, -260);
    title.setStyle(Q.Styles.LABEL_FONT_SIZE,25);
    /*安全门户*/
    var text1A =createText("第三方集成服务\nepmsso", -600, -200,1);
    var text1B =createText("门户\nportal\n(oracle)", -600, -100,3);
    var text1C =createText("安全\nsecurity\n(oracle)", -600, 0,3);
    var text1D =createText("单点登录\ncas\n(oracle)", -600, 100,1);
    var text1E =createText("手机APP", -600, 200,1);
    group1.addChild(text1A);
    group1.addChild(text1B);
    group1.addChild(text1C);
    group1.addChild(text1D);
    group1.addChild(text1E);
    var edge11=createEdge(text1A, text1C,Q.Consts.EDGE_TYPE_EXTEND_LEFT);
    var edge12=createEdge(text1B, text1A,Q.Consts.EDGE_TYPE_EXTEND_RIGHT);
    var edge13=createEdge(text1B, text1C);
    var edge14=createEdge(text1C, text1D);
    var edge15=createEdge(text1E, text1C,Q.Consts.EDGE_TYPE_EXTEND_RIGHT);
    /*客户细分*/
    var text2A =createText("客户细分\nusertool\n(oracle，MPP)", -450, 0,1);
    group2.addChild(text2A);
    /*活动策划*/
    var text3A =createText("营销策划-本网\nclyxactivity\n(oracle)", -300, -200,1);
    var text3B =createText("营销策划-异网\nclyxactivityyw\n(oracle)", -300, -100,1);
    var text3C =createText("活动接口-本网\nactivityInter\n(oracle)", -300, 0,2);
    var text3D =createText("活动接口-异网\nywactivityInter\n(oracle)", -300, 100,2);
    var text3E =createText("省份场景营销\nscenemarketing\n(oracle)", -300, 200,1);
    group3.addChild(text3A);
    group3.addChild(text3B);
    group3.addChild(text3C);
    group3.addChild(text3D);
    group3.addChild(text3E);
    /*基础引擎*/
    var text4A =createText("分配引擎\nepmwxwl\n(oracle、MPP)", -150, -150,1);
    var text4B =createText("规则引擎\n(Mysql、redis)", -150, 200,4);
    group4.addChild(text4A);
    group4.addChild(text4B);
    var edge41=createEdge(text3A, text4A, Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL);
    var edge42=createEdge(text3B, text4A,Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL);
    var edge42=createEdge(text3E, text4B,Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL);
    /*工单中心*/
    var text5A =createText("工单任务-本网\nordertask\n(mysql、MPP)", 0, -200,1);
    var text5B =createText("工单服务-本网\nordercenter\n(Mysql)", 0, -100,2);
    var text5C =createText("工单服务-异网\nordercenter-yw\n(Mysql)", 0, 50,2);
    var text5D =createText("工单任务-异网\nordertask-yw\n(Mysql)", 0, 200,1);
    group5.addChild(text5A);
    group5.addChild(text5B);
    group5.addChild(text5C);
    group5.addChild(text5D);
    var edge51=createEdge(text5A, text3C, Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL);
    edge51.setStyle(Q.Styles.EDGE_SPLIT_BY_PERCENT, false);
    edge51.setStyle(Q.Styles.EDGE_SPLIT_VALUE, 5);
    var edge52=createEdge(text5D, text4A, Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL);
    var edge53=createEdge(text5C, text3D, Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL);
    var edge54=createEdge(text5D, text3D, Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL);
    edge54.setStyle(Q.Styles.EDGE_SPLIT_BY_PERCENT, false);
    edge54.setStyle(Q.Styles.EDGE_SPLIT_VALUE, 40);
    var edge55=createEdge(text5B, text5A);
    var edge58=createEdge(text5C, text5D);
    /*渠道触点*/
    var text6A =createText("微信平台\nwechat\n(oracle)", 150, -200,1);
    var text6B =createText("渠道中心\nchannelcenter\n(mysql)", 150, -100,1);
    var text6C =createText("短信渠道\nsmscenter\n(mysql)", 150, 0,1);
    var text6D =createText("短信接口\nsmsinterface\n(oracle)", 150, 130,2);
    var text6E =createText("短信服务\n(oracle)", 150, 200,4);
    group6.addChild(text6A);
    group6.addChild(text6B);
    group6.addChild(text6C);
    group6.addChild(text6D);
    group6.addChild(text6E);
    var edge61=createEdge(text6A, text6B);
    var edge62=createEdge(text6A, text6C,Q.Consts.EDGE_TYPE_EXTEND_RIGHT);
    var edge63=createEdge(text6B, text5B, Q.Consts.EDGE_TYPE_EXTEND_BOTTOM);
    var edge64=createEdge(text6B, text5C, Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL);
    edge64.setStyle(Q.Styles.EDGE_SPLIT_BY_PERCENT, false);
    edge64.setStyle(Q.Styles.EDGE_SPLIT_VALUE, 15);
    var edge63=createEdge(text6C, text5B, Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL);
    var edge64=createEdge(text6C, text6D);
    var edge64=createEdge(text6D, text6E);
    var edge63=createEdge(text4B, text6D,Q.Consts.EDGE_TYPE_VERTICAL_HORIZONTAL);
    /*订购中心*/
    var text7A =createText("订购中心\nxorder\n(mysql)", 300, -100,1);
    group7.addChild(text7A);
    var edge71=createEdge(text6A, text7A, Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL);
    var edge72=createEdge(text7A, text6D, Q.Consts.EDGE_TYPE_VERTICAL_HORIZONTAL);
    /*工作台*/
    var text8A =createText("工作台\nxbuilderoracle\n(Mysql,oracle、MPP)", 450,-40,1);
    group8.addChild(text8A);
    var edge81=createEdge(text8A, text5B, Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL);
    var edge82=createEdge(text8A, text5C, Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL);
    /*报表中心*/
    var text9A =createText("存量报表页面构建器\nxbuildepage\n(oracle)", 600, -200,1);
    group9.addChild(text9A);
    var edge91=createEdge(text8A, text9A, Q.Consts.EDGE_TYPE_ORTHOGONAL_VERTICAL);
    $(".Q-Graph canvas:last").hide(); //消除水印
})