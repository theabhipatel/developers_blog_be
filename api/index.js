/* eslint-disable */

/**
 * Vercel deploy entry handler, for serverless deployment, please don't modify this file
 */
const app = require("../dist/app.js").default;

module.exports = (req, res) => app(req, res);
