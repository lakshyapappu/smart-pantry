const PantryItem = require('../models/PantryItem');
const { normalizeName } = require('../utils/normalize');
const { calculateExpiryStatus } = require('../utils/expiryHelper');

// @desc    Get all pantry items for logged-in user
// @route   GET /api/pantry
// @access  Private
const getPantryItems = async (req, res, next) => {
  try {
    const { category, search, sort } = req.query;
    const query = { userId: req.user._id };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    let sortOption = { expiryDate: 1 }; // Default sort: soonest expiring first
    if (sort === 'name') {
      sortOption = { name: 1 };
    } else if (sort === 'quantity') {
      sortOption = { quantity: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const items = await PantryItem.find(query).sort(sortOption);

    // Map items to include dynamic expiry status
    const annotatedItems = items.map(item => {
      const plain = item.toObject();
      plain.expiryStatus = calculateExpiryStatus(item.expiryDate);
      return plain;
    });

    return res.status(200).json({
      success: true,
      count: annotatedItems.length,
      data: annotatedItems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pantry item by ID
// @route   GET /api/pantry/:id
// @access  Private
const getPantryItemById = async (req, res, next) => {
  try {
    const item = await PantryItem.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Pantry item not found'
      });
    }

    const plain = item.toObject();
    plain.expiryStatus = calculateExpiryStatus(item.expiryDate);

    return res.status(200).json({
      success: true,
      data: plain
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new pantry item
// @route   POST /api/pantry
// @access  Private
const addPantryItem = async (req, res, next) => {
  try {
    const { name, category, quantity, unit, purchaseDate, expiryDate, notes } = req.body;

    if (!name || quantity === undefined || !unit || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, category, quantity, and unit'
      });
    }

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a non-negative number'
      });
    }

    const item = await PantryItem.create({
      userId: req.user._id,
      name: name.trim(),
      normalizedName: normalizeName(name),
      category,
      quantity: numQty,
      unit,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      notes: notes ? notes.trim() : ''
    });

    const plain = item.toObject();
    plain.expiryStatus = calculateExpiryStatus(item.expiryDate);

    return res.status(201).json({
      success: true,
      message: `${item.name} added to your pantry!`,
      data: plain
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a pantry item
// @route   PUT /api/pantry/:id
// @access  Private
const updatePantryItem = async (req, res, next) => {
  try {
    const item = await PantryItem.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Pantry item not found'
      });
    }

    const { name, category, quantity, unit, purchaseDate, expiryDate, notes } = req.body;

    if (name) {
      item.name = name.trim();
      item.normalizedName = normalizeName(name);
    }
    if (category) item.category = category;
    if (quantity !== undefined) {
      const numQty = parseFloat(quantity);
      if (isNaN(numQty) || numQty < 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be non-negative'
        });
      }
      item.quantity = numQty;
    }
    if (unit) item.unit = unit;
    if (purchaseDate) item.purchaseDate = new Date(purchaseDate);
    if (expiryDate !== undefined) {
      item.expiryDate = expiryDate ? new Date(expiryDate) : null;
    }
    if (notes !== undefined) item.notes = notes.trim();

    await item.save();

    const plain = item.toObject();
    plain.expiryStatus = calculateExpiryStatus(item.expiryDate);

    return res.status(200).json({
      success: true,
      message: 'Pantry item updated successfully',
      data: plain
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a pantry item
// @route   DELETE /api/pantry/:id
// @access  Private
const deletePantryItem = async (req, res, next) => {
  try {
    const item = await PantryItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Pantry item not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: `${item.name} removed from your pantry`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPantryItems,
  getPantryItemById,
  addPantryItem,
  updatePantryItem,
  deletePantryItem
};

