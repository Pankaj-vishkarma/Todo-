const Todo = require("../models/todomodel");
const mongoose = require("mongoose");

const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required"
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description?.trim() || "",
      user: req.user.id
    });

    res.status(201).json(todo);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(todos);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const getSingleTodo = async (req, res) => {
  try {
    const { id } = req.params;

    // Check valid Mongo ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Todo ID"
      });
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found"
      });
    }

    res.status(200).json(todo);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch todo",
      error: error.message
    });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Todo ID"
      });
    }

    const { title, description, completed } = req.body;

    const updateData = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Title cannot be empty"
        });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (completed !== undefined) {
      updateData.completed = completed;
    }

    const updated = await Todo.findOneAndUpdate(
      { _id: id, user: req.user.id },
      updateData,
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Todo not found"
      });
    }

    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({
      message: "Failed to update todo",
      error: error.message
    });
  }
};


const deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTodo,
  getTodos,
  getSingleTodo,
  updateTodo,
  deleteTodo
};