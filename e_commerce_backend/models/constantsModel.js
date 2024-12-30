const mongoose = require("mongoose");

const constantsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Constant Name"],
    trim: true,
  },
  metadata: {
    type: Object,
    default: {}
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

module.exports = mongoose.model("Constants", constantsSchema);
