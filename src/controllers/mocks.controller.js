const { generateMockProducts} = require("../dao/mocks")

exports.getMockProducts = async (req,res) => {
    try{
        const mockProducts = generateMockProducts();
        console.log(mockProducts)
        res.status(200).send(mockProducts);
    } catch(error) {
        res.status(500).json({ error: 'Error al obtener los productos ficticios' });
    }


}

