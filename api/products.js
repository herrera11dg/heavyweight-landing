/* GET /api/products — catálogo + stock para el frontend */
const { listProducts } = require('../lib/products');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  res.status(200).json(listProducts());
};
