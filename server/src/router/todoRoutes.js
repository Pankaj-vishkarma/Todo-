const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createTodo,
  getTodos,
  getSingleTodo,
  updateTodo,
  deleteTodo,
  permanentlyDeleteTodo,
} = require("../controller/todoCtrl");

const {
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoId,
} = require("../middleware/validateTodo");

const handleValidation = require("../middleware/handleValidation");

/* ================================
   CREATE TODO
================================ */
router.post(
  "/",
  authMiddleware,
  validateCreateTodo,
  handleValidation,
  createTodo
);

/* ================================
   GET ALL TODOS (Filter + Pagination)
================================ */
router.get("/", authMiddleware, getTodos);

/* ================================
   HARD DELETE (Permanent)
   (Specific route should come first)
================================ */
router.delete(
  "/permanent/:id",
  authMiddleware,
  validateTodoId,
  handleValidation,
  permanentlyDeleteTodo
);

/* ================================
   GET SINGLE TODO
================================ */
router.get(
  "/:id",
  authMiddleware,
  validateTodoId,
  handleValidation,
  getSingleTodo
);

/* ================================
   UPDATE TODO
================================ */
router.put(
  "/:id",
  authMiddleware,
  validateUpdateTodo,
  handleValidation,
  updateTodo
);

/* ================================
   SOFT DELETE (Archive)
================================ */
router.delete(
  "/:id",
  authMiddleware,
  validateTodoId,
  handleValidation,
  deleteTodo
);

module.exports = router;