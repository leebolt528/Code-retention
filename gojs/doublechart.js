function init(diagram,nodeDataArray,linkDataArray,diagramSty) {
    //上下两个框的布局设置
    diagram.layout =
        $objGo(go.LayeredDigraphLayout, {
            columnSpacing: 15,
            layerSpacing: 80,
            setsPortSpots: false
        });

    var cxElement = document.getElementById("contextMenu");
    var myContextMenu = $objGo(go.HTMLInfo, {
        show: showContextMenu,
        mainElement: cxElement
    });

    //节点模板
    diagram.nodeTemplate =
        $objGo(go.Node, "Auto", {
                selectionAdornmentTemplate:$objGo(go.Adornment, "Auto", // 节点点击颜色设置
                    $objGo(go.Shape, "Rectangle", { 
                        fill: null, 
                        stroke: diagramSty.strokeYes, 
                        strokeWidth: diagramSty.strokeWidth }),
                    $objGo(go.Placeholder)
                ),
                fromSpot: go.Spot.RightSide, // 右边出,左边走
                toSpot: go.Spot.LeftSide,
                //isShadowed: true, //阴影
                //shadowColor: "#0098f4"
                cursor: "pointer",
                contextMenu: myContextMenu
            },
            //RoundedRectangle 圆角矩形
            $objGo(go.Shape, "Rectangle", {
                name: "OBJSHAPE",
                width: 120,
                height: 80,
                fill:"#fff",
                stroke: diagramSty.strokeNo,
                strokeWidth: diagramSty.strokeWidth
            }),
            //垂直放置图片及文字
            $objGo(go.Panel, "Vertical",
                //设置图片
                $objGo(go.Picture, {
                        margin: 5,
                        width: 40,
                        height: 40
                    },
                new go.Binding("source", "image")),
                 //节点名称
                $objGo(go.TextBlock, {
                    font: "12px Lato, sans-serif",
                    textAlign: "center",
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
                    $objGo(go.Shape, { isPanelMain: true,
                         stroke: diagramSty.strokeYes, 
                         strokeWidth: diagramSty.strokeWidth 
                        }),
                    $objGo(go.Shape, { toArrow: "Standard",
                     fill: null, 
                     stroke: diagramSty.strokeYes, 
                     strokeWidth: diagramSty.strokeWidth 
                    }),
                    $objGo(go.TextBlock, { background: "#fff" }, new go.Binding("text", "totalCount"))
                ),
                routing: go.Link.Orthogonal, // Orthogonal routing
                corner: 10, //线的弧度
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpGap, 
                reshapable: true, 
                toShortLength: 7,
                cursor: "pointer"
            },
            $objGo(go.Shape, { 
                name: "OBJSHAPE",
                isPanelMain: true, 
                stroke: diagramSty.strokeNo, 
                strokeWidth: diagramSty.strokeWidth * 2 
            }),
            $objGo(go.Shape, { 
                name: "OBJSHAPE1",
                isPanelMain: true, 
                stroke: diagramSty.strokeNo, 
                strokeWidth: diagramSty.strokeWidth 
            }),
            $objGo(go.Shape, { 
                name: "PIPE", 
                isPanelMain: true, 
                stroke: "white", 
                strokeWidth: 1, 
                strokeDashArray: [10, 10] 
            }),
            $objGo(go.Shape, { 
                name: "ARWSHAPE",
                toArrow: "Standard", 
                stroke: diagramSty.strokeNo,
                strokeWidth: diagramSty.strokeWidth,
                fill:null 
            }),
            $objGo(go.TextBlock, { 
                font: "bold 10pt helvetica, bold arial, sans-serif",
                textAlign: "center",
                stroke: "#2f4554"
            }, new go.Binding("text", "totalCount")) //链接绑定文本
        );

    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    diagram.contextMenu = myContextMenu;

    nodeClickEventOnce = false;
    var nodesFromToList;

    loop();

    cxElement.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        return false;
    }, false);
    //显示弹出框
    function showContextMenu(obj, diagram, tool) {
        cxElement.style.display = "block";
        var mousePt = diagram.lastInput.viewPoint;
        cxElement.style.left = mousePt.x + "px";
        cxElement.style.top = mousePt.y + "px";
    }
    //线条流动
    function loop() {
        var mydiagram = diagram;
        setTimeout(function() {
            var oldskips = mydiagram.skipsUndoManager;
            mydiagram.skipsUndoManager = true;
            mydiagram.links.each(function(link) {
                var shape = link.findObject("PIPE");
                var off = shape.strokeDashOffset - 2;
                shape.strokeDashOffset = (off <= 0) ? 20 : off;
            });
            mydiagram.skipsUndoManager = oldskips;
            loop();
        }, 100);
    }
    //监听点击事件
    diagram.addDiagramListener("ChangedSelection",function() {
        var x = diagram.selection.first();
        if (x) {
            if (x instanceof go.Node) {
                if (!nodeClickEventOnce) {
                    //onNodeClicked(x);
                    nodeClickEventOnce = true;
                }
            }
            if (x instanceof go.Link) {
                console.log('线执行点击')
            }
        }
        updateHighlights(x, 1);
    });
    function onNodeClicked(node){
        console.log('节点执行点击')
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
    //关联线 点击后颜色
    function linksHighlight(link){
        var hl = link.highlight;
        var shp = link.findObject("OBJSHAPE");
        var shpInner = link.findObject("OBJSHAPE1");
        var arw = link.findObject("ARWSHAPE");
        var color;
        var width = diagramSty.strokeWidth;
        if (hl === 0) {
            color = diagramSty.strokeNo
        } else if (hl === 1) {
            color = diagramSty.strokeYes;
        }
        shp.stroke = color;
        shp.strokeWidth = width * 2;
        shpInner.strokeWidth = width;
        shp.stroke = color;
        shpInner.stroke = color;
        arw.stroke = color;
    }
    //节点 点击后颜色
    function nodesHighlight(node){
        var shp = node.findObject("OBJSHAPE");
        var hl = node.highlight;
        var color;
        var width = diagramSty.strokeWidth;
        if (hl === 0) {
            color = diagramSty.strokeNo
        } else if (hl === 1) {
            color = diagramSty.strokeYes;
        }
        shp.stroke = color;
        shp.strokeWidth = width;
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
