const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());

// Récupère l'argument pour démarrer en local
devMode = process.argv[2];

// Connection locale
if (devMode === "localDb") {
  console.log("BD Boutique Locale");
  mongoose.connect("mongodb://localhost/boutique", { useNewUrlParser: true });
} else {
  // Connexion distante
  mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/boutique", {
    useNewUrlParser: true
  });
}
// Initialiser les collections
// Mongoose va prendre connaissance de ces collections
require("./models/product");
require("./models/department");
require("./models/category");
require("./models/review");

const departmentRoutes = require("./routes/department");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");

// Activer les routes
app.use(departmentRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(reviewRoutes);

if (devMode === "localDb") {
  console.log("Local Boutique Server");
  app.listen(3000, () => {
    console.log("Boutique Server started");
  });
} else {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Boutique Server started");
  });
}
