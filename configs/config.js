const appUtils = require('../utils/app-util');
const options = appUtils.getArgs();



module.exports = {
    //Roles
    SALON:'salon',
    CLIENT_ROLE: 'client',
    ADMIN: 'admin',
    SALES_PERSON_ROLE: 'salesperson',
    EDUCATOR_ROLE:'educator',
    SUPER_ADMIN_ROLE: 'superAdmin',

      

  
  SIX_MOUNTH_DATE: 15778800,
  
    
    JWT_SECRET_ADMIN: options['access-token-secret'] || 'uf7e^WaiUGFSA7fd8&^dadhADMIN',
    ACCESS_TOKEN_LIFETIME: options['access-token-lifetime'] || '30m',

    JWT_REFRESH_SECRET_ADMIN: options['refresh-token-secret'] || '3fhfsdjfkf$$uIEFSHFKdfADMIN',
    REFRESH_TOKEN_LIFETIME: options['refresh-token-lifetime'] || '5d',

    MAIL_HOST: options['mail-host'],
    MAIL_PORT: options['mail-port'] ,
    MAIL_USERNAME: options['mail-username'],
    MAIL_PASSWORD: options['mail-password'] ,
    MAIL_FROM: options['mail-from'] ,
    MAIL_SECURE: options['mail-secure'],
    MAIL_TLS: options['mail-tls'],
    MAIL_ANON: options['mail-anon'],

    FRONT_URL: options['front-url'],

    IMG_URL: options['front-url-img'],

    REGEX_EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    //REGEX_PASSWORD: /^(?=^[^\s]{8,16}$)(?=.*\d.*)(?=.*[a-z].*)(?=.*[A-Z].*)(?=.*[!@#$%^&*()_\-+=]).*$/,
    REGEX_PASSWORD: /^[0-9a-zA-Z!@#$%^&*]{6,}$/,
    REGEX_PHONE: /^[0-9\ \+\(\)\/]+$/,

    UPLOAD_IMAGE_TYPES: ['pages','banner','gallery','editor','blog', 'dealers'],


    DELIVERY_TYPES:{
        0: 'Самовивіз',
        1: 'Доставка у відділення Нова Пошта',
        2: 'Доставка у відділення УкрПошта',
        3: 'Адресна доставка',
    },
    CURRENCY_TYPES:{
        0: 'грн',
        1: 'євро'
    },

    PAY_TYPES:{
        0: 'Готівка',
        1: 'Онлайн оплата',
        2: 'Рахунок фактура'
    },

    // BOOKING_STATUSES:{
    //     0: 'Очікує підтвердження',
    //     1: 'Не розглянуто',
    //     2: 'Підтверджено',
    //     3: 'В опрацюванні',
    //     4: 'Скасовано'
    // },
    BOOKING_STATUSES:{
        0: 'Кошик',
        1: 'Нові',
        2: 'Обробляється',
        3: 'Виконано',
        4: 'Скасовано',
        5: 'Не вдалось'
    },

    GLOBAL_STATUSES:{
        DELETED: 0,
        ACTIVE: 1,
        BLOCKED: 2,
        WAITING: 3,
        DUPLICATE_POST:4
    },

    CHANGE_DATA_REQUEST_STATUSES:{
        0: 'Не розглянуто',
        1: 'Підтверджено',
        2: 'Скасовано'
    },
A: {
    "Ё": "yo", "Й": "i", "Ц": "ts", "У": "u", "К": "k", "Е": "e", "Н": "n", "Г": "g", "Ш": "sh", "Щ": "sch", "З": "z", "Х": "h", "Ъ": "'", "ё": "yo", "й": "i", "ц": "ts", "у": "u", "к": "k",
    "е": "e", "н": "n", "г": "g", "ш": "sh", "щ": "sch", "з": "z", "х": "h", "ъ": "'", "Ф": "f", "Ы": "i", "В": "v", "А": "a", "П": "p", "Р": "r", "О": "o", "Л": "l", "Д": "d", "Ж": "zh", "Э": "e", "ф": "f",
    "ы": "i", "в": "v", "а": "a", "п": "p", "р": "r", "о": "o", "л": "l", "д": "d", "ж": "zh", "э": "e", "Я": "ya", "Ч": "ch", "С": "s", "М": "m","І": "i","і": "i", "И": "i", "Т": "t", "Ь": "'", "Б": "b", "Ю": "yu", "я": "ya",
    "ч": "ch", "с": "s", "м": "m", "и": "i", "т": "t", "ь": "'", "б": "b", "ю": "yu", " ": "-"
}


}
