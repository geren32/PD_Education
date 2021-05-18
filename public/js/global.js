var _functions = {}, winWidth;

jQuery(function($) {

	"use strict";

  /* function on page ready */
  var isTouchScreen = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);
  if (isTouchScreen) $('html').addClass('touch-screen');
  var winScr, winHeight,
      is_Mac = navigator.platform.toUpperCase().indexOf('MAC') >= 0,
      is_IE = /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /Edge\/\d+/.test(navigator.userAgent),
      is_Chrome = navigator.userAgent.indexOf('Chrome') >= 0 && navigator.userAgent.indexOf('Edge') < 0;

  /* check browser */
  winWidth = $(window).width();
  winHeight = $(window).height();

  if(is_Mac){$('html').addClass('mac');}
  if(is_IE){$('html').addClass('ie');}
  if(is_Chrome){$('html').addClass('chrome');}

  /* page loader and etc */
  if($('.select-box').length){
    $('.SelectBox').SumoSelect();
  }

  //rellax
  if(!is_IE && $('.rellax').length && $(window).width() > 1199){
    var rellax = new Rellax('.rellax', {
      center: true
    });
    new WOW().init();

  }

  setTimeout( function(){
    $('body').addClass('site-ready');
  },1000);

	/* function on page scroll */
	$(window).scroll(function(){
		_functions.scrollCall();
	});

  _functions.scrollCall = function() {
    winScr = $(window).scrollTop();
    if(winScr > 10) {
      $('header').addClass('scrolled');
    } else {
      $('header').removeClass('scrolled');
    }
  }

  /*menu*/
  $('.mobile-button').on('click', function(){
    $(this).toggleClass('active');
    $('html').toggleClass('overflow-menu');
    $('header').toggleClass('active-layer-close');
    $('.mobile-menu').toggleClass('open');
  });

  //layer close
  $('.layer-close').on('click', function(){
    $('.mobile-button').removeClass('active');
    $('html').removeClass('overflow-menu');
    $('header').removeClass('active-layer-close');
    $('.mobile-menu').removeClass('open');
  });

  //custom-input-number
  $('.custom-input-number .increment').on('click',function(){
    var $input = $(this).siblings('.input-field'),
    val = parseInt($input.val()),
    max = parseInt($input.attr('max')),
    step = parseInt($input.attr('step'));
    var temp = val + step;
    $input.val(temp <= max ? temp : max);
  });

  $('.custom-input-number .decrement').on('click',function(){
    var $input = $(this).siblings('.input-field'),
    val = parseInt($input.val()),
    min = parseInt($input.attr('min')),
    step = parseInt($input.attr('step'));
    var temp = val - step;
    $input.val(temp >= min ? temp : min);
  });

  //fail Input
  $('.input').on('keyup', function(){
    if($(this).val()){
      $(this).parent('.input-field-wrapp').removeClass('fail');
    }
    else{$(this).parent('.input-field-wrapp').addClass('fail');}
  });

  //telephone mask
  $('.input[type="tel"]').on('focus', function(){
    $(this).inputmask("+38 (999) 999 - 9999",{ "placeholder": "+38 (ххх) ххх - хххх" });
  });

  /* swiper sliders */
  _functions.getSwOptions = function(swiper){
    var options = swiper.data('options');
        options = (!options || typeof options !=='object') ? {} : options;
        var $p = swiper.closest('.swiper-entry'),
            slidesLength = swiper.find('>.swiper-wrapper>.swiper-slide').length;
    if(!options.pagination) options.pagination = {
      el: $p.find('.swiper-pagination')[0],
      clickable: true
    };
    if(!options.navigation) options.navigation = {
      nextEl: $p.find('.swiper-button-next')[0],
      prevEl: $p.find('.swiper-button-prev')[0]
    };
    options.preloadImages = false;
    options.lazy = {loadPrevNext: true};
    options.observer = true;
    options.observeParents = true;
    options.watchOverflow = true;
    if(!options.speed) options.speed = 500;
    options.roundLengths = false;
    if(!options.centerInsufficientSlides) options.centerInsufficientSlides = false;
    if(isTouchScreen) options.direction = "horizontal";
    return options;
  };

  _functions.initSwiper = function(el){
    var swiper = new Swiper(el[0], _functions.getSwOptions(el));
  };

  $('.swiper-entry .swiper-container').each(function(){
    _functions.initSwiper($(this));
  });

  //popup
  var popupTop = 0;
  function removeScroll(){
    popupTop = $(window).scrollTop();
    $('html').css({
      "position": "fixed",
      "top": -$(window).scrollTop(),
      "width": "100%"
    });
  }
  function addScroll(){
    $('html').css({
      "position": "static"
    });
    window.scroll(0, popupTop);
  }
  _functions.openPopup = function(popup){
    $('.popup-content').removeClass('active');
    $(popup + ', .popup-wrapper').addClass('active');
    removeScroll();
  };

	_functions.closePopup = function(){
		$('.popup-wrapper, .popup-content').removeClass('active');
		addScroll();
	};

	_functions.textPopup = function(title, description){
		$('#text-popup .text-popup-title').html(title);
		$('#text-popup .text-popup-description').html(description);
		_functions.openPopup('#text-popup');
	};

	$(document).on('click', '.open-popup', function(e){
		e.preventDefault();
    _functions.openPopup('.popup-content[data-rel="' + $(this).data('rel') +'"]');
	});

	$(document).on('click', '.popup-wrapper .btn-close, .popup-wrapper .layer-close, .popup-wrapper .close-popup', function(e){
		e.preventDefault();
		_functions.closePopup();
	});

  //close popup with ESCAPE key
  $(document).keyup(function(e){
    if (e.keyCode === 27 ){
      _functions.closePopup();
    }
  });

  function pageScroll(current,headerHeight){
    if($(window).width() > 991){
      $('html, body').animate({scrollTop: current.offset().top - 90}, 888);
    }
    else{
      $('html, body').animate({scrollTop: current.offset().top - 59}, 777);
    }
  }

  //scroll animation
  $(window).on('scroll load', function () {
    if ($('.animate-item').length && (!isTouchScreen || $(window).width() >= 1200)) {
      $('.animate-item').not('.animated').each(function () {
        var th = $(this);
        if ($(window).scrollTop() >= th.offset().top - ($(window).height() * 0.7)) {
          th.addClass('animated');
        }
    });
    }
  });

  //anchor scroll
  $(function() {
    $('a[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top - 170
          }, 1000);
          $('.mobile-button').removeClass('active');
          $('html').removeClass('overflow-menu');
          $('header').removeClass('open-menu');
          return false;
        }
      }
    });
  });


  //accordion
  $(document).on('click', '.accordion:not(.employment-accord) .accordion-item .accordion-title', function () {
    var headerHeight = $('header').height(),
        current = $(this);
    if($(this).hasClass('active')){
      $(this).removeClass('active').next().slideUp();
    }
    else {
      $(this).closest('.accordion').find('.accordion-title').not(this).removeClass('active').next().slideUp();
      $(this).addClass('active').next().slideDown();
    }
  });

  // toggle slide
  $(document).on('click', '.tools-bar__link', function (e) {
    $(this).parent().toggleClass('active');
    $(this).parent().find('.tools-bar__content').slideToggle();
    $(this).toggleClass('active');
  });

  //tabs
  // $('.tab-title').on('click', function () {
  //   $(this).parent().toggleClass('active');
  //   $(this).parent().find('.tab-toggle').slideToggle();
  // });

  $(document).on('click', '.tab-toggle div', function () {
    var tab = $(this).closest('.tabs').find('.tab');
    var i = $(this).index();
    $(this).addClass('active').siblings().removeClass('active');
    tab.eq(i).siblings('.tab:visible').fadeOut(function () {
      tab.eq(i).fadeIn();
    });
  });

  $('.menu-wrapper').on('click', function () {
    $('.hamburger-menu').toggleClass('animate');
    $('.tools-bar').toggleClass('active');
    $('.section-content').toggleClass('active');
  });

  $('.contains-links').on('click', function(){
    $(this).toggleClass('active');
  });

  $( ".open-header-nav" ).click(function() {
    $('.header-menu').toggleClass('active');
  });

  $(".scroll-top").click(function() {
    $("html, body").animate({
        scrollTop: $('html, body').offset().top,
    }, 300);
    return true;
  });

  // checkout tabs
  $('.toggle-block-control').on('change', function () {
    let blockNum = $(this).data('block'),
        rel = $(this).data('rel'),
        $showBlock = $('.toggle-block[data-block="' + blockNum + '"][data-rel="' + rel + '"]'),
        $hideBlock = $('.toggle-block[data-block="' + blockNum + '"]:visible');

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


  // datepicker
  $( function() {
    $( "#datepicker" ).datepicker();
  } );

// chart
  var canvas = document.getElementById("barChart");
  var ctx = canvas.getContext('2d');

// Data with datasets options
  var data = {
    labels: ["Kevin", "Color.me", "Showpony"],
    datasets: [
      {
        label: "Statystyki",
        fill: true,
        backgroundColor: [
          'blue',
          'orange',
          'grey'],
        data: [2500, 2000, 1500]
      }
    ]
  };

// Notice how nested the beginAtZero is
  var options = {
    title: {
      display: true,
      text: '',
      position: 'bottom'
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    }
  };

// Chart declaration:
  var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
  });
// chart


});
