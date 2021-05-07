
const sequelize = require('../sequelize-orm');
const invoceService = require("../services/invoice.service");
const salonService = require('../services/salon.service');

module.exports = {

     createInvoces: async (req, res) => {
          let { date, due_data, status, number, price, downloaded, order_id, salon_id } = req.body;

          if (!date || !due_data || !status || !number || !price || !downloaded || !order_id || !salon_id) {
               res.status(403).json({ message: "Some field provided" });
          }
          let result = await invoceService.createInvoce({ date, due_data, status, number, price, downloaded, order_id, salon_id });

          return res.status(200).json(result);

     },
     editInvoiceById: async (req, res) => {
          let id = req.params.id;
          let { date, due_data, status, number, price, order_id, salon_id, invoice_id } = req.body;
          let downloaded = Math.floor(new Date().getTime() / 1000);
          if (!id) {
               return res.status(403).json({ message: "Invoice id not provided" });

          }
          let result = await invoceService.editInvoceById({ date, due_data, status, number, price, order_id, salon_id, invoice_id, downloaded }, id);

          return res.status(200).json(result);

     },
     deleteInvoiceById: async (req, res) => {
          let id = req.params.id;
          if (!id) {
               return res.status(403).json({ message: "Booking id not provided" });
          }
          let result = await invoceService.deleteInvoiceById(id);
          return res.status(200).json(result);

     },
     getAllInvoice: async (req,res)=>{
     
     let result= await invoceService.getAllInvoice();
 console.log(result);
     return res.status(200).json(result);

     },
     getAllSales :async (req,res)=>{
    let id= req.params.id;


    let result = await salonService.getAllSabic(id);


    return res.status(200).json(result);

     }



}