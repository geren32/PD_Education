let _functions = {}, winW, winH, winScr, isTouchScreen, is_Mac, isIE;

jQuery(function ($) {

    "use strict";

    /* function on page ready */
    isTouchScreen = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);
    is_Mac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    isIE = /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent);

    const $body = $('body');

    $body.addClass('loaded');

    if (isTouchScreen) $('html').addClass('touch-screen');
    if (is_Mac) $body.addClass('mac');
    if (isIE) $body.addClass('ie');

    _functions.productSwiperWrapperHeight = function () {
        if (!$('.products_swiper').length) return;

        setTimeout(function () {
            const h = $('.products_swiper').find('.swiper-container').height();
            $('.products_swiper').find('.swiper-wrapper').css({ 'height': h });
        }, 100);
    }

    _functions.pageCalculations = function () {
        winW = $(window).width();
        winH = $(window).height();

        _functions.productSwiperWrapperHeight();
    }

    _functions.pageCalculations();

    //images preload
    _functions.imagesLazyLoad = function () {
        /* images load */
        $('img[data-i-src]:not(.imgLoaded)').each(function (i, el) {
            let loadImage = new Image();
            loadImage.src = $(el).data('i-src');

            loadImage.onload = function () {
                $(el).attr({ 'src': $(el).data('i-src') }).addClass('imgLoaded');
            };
            loadImage = null;
        });

        $('iframe[data-i-src]:not(.imgLoaded)').each(function (i, el) {
            $(el).attr({ 'src': $(el).data('i-src') }).addClass('imgLoaded');
        });

        $('[data-bg]:not(.bgLoaded)').each(function (i, el) {
            let loadImage = new Image();
            loadImage.src = $(el).data('bg');

            loadImage.onload = function () {
                $(el)
                    .css({ 'background-image': 'url(' + $(el).data('bg') + ')' })
                    .addClass('bgLoaded');
            }
            loadImage = null;
        });
    }

    //images preload
    setTimeout(function () {
        _functions.imagesLazyLoad();
    }, 100);

    _functions.pageScroll = function (current, header_height) {
        $('html, body').animate({ scrollTop: current.offset().top - header_height }, 700);
    }

    //sumoselect
    if ($('.select-box').length) {
        var btnText = $('.select-wrapp').data('btn-text');

        $('.default').SumoSelect();
        $('.search').SumoSelect({
            placeholder: '',
            search: true,
            searchText: ''
        });
        $('.extra-select').SumoSelect({ placeholder: '', search: true, searchText: '', okCancelInMulti: true, csvDispCount: 0 });

        $('.btnOk').text(btnText);
    }

    /* selects additional */
    $(document).on('click', '.filter-clear', function () {
        const $this = $(this),
            select = $this.siblings('.SumoSelect').find('select');

        if (select.is('[multiple="multiple"]')) {
            select[0].sumo.unSelectAll();
        } else {
            select.find('option:first-child').attr('disabled', false);
            select[0].sumo.selectItem(0);
            select.find('option:first-child').attr('disabled', true);
            select[0].sumo.reload();
        }
        $('.selected-filter').remove();
        $(this).closest('fieldset').find('.filters-list').addClass('d-none');
    });
    $(document).on('change', 'select', function () {
        const $this = $(this),
            val = $this.val(),
            $wrap = $this.closest('.select-box');
        var items = '';

        // show - hide filter-clear button
        if (typeof val === 'object' && val && val.length === 0) {
            $wrap.removeClass('active');
        } else {
            if (val !== $this.find('option:first-child').attr('value')) {
                $wrap.addClass('active');
            } else {
                $wrap.removeClass('active');
            }
        }

        // show - hide select-num count in multiple select
        if (typeof val === 'object' && val && val.length > 1) {
            $wrap.find('.select-num').text("+" + (val.length));
            $wrap.addClass('active-num');
        } else {
            $wrap.find('.select-num').text('+0');
            $wrap.removeClass('active-num');
        }
    });

    if ($('.swiper-3').length) {
        $('.SumoSelect').on('sumo:opened', function () {
            $(this).closest('.swiper-3').addClass('active');
        });
        $('.SumoSelect').on('sumo:closing', function () {
            $(this).closest('.swiper-3').removeClass('active');
        });
    }

    /* rellax */
    setTimeout(function () {
        if (!isIE && $('.rellax').length && !isTouchScreen) {
            var rellax = new Rellax('.rellax', {
                center: false
            });
        }
    }, 1000);

    /* function on page scroll */
    $(window).scroll(function () {
        _functions.scrollCall();
    });

    var prev_scroll = 0;
    _functions.scrollCall = function () {
        winScr = $(window).scrollTop();
        if (winScr > 50) {
            $('header').addClass('scrolled');
        } else {
            $('header').removeClass('scrolled');
        }
        //show-hide header on scroll
        if (winScr > prev_scroll) {
            $('header').addClass('header-hide');
        } else {
            $('header').removeClass('header-hide');
        }
        prev_scroll = winScr;

        // sticky product
        if ($('.sticky-product').length && !isTouchScreen) {
            if (winScr >= $('.tabs').position().top - $('header').outerHeight() - 50) {
                $('.sticky-product').fadeIn().css('margin-top', $('.sticky-product').outerHeight() / -2);
            } else {
                $('.sticky-product').fadeOut();
            }
        }

    }

    setTimeout(_functions.scrollCall, 0);

    /* function on page resize */
    _functions.resizeCall = function () {
        setTimeout(function () {
            _functions.pageCalculations();
        }, 100);
    };

    if (!isTouchScreen) {
        $(window).resize(function () {
            _functions.resizeCall();
        });
    } else {
        window.addEventListener("orientationchange", function () {
            _functions.resizeCall();
        }, false);
    }

    /* swiper sliders */
    _functions.getSwOptions = function (swiper) {
        let options = swiper.data('options');
        options = (!options || typeof options !== 'object') ? {} : options;
        const $p = swiper.closest('.swiper-entry');
        if (!options.pagination) options.pagination = {
            el: $p.find('.swiper-pagination')[0],
            clickable: true
        };
        if (!options.navigation) options.navigation = {
            nextEl: $p.find('.swiper-button-next')[0],
            prevEl: $p.find('.swiper-button-prev')[0]
        };
        options.preloadImages = false;
        options.lazy = { loadPrevNext: true };
        options.observer = true;
        options.observeParents = true;
        options.watchOverflow = true;
        options.centerInsufficientSlides = true;
        if (!options.speed) options.speed = 500;
        options.roundLengths = true;
        if (isTouchScreen) options.direction = "horizontal";
        return options;
    };
    _functions.initSwiper = function (el) {
        const swiper = new Swiper(el[0], _functions.getSwOptions(el));
    };

    $('.swiper-entry .swiper-container').each(function () {
        _functions.initSwiper($(this));
    });
    $('.swiper-thumbs').each(function () {
        let top = $(this).find('.swiper-container.swiper-thumbs-top')[0].swiper,
            bottom = $(this).find('.swiper-container.swiper-thumbs-bottom')[0].swiper;
        top.thumbs.swiper = bottom;
        top.thumbs.init();
        top.thumbs.update();
    });
    $('.swiper-control').each(function () {
        let top = $(this).find('.swiper-container')[0].swiper,
            bottom = $(this).find('.swiper-container')[1].swiper;
        top.controller.control = bottom;
        bottom.controller.control = top;
    });
    if ($('[class*="swiper-button-"]').hasClass('swiper-button-lock')) {
        $('[class*="swiper-button-"]').parents('.swiper-container').addClass('swiper-no-swiping');
    }

    /* mobile slider */
    var mobSlider = undefined;
    _functions.initMobSlider = function () {
        if ($('.mobile-slider').length) {
            if (winW < 1199 && mobSlider == undefined) {
                mobSlider = $('.mobile-slider').find('.swiper-container')[0].swiper;
            } else if (winW > 1200 && mobSlider != undefined) {
                mobSlider.destroy();
                mobSlider = undefined;
            }
        }
    }
    _functions.initMobSlider();
    $(window).on('resize', function () {
        _functions.initMobSlider();
    });

    //popup
    let popupTop = 0;
    _functions.removeScroll = function () {
        popupTop = $(window).scrollTop();
        $('html').css({
            "position": "fixed",
            "top": -$(window).scrollTop(),
            "width": "100%"
        });
        if (!$('header').hasClass('header-hide')) {
            $('body').addClass('fix-header');
        }
    }
    _functions.addScroll = function () {
        $('html').css({
            "position": "static"
        });
        window.scroll(0, popupTop);
        prev_scroll = 0;
        $('body').removeClass('fix-header');
    }

    _functions.openPopup = function (popup) {
        $('.popup-content').removeClass('active');
        $(popup + ', .popup-wrapper').addClass('active');
        _functions.removeScroll();
    };

    _functions.videoPopup = function (src) {
        $('#video-popup .embed-responsive').html('<iframe src="' + src + '"></iframe>');
        _functions.openPopup('#video-popup');
    };

    _functions.closePopup = function () {
        $('.popup-wrapper, .popup-content').removeClass('active');

        // $('.popup-iframe').html('');
        $('#video-popup iframe').remove();

        _functions.addScroll();
    };

    _functions.textPopup = function (title, description) {
        $('#text-popup .text-popup-title').html(title);
        $('#text-popup .text-popup-description').html(description);
        _functions.openPopup('#text-popup');
    };

    $(document).on('click', '.video-popup', function (e) {
        e.preventDefault();
        _functions.videoPopup($(this).data('src'));
    });

    $(document).on('click', '.open-popup', function (e) {
        e.preventDefault();
        _functions.openPopup('.popup-content[data-rel="' + $(this).data('rel') + '"]');
    });

    $(document).on('click', '.popup-wrapper .close-popup, .popup-wrapper .layer-close', function (e) {
        e.preventDefault();
        _functions.closePopup();
    });

    // detect if user is using keyboard tab-button to navigate
    // with 'keyboard-focus' class we add default css outlines
    function keyboardFocus(e) {
        if (e.keyCode !== 9) {
            return;
        }

        switch (e.target.nodeName.toLowerCase()) {
            case 'input':
            case 'select':
            case 'textarea':
                break;
            default:
                document.documentElement.classList.add('keyboard-focus');
                document.removeEventListener('keydown', keyboardFocus, false);
        }
    }

    document.addEventListener('keydown', keyboardFocus, false);

    // filter style click
    /* $('.filters-list li').on('click', function () {
        $(this)
            .addClass('active')
            .siblings()
            .removeClass('active');
    }); */

    // categories mobile
    /* $(document).on('click', function (event) {
        $('.categories-menu').removeClass('active');
    });
    $(document).on('click', '.category-title', function (event) {
        event.stopPropagation();
        $(this)
            .toggleClass('active')
            .closest('.categories-menu')
            .toggleClass('active');
    });
    $('.categories-list-item').on('click', function () {
        $(this)
            .closest('.categories-menu')
            .removeClass('active')
            .find('.category-title')
            .removeClass('active');
    }); */

    /*---- product -----*/
    // add to favourite
    /* $('.js-product .fav-btn, .product_detail-swiper .fav-btn').on('click', function () {
        $(this).toggleClass('active');
    }); */

    // delete from favourites
    $(document).on('click', '.delete-item', function () {
        $(this).closest('.card').remove();
    });

    //plus-minus
    $(document).on('click', '.decrement', function () {
        let $this = $(this),
            $input = $this.parent().find('input'),
            hasMin = $input[0].hasAttribute('data-min'),
            value = parseInt($input.val(), 10),
            min = hasMin ? +$input.attr('data-min') : 1;

        if (value != min) {
            value = value - 1;
        } else {
            value = min;
        }

        $input.val(value);
    });

    $(document).on('click', '.increment', function () {
        let $this = $(this),
            $input = $this.parent().find('input'),
            value = parseInt($input.val(), 10);
        $input.val(value + 1);
    });

    // order btn animation example
    $(document).on('click', '.js-product .order-btn', function () {
        const $this = $(this);

        if (!$this.hasClass('loading')) {
            $this.addClass('loading');

            $('.js-product').not($(this).closest('.js-product')).each(function () {
                $(this).find('.order-btn').addClass('disabled');
            });

            let loader = '<span class="btn-loader"><span class="btn-loader-inner"><span></span><span></span><span></span></span></span>',
                success = '<span class="btn-loader-complete"></span>';

            $this.append(loader).find('.btn-loader').fadeIn(500, function () {
                // FOR WP DEV !!!! instead of setTimeout here MUST be succes ajax callback
                setTimeout(function () {
                    $this.append(success).fadeIn(500, function () {
                        $this.find('.btn-loader').remove();
                        setTimeout(function () {
                            $this.find('.btn-loader-complete').fadeOut(500, function () {
                                $(this).remove();
                                $this.removeClass('loading');
                                $('.js-product').each(function () {
                                    $(this).find('.order-btn').removeClass('disabled');
                                });
                            });
                        }, 1000);
                        $('.cart-block').fadeIn();
                        setTimeout(function () {
                            $('.cart-block').fadeOut();
                        }, 3000);
                    });
                }, 1000);
            });
        }
    });

    /*---- end of product -----*/

    // calc total sum in cart
    _functions.calculateCartTotalPrice = function () {
        let total = 0;
        $('.cart .js-product').each(function () {
            total += +$(this).data('price') * +$(this).find('.thumb-input-number input').val();
        });
        $('#card-total-price').html(total);

        if (total === 0) {
            $('#cart-submit').addClass('disabled');
        }
    }

    $(document).on('click', '.cart .js-product .thumb-input-number button', function () {
        _functions.calculateCartTotalPrice();
    });

    //remove product from card
    $(document).on('click', '.cart .js-product .btn-close', function () {
        $(this).closest('.js-product').slideUp(0, function () {
            $(this).remove();
            _functions.calculateCartTotalPrice();
        })
    });

    // open - close cart
    $(document).on('click', '.open-cart', function () {
        $('.cart').addClass('active');
        $('.cart-block').fadeOut();
        _functions.removeScroll();
    });

    $(document).on('click', '.cart-close, .cart_bg-layer', function () {
        $('.cart').removeClass('active');
        _functions.addScroll();
    });

    // remove from favourites
    /* $('.js-product .fav-btn.btn-close').on('click', function () {
        $(this).closest('.js-product').parent().remove();
    }); */

    // checkout tabs
    $(document).on('change', '.toggle-block-control', function () {
        let blockNum = $(this).data('block'),
            rel = $(this).data('rel'),
            $showBlock = $('.toggle-block[data-block="' + blockNum + '"][data-rel="' + rel + '"]'),
            $hideBlock = $('.toggle-block[data-block="' + blockNum + '"]:visible');

        $(this).closest('.checkbox-entry-wrap').fadeOut();

        if ($(this).is('input[type="checkbox"]')) {
            $showBlock.slideToggle();
            return;
        }

        if ($hideBlock.length) {
            $hideBlock.slideUp(500, function () {
                $showBlock.slideDown();
            });
        } else {
            $showBlock.slideDown();
        }

    });

    // checkout comment
    $(document).on('click', '.cancel-comment', function () {
        $(this).closest('.toggle-block').slideUp(500);
        $(this).closest('.toggle-block').prev('.checkbox-entry-wrap').fadeIn();
    });
    $(document).on('click', '.add-comment', function () {
        $(this).closest('.comment-wrapp').hide();
        $('.show-comment').fadeIn();
    });
    $(document).on('click', '.delete-comment', function () {
        $(this).closest('.comment').hide();
        $('.comment-wrapp').fadeIn();
    });

    // checkout calculate

    _functions.calculateTotalCheckoutPrice = function () {
        let allSummProduct = 0;
        $('.checkout-products .js-checkout-product').each(function () {
            allSummProduct += +$(this).data('price') * +$(this).find('.thumb-input-number input').val();
        });
        $('.all-product-price-el').text(allSummProduct);

        //show empty cart message
        if (allSummProduct === 0) {
            $('.cart-empty-section').show();
            $('.checkout-section').hide();
        }
    }

    // _functions.calculateTotalCheckoutPrice();

    $(document).on('click', '.js-checkout-product .thumb-input-number button', function () {
        _functions.calculateTotalCheckoutPrice();

        let prod = $(this).closest('.js-checkout-product'),
            productSum = +prod.data('price') * +prod.find('input').val();
        prod.find('.price').text(productSum);
    });

    //remove product from card
    $(document).on('click', '.js-checkout-product .btn-close', function () {
        $(this).closest('.js-checkout-product').slideUp(0, function () {
            $(this).remove();
            _functions.calculateTotalCheckoutPrice();
        });
    });

    //single product price
    _functions.calculateSinglePrice = function ($parentEl) {
        let prod = $parentEl,
            productSum = +prod.attr('data-price');
        prod.find('.price').text(productSum);
    }

    $(document).on('click', '.js-product .thumb-input-number button', function () {
        _functions.calculateSinglePrice($(this).closest('.js-product'));
    });

    // product_variations
    $(document).on('click', '.js-product .product_variations li', function (e) {
        let $this = $(this),
            $product = $this.closest('.js-product'),
            price = $this.attr('data-price'),
            oldPrice = $this.attr('data-old-price'),
            size = $this.attr('data-size'),
            imgSrc = $this.attr('data-img-scr'),
            imgHoverSrc = $this.attr('data-img-hover-src');

        $this.addClass('active').siblings().removeClass('active');

        if (price) $product.attr('data-price', price);
        if (oldPrice) $product.find('.price-old').text(oldPrice);
        if (size) $product.find('.size').text(size);
        if (imgSrc) {
            if ($product.is('.js-product-detail')) {
                $('.product_detail-img').eq(0).find('.img').attr('src', imgSrc);
            } else {
                $product.find('.img-default').attr('src', imgSrc);
            }
        }
        if (imgHoverSrc) $product.find('.img-hover').attr('src', imgHoverSrc);
        $product.find('input').val(1);

        _functions.calculateSinglePrice($product);
    });

    // Invalid Input
    $('.input[required]').on('blur', function () {
        if ($(this).val().trim()) {
            $(this).removeClass('invalid');
        } else {
            $(this).addClass('invalid');
        }
    });

    //fail Input
    $('.input[required]').on('keyup', function () {
        if ($(this).val()) {
            $(this).removeClass('invalid');
        }
        else { $(this).addClass('invalid'); }
    });

    // custom_dropdown
    /* $('.custom_dropdown-title').on('click', function (e) {
        $(this).toggleClass('active');
        $(this).closest('.custom_dropdown').find('.custom_dropdown-toggle').slideToggle(300);
    }); */

    // cabinet address table
    $('input[name="cabinet-address"]').on('change', function () {
        $('.cabinet_address tr').removeClass('active');
        $('input[name="cabinet-address"]:checked').closest('tr').addClass('active');
    });

    /* $('.cabinet_address .btn-close').on('click', function () {
        $(this).closest('tr').remove();
    }); */

    /* header drop menu */
    $(document).on('click', function () {
        $('.h-menu-drop').removeClass('show');
    });
    $(document).on('click', '.h-menu', function (e) {
        e.stopPropagation();
        $('.h-menu-drop').addClass('show');
    });

    /* header search */
    $(document).on('click', '.h-search', function () {
        $('.h-sform').addClass('show');
        setTimeout(function () {
            $('.h-sform').find('.h-sform-input').focus();
        }, 100);
        _functions.removeScroll();
    });
    $(document).on('click', '.h-sform-close, .h-sform-overlay', function () {
        $('.h-sform').removeClass('show');
        _functions.addScroll();
    });

    /* autocomplete */
    var availableTags = [
        'Гелевий барвник',
        'Гелевий барвник на водній основі'
    ];

    var availableTags = [
        {
            value: 'Тримач для ножів Orgaline',
            category: 'Вироби',
            code: '#DQDB2M',
            icon: '/img/search-1.jpg'
        },
        {
            value: 'Комплект висувних шухляд типу Orgaline',
            category: 'Комплекти',
            code: '#DQDB2M',
            icon: '/img/search-2.jpg'
        },
        {
            value: 'Різак для харчової плівки Orgaline',
            category: 'Вироби',
            code: '#DQDB2M',
            icon: '/img/search-3.jpg'
        },
        {
            value: 'Увага! Поповнення асортименту в лінійці Orgaline Увага! Поповнення асортименту в лінійці Orgaline Увага! Поповнення асортименту в лінійці Orgaline',
            category: 'Новини',
            code: '#DQDB2M',
            icon: '/img/search-4.jpg'
        },
        {
            value: 'Тримач для тарілок Orgaline',
            category: 'Вироби',
            code: '#DQDB2M',
            icon: '/img/search-5.jpg'
        }
    ];
    $(document).ready(function(){
        $(".h-sform-input").keyup(function(){
            $.ajax({
                type: 'post',
                url: '/searchItems',
                data:'search='+$(this).val(),
                success: function(data){
                    console.log(data);
                    $('.h-sform-input').each(function () {
                        $(this).autocomplete({
                            source: data
                        }).autocomplete('instance')._renderItem = function (ul, item) {
                            console.log(item)
                            return $('<li>')
                                .append('<span class="ui-img"><a href="/'+ item.slag +'"><img src="' + item.image + '" alt="preview image"/></a></span>' + '<span>' + '<a href="/'+ item.slag +'"><span class="ui-top d-flex">' + '<span class="ui-category">' + item.category + '</span>' + '<span class="ui-code">' + item.sku + '' + '</span></span></a>' + '<span class="text-truncate line-3"><a href="/'+ item.slag +'">' + item.value + '</a></span></span>')
                                .appendTo(ul);
                        };
                    });
                }
            });
        });
    });
    // if ($('.h-sform-input').length) {
    //     $('.h-sform-input').each(function () {
    //         $(this).autocomplete({
    //             source: availableTags
    //         }).autocomplete('instance')._renderItem = function (ul, item) {
    //             return $('<li>')
    //                 .append('<span class="ui-img"><img src="' + item.icon + '" alt="preview image"/></span>' + '<span>' + '<span class="ui-top d-flex">' + '<span class="ui-category">' + item.category + '</span>' + '<span class="ui-code">' + item.code + '' + '</span></span>' + '<span class="text-truncate line-3">' + item.value + '</span>')
    //                 .appendTo(ul);
    //         };
    //     });
    // }

    /* header categories */
    $(document).on('click', function () {
        $('.h-drop').removeClass('show');
        $('.h-btn').removeClass('active');
    });
    $(document).on('click', '.h-btn-wrapp', function (e) {
        e.stopPropagation();
        $(this).find('.h-btn').toggleClass('active');
        $(this).siblings().find('.h-btn').removeClass('active');
        $(this).find('.h-drop').toggleClass('show');
        $(this).siblings().find('.h-drop').removeClass('show');
        $('.h-user-drop').removeClass('show');
    });
    $('.h-drop').css('max-height', winH - $('header').outerHeight());

    /* user dropdown */
    if (isTouchScreen) {
        $(document).on('click', function () {
            $('.h-user-drop').removeClass('show');
            $('.h-user-name').removeClass('active');
        });
        $(document).on('click', '.h-user-name', function (e) {
            e.stopPropagation();
            $(this).addClass('active');
            $(this).find('.h-user-drop').addClass('show');
            $('.h-drop').removeClass('show');
        });
    }

    /* mobile menu */
    $(document).on('click', '.show-menu', function () {
        $('.mobile-menu').addClass('show');
        $('.h-drop').removeClass('show');
        $('.catalog-sidebar').removeClass('show');
        $('.sidebar-layer').removeClass('show');
        $('.open-filters').removeClass('active');
        $('.open-filters').find('img').attr('src', sidebarFilters);
        _functions.removeScroll();
    });
    $(document).on('click', '.menu-close', function () {
        $('.mobile-menu').removeClass('show');
        _functions.addScroll();
    });

    /* footer address */
    $(window).on('resize', function () {
        if ($('footer').hasClass('type-2')) {
            $('.f-addr-wrapp').css('margin-left', $('.nav-secondary li').outerWidth(true) * 2 + $('.f-logo').outerWidth(true) + 60);
        }
    }).trigger('resize');

    /* tabs */
    $(document).on('click', '.tab-title', function () {
        $(this).parent().toggleClass('active');
    });

    var tabsFinish = 0;

    $(document).on('click', '.tab-toggle div', function () {

        if (tabsFinish) return false;

        var tab = $(this).closest('.tabs').find('.tab');
        var i = $(this).index();

        tabsFinish = 1;

        $(this).addClass('active').siblings().removeClass('active');
        tab.eq(i).siblings('.tab:visible').fadeOut(function () {
            tab.eq(i).css({ 'display': 'block', 'opacity': 0 });
            tab.eq(i).animate({ 'opacity': 1 }, function () {
                tabsFinish = 0;
            });
        });
        $(this).closest('.tab-nav').removeClass('active').find('.tab-title span').text($(this).text());
    });
    /* end tabs */

    /* seo block */
    $(document).on('click', '.read-more', function () {
        $(this).toggleClass('active');
        $(this).closest('.acc-item').find('.acc-body').slideToggle(500);
    });
    /* end seo block */

    /* cookies */
    if ($('.cookies-block').length) {
        $(document).on('click', '.close-cookies', function () {
            $(this).parents('.cookies-block').fadeOut();
        });
    }
    /* end cookies */

    /* add to favourite */
    $(document).on('click', '.add-to-favourite', function () {
        $(this).toggleClass('active');
    });
    /* end add to favourite */

    /* toggle filter */
    $(document).on('click', '.toggle-filter', function () {
        $(this).toggleClass('active');
        $(this).next('.filter-toggle').slideToggle();
    });
    /* end toggle filter */

    /* mobile open filters */
    var sidebarClose = $('.open-filters').attr('data-close'),
        sidebarFilters = $('.open-filters').find('img').attr('src');

    $(document).on('click', '.open-filters', function () {
        $('.catalog-sidebar').toggleClass('show');
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $(this).find('img').attr('src', sidebarClose);
        } else {
            $(this).find('img').attr('src', sidebarFilters);
        }
        $('.sidebar-layer').addClass('show');
        _functions.removeScroll();

        if (!$(this).hasClass('active')) {
            $('.sidebar-layer').removeClass('show');
            _functions.addScroll();
        }
    });
    $(document).on('click', '.sidebar-layer', function () {
        $(this).removeClass('show');
        $('.catalog-sidebar').removeClass('show');
        $('.open-filters').removeClass('active');
        $('.open-filters').find('img').attr('src', sidebarFilters);
    });
    /* end mobile open filters */

    /* prices slider */
    var sliderRange = $(".slider-range");
    if (sliderRange.length) {
        sliderRange.each(function () {
            $(this).slider({
                range: true,
                min: $(this).data('min'),
                max: $(this).data('max'),
                values: $(this).data('values'),
                stop: function (event, ui) {
                    $(".range-min").val($(this).slider("values", 0));
                    $(".range-max").val($(this).slider("values", 1));
                },
                slide: function (event, ui) {
                    $(".range-min").val($(this).slider("values", 0));
                    $(".range-max").val($(this).slider("values", 1));
                }
            });
        });
        $(".range-min").change(function () {
            var min = $(".range-min").val(),
                max = $(".range-max").val();

            if (parseInt(min) > parseInt(max)) {
                min = max;
                $(".range-min").val(min);
            }
            sliderRange.slider("values", 0, min);
        });
        $(".range-max").change(function () {
            var min = $(".range-min").val(),
                max = $(".range-max").val();

            if (max > sliderRange.data('max')) {
                max = sliderRange.data('max');
                $(".range-max").val(sliderRange.data('max'));
            }

            if (parseInt(min) > parseInt(max)) {
                max = min;
                $(".range-max").val(max);
            }
            sliderRange.slider("values", 1, max);
        });
        $('.range-input input').keypress(function (event) {
            var key, keyChar;
            if (!event) var event = window.event;

            if (event.keyCode) key = event.keyCode;
            else if (event.which) key = event.which;

            if (key == null || key == 0 || key == 8 || key == 13 || key == 9 || key == 46 || key == 37 || key == 39) return true;
            keyChar = String.fromCharCode(key);

            if (!/\d/.test(keyChar)) return false;

        });
    }
    /* end prices slider */

    //anchor scroll
    /* $(function () {
        $('a[href*="#"]:not([href="#"])').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - $('header').outerHeight() - 30
                    }, 888);
                    return false;
                }
            }
        });
    }); */

    /* set cart */
    $(document).on('click', '.set-cart', function () {
        var setCheck = $(this).find('input[type="checkbox"]');
        if (setCheck.prop('checked')) {
            $(this).parents('.swiper-wrapper').find('.set').addClass('active');
            $(this).parents('.swiper-wrapper').find('input[type="checkbox"]').prop("checked", true);
        } else {
            $(this).parents('.swiper-wrapper').find('.set').removeClass('active');
            $(this).parents('.swiper-wrapper').find('input[type="checkbox"]').prop("checked", false);
        }
    });

    // accordion
    $(document).on('click', '.accordion:not(.employment-accord) .accordion-item .accordion-title', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active').next().slideUp();
        }
        else {
            $(this).closest('.accordion').find('.accordion-title').not(this).removeClass('active').next().slideUp();
            $(this).addClass('active').next().slideDown();
        }
    });

    /* daterange */
    if ($('.daterange').length) {
        var dateFormatString = 'DD.MM.YYYY';
        $('input[name="daterange"]').daterangepicker({
            opens: 'right',
            autoUpdateInput: true,
            startOfWeek: 'monday',
            firstDay: 1,
            "locale": {
                applyLabel: 'Підтвердити',
                format: dateFormatString,
                daysOfWeek: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                monthNames: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень']
            }
        });

        $('#daterange').on('show.daterangepicker', function (ev, picker) {
            $('#daterange').addClass('active');
        });
        $('#daterange').on('hide.daterangepicker', function (ev, picker) {
            $('#daterange').removeClass('active');
        });
    }

    /* crm */
    if (isTouchScreen) {
        $(document).on('click', function (e) {
            $('.crm-user, .tooltip').removeClass('active');
        });
        $(document).on('click', '.crm-user, .tooltip', function (e) {
            e.stopPropagation();
            $(this).toggleClass('active');
        });
    }
    _functions.hideSidebar = function () {
        $('.crm-sidebar').removeClass('show');
        $('.show-sidebar').css('left', '0').removeClass('active');
        $('.mobile-overlay').removeClass('show');
        _functions.addScroll();
    }
    $(document).on('click', '.mobile-overlay', function () {
        _functions.hideSidebar();
    });
    $(document).on('click', '.show-sidebar', function (e) {
        e.stopPropagation();
        $(this).css('left', $('.crm-sidebar').outerWidth()).addClass('active');
        $('.crm-sidebar').addClass('show');
        $('.mobile-overlay').addClass('show');
        _functions.removeScroll();
    });
    $(document).on('click', '.show-sidebar.active', function (e) {
        e.stopPropagation();
        $(this).removeClass('active');
        _functions.hideSidebar();
    });
    /* end crm */

    //upload file
    $(document).on('click', '.upload-wrapper .file-name', function () {
        $(this).closest('.upload-wrapper').find('input').click();
    });
    $(document).on('change', '.upload-wrapper input', function () {
        var fileName = $(this).val().substring($(this).val().lastIndexOf("\\") + 1);
        if (!fileName) {
            $(this).closest('.upload-wrapper').find('.remove-file').click();
        } else {
            $(this).parent().addClass('active');
            $(this).closest('.file-form').find('.uploaded-files').append('<div class="uploaded-item d-flex align-items-center"><span>' + fileName + '</span><div class="remove-file"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L4 12" stroke-width="1.5" stroke-linecap="square"/><path d="M4 4L12 12" stroke-width="1.5" stroke-linecap="square"/></svg></div></div>');

            $(this).closest('.file-form').find('.send').removeClass('d-none').addClass('d-inline-flex');
            $(this).closest('.file-form').find('.file-name').addClass('active');

        }
    });

    //remove uploaded file
    $(document).on('click', '.remove-file', function () {
        if ($(this).closest('.file-form').find('.uploaded-item').length <= 1) {
            $(this).closest('.file-form').find('.send').addClass('d-none').removeClass('d-inline-flex');
            $(this).closest('.file-form').find('.file-name').removeClass('active');
        }
        $(this).parent('.uploaded-item').remove();
    });

    //inputmask
    if ($(".inputmask").length) {
        $(".inputmask").inputmask({
            // clearMaskOnLostFocus: false
            showMaskOnHover: false,
            definitions: {
                'x': {
                    validator: "[1-9]"
                },
                '9': {
                    validator: "[0-9]"
                }
            }
        });
    }

    $(document).on('click', '.toggle-state', function () {
        $(this).addClass('active').removeClass('link').siblings('.toggle-state').removeClass('active').addClass('link');
    });

    $(document).on('click', '.layout-btn', function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.layout-block').toggleClass('active');
    });

    /*--------------------------------------------------------------------*/
    /*changes*/
    /*--------------------------------------------------------------------*/

    //set date
    _functions.getDateAndTime = function () {
        let getDate = new Date();
        let setDate = ('0' + getDate.getDate()).slice(-2) + '.' + ('0' + (getDate.getMonth() + 1)).slice(-2) + '.' + getDate.getFullYear();
        let setTime = ('0' + getDate.getHours()).slice(-2) + ':' + ('0' + getDate.getMinutes()).slice(-2)
        $('.crm-top-date span').html(setDate + ', ' + setTime)
    };
    _functions.getDateAndTime();
    setInterval(function () {
        _functions.getDateAndTime();
    }, 60000);

    //set active class to sidebar
    let activeLink = window.location.pathname.split('/');
    let realLink = '/' + activeLink[activeLink.length - 2] + '/' + activeLink[activeLink.length - 1]
    $('.crm-nav ul li').each(function () {
        let $this = $(this).find('a')
        let thisHref = $(this).find('a').attr('href')
        if (realLink == thisHref) {
            $this.addClass('current')
        }
        else {
            $this.removeClass('current')
        }
    });

    //set contacts in sidebar
    $(document).on('click', '.crm-nav .set-contacts', function () {
        $.ajax({
            type: "get",
            url: '/dealer/crm-dealer-manager-contacts',
            data: {
            },
            dataType: 'JSON',
            success: function (data) {
                $('.popup-content').find('#managerFirstName').text(data.first_name)
                $('.popup-content').find('#managerLastName').text(data.last_name)
                $('.popup-content').find('#managerPhone').text(data.phone)
                $('.popup-content').find('#managerEmail').text(data.email)
            },
            error: function (data) {

            }
        });
        return false
    });

    //change city or region
    $(document).on('change', '.select-region .SelectBox', function () {
        $(this).closest('.input-field.row').find('.select-box.select-city').removeClass('disabled')
        $(this).closest('.input-field.row').find('.select-box.select-city select').html('');
        $(this).closest('.input-field.row').find('.select-box.select-city select')[0].sumo.reload();
    });

    //check amount page pagination
    $('.crm-search').find('.daterange input').val('')
    _functions.checkPagePagination = function () {
        let getNumberPage = $('.crm-table-page').find('span').text()
        if (getNumberPage <= 1) {
            $('.crm-table-page').addClass('disabled')
        }
        else { $('.crm-table-page').removeClass('disabled') }
    };
    _functions.checkPagePagination();

    //page navigation
    _functions.checkButtonNavigation = function () {
        let currentPage = +$('.crm-table-page').find('input').val(),
            allPages = +$('.crm-table-page').find('span').text()

        if (allPages <= 1) {
            $('.crm-table-pag .page-start').attr("disabled", true)
            $('.crm-table-pag .page-prev').attr("disabled", true)
            $('.crm-table-pag .page-next').attr("disabled", true)
            $('.crm-table-pag .page-end').attr("disabled", true)
        }
        else if ((currentPage > 1) && (currentPage < allPages)) {
            $('.crm-table-pag .page-start').removeAttr('disabled')
            $('.crm-table-pag .page-prev').removeAttr('disabled')
            $('.crm-table-pag .page-next').removeAttr('disabled')
            $('.crm-table-pag .page-end').removeAttr('disabled')
        }
        else if ((currentPage >= 1) && (currentPage == allPages)) {
            $('.crm-table-pag .page-start').removeAttr('disabled')
            $('.crm-table-pag .page-prev').removeAttr('disabled')
            $('.crm-table-pag .page-next').attr("disabled", true)
            $('.crm-table-pag .page-end').attr("disabled", true)
        }
        else if ((currentPage == 1) && (currentPage < allPages)) {
            $('.crm-table-pag .page-start').attr("disabled", true)
            $('.crm-table-pag .page-prev').attr("disabled", true)
            $('.crm-table-pag .page-next').removeAttr('disabled')
            $('.crm-table-pag .page-end').removeAttr('disabled')
        }
        else {
            return false
        }
    };
    _functions.checkButtonNavigation();

    //page-start
    $(document).on('click', '.crm-table-pag .page-start', function (e) {
        $('.crm-table-page').find('input').val(1)
        $('.crm-table-page').addClass('clickPag')

        if ($('#form-get-results').length) {
            $('#form-get-results #searchButton').click();
        }
    });

    //page-prev
    $(document).on('click', '.crm-table-pag .page-prev', function (e) {
        let currentPage = +$('.crm-table-page').find('input').val()
        $('.crm-table-page').find('input').val(currentPage - 1)
        $('.crm-table-page').addClass('clickPag')

        if ($('#form-get-results').length) {
            $('#form-get-results #searchButton').click();
        }
    });

    //page-next
    $(document).on('click', '.crm-table-pag .page-next', function (e) {
        let currentPage = +$('.crm-table-page').find('input').val()
        $('.crm-table-page').find('input').val(currentPage + 1)
        $('.crm-table-page').addClass('clickPag')

        if ($('#form-get-results').length) {
            $('#form-get-results #searchButton').click();
        }
    });

    //page-end
    $(document).on('click', '.crm-table-pag .page-end', function (e) {
        let allPages = +$('.crm-table-page').find('span').text()
        $('.crm-table-page').find('input').val(allPages)
        $('.crm-table-page').addClass('clickPag')

        if ($('#form-get-results').length) {
            $('#form-get-results #searchButton').click();
        }
    });

    //change current page in input
    $(document).on('change', '.crm-table-page input', function (e) {
        let inputValue = +$(this).val()
        let allPages = +$('.crm-table-page').find('span').text()

        if (inputValue <= 1) {
            $('.crm-table-page').find('input').val(1)
        }
        else if (inputValue >= allPages) {
            $('.crm-table-page').find('input').val(allPages)
        }
        else {
            $('.crm-table-page').find('input').val(inputValue)
        }

        $('.crm-table-page').addClass('clickPag')
        //start AJAX
        if ($('#form-get-results').length) {
            $('#form-get-results #searchButton').click();
        }
    });

    //display or hidden pagination
    _functions.displayHiddenPagination = function (countItems, countPages) {
        if (countItems === 0 || countPages === 1) {
            $('.crm-table-controls').addClass('crm-hidden-pagination')
        } else {
            $('.crm-table-controls').removeClass('crm-hidden-pagination')
        }
    };
    _functions.addPagination = function () {
        let page = null;
        let pag = $('.clickPag').find('input').val();
        if (pag) {
            page = $('.crm-table-page').find('input').val();
        } else {
            $('.crm-table-page').find('input').val(1);
        }
        return page
    };



    //clear all fields
    _functions.clearFields = function () {
        $('.crm-search').find('input').val('')
        $('.crm-search select').each(function () {
            let thisSelect = $(this)
            if (thisSelect.is('[multiple="multiple"]')) {
                thisSelect[0].sumo.unSelectAll();
            } else {
                thisSelect.find('option:first-child').attr('disabled', false);
                thisSelect[0].sumo.selectItem(0);
                thisSelect.find('option:first-child').attr('disabled', true);
                thisSelect[0].sumo.reload();
            }
        });
    };

    //clear all fields of registration form
    _functions.clearRegistrationFields = function () {
        $('#register-user-form').find('input').val('')
        $('#dealerDropDownAjax').html(`<option disabled selected>*Вибрати диллера</option>`)
        $('#register-user-form select').each(function () {
            let thisSelect = $(this)
            if (thisSelect.is('[multiple="multiple"]')) {
                thisSelect[0].sumo.unSelectAll();
            } else {
                thisSelect.find('option:first-child').attr('disabled', false);
                thisSelect[0].sumo.selectItem(0);
                thisSelect.find('option:first-child').attr('disabled', true);

                thisSelect[0].sumo.reload();
            }
        });
    };

    //approve dealer order status
    $(document).on('click', '.status-drop .approve-dealer-order', function () {
        let activeLink = window.location.pathname.split('/')
        let getId = activeLink[activeLink.length - 1]
        let statusVal = $('.status-drop .select-status').val();

        $.ajax({
            type: "post",
            url: '/dealer/crm-dealer-order-change-status' + '/' + getId,
            data: {
                status: statusVal ? statusVal : null,
            },
            dataType: 'JSON',
            success: function (data) {
                console.log(data);
            },
            error: function (data) {

            }
        });
        return false
    });

    //change client status on detail page
    $(document).on('click', '.status-drop .approve-dealer-client', function () {
        let activeLink = window.location.pathname.split('/');
        let getId = activeLink[activeLink.length - 1];
        let statusVal = $('.status-drop .select-status').val();
        let blockingText = $('#reasonBlocking').find('.input').val();

        if (statusVal == '2') {
            $('#reasonBlocking').find('.input').val('');
            $('#reasonBlocking').attr('data-id', getId);
            $('#reasonBlocking').attr('data-status', statusVal);
            _functions.openPopup('.popup-content[data-rel="4"]');
        } else {
            $.ajax({
                type: "post",
                url: '/dealer/crm-dealer-client-change-status' + '/' + getId,
                data: {
                    status: statusVal ? statusVal : null,
                    description: blockingText ? blockingText : null
                },
                dataType: 'JSON',
                success: function (data) {
                    console.log(data);
                },
                error: function (data) {

                }
            });
        }
        return false
    });

    //change client status - active - in tables
    $(document).on('click', '.crm-table .toggle-state:not(.open-popup)', function () {
        let getId = $(this).closest('tr').find('#id-client').data('id');
        let statusVal = $(this).data('status');

        $.ajax({
            type: "post",
            url: '/dealer/crm-dealer-client-change-status' + '/' + getId,
            data: {
                status: statusVal ? statusVal : null
            },
            dataType: 'JSON',
            success: function (data) {
                console.log(data);
            },
            error: function (data) {

            }
        });
        return false
    });

    //set id client and status to popup
    $(document).on('click', '.crm-table .toggle-state.open-popup', function () {
        let getId = $(this).parents('tr').find('#id-client').data('id');
        let statusVal = $(this).data('status');

        $('#reasonBlocking').find('.input').val('');
        $('#reasonBlocking').attr('data-id', getId);
        $('#reasonBlocking').attr('data-status', statusVal);

    });

    //change client status - blocked - in tables
    $(document).on('click', '#reasonBlocking .btn', function () {
        let getId = $('#reasonBlocking').attr('data-id');
        let statusVal = $('#reasonBlocking').attr('data-status');
        let blockingText = $('#reasonBlocking').find('.input').val();

        $.ajax({
            type: "post",
            url: '/dealer/crm-dealer-client-change-status' + '/' + getId,
            data: {
                status: statusVal ? statusVal : null,
                description: blockingText ? blockingText : null
            },
            dataType: 'JSON',
            success: function (data) {
                console.log(data);
            },
            error: function (data) {

            }
        });
        return false
    });


    //loader for buttons
    $.fn.buttonLoader = function (action) {
        let self = $(this);
        if (action == 'start') {
            if ($(self).attr("disabled") == "disabled") {
                e.preventDefault();
            }
            $('.has-spinner').attr("disabled", "disabled");
            $(self).attr('data-btn-text', $(self).text());
            $(self).html('<span class="spinner"><i class="fa fa-spinner fa-spin"></i></span>');
            $(self).addClass('active');
        }
        if (action == 'stop') {
            $(self).html($(self).attr('data-btn-text'));
            $(self).removeClass('active');
            $('.has-spinner').removeAttr("disabled");
        }
    }

    //start loader for buttons
    $(document).on('click', '.has-spinner', function () {
        let btn = $(this);
        $(btn).buttonLoader('start');

        setTimeout(function () {
            $(btn).buttonLoader('stop');
        }, 2000);
    })


    /*--------------------------------------------------------------------*/
    //crm-dealer-orders and other the same tables

    //start AJAX after change any field
    $('#form-get-results #daterange').on('hide.daterangepicker', function (ev, picker) {
        $('#form-get-results #searchButton').click();
    });
    $(document).on('change', '#form-get-results select[name=company_name]', function (e) {
        $('#form-get-results #searchButton').click();
    });
    $(document).on('change', '#form-get-results select[name=status]', function (e) {
        $('#form-get-results #searchButton').click();
    });
    $(document).on('change', '#form-get-results select[name=region]', function (e) {
        $('#form-get-results #searchButton').click();
    });
    $(document).on('change', '#form-get-results select[name=dealer]', function (e) {
        $('#form-get-results #searchButton').click();
    });

    //set dealer orders after search click button
    $(document).on('click', '#form-get-results #searchButton', function () {
        let values = $('#form-get-results *[name]');
        let data = {};
        values.each((index, el) => {
            data[$(el).attr('name')] = $(el).val()
        });

        data['page'] = _functions.addPagination();

        $.ajax({
            type: "post",
            url: $(this).attr('action'),
            data: data,
            dataType: 'JSON',
            success: function (data) {
                $('.crm-table').html(data.html);
                $('.count-results').find('span i').html(data.countItems);
                $('.crm-table-page').find('span').html(data.countPages);
                _functions.checkPagePagination();
                _functions.checkButtonNavigation();
                _functions.displayHiddenPagination(data.countItems, data.countPages);
                $('.crm-table-page').removeClass('clickPag');

                /*$(document).find( '.crm-table .SelectBox').SumoSelect({ placeholder: '', search: true, searchText: '', okCancelInMulti: true, csvDispCount: 0 });
                $(document).find( '.crm-table .SelectBox')[0].sumo.reload();*/
            },
            error: function (data) {
                console.log(data);
            }
        });
        return false
    });

    //set defaults dealer orders
    $(document).on('click', '#clear-search-results', function () {
        $('.crm-table-page').find('input').val(1)
        $.ajax({
            type: "post",
            url: $(this).attr('action'),
            data: {
            },
            dataType: 'JSON',
            success: function (data) {
                _functions.clearFields();
                $('.crm-table').html(data.html);
                $('.count-results').find('span i').html(data.countItems);
                $('.crm-table-page').find('span').html(data.countPages);
                _functions.checkPagePagination();
                _functions.checkButtonNavigation();
                _functions.displayHiddenPagination(data.countItems, data.countPages);
            },
            error: function (data) {
                console.log(data);
            }
        });
        return false
    });

    //get dealer by region
    $(document).on('click', '.regionDropDownAjax', function () {
        let regionId = $("select[name=region_activity_id]").val()
        $.ajax({
            type: "post",
            url: '/auth/dealersOfRegion',
            data: {
                regionId: regionId
            },
            dataType: 'JSON',
            success: function (data) {
                console.log(data);
                let html = '';
                if(data && data.length){
                    data.forEach(i => {
                    html += `<option value="${i.dealer.id}">${i.dealer.company_name}</option>`
                    });
                }else{
                    html += `<option disabled selected>Не знайдено дилерів у вибраній області</option>`
                }

                $('#dealerDropDownAjax').html(html)
                $('#dealerDropDownAjax')[0].sumo.reload();


            },
            error: function (data) {

            }
        });
        return false
    });

    //upload orders attachments
    $(document).on('submit', '.sendFile', function (e) {
        e.preventDefault()
        let input = $(this).find("input[type='file']")[0].files;
        let formData = new FormData();
        for (let i = 0; i < input.length; i++) {
            formData.append('files', input[i]);
        }

        $.ajax({
            type: "POST",
            url: $(this).attr('action'),
            data: formData,
            enctype: 'multipart/form-data',
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function (data) {
                const idName = '#sendFile' + data[0].doc_type;
                $(idName).find('.uploaded-files .uploaded-item').each(function () {
                    $(this).find(".remove-file").remove()
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
        return false
    });

    //check crm_number exist
    $(document).on('change', 'input[name="crm_number"]', function () {
        let crm_number = $('input[name="crm_number"]').val();
        $.ajax({
            type: "get",
            url: '/dealer/crm-number-exist/' + crm_number,
            data: {
            },
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    $('.input-wrapp').append(
                        '<div class="inputError">SRM номер існує в системі. Введіть унікальний номер</div>'
                    );
                    $('.saveChange').addClass('disabled');
                } else {
                    $('.input-wrapp').find('.inputError').remove();
                    $('.saveChange').removeClass('disabled');
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
        return false
    });

    //change dealers list in dropdown 'fixed_dealers' by selecting regions
    $(document).on('change', 'select[name="fixed_regions"]', function () {
        let fixed_regions = $('select[name="fixed_regions"]').val();
        let fixed_dealers = $('select[name="fixed_dealers"]').val();

        let srId = $('select[name="fixed_regions"]').data('srid');

        $.ajax({
            type: "post",
            url: '/blum-manager/blum-manager-refresh-list-for-fixed-dealers',
            data: {
                fixed_regions:fixed_regions,
            },
            dataType: 'JSON',
            success: function (data) {
                let options = '';
                if (data && data.length) {
                    data.forEach(i =>{
                        let selected = fixed_dealers.some(x => x === i.dealer.id.toString()) ? 'selected' : '';
                        let manager = srId != i.dealer.manager_sr_id ? `- ( Менеджер: ${i.dealer.manager_sr && i.dealer.manager_sr.company_name ? i.dealer.manager_sr.company_name : 'немає'})` : '';
                        options += `<option value="${i.dealer.id}" ${selected}>${i.dealer.company_name} ${manager}</option>`
                    });
                }
                $('select[name="fixed_dealers"]').html(options);
                $(document).find( 'select[name="fixed_dealers"]')[0].sumo.reload();
            },
            error: function (data) {
                console.log(data);
            }
        });
        return false
    });

    //delete SR MANAGER
    $(document).on('click', '#deleteSRmanagerPopup', function () {
        let activeLink = window.location.pathname.split('/');
        let getId = activeLink[activeLink.length - 1];

        $.ajax({
            type: "get",
            url: `/blum-manager/blum-manager-delete-sr/${getId}/soft`,
            data: {
            },
            dataType: 'JSON',
            success: function (data) {
                console.log(data);
            },
            error: function (data) {
                console.log(data);
            }
        });
        return false
    });

    //change data request status
    $(document).on('click', '.ajaxChangeDataRequest', function () {
        let status = $(this).attr('data-status');
        let blockingText = $('#reasonBlockingForChangeData').find('.input').val();
        let getId = $(this).attr('data-id');
        if(!getId){
            getId = $('#rejectDataRequest').attr('data-id');
        }

        $.ajax({
            type: "post",
            url: `/blum-manager/blum-manager-change-data/${getId}/${status}`,
            data: {
                description: blockingText ? blockingText : null
            },
            dataType: 'JSON',
            success: function (data) {
                $('#content').html(data.html);
            },
            error: function (data) {
                console.log(data);
            }
        });
        return false
    });

    //submit form by ajax
    $(document).on('click', 'form .submitByAjax', function () {
        let values = $(this).parents('form:first').find('*[name]');

        let data = {};
        values.each((index, el) => {
            data[$(el).attr('name')] = $(el).val()
        });

        $.ajax({
            type: "post",
            url: $(this).parents('form:first').attr('action'),
            data: data,
            dataType: 'JSON',
            success: function (data) {
            },
            error: function (data) {
            }
        });
        return false
    });

    //set reason_for_rejection to popup and read message
    $(document).on('click', '.openRejectionPopup', function () {
        let getId = $(this).data('id');
        let reason_for_rejection = $(this).data('massage');

        $('#rejectionMessage').text(reason_for_rejection);

        $.ajax({
            type: "get",
            url: `/client/cabinet/read-rejection-message/${getId}`,
            data: {},
            success: function (data) {
                $(`[data-id= ${getId}]`).parent().remove();
            },
            error: function (error) {

            }
        });
        return false

    });

    //change password
    $(document).on('click', '.changePasswordAjax', function () {
        let values = $(this).parents('form:first').find('*[name]');

        let data = {};
        values.each((index, el) => {
            data[$(el).attr('name')] = $(el).val()
        });

        $.ajax({
            type: "post",
            url: $(this).parents('form:first').attr('action'),
            data: data,
            dataType: 'JSON',
            success: function (data) {
                console.log("success")
                $('#messageChangePassword').text(data.result)
                values.each((index, el) => {
                    $(el).val('')
                });
            },
            error: function (data) {
                console.log("error")
            }
        });
        return false
    });

    /*--------------------------------------------------------------------*/

    //exportXLS
    $(document).on('click', '#exportXLS', function () {
        let searchVal = $('input[name=search]').val(),
            dataRange = $('input[name=daterange]').val(),
            nameCompany = $('select[name=company_name]').val(),
            getStatus = $('select[name=status]').val();

        let url = $(this).attr('data-url');
        let filename;
        switch (url) {
            case '/dealer/exportClientsXls':
                filename = 'exportClientsForDealer.xlsx';
                break;
            case '/dealer/exportRequestsXls':
                filename = 'exportClientsRegistrationRequestsForDealer.xlsx';
                break;
            case '/dealer/exportOrdersXls':
                filename = 'exportClientsOrdersForDealer.xlsx';
                break;
            case '/sr-manager/exportOrdersXls':
                filename = 'exportClientsOrdersForSR.xlsx';
                break;
            case '/sr-manager/exportClientsXls':
                filename = 'exportClientsForSR.xlsx';
                break;
            case '/sr-manager/exportRequestsXls':
                filename = 'exportClientsRegistrationRequestsForSR.xlsx';
                break;
            case '/blum-manager/exportOrdersXls':
                filename = 'exportClientsOrdersForBlum.xlsx';
                break;
            case '/blum-manager/exportClientsXls':
                filename = 'exportClientsForBlum.xlsx';
                break;
            default:
                filename = 'exportXlsBlum.xlsx';
        }

        $.ajax({
            type: "post",
            url: $(this).attr('data-url'),
            data: {
                search: searchVal ? searchVal : null,
                daterange: dataRange ? dataRange : null,
                company_name: nameCompany ? nameCompany : null,
                status: getStatus ? getStatus : null
            },
            xhrFields: {
                responseType: 'blob'
            },

            success: function (response) {
                console.log('response');
                console.log(response);
                // var blob= new Blob([response]);
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(response);
                link.download = filename;
                link.click();
            },
            error: function (data) {

            }
        });
        return false
    });

    //check email exist
    $(document).on('change', 'input[name="new_email"]', function () {
        let new_email = $('input[name="new_email"]').val();
        $.ajax({
            type: "get",
            url: '/auth/checkIsEmailExist/' + new_email,
            data: {
            },
            dataType: 'JSON',
            success: function (data) {

                if (data.notEmail) {
                    $('.input-wrapp').find('.inputError').remove();
                    $('.input-wrapp').append(
                        '<div class="inputError">Будь ласка введіть електронну адресу в форматі: email@mail.com</div>'
                    );
                    // $('#registrationBtn').addClass('disabled');
                } else if (data.emailExist) {
                    $('.input-wrapp').append(
                        '<div class="inputError">Користувач з такою електронною адресою вже зареєстрований</div>'
                    );
                    // $('#registrationBtn').addClass('disabled');
                } else {
                    $('.input-wrapp').find('.inputError').remove();
                    // $('#registrationBtn').removeClass('disabled');
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
        return false
    });

    //check phone number exist
    $(document).on('change', 'input[name="phone_number"]', function () {
        let phone_number = $('input[name="phone_number"]').val();
        $.ajax({
            type: "get",
            url: '/auth/checkIsPhoneExist/' + phone_number,
            data: {
            },
            dataType: 'JSON',
            success: function (data) {

                if (data.notPhone) {
                    $('.input-wrapp-phone').find('.inputError').remove();
                    $('.input-wrapp-phone').append(
                        '<div class="inputError">Введіть номер телефону</div>'
                    );
                    // $('#registrationBtn').addClass('disabled');
                } else if (data.phoneExist) {
                    $('.input-wrapp-phone').append(
                        '<div class="inputError">Користувач з таким номером телефону вже зареєстрований</div>'
                    );
                    // $('#registrationBtn').addClass('disabled');
                } else {
                    $('.input-wrapp-phone').find('.inputError').remove();
                    // $('#registrationBtn').removeClass('disabled');
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
        return false
    });

    //check compare password
    $(document).on('change', 'input[name="confirm_password"]', function () {
        let password = $('input[name="password"]').val();
        let confirmPassword = $('input[name="confirm_password"]').val();

        if (!/^[0-9a-zA-Z!@#$%^&*]{6,}$/.test(password)) {
            $('.input-wrapp-password').find('.inputError').remove();
            $('.input-wrapp-password').append(
                `<div class="inputError">
                Пароль до вашого облікового запису має відповідати таким вимогам:
                <ul type="disc">
                    <li>-щонайменше 6 символів;</li>
                    <li>-лише латинські літери;</li>
                </ul></div>`
            );
            // $('#registrationBtn').addClass('disabled');
        } else if (password != confirmPassword) {
            $('.input-wrapp-password').find('.inputError').remove();
            $('.input-wrapp-password').append(
                `<div class="inputError">Пароль не збігається</div>`
            );
            // $('#registrationBtn').addClass('disabled');
        } else {
            $('.input-wrapp-password').find('.inputError').remove();
            // $('#registrationBtn').removeClass('disabled');
        }

        return false
    });

    //check compare password
    $(document).on('change', 'input[name="password"]', function () {
        let password = $('input[name="password"]').val();
        let confirmPassword = $('input[name="confirm_password"]').val();

        if (!/^[0-9a-zA-Z!@#$%^&*]{6,}$/.test(password)) {
            $('.input-wrapp-password').find('.inputError').remove();
            $('.input-wrapp-password').append(
                `<div class="inputError">
                Пароль до вашого облікового запису має відповідати таким вимогам:
                <ul type="disc">
                    <li>-щонайменше 6 символів;</li>
                    <li>-лише латинські літери;</li>
                </ul></div>`
            );
            // $('#registrationBtn').addClass('disabled');
        } else if (password != confirmPassword) {
            $('.input-wrapp-password').find('.inputError').remove();
            $('.input-wrapp-password').append(
                `<div class="inputError">Пароль не збігається</div>`
            );
            // $('#registrationBtn').addClass('disabled');
        } else {
            $('.input-wrapp-password').find('.inputError').remove();
            // $('#registrationBtn').removeClass('disabled');
        }

        return false
    });

    //register form
    $(document).on('click', '#register-user-form #registrationBtn', function () {
        let values = $('#register-user-form *[name]');
        let data = {};
        values.each((index, el) => {
            data[$(el).attr('name')] = $(el).val();
        });

        $.ajax({
            type: "post",
            url: $(this).attr('action'),
            data: data,
            dataType: 'JSON',
            success: function (data) {

                $('.input-wrapp-first-name').find('.inputError').remove();
                $('.input-wrapp-last-name').find('.inputError').remove();
                $('.input-wrapp-phone').find('.inputError').remove();
                $('.input-wrapp').find('.inputError').remove();
                $('.input-wrapp-password').find('.inputError').remove();
                $('.input-wrapp-region-activity-id').find('.inputError').remove();
                $('.input-wrapp-city').find('.inputError').remove();
                $('.input-wrapp-activity-id').find('.inputError').remove();
                $('.input-wrapp-positon-activity-id').find('.inputError').remove();
                $('.input-wrapp-dealer-id').find('.inputError').remove();

                if (data.firstNameNotExist) {
                    $('.input-wrapp-first-name').append(
                        '<div class="inputError">Введіть ім’я</div>'
                    );
                }
                if(data.lastNameNotExist){
                    $('.input-wrapp-last-name').append(
                        '<div class="inputError">Введіть прізвище</div>'
                    );
                }

                if (data.phoneExist) {
                    $('.input-wrapp-phone').append(
                        '<div class="inputError">Користувач з таким номером телефону вже зареєстрований</div>'
                    );
                }
                if(data.phoneNumberNotExist){
                    $('.input-wrapp-phone').append(
                        '<div class="inputError">Введіть номер телефону</div>'
                    );
                }

                if (data.notEmail) {
                    $('.input-wrapp').append(
                        '<div class="inputError">Будь ласка введіть електронну адресу в форматі: email@mail.com</div>'
                    );
                }
                if (data.emailExist) {
                    $('.input-wrapp').append(
                        '<div class="inputError">Користувач з такою електронною адресою вже зареєстрований</div>'
                    );
                }

                if (data.badPassword) {
                    $('.input-wrapp-password').append(
                        `<div class="inputError">
                        Пароль до вашого облікового запису має відповідати таким вимогам:
                        <ul type="disc">
                            <li>-щонайменше 8 символів;</li>
                            <li>-не більше 16 символів;</li>
                            <li>-як мінімум одна велика, одна мала літери, один доступний символ:!@#$%^&*()_\-+= ;</li>
                            <li>-лише латинські літери;</li>
                            <li>-як мінімум одна цифра;</li>
                        </ul></div>`
                    );


                }
                if (data.passwordNotExist) {
                    $('.input-wrapp-password').append(
                        `<div class="inputError">Введіть пароль</div>`
                    );
                }
                if (data.passwordNotConfirm) {
                    $('.input-wrapp-password').append(
                        `<div class="inputError">Пароль не збігається</div>`
                    );
                }

                if (data.regionActivityIdNotExist) {
                    $('.input-wrapp-region-activity-id').append(
                        '<div class="inputError">Виберіть область</div>'
                    );
                }
                if (data.cityNotExist) {
                    $('.input-wrapp-city').append(
                        '<div class="inputError">Введіть місто</div>'
                    );
                }
                if (data.activityIdNotExist) {
                    $('.input-wrapp-activity-id').append(
                        '<div class="inputError">Виберіть вид діяльності</div>'
                    );
                }
                if (data.positonActivityIdNotExist) {
                    $('.input-wrapp-positon-activity-id').append(
                        '<div class="inputError">Виберіть посаду</div>'
                    );

                }
                if (data.dealerIdNotExist) {
                    $('.input-wrapp-dealer-id').append(
                        '<div class="inputError">Виберіть дилера</div>'
                    );
                }

                if (data.successRegistration) {
                    _functions.clearRegistrationFields();
                    _functions.openPopup('.popup-content[data-rel="1"]')
                }
            },
            error: function (data) {
                console.log(data);
            }
        });

        return false
    });

    //set cookies after click button on cookies popup
    $(document).on('click', '#confirmCookiesButton', function () {
        document.cookie = "isReadCookiesPopup=true; max-age=2592000;"; // cookie expires at 30 days
        return false
    });

    $(document).on('click','.h-currency-drop', function () {
        let currency = $(".h-currency-drop li a").attr('data-type');
        document.cookie = `currencyType=${currency}; max-age=2592000;`; // cookie expires at 30 days
        window.location.replace(`${window.location.pathname}`);
        return false
    })


    //function for read cookies by name
    function readCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    //add input
    let count = 0;
    $(document).on('click', '.add-input-block-item .add-more', function (e){
        count++;
        let lengthInputs = $('.added-inputs .input-with-remove-btn');
        if(lengthInputs.length < 2){
            let closestElem = $(this).closest('.add-input-block-item').find('.add-input-block > .input-with-remove-btn');
            let cloneInput = closestElem.clone();
            cloneInput.find('> input').attr('name', 'phone' + count );

            $(this).closest('.add-input-block-item').find('.added-inputs').append(cloneInput);

            $(this).closest('.add-input-block-item').find('.added-inputs .input-with-remove-btn input').inputmask({
                // clearMaskOnLostFocus: false
                showMaskOnHover: false,
                definitions: {
                    'x': {
                        validator: "[1-9]"
                    },
                    '9': {
                        validator: "[0-9]"
                    }
                }
            });

            if(lengthInputs.length >= 1) $('.add-input-block .add-more').addClass('disabled');
        }else{
            $('.add-input-block .add-more').addClass('disabled');
        }

    });

    //remove input
    $(document).on('click', '.input-with-remove-btn .btn-close', function (e){
        $(this).closest('.input-with-remove-btn').remove();
        $('.add-input-block .add-more').removeClass('disabled');
    });

    //add class to checkbox
    $(document).on('change', '.select-icons .checkbox-entry input', function (e){
        if ($(this).is(':checked')){
            $(this).prop('checked', true);
            $(this).closest('.checkbox-entry').addClass('check')
        }
        else{
            $(this).prop('checked', false);
            $(this).closest('.checkbox-entry').removeClass('check')
        }
    });

    $('.select-icons .checkbox-entry').each(function(){
        if($(this).hasClass('check')){
            $(this).find('input[type=checkbox]').prop('checked', true)
        }
        else{
            $(this).find('input[type=checkbox]').prop('checked', false)
        }
    });

    //get phone value and social
    $(document).on('click', '#submitDealerPersonalData', function (e){
        e.preventDefault();

        let lengthInputs = $(document).find('.added-inputs .input-with-remove-btn');
        let phones = [];

        let defaultPhoneNumber = $('.add-input-block-item').find('> .input').val();
        let getDefaultCheckboxNames = [];

        $('.add-input-block-item .select-icons.default-icons .checkbox-entry.check').each(function(){
            let getDefaultSocialName = $(this).find('input').attr('name');
            getDefaultCheckboxNames.push(parseInt(getDefaultSocialName));
        });

        phones.push({phone: defaultPhoneNumber, icon: getDefaultCheckboxNames});

        lengthInputs.each(function(){
            let iconCount = $(this).find('.select-icons .checkbox-entry.check');
            let getPhone = $(this).find('> .input').val();

            let getCheckboxNames = [];

            iconCount.each(function(){
                let getSocialName = $(this).find('input').attr('name');

                getCheckboxNames.push(parseInt(getSocialName));
            });

            phones.push({phone: getPhone, icon: getCheckboxNames});

        });

        let values = $('#submitDealerPersonalDataForm *[name]');
        let data = {};
        values.each((index, el) => {
            data[$(el).attr('name')] = $(el).val();
        });
        data.phone_numbers = phones;

        $.ajax({
            type: "post",
            url: $(this).attr('action'),
            data: data,
            dataType: 'JSON',
            success: function (data) {
                window.location.href = data.redirect;
            },
            error: function (data) {
                console.log('error ',data);
            }
        });

        return false

    });

    $(document).on('click', '#page-form #page-form-btn', function () {
        $('.input-wrapp-name').find('.inputError').remove();
        $('.input-wrapp-phone').find('.inputError').remove();
        $('.input-wrapp-email').find('.inputError').remove();
        $('.input-wrapp-message').find('.inputError').remove();
        let values = $('#page-form *[name]');
        let data = {};

        // comment, street, department, apartment, house, district, city, last_name, first_name, email, phone, pay_type, delivery_type
        let config = {
            REGEX_PHONE: /^[0-9\ \+\(\)\/]+$/,
            REGEX_EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        }
        values.each((index, el) => {
            data[$(el).attr('name')] = $(el).val();
        });

        if (!data.name) {
            $('.input-wrapp-name').append(
                '<div class="inputError">Введіть ім’я</div>'
            );
        }
        if (!config.REGEX_PHONE.test(data.phone)) {
            $('.input-wrapp-phone').append(
                '<div class="inputError">Введіть номер телефону</div>'
            );
        }
        if (!data.email) {
            $('.input-wrapp-email').append(
                '<div class="inputError">Введіть електронну пошту</div>'
            );
        } else if(!config.REGEX_EMAIL.test(data.email)) {
            $('.input-wrapp-email').append(
                '<div class="inputError">Будь ласка введіть електронну адресу в форматі: email@mail.com</div>'
            );
        }
        if (!data.message) {
            $('.input-wrapp-message').append(
                '<div class="inputError">Введіть ваше запитання</div>'
            );
        }
        data.form_id = $(this).attr('form_id')

        let inputErr = $('#page-form').find('.inputError').length
        if(!inputErr) {
            $("#page-form-btn").attr("disabled", true);
            $.ajax({
                type: "post",
                url: '/addNewComment',
                data: data,
                dataType: 'JSON',
                success: function (data) {
                    window.location.replace(`${window.location.pathname}`);
                },
                error: function (data) {
                    console.log(data);
                }
            });
        }

        return false
    });

    // open/close cookies popup
    function setCookiePopup(){
        let isReadCookiesPopup = readCookie("isReadCookiesPopup");
        if(isReadCookiesPopup){
            document.getElementById("cookiesPopup").style.display = "none";
        }
    }
    setCookiePopup();

});
