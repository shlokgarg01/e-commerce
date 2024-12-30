const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(morgan("combined"));

// Was getting - (Entity too large) error while uploading heavy images from Frontend. Below 2 lines are the fix for that. Sequence of lines matter, so in future keep the sequence same if needed.
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(cors());

const errorMiddleware = require("./middleware/error");

// Route imports
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const addressRoutes = require("./routes/addressRoute");
const couponRoutes = require("./routes/couponRoutes");
const constantsRoutes = require("./routes/constantsRoute")

app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", addressRoutes);
app.use("/api/v1", couponRoutes);
app.use("/api/v1", subCategoryRoutes);
app.use("/api/v1", constantsRoutes);

app.get("/ping", (req, res) => {
  res.status(200).json({
    message:"Server is running."
  })
})

// This is the static frontend file. Whenever anychange in frontend is made, u need to generate build file &then run server again.
// IMPORTANT - make sure that this static frontend route is after all the backend routes otherwise all API calls will fail.
app.use(express.static(path.join(__dirname, "../e_commerce_frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../e_commerce_frontend/build/index.html")
  );
});

// middleware for errors
app.use(errorMiddleware);

module.exports = app;
