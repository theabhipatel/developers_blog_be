/**
 * Vercel deploy entry handler, for serverless deployment, please don't modify this file
 */
import app from "../dist/app";

module.exports = (req, res) => {
  return app(req, res);
};
