const express = require('express');
const router = express.Router();
const {
  getPantryItems,
  getPantryItemById,
  addPantryItem,
  updatePantryItem,
  deletePantryItem
} = require('../controllers/pantryController');
const { protect } = require('../middleware/auth');

router.use(protect); // All pantry routes require authentication

router.route('/')
  .get(getPantryItems)
  .post(addPantryItem);

router.route('/:id')
  .get(getPantryItemById)
  .put(updatePantryItem)
  .delete(deletePantryItem);

module.exports = router;

