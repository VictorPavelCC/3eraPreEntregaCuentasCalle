const { productModel } = require("../dao/models/product.model");
const { cartModel } = require("../dao/models/cart.model");
const productsDao = require("../dao/productsDao");
const { paginate } = require("mongoose-paginate-v2");


exports.getAllProducts = async (req, res) => {
  try {
    let { limit, page, sort, category } = req.query;

    limit = parseInt(limit, 10) || 10;
    page = parseInt(page, 10) || 1;
    sort = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    const query = category ? { category } : {};

    const options = { limit, page, sort };

    const products = await productsDao.getAllProducts(query, options);

    const totalPages = products.totalPages;
    const hasPrevPage = products.hasPrevPage;
    const hasNextPage = products.hasNextPage;
    const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&category=${category}`: null;
    const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&category=${category}`: null;

    res.send({
      status: "success",
      payload: products.docs,
      totalPages,
      prevPage: page - 1,
      nextPage: page + 1,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error al obtener los productos" });
  }
};
  
  exports.getProductList = async (req, res) => {
  let { limit, page, sort, category } = req.query;
  try {
    limit = parseInt(limit, 10) || 10;
    page = parseInt(page, 10) || 1;
    sort = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    const query = category ? { category } : {};
    const options = { limit, page, sort };

    const sessionUser = req.session.user;

    let result = await productsDao.getProductList(query, options, sessionUser);
    res.render("productsList", result);
  } catch (error) {
    res.render("productsList", {
      status: "error",
    });
  }
};


  exports.getProductById = async (req, res) => {
  let id = req.params.id;
  try {
    const product = await productsDao.getProductById(id);
    res.render("product", {
      payload: product,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error al obtener el producto" });
  }
};

  
exports.getProductsByCategory = async (req, res) => {
  try {
    const result = await productsDao.getProductsByCategory();
    res.send(result);
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error al obtener las categorías" });
  }
};

  
    
exports.postProduct = async (req, res) => {
  let { name, category, price, stock, image } = req.body;

  if (!name || !category || !price || !stock || !image) {
    res.send({ status: "error", error: "Missing parameters" });
  } else {
    let result = await productsDao.postProduct(name, category, price, stock, image);
    res.send(result);
  }
};
  

exports.putProduct = async (req, res) => {
  let { name, category, price, stock, image } = req.body;

  if (!name || !category || !price || !stock || !image) {
    res.send({ status: "error", error: "Missing parameters" });
  } else {
    let result = await productsDao.putProduct(name, category, price, stock, image);
    res.send(result);
  }
};
exports.deleteProduct = async (req, res) => {
  let { name } = req.body;

  if (!name) {
    res.send({ status: "error", error: "Missing parameters" });
  } else {
    let result = await productsDao.deleteProduct(name);
    res.send(result);
  }
};
  