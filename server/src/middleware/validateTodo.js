const { body, param } = require("express-validator");
const mongoose = require("mongoose");

/* ================================
   CREATE TODO VALIDATION
================================ */
exports.validateCreateTodo = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority value"),

  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Invalid status value"),
];

/* ================================
   UPDATE TODO VALIDATION
================================ */
exports.validateUpdateTodo = [
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid Todo ID");
    }
    return true;
  }),
];

/* ================================
   ID VALIDATION
================================ */
exports.validateTodoId = [
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid Todo ID");
    }
    return true;
  }),
];