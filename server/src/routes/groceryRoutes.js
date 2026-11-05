const express = require('express');
const router = express.Router();
const {
  getGroceryItems,
  addGroceryItem,
  updateGroceryItem,
  deleteGroceryItem,
  clearPurchasedItems,
  purchaseAndTransferToPantry
} = require('../controllers/groceryController');
const { protect } = require('../middleware/auth');

router.use(protect); // All grocery routes require authentication

router.route('/')
  .get(getGroceryItems)
  .post(addGroceryItem);

router.delete('/clear-purchased', clearPurchasedItems);

router.route('/:id')
  .put(updateGroceryItem)
  .delete(deleteGroceryItem);

router.patch('/:id/purchase', purchaseAndTransferToPantry);

module.exports = router;

