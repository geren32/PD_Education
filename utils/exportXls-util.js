const ExcelJS = require('exceljs');

module.exports = {

    exportXlsClientsForDealer: async (clients) => {

    let file = new ExcelJS.Workbook();
    let sheet = file.addWorksheet('Sheet');
    let worksheet = file.getWorksheet('Sheet');
    worksheet.columns = [
        { header: '№ CRM', key: 'number', width: 20 },
        { header: 'Прізвище ім’я', key: 'firstLastName', width: 32 },
        { header: 'Компанія', key: 'company', width: 20 },
        { header: 'Телефон', key: 'phone', width: 20 },
        { header: 'Ел. пошта', key: 'email', width: 20 },
        { header: 'Дата реєстрації', key: 'registration', width: 20 },
        { header: 'Статус кабінету', key: 'statusOfCabinet', width: 20 }
    ];

    for (let j = 0; j < clients.length; j++) {
        let client = clients[j];

        worksheet.addRow({
            number: client.client &&  client.client.crm_number ? client.client.crm_number : '',
            firstLastName: (client.last_name || client.first_name) ? client.last_name + ' ' + client.first_name : '',
            company: client.client && client.client.company_name  ? client.client.company_name : '',
            phone: client.phone ? client.phone : '',
            email: client.email ? client.email : '',
            registration: client.createdAt ? client.createdAt : '',
            statusOfCabinet: client.status ? client.status : '',
        });
    }
    // write to a new buffer
    file = await file.xlsx.writeBuffer();

    return file;
    },

    exportXlsOrdersForDealer: async (orders) => {

        let file = new ExcelJS.Workbook();
        let sheet = file.addWorksheet('Sheet');
        let worksheet = file.getWorksheet('Sheet');
        worksheet.columns = [
            { header: '№', key: 'number', width: 20 },
            { header: 'Дата замовлення', key: 'createdAt', width: 20 },
            { header: 'Компанія', key: 'company', width: 20 },
            { header: 'Клієнт', key: 'firstLastName', width: 32 },
            { header: 'Телефон', key: 'phone', width: 20 },
            { header: 'Ел. пошта', key: 'email', width: 20 },
            { header: 'Тип доставки', key: 'orderType', width: 20 },
            { header: 'Адрес доставки', key: 'orderAddress', width: 20 },
            { header: 'Сума', key: 'total', width: 20 },
            { header: 'Статус', key: 'status', width: 20 },
            { header: 'Коментар', key: 'comment', width: 20 },
        ];

        for (let j = 0; j < orders.length; j++) {
            let order = orders[j];

            worksheet.addRow({
                number: order.id  ? order.id : '',
                createdAt: order.date ? order.date : '',
                company: order.company_name ? order.company_name : '',
                firstLastName: ( order.address && (order.address.last_name || order.address.first_name)) ? order.address.last_name + ' ' + order.address.first_name : '',
                phone: order.address && order.address.phone ? order.address.phone : '',
                email: order.address && order.address.email ? order.address.email : '',
                orderType: order.address && order.address.delivery_type ? order.address.delivery_type : '',
                orderAddress: order.address ? `${order.address.city}, ${order.address.street}, ${order.address.apartment}` : '',
                total: order.total_price ? order.total_price : '',
                status: order.status ? order.status : '',
                comment: order.comment ? order.comment : '',
            });
        }
        // write to a new buffer
        file = await file.xlsx.writeBuffer();

        return file;
    },

    exportXlsClientsForSR: async (clients) => {
        let file = new ExcelJS.Workbook();
        let sheet = file.addWorksheet('Sheet');
        let worksheet = file.getWorksheet('Sheet');
        worksheet.columns = [
            { header: '№ CRM', key: 'number', width: 20 },
            { header: 'Дата реєстрації', key: 'registration', width: 20 },
            { header: 'Прізвище ім’я', key: 'firstLastName', width: 32 },
            { header: 'Компанія', key: 'company', width: 20 },
            { header: 'Телефон', key: 'phone', width: 20 },
            { header: 'Ел. пошта', key: 'email', width: 20 },
            { header: 'Дилер', key: 'dealer', width: 20 },
            { header: 'Область дилера', key: 'dealerAddress', width: 20 },
            { header: 'Статус кабінету', key: 'statusOfCabinet', width: 20 }
        ];

        for (let j = 0; j < clients.length; j++) {
            let client = clients[j];

            worksheet.addRow({
                number: client.client &&  client.client.crm_number ? client.client.crm_number : '',
                registration: client.createdAt ? client.createdAt : '',
                firstLastName: (client.last_name || client.first_name) ? client.last_name + ' ' + client.first_name : '',
                company: client.client && client.client.company_name  ? client.client.company_name : '',
                phone: client.phone ? client.phone : '',
                email: client.email ? client.email : '',
                dealer: client.client && client.client.dealer && client.client.dealer.company_name ? client.client.dealer.company_name : '',
                dealerAddress: client.client && client.client.dealer && client.client.dealer.user && client.client.dealer.user.region_activity && client.client.dealer.user.region_activity.region  ? client.client.dealer.user.region_activity.region : '',
                statusOfCabinet: client.status ? client.status : '',
            });
        }
        // write to a new buffer
        file = await file.xlsx.writeBuffer();

        return file;
    },

    exportXlsOrdersForSR: async (orders) => {

        let file = new ExcelJS.Workbook();
        let sheet = file.addWorksheet('Sheet');
        let worksheet = file.getWorksheet('Sheet');
        worksheet.columns = [
            { header: '№', key: 'number', width: 20 },
            { header: 'Дата замовлення', key: 'createdAt', width: 20 },
            { header: 'Дилер', key: 'dealer', width: 20 },
            { header: 'Область дилера', key: 'dealerAddress', width: 20 },
            { header: 'Компанія', key: 'company', width: 20 },
            { header: 'Клієнт', key: 'firstLastName', width: 32 },
            { header: 'Телефон', key: 'phone', width: 20 },
            { header: 'Ел. пошта', key: 'email', width: 20 },
            { header: 'Тип доставки', key: 'orderType', width: 20 },
            { header: 'Адрес доставки', key: 'orderAddress', width: 20 },
            { header: 'Сума', key: 'total', width: 20 },
            { header: 'Статус', key: 'status', width: 20 },
            { header: 'Коментар', key: 'comment', width: 20 },
        ];

        for (let j = 0; j < orders.length; j++) {
            let order = orders[j];

            worksheet.addRow({
                number: order.id  ? order.id : '',
                createdAt: order.date ? order.date : '',
                dealer: order.dealer && order.dealer.company_name ? order.dealer.company_name : '',
                dealerAddress: order.dealer && order.dealer.user && order.dealer.user.region_activity && order.dealer.user.region_activity.region  ? order.dealer.user.region_activity.region : '',
                company: order.company_name ? order.company_name : '',
                firstLastName: ( order.address && (order.address.last_name || order.address.first_name)) ? order.address.last_name + ' ' + order.address.first_name : '',
                phone: order.address && order.address.phone ? order.address.phone : '',
                email: order.address && order.address.email ? order.address.email : '',
                orderType: order.address && order.address.delivery_type ? order.address.delivery_type : '',
                orderAddress: order.address ? `${order.address.city}, ${order.address.street}, ${order.address.apartment}` : '',
                total: order.total_price ? order.total_price : '',
                status: order.status ? order.status : '',
                comment: order.comment ? order.comment : '',
            });
        }
        // write to a new buffer
        file = await file.xlsx.writeBuffer();

        return file;
    },

    exportXlsOrderDetail: async (orderData, booking) => {

        let file = new ExcelJS.Workbook();
        let sheet = file.addWorksheet('Sheet');
        let worksheet = file.getWorksheet('Sheet');

        for (let r = 0; r < orderData.length; r++) {
            let row = worksheet.getRow(r+1);
            row.getCell(1).value = Object.keys(orderData[r])[0];
            row.getCell(2).value = Object.values(orderData[r])[0];
        }


        worksheet.getRow(17).values = ['Назва товару', '№ SKU', 'Опис', 'К-ть', 'Ціна'];

        worksheet.columns = [
            { key: 'Назва товару'},
            { key: '№ SKU'},
            { key: 'Опис'},
            { key: 'К-ть'},
            { key: 'Ціна'}
        ]

        for (let i = 0; i < booking.orders.length; i++) {
            let order = booking.orders[i];

            worksheet.addRow({
                'Назва товару': order.product && order.product.name ? order.product.name : '',
                '№ SKU': order.product && order.product.product_variations && order.product.product_variations[0] && order.product.product_variations[0].sku ? order.product.product_variations[0].sku : order.product.sku,
                'Опис': order.product && order.product.description ? order.product.description : '',
                'К-ть': order.count,
                'Ціна': order.price ? order.price + ' грн' : '',
            });
        }

        // write to a new buffer
        file = await file.xlsx.writeBuffer();

        return file;
    },



}
