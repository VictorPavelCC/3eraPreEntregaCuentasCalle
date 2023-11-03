export default class ProductDTO {
    constructor(product) {
      this.title = product.title
      this.description = product.description
      this.code = product.code
      this.price = product.price
      this.image = product.image
      this.category = product.category
      this.stock = product.stock
    }
  }