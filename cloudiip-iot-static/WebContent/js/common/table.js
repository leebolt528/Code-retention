$(document).on("click",".switchColumns thead .fa-angle-left",function(){
    var $thisPa=$(this).closest(".bootstrap-table");
    $thisPa.find(".fixed-table-toolbar .columns .dropdown-menu li input").click();
    $thisPa.find(".fa-angle-left").siblings().css({"color":"#198ccb","cursor":"pointer","pointer-events":"auto"});
    $thisPa.find(".fa-angle-left").css({"color":"#a7b7c7","pointer-events":"none"});
});
$(document).on("click",".switchColumns thead .fa-angle-right",function(){
    var $thisPa=$(this).closest(".bootstrap-table");
    var restInput=[];
    $thisPa.find(".fixed-table-toolbar .columns .dropdown-menu li input").each(function(){
        if(!$(this).attr("checked")){
            $(this).click();
        }else{
            restInput.push($(this));
        }
    });
    restInput.map(function(elem){
        elem.click();
    })
    $thisPa.find(".fa-angle-right").siblings().css({"color":"#198ccb","cursor":"pointer","pointer-events":"auto"});
    $thisPa.find(".fa-angle-right").css({"color":"#a7b7c7","pointer-events":"none"});
    initFileInput("mqtt-genzhengshu","btn btn-default btn-sm");
    initFileInput("mqtt-kezhengshu","btn btn-default btn-sm");
    initFileInput("mqtt-kesimi","btn btn-default btn-sm");
});