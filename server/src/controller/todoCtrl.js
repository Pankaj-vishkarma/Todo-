const Todo = require("../models/todomodel");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");

/* ================================
   CREATE TODO
================================ */
const createTodo = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    priority,
    category,
    tags,
    dueDate,
    reminder,
    status,
  } = req.body;

  if (!title || !title.trim()) {
    res.status(400);
    throw new Error("Title is required");
  }

  const todo = await Todo.create({
    title: title.trim(),
    description: description?.trim() || "",
    priority,
    category,
    tags: Array.isArray(tags) ? tags : [],
    dueDate: dueDate ? new Date(dueDate) : undefined,
    reminder: reminder ? new Date(reminder) : undefined,
    status,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Todo created successfully",
    data: todo,
  });
});

/* ================================
   GET TODOS
================================ */
const getTodos = asyncHandler(async (req, res) => {
  let {
    status,
    priority,
    category,
    search,
    page = 1,
    limit = 10,
    archived,
  } = req.query;

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

  const query = { user: req.user.id };

  query.isArchived = archived === "true";

  if (status && ["pending", "in-progress", "completed"].includes(status)) {
    query.status = status;
  }

  if (priority && ["low", "medium", "high"].includes(priority)) {
    query.priority = priority;
  }

  if (category) {
    query.category = category;
  }

  if (search && search.trim()) {
    const safeSearch = search.trim();
    query.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const skip = (pageNum - 1) * limitNum;

  const todos = await Todo.find(query)
  .select("-__v")
  .sort({ isArchived: 1, createdAt: -1 })
  .skip(skip)
  .limit(limitNum)
  .lean();

  const total = await Todo.countDocuments(query);

  res.status(200).json({
    success: true,
    meta: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    },
    data: todos,
  });
});

/* ================================
   GET SINGLE TODO
================================ */
const getSingleTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid Todo ID");
  }

  const todo = await Todo.findOne({
  _id: id,
  user: req.user.id,
}).select("-__v").lean();

  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  res.status(200).json({
    success: true,
    data: todo,
  });
});

/* ================================
   UPDATE TODO
================================ */
const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid Todo ID");
  }

  const allowedFields = [
    "title",
    "description",
    "status",
    "priority",
    "category",
    "tags",
    "dueDate",
    "reminder",
    "isArchived",
  ];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  if (updateData.dueDate) {
    updateData.dueDate = new Date(updateData.dueDate);
  }

  if (updateData.reminder) {
    updateData.reminder = new Date(updateData.reminder);
  }

  if (updateData.title && !updateData.title.trim()) {
    res.status(400);
    throw new Error("Title cannot be empty");
  }

  if (updateData.title) {
    updateData.title = updateData.title.trim();
  }

  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: id, user: req.user.id },
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedTodo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  res.status(200).json({
    success: true,
    data: updatedTodo,
  });
});

/* ================================
   SOFT DELETE
================================ */
const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid Todo ID");
  }

  const todo = await Todo.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { isArchived: true },
    { new: true }
  );

  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  res.status(200).json({
    success: true,
    message: "Todo archived successfully",
  });
});

/* ================================
   HARD DELETE
================================ */
const permanentlyDeleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid Todo ID");
  }

  const deleted = await Todo.findOneAndDelete({
    _id: id,
    user: req.user.id,
  });

  if (!deleted) {
    res.status(404);
    throw new Error("Todo not found");
  }

  res.status(200).json({
    success: true,
    message: "Todo permanently deleted",
  });
});

/* ================================
   TODO ANALYTICS
================================ */
const getTodoAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const stats = await Todo.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isArchived: false,
      },
    },
    {
      $facet: {
        statusStats: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],
        priorityStats: [
          {
            $group: {
              _id: "$priority",
              count: { $sum: 1 },
            },
          },
        ],
        categoryStats: [
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
        ],
        overall: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              completed: {
                $sum: {
                  $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                },
              },
              archived: {
                $sum: {
                  $cond: [{ $eq: ["$isArchived", true] }, 1, 0],
                },
              },
            },
          },
        ],
      },
    },
  ]);

  if (!stats || stats.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        total: 0,
        completed: 0,
        archived: 0,
        completionRate: 0,
        statusBreakdown: [],
        priorityBreakdown: [],
        categoryBreakdown: [],
      },
    });
  }

  const data = stats[0];

  const total = data.overall[0]?.total || 0;
  const completed = data.overall[0]?.completed || 0;

  const completionRate =
    total === 0
      ? 0
      : Number(((completed / total) * 100).toFixed(2));

  res.status(200).json({
    success: true,
    data: {
      total,
      completed,
      archived: data.overall[0]?.archived || 0,
      completionRate,
      statusBreakdown: data.statusStats,
      priorityBreakdown: data.priorityStats,
      categoryBreakdown: data.categoryStats,
    },
  });
});

module.exports = {
  createTodo,
  getTodos,
  getSingleTodo,
  updateTodo,
  deleteTodo,
  permanentlyDeleteTodo,
  getTodoAnalytics
};