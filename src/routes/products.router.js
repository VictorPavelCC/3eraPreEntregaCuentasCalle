const { Router } = require("express");
const productsController = require("../controllers/products.controller");
const router = Router();



router.get("/", productsController.getAllProducts);
router.get("/productsList", productsController.getProductList);
router.get("/:id", productsController.getProductById);
router.get("/categories", productsController.getProductsByCategory);
router.post("/", productsController.postProduct)
router.put("/", productsController.putProduct)
router.delete("/", productsController.deleteProduct);


module.exports = router