const asyncHandler = require('express-async-handler');

/**
 * Generic CRUD handler factory. Used for straightforward, non-singleton
 * collections (Education, Experience, Certification, Achievement) to avoid
 * repeating identical boilerplate across controllers.
 *
 * Each generated handler follows the same response shape:
 *   { success: true, data: ... }
 * and relies on the shared error middleware for failures (CastError,
 * ValidationError, etc. are normalized there).
 */
const handlerFactory = (Model, resourceName = 'Resource') => ({
  getAll: asyncHandler(async (req, res) => {
    const items = await Model.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  }),

  getOne: asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error(`${resourceName} not found`);
    }
    res.json({ success: true, data: item });
  }),

  createOne: asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json({ success: true, data: item });
  }),

  updateOne: asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404);
      throw new Error(`${resourceName} not found`);
    }
    res.json({ success: true, data: item });
  }),

  deleteOne: asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error(`${resourceName} not found`);
    }
    res.json({ success: true, message: `${resourceName} deleted successfully` });
  }),
});

module.exports = handlerFactory;
