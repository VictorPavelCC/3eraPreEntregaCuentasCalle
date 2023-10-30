const { cartModel } = require("../dao/models/cart.model");
const { productModel } = require("../dao/models/product.model");
const CartDao = require("../dao/cartDao")


exports.createCart = async (req, res) => {
    try {
      const newCart = await CartDao.createCart();    
      
      res.status(201).json(newCart);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
      }
};
  
  exports.getAllCarts = async (req, res) => {
        try {
          let carts = await CartDao.getAllCarts();      
          res.json({ status: "success", payload: carts });
        } catch (error) {
          res.status(500).json({ error: "Error al obtener los carritos" })
        }
  };
  
  exports.getCart = async (req, res) => {
    const id = req.params.cid;
    try {
      
      const cart = await CartDao.getCart(id);

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const resume = cart.products.map(async (p) => {
      const data = {};
      data.info = await productModel.findById(p.product);
      data.quantity = p.quantity;
      data.total = data.info.price * p.quantity;
      
      return data;
    });
    const products = await Promise.all(resume);
  
    let total = 0;
    
    for (const product of cart.products) {
      total += product.product.price * product.quantity;
    }

      res.render("carts", {
        status: "success",
        cartId: id,
        products,
        total: total,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el carrito" });
    }
  };
  
  exports.addToCart = async (req, res) => {
  const cid = req.params.cid;
  const productId = req.body.productId;

  try {
     const result = await CartDao.addToCart( cid, productId)

    res.status(200).json({ ok: "Producto agregado correctamente" });
  } catch (error) {
    console.log(error);
  }
  };
  
  exports.updateCartProduct = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await CartDao.updateCartProduct(cid, pid, quantity)
    
        res.json({ message: "La cantidad del producto fue actualizada"  });
      } catch (error) {
        res.status(500).json({ error: "Error al actualizar la cantidad de producto en el carrito" });
      }
  };
  
  exports.removeCartProduct = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity;
        
        const cart = await CartDao.removeCartProduct(cid, pid, quantity);
        res.json({ message: "Producto eliminado del carrito con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto del carrito" });
    }
  };
  
  exports.deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await CartDao.deleteCart(cid)
    
        res.json({  message: "El Carrito ha sido vaciado" });
      } catch (error) {
        res.status(500).json({ error: "Error al eliminar vaciar del carrito" });
      }
  };