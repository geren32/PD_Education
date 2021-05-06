let config = {
    REGEX_PHONE: /^[0-9\ \+\(\)\/]+$/,
    REGEX_EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}

jQuery(function ($) {

    $(document).on('click', '.add-product-to-cart', function(){


        let product_id =  $(this).attr('product')
        let variation_id =  $(this).attr('variation')
        let count = 1;

        console.log('product', product_id)
        console.log('variation_id', variation_id)
        $.ajax({
            type: "post",
            url: '/booking/addProductToCart',
            data:  { product_id : product_id , variation_id : variation_id, count: 1},
            dataType:'JSON',
            success: function (data)
            {
                $('.card-total-price').html(data.totalPrice)
                $('.all-product-price-el').html(data.totalPrice)
                $('.h-cart-num').html(data.totalAmount)
                $('.total-price').html(data.totalPrice)
                $('.cart-block p b').html(data.product.name)
                $('#CartAjax').html(data.cart_html)
                $('#CheckoutAjax').html(data.html)
            },
            error: function (data){
                console.log(data)
            }
        });
        return false
    });

    $(document).on('click', '.add-product-kit-to-cart', function(){

        // let complect = $('#complect').find('.swiper-entry:not(:has(.set.active))')
        // let products = $('#complect').find('.swiper-entry:not(:has(.set.active)) .swiper-container .swiper-wrapper .swiper-slide')
        let products = [];
        $('#complect').find('.swiper-entry:not(:has(.set.active)) .swiper-container .swiper-wrapper .swiper-slide').each(function(){
            products.push({product: $(this).data('product'), quantity: $(this).data('quantity'), variation: $(this).data('variation')})
        });
        console.log(products)
        if(!products || !products.length) return alert('Ви не вибрали жодної позиції')

        let product_kit =  $(this).attr('product_kit')
        let variation_id =  $(this).attr('variation')
        console.log('product_kit', product_kit)
        console.log('variation_id', variation_id)
        $.ajax({
            type: "post",
            url: '/booking/addProductKitToCart',
            data:  { product_kit_id : product_kit , products : products, count: 1},
            dataType:'JSON',
            success: function (data)
            {
                $('.card-total-price').html(data.totalPrice)
                $('.all-product-price-el').html(data.totalPrice)
                $('.h-cart-num').html(data.totalAmount)
                $('.total-price').html(data.totalPrice)
                $('#CartAjax').html(data.cart_html)
                $('#CheckoutAjax').html(data.html)
            },
            error: function (data){
                console.log(data)
            }
        });
        return false
    });

    $(document).on('click', '.btn-close.delete-order', function(){
        let is_cart = $(this).attr('is_cart');
        let order_id =  $(this).attr('order_id')
        let order_kit_id =  $(this).attr('order_kit_id')

        console.log('order_id', order_id)
        console.log('order_kit_id', order_kit_id)
        $.ajax({
            type: "post",
            url: '/booking/deleteProductFromCart',
            data:  { order_id : order_id , order_kit_id : order_kit_id},
            dataType:'JSON',
            success: function (data)
            {
                $('.h-cart-num').html(data.data.totalAmount)
                $('.card-total-price').html(data.data.totalPrice)
                $('.all-product-price-el').html(data.data.totalPrice)
                $('.total-price').html(data.data.totalPrice)
                $('#CartAjax').html(data.cart_html)
                $('#CheckoutAjax').html(data.html)
                if(!data.data.kits.length && !data.data.products.length) {
                    $('.checkout-box').css('display', 'none');
                    $('.section.checkout-section').css('display','none')
                    $('#EmptyCart').html('<section id="EmptyCart" class="section section-404">\n' +
                        '                    <div class="container">\n' +
                        '                        <div class="row">\n' +
                        '                            <div class="col-12 text-center">\n' +
                        '                                <div class="h2 section-title">Ваш кошик порожній</div>\n' +
                        '                                <a href="/" class="btn btn-primary btn-invert">На головну</a>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </section>')
                }
            },
            error: function (data){
                console.log(data)
            }
        });
        return false
    });
    $(document).on('click', '.add-product-to-checkout', function(){


        $(".add-product-to-checkout").attr("disabled", true);
        $(".add-product-kit-to-checkout").attr("disabled", true)
        let is_cart = $(this).attr('is_cart');
        console.log(is_cart)
        let product_id =  $(this).attr('product')
        let variation_id =  $(this).attr('variation')
        let count = $(this).attr('data');

        console.log('product', product_id)
        console.log('variation_id', variation_id)
        console.log('data', count)
        $.ajax({
            type: "post",
            url: '/booking/addProductToCartAjax',
            data:  { product_id : product_id , variation_id : variation_id, count: count},
            dataType:'JSON',
            success: function (data)
            {
                $('.h-cart-num').html(data.data.totalAmount)
                $('.all-product-price-el').html(data.data.totalPrice)
                $('.card-total-price').html(data.data.totalPrice)
                $('.total-price').html(data.data.totalPrice)
                $('#CartAjax').html(data.cart_html)
                $('#CheckoutAjax').html(data.html)
                if(!data.data.kits.length && !data.data.products.length) {
                    $('.checkout-box').css('display', 'none');
                    $('.section.checkout-section').css('display','none')
                    $('#EmptyCart').html('<section id="EmptyCart" class="section section-404">\n' +
                        '                    <div class="container">\n' +
                        '                        <div class="row">\n' +
                        '                            <div class="col-12 text-center">\n' +
                        '                                <div class="h2 section-title">Ваш кошик порожній</div>\n' +
                        '                                <a href="/" class="btn btn-primary btn-invert">На головну</a>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </section>')
                    // $(this).siblings(".section.section-404").toggle();
                }
            },
            error: function (data){
                console.log(data)
            }
        });
        return false
    });

    $(document).on('click', '.add-product-kit-to-checkout', function(){

        $(".add-product-to-checkout").attr("disabled", true);
        $(".add-product-kit-to-checkout").attr("disabled", true)
        // let comment = $(".comment-wrapp textarea").val();
        let kit =  JSON.parse($(this).attr('kit'))
        let count = $(this).attr('data');
        let product_kit_id = $(this).attr('product_kit_id');
        let comment = $(`#${product_kit_id}`).val();
        console.log(comment)
        // console.log($(`#${product_kit_id}`).val())
        console.log('kit', kit)
        console.log('product_kit_id', product_kit_id)
        console.log('data', count)
        kit = kit.map(k => k.info);

        $.ajax({
            type: "post",
            url: '/booking/addProductKitToCartAjax',
            data:  { products : kit,  count: count, product_kit_id: product_kit_id, comment: comment ? comment: null},
            dataType:'JSON',
            success: function (data)
            {
                $('.h-cart-num').html(data.data.totalAmount)
                $('.card-total-price').html(data.data.totalPrice)
                $('.all-product-price-el').html(data.data.totalPrice)
                $('.total-price').html(data.data.totalPrice)
                $('#CartAjax').html(data.cart_html)
                $('#CheckoutAjax').html(data.html)
                if(!data.data.kits.length && !data.data.products.length) {
                    $('.checkout-box').css('display', 'none')
                    $('.section.checkout-section').css('display','none')
                    $('#EmptyCart').html('<section id="EmptyCart" class="section section-404">\n' +
                        '                    <div class="container">\n' +
                        '                        <div class="row">\n' +
                        '                            <div class="col-12 text-center">\n' +
                        '                                <div class="h2 section-title">Ваш кошик порожній</div>\n' +
                        '                                <a href="/" class="btn btn-primary btn-invert">На головну</a>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </section>')
                    // $('.section.section-404').css('display', 'block')
                    // $('.section.section-404').css('display', 'block')
                }
            },
            error: function (data){
                console.log(data)
            }
        });
        return false
    });

});

$(document).on('click', '#checkout-form #checkoutBtn', function () {
    $('.input-wrapp-first-name').find('.inputError').remove();
    $('.input-wrapp-last-name').find('.inputError').remove();
    $('.input-wrapp-phone').find('.inputError').remove();
    $('.input-wrapp-email').find('.inputError').remove();
    $('.input-wrapp-poshta').find('.inputError').remove();
    $('.input-wrapp-street').find('.inputError').remove();
    $('.input-wrapp-house').find('.inputError').remove();
    $('.input-wrapp-vidilena').find('.inputError').remove();
    $('.input-wrapp-delivery').find('.inputError').remove();
    let values = $('#checkout-form *[name]');
    let data = {};
    $('.btn.btn-link.cancel-comment').submit();
    console.log($('.btn.btn-link.cancel-comment').val())

    // comment, street, department, apartment, house, district, city, last_name, first_name, email, phone, pay_type, delivery_type

    values.each((index, el) => {
        data[$(el).attr('name')] = $(el).val();
    });

    if (!data.first_name) {
          $('.input-wrapp-first-name').append(
            '<div class="inputError">Введіть ім’я</div>'
        );
    }
    if (!data.last_name) {
         $('.input-wrapp-last-name').append(
            '<div class="inputError">Введіть Прізвище</div>'
        );
    }
    if (!config.REGEX_PHONE.test(data.phone)) {
         $('.input-wrapp-phone').append(
            '<div class="inputError">Введіть номер телефону</div>'
        );
    }
 
    // if(data.city=" "){
//         $('.input-wrapp-poshta').append(
//             '<div class="inputError">У даному місті немає відділень оберіть інше місто</div>'
//         );
//     // }
// if(data.department==" "){
//     $('.input-wrapp-vidilena').append(
//         '<div class="inputError">У даному місті немає відділень оберіть інше місто</div>'
//     );
// }
    if (!data.email) {
         $('.input-wrapp-email').append(
            '<div class="inputError">Введіть електронну пошту</div>'
        );
    } else if(!config.REGEX_EMAIL.test(data.email)) {
        $('.input-wrapp-email').append(
            '<div class="inputError">Будь ласка введіть електронну адресу в форматі: email@mail.com</div>'
        );
    } 
    if(data.citys==""){
            $('.input-wrapp-poshta').append(
                '<div class="inputError">Поле міста неможе бути пустим</div>'
            );
         
        }
        else 
        if(data.department==" "){
            $('.input-wrapp-vidilena').append(
                '<div class="inputError">У даному місті немає відділень оберіть інше місто</div>'
            );
        }
    data.pay_type = $('.checkbox-entry [name="paymentType"]:checked').val();
    // data.delivery_type = $('.checkbox-entry .toggle-block-control:checked').val();
    data.delivery_type = $('.checkbox-entry [name="delivery_type"]:checked').val();
    data.comment = data.comment_textarea;



    if(data.delivery_type == 1) {
       
        data.delivery_price = 1000;
        data.city = $('#citys').val();

        data.department = $('.SelectBox.department.nova-poshta option:checked').html();
    }else if(data.delivery_type == 2) {
        
        data.delivery_price = 1000;
        data.city = $('.SelectBox.search.city.ukr-poshta option:checked').val();
        data.department = $('.SelectBox.search.department.ukr-poshta option:checked').val();
    } else if(data.delivery_type == 3) {
      
        if (!data.city) {
            $('.input-wrapp-city').append(
                '<div class="inputError">Введіть місто</div>'
            );
        }
        if (!data.street) {
            $('.input-wrapp-street').append(
                '<div class="inputError">Введіть вулицю</div>'
            );
        }
        if (!data.house) {
            $('.input-wrapp-house').append(
                '<div class="inputError">Введіть будинок</div>'
            );
        }
    } else if(data.delivery_type != 0){
        $('.input-wrapp-delivery').append(
            '<div class="inputError">Виберіть тип доставки</div>'
        );
    }
    let inputErr = $('#checkout-form').find('.inputError').length
    console.log(inputErr)
    console.log(data)
    $("#checkout-form").val(data);
    $('#data').val(data);
    if(!inputErr) {
        $("#checkoutBtn").attr("disabled", true);
        // $("#checkout-form").submit()
        // $(document).ready(function () {
        //     $("#checkout-form").submit(function () {
        //         $("#checkout-form").val(data);
        //     });
        // });
        $.ajax({
            type: "post",
            url: '/booking/makeBooking',
            data: data,
            dataType: 'JSON',
            success: function (data) {
                $('.h-cart-num').html(0)
                $('.card-total-price').html(0)
                $('.all-product-price-el').html(0)
                $('.total-price').html(0)
                $(' main').html(data.html);
            },
            error: function (data) {
                console.log(data);
            }
        });
    }

    return false
});
