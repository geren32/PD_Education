
jQuery(function ($) {


    $(document).on('click', '.custom-pagination .item-pagination-search', function(){

        $('.custom-pagination .item-pagination').removeClass('active')

        $(this).addClass('active')
        let page =  $(this).attr('data-id')
        let search = $(this).attr('data-search');
        let type = $(this).attr('data-type');

        console.log('page', page)
        $.ajax({
            type: "post",
            url: '/searchItemsAjax',
            data:  { current_page : page , perPage : 10, search, type: type ? type: null},
            dataType:'JSON',
            success: function (data)
            {
                $('#SearchAjax').html(data.html)
                $('html, body').animate({ scrollTop: 0 }, 0);

            },
            error: function (data){

            }
        });
        return false
    });
    $(document).on('click', '#selectSearchCategory li', function(){

        console.log($(this).attr('data-id'))
        console.log($(this).attr('data-search'))

        $('#selectSearchCategory li a').removeClass('current')
        $(this).children('li a').addClass('current')
        let search = $(this).attr('data-search');
        let type =  $(this).attr('name')
        $.ajax({
            type: "post",
            url: '/searchItemsAjax',
            data:  { current_page : 1 , perPage : 10, search, type: type},
            dataType:'JSON',
            success: function (data)
            {
                $('#SearchAjax').html(data.html)
                $('.search-form input').attr('data-type',`${data.type}`)
                $('html, body').animate({ scrollTop: 0 }, 0);

            },
            error: function (data){

            }
        });
        return false
    });
    $(document).ready(function(){
        $(".search-form input").keyup(function(){
            let type =  $(this).attr('data-type');
            $.ajax({
                type: 'post',
                url: '/searchItemsAjax',
                data:  { current_page : 1 , perPage : 10, search: $(this).val(), type: type},
                success: function(data){
                    $('#SearchAjax').html(data.html)
                }
            });
        });
    });
    $(document).ready(function(){
        $(".search-form-ajax input").keyup(function(){
            let type =  $(this).attr('data-type');
            $.ajax({
                type: 'post',
                url: '/searchItemsAjax',
                data:  { current_page : 1 , perPage : 10, search: $(this).val(), type: type},
                success: function(data){
                    $('#SearchAjax').html(data.html)
                }
            });
        });
    });
});
