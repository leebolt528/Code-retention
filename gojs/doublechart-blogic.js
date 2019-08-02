function init(diagram,nodeDataArray,linkDataArray,defaultClick,diagramSty) {
    //上下两个框的布局设置
    diagram.layout =
        $objGo(go.LayeredDigraphLayout, {
            columnSpacing: 10,
            layerSpacing: 100,
            setsPortSpots: false
        });

    //节点模板
    diagram.nodeTemplate =
        $objGo(go.Node, "Auto", {
                selectionAdornmentTemplate:$objGo(go.Adornment, "Auto", // 节点点击颜色设置
                    $objGo(go.Shape, "Rectangle", { fill: null, stroke: diagramSty.strokeYes, strokeWidth: diagramSty.strokeWidth }),
                    $objGo(go.Placeholder)
                ),
                fromSpot: go.Spot.RightSide, // 右边出,左边走
                toSpot: go.Spot.LeftSide,
                cursor: "pointer",
                click: function(e, node) {
                    if (e && e.clickCount && e.clickCount > 0) {
                        onNodeClicked(node);
                    }
                }
            },

            //RoundedRectangle 圆角矩形
            $objGo(go.Shape, "Rectangle", {
                name: "OBJSHAPE",
                stroke: diagramSty.strokeNo,
                strokeWidth: diagramSty.strokeWidth,
                fill: "white",
                width: 120,
                height: 80
            }),

            $objGo(go.Panel, "Auto", {
                    alignment: go.Spot.TopRight,
                    alignmentFocus: go.Spot.TopRight,
                    visible: false,
                    margin: 3
                },
                new go.Binding("visible", "instanceCount", function(v) {
                    return v > 1 ? true : false;
                }),
                $objGo(go.Shape, "RoundedRectangle", {
                    fill: "#666",
                    strokeWidth: diagramSty.strokeWidth,
                    stroke: "#666"
                }),
                $objGo(go.TextBlock, {
                        stroke: "#FFF",
                        textAlign: "center",
                        height: 15,
                        editable: false,
                    },
                    new go.Binding("text", "instanceCount"))
            ),
            //垂直放置图片及文字
            $objGo(go.Panel, "Vertical",
                //设置图片
                $objGo(go.Picture, {
                        margin: 5,
                        width: 40,
                        height: 40,
                    },
                    new go.Binding("source", "image")),

                //设置文本属性
                $objGo(go.TextBlock, {
                        margin: 5,
                        textAlign: "center",
                        stroke: "#333",
                        width: 95,
                        wrap: go.TextBlock.WrapDesiredSize
                    },
                    new go.Binding("text", "name"))
            )
        );

    //链接模板  设置线条颜色
    diagram.linkTemplate =
        $objGo(go.Link, {
                //选中线条颜色
                selectionAdornmentTemplate: $objGo(go.Adornment,
                    $objGo(go.Shape, { isPanelMain: true, stroke: diagramSty.strokeYes, strokeWidth: diagramSty.strokeWidth }),
                    $objGo(go.Shape, { toArrow: "OpenTriangle", fill: null, stroke: diagramSty.strokeYes, strokeWidth: diagramSty.strokeWidth }),
                    $objGo(go.TextBlock, { background: "#EAEAEA" }, new go.Binding("text", "totalCount"))
                ),
                routing: go.Link.Orthogonal, // Orthogonal routing
                corner: 3,
                cursor: "pointer"
            },
            $objGo(go.Shape, {
                name: "OBJSHAPE",
                stroke: diagramSty.strokeNo,
                strokeWidth: diagramSty.strokeWidth
            }),
            $objGo(go.Shape, {
                name: "ARWSHAPE",
                toArrow: "OpenTriangle",
                fill: null,
                stroke: diagramSty.strokeNo,
                strokeWidth: diagramSty.strokeWidth
            }),
            $objGo(go.TextBlock, { textAlign: "center",background: "#EAEAEA"}, new go.Binding("text", "totalCount")) //链接绑定文本
        );

    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    diagram.initialContentAlignment = go.Spot.Center;
    diagram.undoManager.isEnabled = true;
    nodeClickEventOnce = false;
    var nodesFromToList;

    //监听点击事件
    diagram.addDiagramListener("ChangedSelection",function() {
        var x = diagram.selection.first();
        if (x) {
            if (x instanceof go.Node) {
                if (!nodeClickEventOnce) {
                    onNodeClicked(x);
                    nodeClickEventOnce = true;
                }
            }
            if (x instanceof go.Link) {
                appResponse(x.data.histogram,
                    '<img src="'+x.data.fromImage+'" width="25px" height="25px"/>'+x.data.from+' --> '+'<img src="'+x.data.toImage+'" width="25px" height="25px"/>'+x.data.to,x.data.timeSeriesHistogram,x.data.totalCount,x.data.errorCount,"");
            }
        }
        updateHighlights(x, 1);
    });

    //默认选中
    diagram.select(diagram.findNodeForKey(defaultClick));

    function onNodeClicked(node){
        appResponse(node.data.histogram,'<img src="'+node.data.image+'" width="25px" height="25px"/>'+node.data.name,node.data.timeSeriesHistogram,node.data.totalCount,node.data.errorCount,node.data.serverList,node.data.isWas);
        scatterAuto("scatterdiv", node.data.name);
    }

    function updateHighlights(x, i) {
        diagram.nodes.each(function(node) { node.highlight = 0; });
        diagram.links.each(function(link) { link.highlight = 0; });
        x = x || diagram.selection.first();
        //点击点
        if (x instanceof go.Node) {
            nodesFromToList = new go.List("string");
            x.findLinksConnected().each(function(link) {
                link.highlight = i;
            });
            nodesFromToList.add(x.data.key);
        }else if(x instanceof go.Link) {
            nodesFromToList = new go.List("string");
            x.toNode.highlight = i;
            x.fromNode.highlight = i;
            nodesFromToList.add(x.data.from);
            nodesFromToList.add(x.data.to);
        }
        // nodes
        diagram.nodes.each(function(node) {
            nodesHighlight(node);
        });
        // links
        diagram.links.each(function(link) {
            linksHighlight(link);
        });
    }
    //点击后链接线颜色
    function linksHighlight(link){
        var hl = link.highlight;
        var shp = link.findObject("OBJSHAPE");
        var arw = link.findObject("ARWSHAPE");
        highlight(shp, arw, hl);
    }
    function nodesHighlight(node){
        var shp = node.findObject("OBJSHAPE");
        var grp = null;
        var hl = node.highlight;
        highlight(shp, grp, hl);
    }
    function highlight(shp, obj2, hl) {
        var color;
        var width = diagramSty.strokeWidth;
        if (hl === 0) {
            color = diagramSty.strokeNo
        } else if (hl === 1) {
            color = diagramSty.strokeYes;
        }
        shp.stroke = color;
        shp.strokeWidth = width;
        if (obj2 !== null) {
            obj2.stroke = color;
            obj2.fill = color;
        }
    }

    //画布空白即背景点击事件
    diagram.addDiagramListener("BackgroundSingleClicked", function(e) {
        var i = 1;
        if(nodesFromToList.length == 1){
            var dClick = diagram.findNodeForKey(nodesFromToList.n[0]);
            dClick.highlight = i;
            nodesHighlight(dClick);
            dClick.findLinksConnected().each(function(link) {
                link.highlight = i;
                linksHighlight(link);
            });
        }else{
            var dfromClick = diagram.findNodeForKey(nodesFromToList.n[0]);
            var dtoClick = diagram.findNodeForKey(nodesFromToList.n[1]);
            dfromClick.highlight = i;
            dtoClick.highlight = i;
            nodesHighlight(dfromClick);
            nodesHighlight(dtoClick);
            dfromClick.findLinksTo(dtoClick).each(function(link) {
                link.highlight = i;
                linksHighlight(link);
            });
        }
    });
}