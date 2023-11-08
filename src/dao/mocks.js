const { faker } = require('@faker-js/faker')
const uuid = require("uuid")

/* function generateMockProducts(cantidad = 100) {
    const mockProducts = [];
    console.log("mock1",mockProducts)
    for (let i = 0; i < cantidad; i++) {
      const mockProduct = {
        _id: faker.mongodbObjectId(),
        name: faker.commerce.productName(),
        description: faker.productDescription(),
        price: faker.price({ min: 4000, max: 20000, dec: 0}),
        stock: faker.number({ min: 0, max: 100 }),
        category: faker.commerce.department(),
        image: faker.image.avatar(),
      };
      console.log("productrandom n",i,mockProducts)
      mockProducts.push(mockProduct);
    }
    console.log("mock2",mockProducts)
    return mockProducts;
  }
   */
  function generateMockProducts(cantidad) {
    const mockProducts = [];
    const categories = ["categoria x"]
    
    for (let i = 1; i <= 100; i++) {
      mockProducts.push({
        _id: i,
        name: `Product N°${i}`,
        description: `Descripción del producto N°${i}`,
        category: categories[0],
        stock: Math.floor(Math.random() * 100) + 1,
        price: Math.floor(Math.random() * 100) + 1,
        image_url: "https://cdn.dribbble.com/users/2784794/screenshots/11913134/media/99af4e08be61e779fc7b5ccac5ed4d58.jpg?resize=400x0",
      });
    }
    
    return mockProducts
  }


  module.exports = {
    generateMockProducts
  };


