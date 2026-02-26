const Todo = require("../models/todomodel");
const mongoose = require("mongoose");

/* ================================
   CREATE TODO
================================ */
const createTodo = async (req, res, next) => {
  try {
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
      return res.status(400).json({ message: "Title is required" });
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
      data: todo,
    });
  } catch (error) {
  console.error("CREATE TODO ERROR:", error);
  return res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
}
};

/* ================================
   GET TODOS (With Filter, Search, Pagination)
================================ */
const getTodos = async (req, res, next) => {
  try {
    let {
      status,
      priority,
      category,
      search,
      page = 1,
      limit = 10,
      archived,
    } = req.query;

    // Convert page & limit safely
    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.max(Number(limit) || 10, 1);

    const query = { user: req.user.id };

    // Archive filter
    if (archived === "true") {
      query.isArchived = true;
    } else {
      query.isArchived = false;
    }

    // Filters
    if (status && ["pending", "in-progress", "completed"].includes(status)) {
      query.status = status;
    }

    if (priority && ["low", "medium", "high"].includes(priority)) {
      query.priority = priority;
    }

    if (category) {
      query.category = category;
    }

    // Safe search (no text index dependency)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (pageNum - 1) * limitNum;

    const todos = await Todo.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Todo.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: todos,
    });
  } catch (error) {
    next(error);
  }
};

/* ================================
   GET SINGLE TODO
================================ */
const getSingleTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Todo ID" });
    }

    const todo = await Todo.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

/* ================================
   UPDATE TODO
================================ */
const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Todo ID" });
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

    // Trim title if updating
    if (updateData.title && !updateData.title.trim()) {
      return res.status(400).json({
        message: "Title cannot be empty",
      });
    }

    if (updateData.title) {
      updateData.title = updateData.title.trim();
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, user: req.user.id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedTodo,
    });
  } catch (error) {
    next(error);
  }
};

/* ================================
   SOFT DELETE (Archive)
================================ */
const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Todo ID" });
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { isArchived: true },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo archived successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ================================
   HARD DELETE (Optional Admin Use)
================================ */
const permanentlyDeleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Todo.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "Todo permanently deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTodo,
  getTodos,
  getSingleTodo,
  updateTodo,
  deleteTodo,
  permanentlyDeleteTodo,
};