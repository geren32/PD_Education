
jQuery(function ($) {

    function getCountFavorites  () {
        let data =  { }
        $.ajax({
            type: "post",
            url: '/client/cabinet/getCountFavorites',
            data:  data,
            dataType:'JSON',
            success: function (data)
            {
                console.log(data)
                $('.h-favourites-num').html(data)
                $('.weight-normal.color-dark.products_count span').html(data)
                if(data > 0){
                    $('.h-favourites-num .h-tooltip').hide()
                }


            },
            error: function (data){

            }
        });
    }

function catalogProduct  (items , page) {
    $('.custom-pagination .item-pagination').removeClass('active')

    let attributes = []
    let sort = {};

    if($('#sortProduct').val() == 'nameASC')
    {
        sort.name = "ASC"
    }
    if($('#sortProduct').val() == 'nameDESC')
    {
        sort.name = "DESC"
    }
    if($('#sortProduct').val() == 'priceASC')
    {
        sort.price = "ASC"
    }
    if($('#sortProduct').val() == 'priceDESC')
    {
        sort.price = "DESC"
    }
    if($('#sortProduct').val() == 'novelty')
    {
        sort.novelty = "ASC"
    }
    if($('#sortProduct').val() == 'promotional')
    {
        sort.promotional = "ASC"
    }
    let title = ''
    if($('#favorite-select').val())
    {
        title = $('#favorite-select').val()
    }
    console.log(title)
   let  filter = {}
    filter.price = {}
    filter.price.from = $('.range-min.input').val()
    filter.price.to = $('.range-max.input').val()
    attributes = $.map($('input:checkbox:checked'), function(e,i) {
        return   { "value": e.value }
    });
    let categoryId = "";

   if($('#category-id').val())  categoryId = $('#category-id').val() ;

    $.ajax({
        type: "post",
        url: $('.ProductAjax').attr('data-url') + categoryId ,
        data:  { title:title , page : page , perPage : 10 , attributes:attributes , sort:sort , filter:filter} ,
        dataType:'JSON',
        success: function (data)
        {
            $('.ProductAjax').html(data.html)
            $(".custom-pagination").html(data.pagination)
            $(".products_count").html(data.count)
            getCountFavorites();
        },
        error: function (data){

        }
    });
}
    function addToFavourite  (items ) {
        let data =  { product_id : items.attr('data-id-product') , type : items.attr('data-type') }
        console.log(data)
        $.ajax({
            type: "post",
            url: '/client/cabinet/addfavorites',
            data: data,
            dataType:'JSON',
            success: function (data)
            {
                console.log(data)
                getCountFavorites();
            },
            error: function (data){

            }
        });
    }
    function deleteToFavourite  (items ) {
        let data =  { product_id : items.attr('data-id-product') , type : items.attr('data-type') }
        $.ajax({
            type: "post",
            url: '/client/cabinet/deletefavorites',
            data:  data,
            dataType:'JSON',
            success: function (data)
            {
               console.log(data)
                getCountFavorites();
            },
            error: function (data){

            }
        });
    }

    $( document ).ready(function() {
        getCountFavorites();
    });

    $(document).on('click', '.add-to-favourite', function(){

        addToFavourite($(this))
        getCountFavorites();
    });
    $(document).on('click', '.add-to-favourite.active', function(){
        deleteToFavourite($(this))
        getCountFavorites();
    });
    $(document).on('click', '.card-delete.delete-item.favorite', function(){
        deleteToFavourite($(this))
        catalogProduct($(this),1)
        getCountFavorites();
    });


    $(document).on('click', '.custom-pagination .item-pagination', function(){
        catalogProduct($(this),$(this).attr('data-id'))
        return false
    });
    $(document).on('click', '#favorite-select', function(){
        catalogProduct($(this),1)
        return false
    });


    $(document).on('click', '.range', function(){
        catalogProduct($(this),1)
    });
    $('.filter input:checkbox').change(function(){
        catalogProduct($(this),1)
    });
    $('#sortProduct').change(function(){
        catalogProduct($(this),1)
    });
});