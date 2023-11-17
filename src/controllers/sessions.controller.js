const { userModel } = require('../dao/models/user.model');
const {cartModel} =require('../dao/models/cart.model')
const { createHash } = require('../../utils');
const passport = require('passport');
const sessionsDao = require("../dao/sessionsDao")
const logger = require("../utils/logger")
exports.renderRegister = (req, res) => {
    try {
        res.render("register.handlebars")
    } catch (error) {
        res.status(500).send("Error de render")
    }
};

exports.register = async (req, res) => {
     try {

        logger.info("Usuario registrado correctamente.");
        res.redirect("/api/sessions")

    } catch (error) {
        res.status(500).send("Error de registro.")
    }
};

exports.renderLogin = (req, res) => {
    try {
        res.render("login.handlebars")
    } catch (error) {
        res.status(500).send("Error de render.")
    }
};

exports.renderProfile = (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/api/sessions');
        }

        let { first_name, last_name, email, age, rol } = req.session.user;

        res.render('profile.handlebars', {
            first_name, last_name, email, age, rol
        });

    } catch (error) {
        res.status(500).send("Error de render.")
    }
};

exports.renderRestore = (req, res) => {
    try {
        res.render('restore.handlebars')
    } catch (error) {
        res.status(500).send("Error de presentación.")
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            logger.info(`se ha cerrado la sesion actual`);
            res.redirect('/api/sessions')
        } else {
            res.send("Error al intentar salir.")
        }
    })
};

exports.failRegister = async (req, res) => {
    console.log("Failed strategy");
    res.send({ error: "Failed" })
};

exports.login = async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: "error", error: "Credenciales inválidas." });
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol,
        cart: req.user.cart,
        _id: req.user._id
    };

    logger.info(`Usuario Identificado: Bienvenido ${req.session.user.first_name} ${req.session.user.last_name}`)
    res.redirect("/api/sessions/profile");
};

exports.failLogin = (req, res) => {
    res.send({ error: "Failed login" });
};

exports.githubAuth = async (req, res) => {}

exports.githubAuthCallback = async (req, res) => {
    req.session.user = req.user;
    res.redirect("/api/sessions/profile")
}



exports.restorePassword = async (req, res) => {
    try {
        let { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).send({ status: "error", error: "Valores inexistentes" });
        }

        let user = await sessionsDao.findUserByEmail(email);

        if (!user) {
            return res.status(400).send({ status: "error", error: "Usuario no encontrado" });
        }

        user.password = createHash(newPassword);
        await sessionsDao.updateUser(user);

        res.redirect("/api/sessions");
    } catch (error) {
        logger.error(error)
        res.status(500).send("Error al cambiar contraseña.");
    }
};
