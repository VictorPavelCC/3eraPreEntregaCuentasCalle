const { cartModel } = require("../dao/models/cart.model");
const { productModel } = require("../dao/models/product.model");
const CartDao = require("../dao/cartDao")
const productDao = require("../dao/productsDao");
const ticketDao = require("../dao/ticketDao")



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

  exports.purchaseCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await CartDao.getCart(cid)
  
      if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Cart not found' });
      }
 
      const productsToPurchase = []; // Almacenará los productos disponibles para la compra
      const productsNotPurchased = []; // Almacenará los productos sin suficiente stock
      let totalPrice = 0;
      console.log(cart)

      for (const cartItem of cart.products) {
        // Verifica si el producto tiene suficiente stock
        const product = await productModel.findById(cartItem.product);
        if (product.stock >= cartItem.quantity) {
          // El producto tiene suficiente stock, réstalo del stock del producto
          product.stock -= cartItem.quantity;
          await product.save();
          productsToPurchase.push(cartItem);

          totalPrice += product.price * cartItem.quantity;
        } else {
          // El producto no tiene suficiente stock, omítelo
          productsNotPurchased.push(cartItem);
        }
      }
      const amount = totalPrice
  
    
      const ticketData = {
        cart: cart._id,
        purchase_datetime: new Date(),
        amount,
        purchaser: req.user.email,
      };

      const TicketSave = await ticketDao.createTicket(ticketData);
  
      // Actualiza el carrito solo con los productos disponibles
      cart.products = productsNotPurchased;
      await cart.save();
      // Responde con la lista de productos no comprados y un mensaje de éxito
      res.json({
        status: 'success',
        message: 'Purchase completed successfully',
        productsNotPurchased,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }
  
 