const salonService = require('../services/salon.service');







module.exports = {


    getSalesPerson: async (req, res) => {
        let id = req.params.id
        if (!id) {
            return res.status(403).json({ message: "User id not provided" });
        }
        let result = await salonService.getSalesPersons(id);

        return res.status(200).json(result);
    },

    createMessage: async (req, res) => {
        let { salon_id, sales_id, message } = req.body;


        if (!salon_id || !sales_id || !message) {
            res.status(403).json({ message: "Some field provided" });
        }

        let result = await salonService.MessageToSales({
            salon_id: salon_id,
            sales_id: sales_id,
            message: message
        })

        return res.status(200).json(result);

    },

    getSalonById: async (req, res) => {
        let id = req.params.id;
        if (!id) {
            return res.status(403).json({ message: "User id not provided" });
        }
        let result = await salonService.getSalonById(id);

        res.status(200).json(result);



    },
    updateSalonById: async (req, res) => {
        console.log("-------------------------");  let { billing_title, billing_address, billing_city, billing_zip, billing_nip, billing_first_name, billing_last_name, billing_phone, billing_email } = req.body;
        let id = req.headers.id;

         if(!billing_title || !billing_address  || !billing_city ||  !billing_zip || !billing_nip  || !billing_first_name || !billing_last_name || !billing_phone || !billing_email){
            res.status(403).json({ message: "Some field provided" });
         }
       
        let result = await salonService.updateSalonById({
            billing_title: billing_title,
            billing_address: billing_address,
            billing_city: billing_city,
            billing_zip: billing_zip,
            billing_nip: billing_nip,
            billing_first_name: billing_first_name,
            billing_last_name: billing_last_name,
            billing_phone: billing_phone,
            billing_email: billing_email
        }, { id: id })


        res.status(200).json(result);
    },

    getSalonAddressById: async (req,res)=>{
       let id = req.headers.id;

     if(!id){
        return res.status(403).json({ message: "User id not provided" });
     }
     
     let result = await salonService.getSalonAdressBySalonId(id);

     res.status(200).json(result);

    }








}