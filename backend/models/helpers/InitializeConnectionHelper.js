const { scheduleCron } = require('../../routes/listeners/Scheduler');

module.exports = (server, app) => {
  scheduleCron();
};
