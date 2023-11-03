const { Router } = require("express");
const cartsController = require("../controllers/carts.controller");
const router = Router();



router.post("/make", cartsController.createCart)
router.get("/", cartsController.getAllCarts);
router.get("/:cid", cartsController.getCart);
router.put("/:cid", cartsController.addToCart);
router.put("/:cid/products/:pid", cartsController.updateCartProduct);
router.delete("/:cid/products/:pid", cartsController.removeCartProduct);
router.delete("/:cid", cartsController.deleteCart);
router.get("/:cid/purchase", cartsController.purchaseCart)



module.exports = router;