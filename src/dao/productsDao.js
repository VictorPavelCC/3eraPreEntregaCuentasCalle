const { productModel } = require("./models/product.model");
const { cartModel } = require("../dao/models/cart.model");
const { paginate } = require("mongoose-paginate-v2");
async function getAllProducts(query, options) {
  const products = await productModel.paginate(query, options);
  return products;
}

async function getProductList(query, options, sessionUser) {
  const userCartID = sessionUser._id;
  const userCart = await cartModel.findOne({ user: userCartID });

  const cid = userCart._id.toString();
  const uid = userCart.user.toString()

  let products = await productModel.paginate(query, options);

  const pageNumbers = [];

  for (let i = 1; i <= products.totalPages; i++) {
    pageNumbers.push({ number: i, current: i === products.page });
  }

  let categories;

  try {
    const result = await productModel.distinct("category");
    categories = result;
    categories.push("Todas");
  } catch (error) {}

  return {
    status: "success",
    payload: products.docs,
    totalPages: products.totalPages,
    prevPage: products.prevPage,
    nextPage: products.nextPage,
    page: products.page,
    hasPrevPage: products.hasPrevPage,
    hasNextPage: products.hasNextPage,
    pageNumbers: pageNumbers,
    categories: categories,
    user: sessionUser,
    userID: uid,
    userCartId: cid,
  };
}

async function getProductById(id) {
  const product = await productModel.findById(id);
  return product;
}

async function getProductsByCategory() {
  const categories = await productModel.distinct("category");
  return { categories };
}

async function postProduct(productData) {
  const result = await productModel.create(productData);
  return { result: "success", payload: result };
}

async function putProduct(productData) {
  const result = await productModel.updateMany(productData);
  return { result: "success", payload: result };
}

async function deleteProduct(name) {
  const result = await productModel.find({ name: name }).deleteOne();
  return { result: "success", payload: result };
}

module.exports = {
  getAllProducts,
  getProductList,
  getProductById,
  getProductsByCategory,
  postProduct,
  putProduct,
  deleteProduct,
};
