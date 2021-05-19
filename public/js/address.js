$(document).on("submit","#billing_address", function(e){
    e.preventDefault(); // prevent actual form submit
      var form = $(this);
      console.log("sssssssssssssssssssss");
      //get submit url [replace url here if desired]
      $.ajax({
           type: "POST",
           url: 'http://localhost:3000/salonperson',
           data: form.serialize(), 
           processData: false,// serializes form input
           success: function(data){
               console.log("-------------------");
               console.log(data)
            if(data.message=="Sucess"){
           //closeSelf(data.message)
          location.reload();
           
            }
           }
  
  
  
  
      })
  })
        $(document).on("submit","#my_form", function(e){
    e.preventDefault(); // prevent actual form submit
      var form = $(this);
      console.log("sssssssssssssssssssss");
      //get submit url [replace url here if desired]
      $.ajax({
           type: "POST",
           url: 'http://localhost:3000/create_address',
           data: form.serialize(), 
           processData: false,// serializes form input
           success: function(data){
               console.log("-------------------");
               console.log(data)
            if(data.message=="Sucess"){
           //closeSelf(data.message)
          location.reload();
           
            }
           }
  
  
  
  
      })
  })
  
  
  $(document).on("click","#delete_btn",function(e){
  e.preventDefault();
  var selectedLanguage= []
  $('input[name="mycheckbox"]:checked').each(function() {
  selectedLanguage.push(this.value);
  });
  console.log(selectedLanguage)
  
  
    $.ajax({
           type: "POST",
           url: 'http://localhost:3000/deletesalon_address/'+selectedLanguage,
       
           success: function(){
               console.log("-------------------");
            console.log("loshara")
           // if(data.message=="Sucess"){
           //closeSelf(data.message)
          location.reload();
           
           // }
           }
  
  
  
  
      })
  
  })
  $(document).on("submit","#dane_do_factury", function(e){
    e.preventDefault(); // prevent actual form submit
      var form = $(this);
    
      //get submit url [replace url here if desired]
      $.ajax({
           type: "POST",
           url: 'http://localhost:3000/salonperson',
           data: form.serialize(), 
           processData: false,// serializes form input
           success: function(data){
           
            if(data.message=="Sucess"){
           //closeSelf(data.message)
          location.reload();
           
            }
           }
  
  
  
  
      })
  })

  $(document).on("submit","#mesage_to_sales", function(e){
    e.preventDefault(); // prevent actual form submit
      var form = $(this);
    
      //get submit url [replace url here if desired]
      $.ajax({
           type: "POST",
           url: 'http://localhost:3000/createmessage',
           data: form.serialize(), 
           processData: false,// serializes form input
           success: function(data){
           
            if(data.message=="Sucess"){
           //closeSelf(data.message)
          location.reload();
           
            }
           }
  
  
  
  
      })
  })
