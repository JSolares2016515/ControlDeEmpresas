'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const key = '12345';

exports.createToken = (company) => {
    var payload = {
        sub: company._id,
        name: company.name,
        iat: moment().unix(),
        exp: moment().add(30, "minutes").unix()
    }

    return jwt.encode(payload, key);
}