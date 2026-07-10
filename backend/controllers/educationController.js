const Education = require('../models/Education');
const handlerFactory = require('./handlerFactory');

module.exports = handlerFactory(Education, 'Education entry');
