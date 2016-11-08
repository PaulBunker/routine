let mongoose = require('mongoose');
let mockgoose= require('mockgoose');

mockgoose(mongoose);

/*
 * Creates and/or connects to a mongo test database in memory
 * @param {function} cb callback function
 * @returns {void}
 */
module.exports.createDB = (cb) => {
  "use strict";
  mongoose.connect('mongodb://localhost/test', cb);
};

/*
 * Disconnects from and destroys the mongo test database in memory
 * @returns {void}
 */
module.exports.destroyDB = () => {
  "use strict";
  mongoose.disconnect();
};