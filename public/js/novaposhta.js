 

 jQuery(function ($) {
    $( "#citys" ).autocomplete({
        source: function( request, response ) {
          $.ajax({
            type:'POST',
          url: 'https://api.novaposhta.ua/v2.0/json/', 
        
          dataType: 'json',
          data: JSON.stringify({
            modelName: 'Address',
            calledMethod: 'searchSettlements',
            methodProperties: {
              CityName: request.term,
              Limit: 555
            },
            apiKey: 'ba4cdd4fb9e2e353acde84ea8e5b6a94'
          }),
            success: function( data ) {
               if(!data.data.length) return
                var list = new Set();
              for(let key of data.data[0].Addresses ){
                list.add(key.MainDescription);
              }
              list = [...list];
          
            response(list);
            }
        });
    }
      
    });

    
   


      


 })
  var selectes=document.getElementById('citys');
    
  $(document).on('change','#citys',function(e){
      var optionSelected= $('option:selected',this);
      var valueSelected= this.value;
     
     var props= {
        "modelName": "AddressGeneral",
        "calledMethod": "getWarehouses",
        "methodProperties": {
             "CityName":valueSelected,
             "limit":'300'
        },
        "apiKey": "ba4cdd4fb9e2e353acde84ea8e5b6a94"
    }
      
       $.ajax({
              type:'POST',
      url: 'https://api.novaposhta.ua/v2.0/json/', 
      beforeSend: function (xhrObj) {
                  xhrObj.setRequestHeader('Content-Type', 'application/json');
              },
      dataType: 'json',
      data: JSON.stringify(props)
        }).done(function( data ) {
        
           $('#myselect').empty();
           
            var sel= document.getElementById('myselect')
         
            console.log(data.data.length);
            if(!data.data.length){

              sel.append( new Option(" "))
            
         
            }
    else      

    // $('#checkoutBtn').prop('disabled',false);

            for(var i=0;i<data.data.length;i++){  
          
              sel.append(new Option(data.data[i].Description,data.data[i].CityRef))
            }
          });
      })

      jQuery('#citys').on('keydown', function(e) {
        if( e.which == 8 || e.which == 46 ) return  $('#myselect').empty();
       
    });
//  $(document).on('click','#checkoutBtn',function(e){
//   // e.preventDefault();
//  if( $(this).prop('disabled', true))
//   {
//   alert('Button Disabled')
//   }
//             })