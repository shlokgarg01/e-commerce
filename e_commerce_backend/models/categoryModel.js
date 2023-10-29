const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: "String",
    required: [true, "Please enter Category Name"],
    trim: true,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  trending: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  }
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
});

module.exports = mongoose.model("Category", categorySchema);
