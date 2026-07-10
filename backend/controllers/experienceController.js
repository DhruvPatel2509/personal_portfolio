const Experience = require('../models/Experience');
const handlerFactory = require('./handlerFactory');

module.exports = handlerFactory(Experience, 'Experience entry');
