 const { userModel } = require("../dao/models/user.model")


 async function findUserByEmail(email) {
    try {
        return await userModel.findOne({ email: email });
    } catch (error) {
        throw new Error('Error al buscar al usuario por correo electrónico');
    }
}

async function updateUser(user) {
    try {
        return await userModel.updateOne({ _id: user._id }, user);
    } catch (error) {
        throw new Error('Error al actualizar la información del usuario');
    }
}

module.exports = {
    findUserByEmail,
    updateUser,
};

