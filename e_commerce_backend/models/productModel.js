const mongoose = require("mongoose");

// When we create a product without a subcategory, then we get an error that cannot parse "" as ObjectId. This is to bypass that error
const castObjectId = mongoose.ObjectId.cast();
mongoose.ObjectId.cast(v => v === '' ? v : castObjectId(v));
 
const productSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      required: [true, "Please enter product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      maxLength: [8, "Price cannot exceed 8 figures"],
      min: [1, "Price Cannot be less than 1"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be less than 0"],
    },
    maxOrderQuantity: {
      type: Number,
      default: 0,
      min: [0, "Maximum order count cannot be less than 0"],
    },
    ordersCount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      default: function () {
        return this.price - this.discount;
      },
      min: [0, "Final Price cannot be less than 0"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      requred: [true, "Please enter valid product category"],
    },
    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
      default: ''
    },
    stock: {
      type: Number,
      required: [true, "Please enter the Stock"],
      maxLength: [5, "Stock cannot be more than 5 in length"],
      default: 1,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    favourite: {
      type: Boolean,
      default: false,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

productSchema.pre("save", function (next) {
  this.finalPrice = this.price - this.discount;
  next();
});

// Handling the update of discount & price to finally calculate the finalPrice
productSchema.pre("findOneAndUpdate", async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());

  const newValues = this?._update;
  const price = newValues.price || docToUpdate.price;
  const discount =
    newValues.discount === 0
      ? newValues.discount
      : newValues.discount || docToUpdate.discount;

  this.set({ finalPrice: price - discount });
  next();
});

module.exports = mongoose.model("Product", productSchema);
