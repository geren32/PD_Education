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
        let { billing_title, billing_address, billing_city, billing_zip, billing_nip, billing_first_name, billing_last_name, billing_phone, billing_email } = req.body;
        let id = req.headers.id;

        if (!billing_title || !billing_address || !billing_city || !billing_zip || !billing_nip || !billing_first_name || !billing_last_name || !billing_phone || !billing_email) {
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

    getSalonAddressById: async (req, res) => {
        let id = req.headers.id;
        let result = await salonService.getSalonAdressBySalonId(id);
        if (!result) {
            return res.status(403).json({ message: "User id not provided" });
        }



        res.status(200).json(result);

    },

    editSalonAddressById: async (req, res) => {
        let id = req.params.id;
        let { title, address, city, zip, first_name, last_name, phone, phone_contact, email, email_contact } = req.body;


        let result = await salonService.editSalonAddressById({ title, address, city, zip, first_name, last_name, phone, phone_contact, email, email_contact }, { id: id });

        return res.status(200).json(result);

    },
    deleteSalonAddressById: async (req, res) => {
        let id = req.params.id

        let result = await salonService.deleteSalonAddressId(id);
        if (!result) {
            return res.status(403).json({ message: " id not provided" });

        }
        return res.status(200).json(result);

    },

    checkSalonBrands: async (req, res) => {
        let id = req.headers.id;
        let result = await salonService.getSalonBrands(id);
        if (!result) {
            return res.status(403).json({ message: "User id not provided" });

        }

        return res.status(200).json(result);
    },
    checkPromotionsofBrands: async (req, res) => {
        let id = req.headers.id;
        let result = await salonService.getBrandPromotions(id);

        if (!result) {
            return res.status(403).json({ message: "Brand id not provided" });
        }
        return res.status(200).json(result);






    }







}