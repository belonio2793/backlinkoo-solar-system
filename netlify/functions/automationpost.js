// Simple alias to /automation for backward compatibility
const automation = require('./automation');

exports.handler = async (event, context) => {
  // Reuse automation handler directly
  return await automation.handler(event, context);
};
