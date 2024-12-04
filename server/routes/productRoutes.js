const express = require('express');
const router = express.Router();
const { getRequiredProducts, getProductsFromAmazon } = require('../coreFunctions');

router.post('/generate-products', async (req, res) => {
  const { needQuery } = req.body;
  try {
    const products = await getRequiredProducts(needQuery);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error generating products' });
  }
});

router.post('/scrape-products', async (req, res) => {
  const { selectedProducts } = req.body;
  try {
    const scrapedData = await getProductsFromAmazon(selectedProducts);
    res.json(scrapedData);
  } catch (error) {
    res.status(500).json({ error: 'Error scraping products' });
  }
});

module.exports = router;
