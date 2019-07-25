//加载cas单点类型
var casinitdata;
$.ajax({
    "url": $webpath + "/ServiceType/getAllByCondition",
    "type": "POST",
    data: {
        "parentId": "root3",
    },
    async: false,
    success: function (data) {
        casinitdata=data;
    }
});
//定义流程图类型，根据serFlowTypeObj来判断，组件类型新增可直接添加
var serFlowTypeObj = {
    //普通类型
    "normal_serflowData": "normalSerflow",
    //cas组件类型
    "cas_serflowData": casinitdata
}


/**
 *  开始节点对象
 * @param flowChartId 服务ID（流程图ID）
 * @param nodeId 表示唯一的节点
 * @param nodeName 节点的名称
 * @param nodeType 节点类型（圆形或者矩形）
 * @param nodeStyle 节点风格，开始节点，条件节点，接口节点，结束节点
 * @param clientX 起点x轴位置
 * @param clientY 起点y轴位置
 * @param nodeWidth 节点宽度
 * @param nodeHeight 节点高度
 * @param nodeRadius 节点半径
 * @param other 用户可能会保存的其他值
 * @param targetlist 下一个节点的集合
 * @param parentNode 前一个节点的集合
 * @param parentNode 前一个节点的集合
 * @param reqformat 请求格式
 * @param respformat 响应格式
 * @param reqdatatype 请求值类型
 * @param returndatatype 返回值类型
 * @param serdesc 返回值类型
 * @param inparameter 请求参数
 * @param outparameter 响应参数
 * @param inCharset 请求参数字符集
 * @param outCharset 响应参数字符集
 * @param ruleNodeType 组件类型名称
 * @returns
 */
function startSerNodeObj(flowChartId, serVerId, nodeId, nodeName, nodeType, nodeStyle,componentsId,img,
                         clientX, clientY, nodeWidth, nodeHeight, nodeRadius, other, startSet, endSet,setline,
                         serName, agreement, reqformat, respformat, reqdatatype, returndatatype, serviceType, serdesc, inparameter, outparameter, inCharset, outCharset, ruleNodeType) {
    this.flowChartId = flowChartId;
    this.serVerId = serVerId;
    this.nodeId = nodeId;
    this.nodeName = nodeName;
    this.componentsId=componentsId;
    this.img=img;
    this.nodeType = nodeType;
    this.nodeStyle = nodeStyle;
    this.clientX = clientX;
    this.clientY = clientY;
    this.nodeWidth = nodeWidth;
    this.nodeHeight = nodeHeight;
    this.nodeRadius = nodeRadius;
    this.other = other;
    this.startSet = startSet;
    this.endSet = endSet;
    this.setline = setline;
    this.serName = serName;
    this.agreement = agreement;
    this.reqformat = reqformat;
    this.respformat = respformat;
    this.reqdatatype = reqdatatype;
    this.returndatatype = returndatatype;
    this.serviceType = serviceType;
    this.serdesc = serdesc;
    this.inparameter = inparameter;
    this.outparameter = outparameter;
    this.inCharset = inCharset;
    this.outCharset = outCharset;
    this.ruleNodeType=ruleNodeType;
}


/**
 *  接口节点对象
 * @param flowChartId 服务ID（流程图ID）
 * @param nodeId 表示唯一的节点
 * @param nodeName 节点的名称
 * @param nodeType 节点类型（圆形或者矩形）
 * @param nodeStyle 节点风格，开始节点，条件节点，接口节点，结束节点
 * @param clientX 起点x轴位置
 * @param clientY 起点y轴位置
 * @param nodeWidth 节点宽度
 * @param nodeHeight 节点高度
 * @param nodeRadius 节点半径
 * @param other 用户可能会保存的其他值
 * @param startSet 前一个节点集合
 * @param endSet 后一个节点集合
 * @param url url地址
 * @param agreement 请求协议
 * @param method 请求方式(get/post)
 * @param reqformat 请求格式
 * @param respformat 响应格式
 * @param respformat 响应格式
 * @param reqdatatype 请求值类型
 * @param returndatatype 返回值类型
 * @param inparameter 请求参数
 * @param outparameter 响应参数
 * @param inCharset 请求参数字符集
 * @param outCharset 响应参数字符集
 * @param componentType 组件类型
 * @param firstBoolean 是否第一次点击节点请求模板，用于继承模板参数
 * @param ruleNodeType 组件类型名称
 * @returns
 */
function interfaceSerNodeObj(flowChartId, serVerId, nodeId, nodeName, nodeType, nodeStyle,componentsId,img,
                             clientX, clientY, nodeWidth, nodeHeight, nodeRadius, other, startSet, endSet,setline,
                             callType,serName, url, port, agreement, reqformat, respformat, method, reqdatatype, returndatatype, serviceType, serdesc, inparameter, outparameter, inCharset, outCharset, componentType,firstBoolean,ruleNodeType) {
    this.flowChartId = flowChartId;
    this.serVerId = serVerId;
    this.nodeId = nodeId;
    this.nodeName = nodeName;
    this.componentsId=componentsId;
    this.img=img;
    this.nodeType = nodeType;
    this.nodeStyle = nodeStyle;
    this.clientX = clientX;
    this.clientY = clientY;
    this.nodeWidth = nodeWidth;
    this.nodeHeight = nodeHeight;
    this.nodeRadius = nodeRadius;
    this.other = other;
    this.startSet = startSet;
    this.endSet = endSet;
    this.setline = setline;
    this.callType = callType;
    this.serName = serName;
    this.url = url;
    this.port = port;
    this.agreement = agreement;
    this.reqformat = reqformat;
    this.respformat = respformat;
    this.method = method;
    this.reqdatatype = reqdatatype;
    this.returndatatype = returndatatype;
    this.serviceType = serviceType;
    this.serdesc = serdesc;
    this.inparameter = inparameter;
    this.outparameter = outparameter;
    this.inCharset = inCharset;
    this.outCharset = outCharset;
    this.componentType = componentType;
    this.firstBoolean = firstBoolean;
    this.ruleNodeType=ruleNodeType;
}


/**
 *  线对象
 * @param joinId 线ID
 * @param startNodeId 开始节点ID
 * @param endNodeId 结束节点ID
 * @param joinType 开始节点方向
 * @param joinDirection 结束节点方向
 * @param flowChartId 流程图ID
 * @param path 路径
 * @returns
 */
function serJoinObj(flowChartId, serVerId,joinId, startNodeId, endNodeId, joinType,nodeStyle,joinDirection,path,startSet,endSet,serviceType,
                    relationSet,conditionObj) {
    this.flowChartId = flowChartId;
    this.serVerId = serVerId;
    this.joinId = joinId;
    this.startNodeId = startNodeId;
    this.endNodeId = endNodeId;
    this.joinType = joinType;
    this.nodeStyle = nodeStyle;
    this.joinDirection = joinDirection;
    this.path = path;
    this.startSet = startSet;
    this.endSet = endSet;
    this.serviceType = serviceType;
    this.relationSet = relationSet;
    this.conditionObj = conditionObj;
}


/**
 * 参数对象
 * @param id 参数ID
 * @param ecode 参数名称
 * @param reqdesc 参数描述
 * @param reqtype 参数类型
 * @param parampos 参数位置
 * @param maxlength 最大长度
 * @param namespace 命名空间
 * @param isempty 是否必传
 * @param type 参数类型（请求参数或响应参数）
 * @param parentId 父级参数ID
 * @param order
 * @param preparam
 * @param name 参数中文名
 * @param paradefault 参数默认值
 * @param paraRegular 参数正在规则
 * @param mapping 映射
 * @param sortid
 * @param codemap 响应编码映射
 */
function reqObj1(id, ecode, reqdesc, reqtype, parampos, maxlength,namespace,isempty,type,parentId,order,preparam,name,paradefault,paraRegular,mapping,sortid,codemap) {
    this.id = id;
    this.ecode = ecode;
    this.reqdesc = reqdesc;
    this.reqtype = reqtype;
    this.parampos = parampos;
    this.isempty = isempty;
    this.type = type;
    this.maxlength = maxlength;
    this.parentId = parentId;
    this.namespace = namespace;
    this.order = order;
    this.preparam=preparam;
    this.name = name;
    this.paradefault = paradefault;
    this.paraRegular = paraRegular;
    this.mapping = mapping;
    this.sortid = sortid;
    this.codemap = codemap;
}

function reqObj(id,type,parentId,name,ecode,reqDesc,reqType,paraRegular,paramPos,nameSpace,paraDefault,isEmpty,mappingId,mappingRule,sortId,codeMap) {
    this.id = id;
    this.type = type;
    this.parentId = parentId;
    this.name = name;
    this.ecode = ecode;
    this.reqDesc = reqDesc;
    this.reqType = reqType;
    this.paraRegular = paraRegular;
    this.paramPos = paramPos;
    this.nameSpace = nameSpace;
    this.paraDefault = paraDefault;
    this.isEmpty = isEmpty;
    this.mappingId = mappingId;
    this.mappingRule = mappingRule;
    this.sortId = sortId;
    this.codeMap = codeMap;
}

/**
 * 参数映射关系对象
 * @param diamondid 菱形节点ID
 * @param relationid 关系数据ID
 * @param preparamId 前一个参数ID
 * @param preparamname 前一个参数名称
 * @param nextparamId 后一个参数ID
 * @param nextparamname 后一个参数名称
 * @param regex 正则表达式
 * @param constantparam 常量
 * @returns
 */
function paramrelationObj(joinId, relationid, preparamId, preparamname, nextparamId, nextparamname, regex, constantparam, nextNodeSet) {
    //获取当前点击菱形的id
    this.joinId = joinId;
    this.relationid = relationid;
    this.preparamId = preparamId;
    this.preparamname = preparamname;
    this.nextparamId = nextparamId;
    this.nextparamname = nextparamname;
    this.regex = regex;
    this.constantparam = constantparam;
    this.nextNodeSet = nextNodeSet;
}

/**
 * 参数条件设置对象
 * @param diamondid 菱形节点ID
 * @param conditionid 条件设置ID
 * @param preparamIdSet 前一个参数ID集合
 * @param preparamnameSet 前一个参数名称集合
 * @param condition 参数条件
 * @returns
 */
function paramconditionObj(joinId, conditionid, preparamIdSet, preparamnameSet, condition, startSet, endSet) {
    //获取当前点击菱形的id
    this.joinId = joinId;
    this.conditionid = conditionid;
    this.preparamIdSet = preparamIdSet;
    this.preparamnameSet = preparamnameSet;
    this.condition = condition;
    this.startSet = startSet;
    this.endSet = endSet;
}

/**
 * 菱形节点对象
 * @param flowChartId 服务ID（流程图ID）
 * @param nodeId 表示唯一的节点
 * @param nodeName 节点的名称
 * @param nodeType 节点类型（圆形或者矩形）
 * @param nodeStyle 节点风格，开始节点，条件节点，接口节点，结束节点
 * @param clientX 起点x轴位置
 * @param clientY 起点y轴位置
 * @param nodeWidth 节点宽度
 * @param nodeHeight 节点高度
 * @param nodeRadius 节点半径
 * @param startSet 前一个节点集合
 * @param endSet 后一个节点集合
 * @param relationSet 参数映射集合
 * @param conditionObj 参数条件设置集合
 *
 */
function diamondSerObj(flowChartId, serVerId, nodeId, nodeName, nodeType, nodeStyle,
                       clientX, clientY, nodeWidth, nodeHeight, nodeRadius, startSet, endSet,
                       relationSet, conditionObj) {
    this.flowChartId = flowChartId;
    this.serVerId = serVerId;
    this.nodeId = nodeId;
    this.nodeName = nodeName;
    this.nodeType = nodeType;
    this.nodeStyle = nodeStyle;
    this.clientX = clientX;
    this.clientY = clientY;
    this.nodeWidth = nodeWidth;
    this.nodeHeight = nodeHeight;
    this.nodeRadius = nodeRadius;
    this.startSet = startSet;
    this.endSet = endSet;
    this.relationSet = relationSet;
    this.conditionObj = conditionObj;
}


function groupSerNodeObj(flowChartId, serVerId, nodeId, nodeName, nodeType, nodeStyle,
                         clientX, clientY, nodeWidth, nodeHeight, nodeRadius, startSet, endSet,setline,
                         respformat,returndatatype,outCharset,allparameter){
    this.flowChartId = flowChartId;
    this.serVerId = serVerId;
    this.nodeId = nodeId;
    this.nodeName = nodeName;
    this.nodeType = nodeType;
    this.nodeStyle = nodeStyle;
    this.clientX = clientX;
    this.clientY = clientY;
    this.nodeWidth = nodeWidth;
    this.nodeHeight = nodeHeight;
    this.nodeRadius = nodeRadius;
    this.startSet = startSet;
    this.endSet = endSet;
    this.setline = setline;
    this.respformat = respformat;
    this.returndatatype = returndatatype;
    this.outCharset = outCharset;
    this.allparameter = allparameter;
}

function groupStartSerNodeObj(flowChartId, serVerId, nodeId, nodeName, nodeType, nodeStyle,
                              clientX, clientY, nodeWidth, nodeHeight, nodeRadius, startSet, endSet,setline,
                              respformat,returndatatype,outCharset,allparameter){
    this.flowChartId = flowChartId;
    this.serVerId = serVerId;
    this.nodeId = nodeId;
    this.nodeName = nodeName;
    this.nodeType = nodeType;
    this.nodeStyle = nodeStyle;
    this.clientX = clientX;
    this.clientY = clientY;
    this.nodeWidth = nodeWidth;
    this.nodeHeight = nodeHeight;
    this.nodeRadius = nodeRadius;
    this.startSet = startSet;
    this.endSet = endSet;
    this.setline = setline;
    this.respformat = respformat;
    this.returndatatype = returndatatype;
    this.outCharset = outCharset;
    this.allparameter = allparameter;
}

/**
 * 判断是否为cas组件
 * @param serFlowType
 * @returns
 */
function iscasType(serFlowType){
    var typeflag = false;
    //"root3"代表cas组件
    if(serFlowType == "root3" || serFlowType == "root4"){
        typeflag = true;
    }else if((serFlowTypeObj.cas_serflowData).length>0){
        for(var i=0;i<(serFlowTypeObj.cas_serflowData).length;i++){
            var serTypeId = (serFlowTypeObj.cas_serflowData)[i].serTypeId;
            if(serFlowType == serTypeId){
                typeflag = true;
            }
        }
    }
    return typeflag;
}