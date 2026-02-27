const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    category: {
      type: String,
      trim: true,
      default: "general",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    dueDate: {
      type: Date,
    },

    reminder: {
      type: Date,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

/* ================================
   INDEXES (Performance Optimization)
================================ */

todoSchema.index({ user: 1, status: 1 });
todoSchema.index({ user: 1, priority: 1 });
todoSchema.index({ user: 1, category: 1 });
todoSchema.index({ title: "text", description: "text" });
todoSchema.index({ user: 1, createdAt: -1 });

/* ================================
   PRE SAVE HOOK
   Auto set completedAt timestamp
================================ */

todoSchema.pre("save", function () {
  if (this.isModified("status")) {
    if (this.status === "completed") {
      this.completedAt = new Date();
    } else {
      this.completedAt = null;
    }
  }
});

module.exports = mongoose.model("Todo", todoSchema);