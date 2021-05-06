const handlebars = require('handlebars');
const helpers = require('./handebar-helpers');
handlebars.registerHelper(helpers);
const fs = require('fs');


module.exports = {

    // generate template
    getTemplate: async(data, type) => {
        let file = await fs.readFileSync(`views/${type}.hbs`);
        let source = file.toString();
        let template = handlebars.compile(source);
        return await template(data);
    }


}
