$(function(){
    //控制左切换菜单
    var isLHiden = true; 
    $('.cloud-shrink-L').click(function(){
        if(isLHiden){
            $(this).removeClass('shrink-moved');
            $('.cloud-menu-r').css('marginLeft','20px');
            $('.cloud-menu').css('width','0');
        }else{
            $(this).addClass('shrink-moved');
            $('.cloud-menu-r').css('marginLeft','150px');
            $('.cloud-menu').css('width','150px');
        }
        isLHiden = !isLHiden;
    });

    //控制右切换
    var isRHiden = true; 
    $('.cloud-shrink-R').click(function(){
        if(isRHiden){
            $(this).removeClass('shrink-moved');
            computeLayout();
            $('.cloud-describe').css('width','0');
        }else{
            $(this).addClass('shrink-moved');
            computeLayout();
            $('.cloud-describe').css('width','400px');
        }
        isRHiden = !isRHiden;
    });

    //添加页面等左边宽度
    computeLayout();

    //添加-右侧详情展开
    $('.cloud-describe-detail .cloud-describe-title').click(function(){
        var $this = $(this);
        var iclass = $this.find('i');
        if(iclass.is('.fa-caret-down')){
            iclass.removeClass('fa-caret-down').addClass('fa-caret-up');
        }else{
            iclass.removeClass('fa-caret-up').addClass('fa-caret-down');
        }
        $this.next().slideToggle();
    });
});

$(window).resize(function(){
    computeLayout();
});
var computeLayout = function(){
    var cloudDesR = 0;
    if($('.cloud-shrink-R').is('.shrink-moved')){
        cloudDesR = 400;
    }
    var cloudDel = $('.cloud-container').width() - cloudDesR - 1;
    $('.cloud-describe-l').css('width',cloudDel);
}