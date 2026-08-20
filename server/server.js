const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const weddingRoutes = require("./routes/weddingRoutes");
const guestRoutes = require("./routes/guestRoutes");
const eventRoutes = require("./routes/eventRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const expenseCategoryRoutes = require("./routes/expenseCategoryRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const vendorCategoryMapRoutes = require("./routes/vendorCategoryMapRoutes");
const packageRoutes = require("./routes/packageRoutes");
const packageFeatureRoutes = require("./routes/packageFeatureRoutes");
const packageFeatureMapRoutes = require("./routes/packageFeatureMapRoutes");
const dealRoutes = require("./routes/dealRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const profileRoutes = require("./routes/profileRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const aiRoutes = require("./routes/aiRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const seedRoutes = require("./routes/seedRoutes");


const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/weddings", weddingRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/expense-categories", expenseCategoryRoutes);
app.use("/api/vendors", vendorRoutes);
app.use(
  "/api/vendor-categories",
  vendorCategoryMapRoutes
);
app.use("/api/packages", packageRoutes);
app.use("/api/package-features", packageFeatureRoutes);
app.use(
  "/api/package-feature-map",
  packageFeatureMapRoutes
);
app.use("/api/deals", dealRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seed", seedRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Wedding Bloom Backend is Running!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
