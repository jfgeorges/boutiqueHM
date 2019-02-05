const axios = require("axios");
const faker = require("faker");

// const appUrl = "http://localhost:3000";
const appUrl = "https://boutique-jfg.herokuapp.com";

// ------------------------- //
// CREATION DES DEPARTEMENTS //
// ------------------------- //
const createDepartment = async title => {
  try {
    const rep = await axios.post(appUrl + "/department/create", {
      title: title
    });
  } catch (error) {
    console.log("createDepartment(): ", error.message);
  }
};

// ----------------------- //
// CREATION DES CATEGORIES //
// ----------------------- //
const createCategory = async (title, description, dptId) => {
  try {
    const rep = await axios.post(appUrl + "/category/create", {
      title: title,
      description: description,
      department: dptId
    });
  } catch (error) {
    console.log("createCategory(): ", error.message);
  }
};

// --------------------- //
// CREATION DES PRODUITS //
// --------------------- //
const createProduct = async (title, description, price, catId) => {
  try {
    rep = await axios.post(appUrl + "/product/create", {
      title: title,
      description: description,
      price: price,
      category: catId
    });
  } catch (error) {
    console.log(title, description, price, catId);
    console.log("createProduct(): ", error.message);
  }
};

// ----------------- //
// CREATION DES AVIS //
// ----------------- //
const createReview = async (productId, rate, comment, name) => {
  try {
    rep = await axios.post(appUrl + "/review/create", {
      product: productId,
      rating: rate,
      comment: comment,
      username: name
    });
  } catch (error) {
    console.log(productId, rate, comment, name);
    console.log("createReview(): ", error.message);
  }
};

// Attend le retour de createDepartment() avant nu nouvel appel,
// ceci pour éviter le lancement parallèle de plusieurs créations sans avoir eu le retour des précedentes,
// sinon cela crée des doublons
const seqCreateDepartment = async nbDpt => {
  for (let i = 0; i < nbDpt; i++) {
    await createDepartment(faker.commerce.department());
  }
};

const seqCreateCategory = async nbCat => {
  try {
    // Récupère tous les départements et les stocke dans un tableau
    const dpts = await axios.get(appUrl + "/department");
    for (let i = 0; i < nbCat; i++) {
      // Index aléatoire pour piocher dans le tableau
      const rdmIndex = Math.floor(Math.random() * (dpts.data.length - 1));
      try {
        await createCategory(faker.address.state(), `Description ${i}`, dpts.data[rdmIndex]._id);
      } catch (error) {
        console.log("createCategory() failed: ", error);
      }
    }
  } catch (error) {
    console.log("Axios Get department failed: ", error);
  }
};

const seqCreateProduct = async nbProduct => {
  try {
    // Récupères toutes les catégories de la base dans un tableau
    const ctgs = await axios.get(appUrl + "/category");
    for (let i = 0; i < nbProduct; i++) {
      // Détermine aléatoirement un index de catégorie à piocher dans le tableau
      const rdmIndex = Math.floor(Math.random() * (ctgs.data.length - 1));
      try {
        await createProduct(faker.commerce.productName(), faker.commerce.productAdjective(), faker.commerce.price(), ctgs.data[rdmIndex]._id);
      } catch (error) {
        console.log("createProduct() failed: ", error);
      }
    }
  } catch (error) {
    console.log("Axios Get category failed: ", error);
  }
};

const seqCreateReviews = async nbReviews => {
  try {
    const products = await axios.get(appUrl + "/product");

    for (let i = 0; i < nbReviews; i++) {
      // Pioche un produit aléatoirement
      const rdmIndex = Math.floor(Math.random() * (products.data.length - 1));
      // Calcule une note aléatoire
      const rdmRate = Math.floor(Math.random() * 5 + 1);

      try {
        await createReview(products.data[rdmIndex]._id, rdmRate, faker.commerce.productAdjective(), faker.name.firstName());
      } catch (error) {
        console.log("createReview() failed: ", error);
      }
    }
  } catch (error) {
    console.log("Axios Get product failed: ", error);
  }
};

// ------------------ //
// ------ MAIN ------ //
// ------------------ //

// Request failed with status code 400 : les conditions de validation des champs définies au niveau des modèles ne sont pas respectées.
// axios ne semble pas renvoyé le message JSON explicit qu'envoie MongoDb

// Appelle les différentes fonctions de création depuis une fonctions asynchrone

const populateDb = async () => {
  await seqCreateDepartment(10);
  await seqCreateCategory(10);
  await seqCreateProduct(1000);
  await seqCreateReviews(1000);
};

populateDb();
