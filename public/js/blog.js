
jQuery(function ($) {


    $(document).on('click', '.custom-pagination .item-pagination-blog', function(){

        console.log($(this).attr('data-id'))
        $('.custom-pagination .item-pagination').removeClass('active')

        $(this).addClass('active')
        let page =  $(this).attr('data-id')

        console.log('page', page)
        $.ajax({
            type: "post",
            url: '/blog/category',
            data:  { current_page : page , perPage : 6},
            dataType:'JSON',
            success: function (data)
            {
//                 let html='';
//                 data.posts.forEach(i => {
//                     let newHtml ='';
//                     console.log(i.image);
//                     if (i.lastObjStatus == 1) {
//                         // i.lastObj = i;
//                         newHtml += `
//                         <div class="col-md-6 col-xl-5">
//                                 <div class="post">
//                                     <div class="post-img"><a href="` + i.lastObj.id + `"><img src="` + i.lastObj.image + `" alt="" class="img"></a><span class="post-date">` + i.lastObj.createdAt +`</span></div>
//                                     <div class="post-info">
//                                         <a href="` + i.lastObj.id + `" class="h5 post-title d-block">` + i.lastObj.title +`</a>
//                                         <div class="post-excerpt text-truncate line-3">` + i.lastObj.subtitle +`</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         `
//                     }
//                     html += `
// <!--                    <div class="row cols-2" id="BlogAjax">-->
//                         <div class="col-md-6 col-xl-5 offset-xl-1">
//                             <div class="post">
//                                 <div class="post-img"><a href="` + i.id + `"><img src="` + i.image + `" alt="" class="img"></a><span class="post-date">` + i.createdAt +`</span></div>
//                                 <div class="post-info">
//                                     <a href="` + i.id + `" class="h5 post-title d-block">` + i.title +`</a>
//                                     <div class="post-excerpt text-truncate line-3">` + i.subtitle +`</div>
//                                 </div>
//                             </div>
//                         </div>`
//                     if(newHtml) html += newHtml;
//                 });

                // $('#BlogAjax').html(html)
                $('#BlogAjax').html(data.html)
                $('.custom-pagination').html(data.pagination)
                $('html, body').animate({ scrollTop: 0 }, 0);

            },
            error: function (data){

            }
        });
        return false
    });


});
