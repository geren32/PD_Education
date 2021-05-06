const moment = require('moment');
const Handlebars = require('handlebars');

module.exports = {
    paginate: require('handlebars-paginate'),
    // register new function
    ifCond: function (v1, operator, v2, options) {

        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            case 'includes':
                return (v1.includes(v2)) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    },
    sliceStr: function (str) {
        return str.slice(0,10);
    },

    splitStr: function (str, symbol) {
        return str.split(symbol).shift();
    },

    formatDateTime: function (str, type) {
        let date;
        if(type === 1){
            date = moment(str).format('DD.MM.YYYY');
        }else if(type === 2){
            date = moment(str).format('DD.MM.YYYY, HH:mm');
        }else date = moment(str).format('DD.MM.YYYY, HH:mm:ss');
        return date;
    },

    items: function(n, block) {
        var accum = '';
        for(var i = 0; i < n; ++i) {
            block.data.index = i;
            block.data.first = i === 0;
            block.data.last = i === (n - 1);
            accum += block.fn(this);
        }
        return accum;
    },
    itemsFor: function(n, block) {
        var accum = '';
        for(var i = 0; i < n; ++i)
            accum += block.fn(i);
        return accum;
    },



    inc: function(value, options) {
        return parseInt(value) + 1;
    },

    concatArray: function(array, type) {
        let result = [];
        if(type === 1) result = array.map( i => {return ` ${i.region}`});
        if(type === 2) result = array.map( i => {return ` ${i.company_name}`});

        return result.toString();
    },

    isIn: function(value , array) {
        let result = false;
        if(array && array.length){
            array.map(i => {
                if(i.id === value) result = true;
            })
        }
        return result;
    },
    switch: function(value, options) {
        this.switch_value = value;
        this.switch_break = false;
        return options.fn(this);
    },
    case: function(value, options) {
        if (value == this.switch_value) {
            this.switch_break = true;
            return options.fn(this);
        }
    },
    default: function(value, options) {
        if (this.switch_break == false) {
            return value;
        }
    },

    genereteMediaIcons: function (arr) {
        let icons = '';
        arr = JSON.parse(arr);
        if(arr && arr.length){
            arr.forEach(i => {
                if(i == 1){
                    icons = icons + '<img src="/img/icons/whatsapp.svg" alt="">'
                }else if(i == 2){
                    icons = icons + '<img src="/img/icons/telegram.svg" alt="">'
                }else if(i == 3){
                    icons = icons + '<img src="/img/icons/viber.svg" alt="">'
                }else if(i == 4){
                    icons = icons + '<img src="/img/icons/messenger.svg" alt="">'
                }
            })
        }

        return new Handlebars.SafeString(icons);
    },

};
