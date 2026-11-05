const GroceryItem = require('../models/GroceryItem');
const PantryItem = require('../models/PantryItem');
const { normalizeName } = require('../utils/normalize');
const { calculateExpiryStatus } = require('../utils/expiryHelper');
const { areUnitsCompatible, convertQuantity } = require('../utils/unitConverter');

// @desc    Get all grocery items for logged-in user
// @route   GET /api/grocery
// @access  Private
const getGroceryItems = async (req, res, next) => {
  try {
    const { purchased } = req.query;
    const filter = { userId: req.user._id };

    if (purchased !== undefined) {
      filter.purchased = purchased === 'true';
    }

    const items = await GroceryItem.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add one or multiple items to grocery list (including missing recipe ingredients)
// @route   POST /api/grocery
// @access  Private
const addGroceryItem = async (req, res, next) => {
  try {
    const { name, quantity, unit, items, category } = req.body;

    // Handle batch addition (e.g. from recipe "Add missing ingredients")
    if (items && Array.isArray(items) && items.length > 0) {
      const createdItems = [];
      for (const itemData of items) {
        const itemName = itemData.name;
        const itemQty = itemData.quantity || itemData.missingQuantity || itemData.requiredQuantity;
        if (!itemName || !itemQty) continue;

        const norm = normalizeName(itemName);
        const parsedQty = Math.max(0.1, parseFloat(itemQty) || 1);
        const itemUnit = itemData.unit || 'pieces';

        // Check if item is already in active grocery list
        const existing = await GroceryItem.findOne({
          userId: req.user._id,
          normalizedName: norm,
          purchased: false
        });

        if (existing) {
          // If units match or are compatible, increase quantity
          if (areUnitsCompatible(existing.unit, itemUnit)) {
            const addedInExistingUnit = convertQuantity(parsedQty, itemUnit, existing.unit);
            existing.quantity = Math.round((existing.quantity + addedInExistingUnit) * 100) / 100;
          } else {
            existing.quantity += parsedQty;
          }
          await existing.save();
          createdItems.push(existing);
        } else {
          const newItem = await GroceryItem.create({
            userId: req.user._id,
            name: itemName.trim(),
            normalizedName: norm,
            quantity: parsedQty,
            unit: itemUnit,
            category: itemData.category || 'Other'
          });
          createdItems.push(newItem);
        }
      }

      return res.status(201).json({
        success: true,
        message: `Added ${createdItems.length} items to your grocery list.`,
        data: createdItems
      });
    }

    // Single item addition
    if (!name || !quantity || !unit) {
      return res.status(400).json({
        success: false,
        message: 'Please provide item name, quantity, and unit'
      });
    }

    const norm = normalizeName(name);

    // Check if existing pending item exists
    const existing = await GroceryItem.findOne({
      userId: req.user._id,
      normalizedName: norm,
      purchased: false
    });

    if (existing) {
      if (areUnitsCompatible(existing.unit, unit)) {
        const added = convertQuantity(parseFloat(quantity), unit, existing.unit);
        existing.quantity = Math.round((existing.quantity + added) * 100) / 100;
      } else {
        existing.quantity += parseFloat(quantity);
      }
      await existing.save();

      return res.status(200).json({
        success: true,
        message: `Updated quantity for ${existing.name}`,
        data: existing
      });
    }

    const newItem = await GroceryItem.create({
      userId: req.user._id,
      name: name.trim(),
      normalizedName: norm,
      quantity: Math.max(0.1, parseFloat(quantity)),
      unit,
      category: category || 'Other'
    });

    return res.status(201).json({
      success: true,
      message: `${newItem.name} added to grocery list`,
      data: newItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update grocery item
// @route   PUT /api/grocery/:id
// @access  Private
const updateGroceryItem = async (req, res, next) => {
  try {
    const item = await GroceryItem.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Grocery item not found'
      });
    }

    const { name, quantity, unit, purchased } = req.body;

    if (name) {
      item.name = name.trim();
      item.normalizedName = normalizeName(name);
    }
    if (quantity !== undefined) item.quantity = Math.max(0.01, parseFloat(quantity));
    if (unit) item.unit = unit;
    if (purchased !== undefined) item.purchased = purchased;

    await item.save();

    return res.status(200).json({
      success: true,
      message: 'Grocery item updated',
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete grocery item
// @route   DELETE /api/grocery/:id
// @access  Private
const deleteGroceryItem = async (req, res, next) => {
  try {
    const item = await GroceryItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Grocery item not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: `${item.name} removed from grocery list`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all purchased items
// @route   DELETE /api/grocery/clear-purchased
// @access  Private
const clearPurchasedItems = async (req, res, next) => {
  try {
    const result = await GroceryItem.deleteMany({
      userId: req.user._id,
      purchased: true
    });

    return res.status(200).json({
      success: true,
      message: `Cleared ${result.deletedCount} purchased items`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark grocery item as purchased AND transfer to pantry
// @route   PATCH /api/grocery/:id/purchase
// @access  Private
const purchaseAndTransferToPantry = async (req, res, next) => {
  try {
    const { expiryDate, category } = req.body;

    const groceryItem = await GroceryItem.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!groceryItem) {
      return res.status(404).json({
        success: false,
        message: 'Grocery item not found'
      });
    }

    // Prevent duplicate pantry transfer
    if (groceryItem.purchased && groceryItem.transferredToPantry) {
      return res.status(200).json({
        success: true,
        message: 'Item has already been purchased and transferred to pantry.',
        data: groceryItem
      });
    }

    groceryItem.purchased = true;
    groceryItem.transferredToPantry = true;

    // Optional expiry date: use if provided, otherwise leave undefined (no expiry)
    const calculatedExpiry = expiryDate ? new Date(expiryDate) : undefined;

    groceryItem.expiryDate = calculatedExpiry;
    await groceryItem.save();

    // Check if item exists in user's pantry
    const norm = groceryItem.normalizedName || normalizeName(groceryItem.name);
    let pantryItem = await PantryItem.findOne({
      userId: req.user._id,
      normalizedName: norm
    });

    if (pantryItem) {
      // Increase quantity
      if (areUnitsCompatible(pantryItem.unit, groceryItem.unit)) {
        const addedQty = convertQuantity(groceryItem.quantity, groceryItem.unit, pantryItem.unit);
        pantryItem.quantity = Math.round((pantryItem.quantity + addedQty) * 100) / 100;
      } else {
        pantryItem.quantity += groceryItem.quantity;
      }
      if (calculatedExpiry && (!pantryItem.expiryDate || calculatedExpiry > pantryItem.expiryDate)) {
        pantryItem.expiryDate = calculatedExpiry;
      }
      await pantryItem.save();
    } else {
      // Create new pantry item
      pantryItem = await PantryItem.create({
        userId: req.user._id,
        name: groceryItem.name,
        normalizedName: norm,
        category: category || groceryItem.category || 'Other',
        quantity: groceryItem.quantity,
        unit: groceryItem.unit,
        purchaseDate: new Date(),
        expiryDate: calculatedExpiry,
        notes: 'Transferred from grocery list'
      });
    }

    const pantryObj = pantryItem.toObject();
    pantryObj.expiryStatus = calculateExpiryStatus(pantryItem.expiryDate);

    return res.status(200).json({
      success: true,
      message: `${groceryItem.name} marked as purchased and added to pantry!`,
      groceryItem,
      pantryItem: pantryObj
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGroceryItems,
  addGroceryItem,
  updateGroceryItem,
  deleteGroceryItem,
  clearPurchasedItems,
  purchaseAndTransferToPantry
};
