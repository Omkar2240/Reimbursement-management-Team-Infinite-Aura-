const chalk = require('chalk');
const cron = require('node-cron');

exports.scheduleJob = (cronExpression, message, callback) => {
  cron.schedule(
    cronExpression,
    async () => {
      console.log(
        chalk.green(`Running scheduled job for ${message}`),
        chalk.yellow(`${new Date()}`)
      );
      callback();
    },
    { timezone: 'Asia/Kolkata' }
  );
};
