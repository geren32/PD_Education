// jQuery ajax form submit example, runs when form is submitted

    $(document).on("submit","#my_form", function(e){
  e.preventDefault(); // prevent actual form submit
    var form = $(this);
    //get submit url [replace url here if desired]
    $.ajax({
         type: "POST",
         url: 'http://localhost:3000/create_address',
         data: form.serialize(), // serializes form input
         success: function(data){
             console.log(data);
         }




    })
})

