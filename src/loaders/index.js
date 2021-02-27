const expressConfigLoader = require('./expressConfig');
const Logger = require('./logger');


module.exports = async (expressApp) => {
  Logger.info("Loading all configs...");

  await expressConfigLoader(expressApp);
  Logger.info('✌️ Express loaded');

}