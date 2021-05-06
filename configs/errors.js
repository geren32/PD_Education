

module.exports = {
    // 400
    BAD_REQUEST_ID_NOT_FOUND: {
        message: 'Помилка! Об’єкта з вказаним id не знайдено',
        code: 400
    },
    BAD_REQUEST_REGION_ALLREADY_EXIST: {
        message: 'Помилка! Область вже створена',
        code: 400
    },
    BAD_REQUEST_USER_EMAIL_EXIST: {
        message: 'Помилка! Користувач з такою електронною адресою вже створений',
        code: 400
    },
    BAD_REQUEST_USER_EMAIL_NOT_VALID: {
        message: 'Помилка! Будь ласка введіть електронну адресу в форматі: email@mail.com',
        code: 400
    },
    BAD_REQUEST_USER_PHONE_EXIST: {
        message: 'Помилка! Користувач з таким номером телефону вже створений',
        code: 400
    },
    BAD_REQUEST_CLIENT_CRM_NUMBER_EXIST: {
        message: 'Помилка! Користувач з таким CRM номером вже створений',
        code: 400
    },
    BAD_REQUEST_USER_PHONE_NOT_VALID: {
        message: 'Помилка! Будь ласка вкажіть номер телефону у форматі +38 (099) 000 00 00',
        code: 400
    },
    BAD_REQUEST_USER_CONFIRM_PASSWORD_NOT_MATCH: {
        message: 'Помилка! Пароль не збігається, будь ласка підтвердіть пароль',
        code: 400
    },
    BAD_REQUEST_USER_PASSWORD_NOT_VALID: {
        message: 'Помилка! Пароль не відповідає вимогам(щонайменше 8 символів і не більше 16 символів і як мінімум одна велика і одна мала літери і один доступний символ:!@#$%^&*()_\-+= і лише латинські літери і як мінімум одна цифра)',
        code: 400
    },
    BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI: {
        message: 'Помилка! Будь ласка заповніть всі обовязкові поля',
        code: 400
    },
    BAD_REQUEST_NOT_VALID_USER: {
        message: 'User object is not valid',
        code: 4002
    },

    //404
    NOT_FOUND_USER: {
        message: 'User mot found',
        code: 4041
    }

}
