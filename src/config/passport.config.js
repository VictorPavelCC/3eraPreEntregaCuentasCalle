const passport = require('passport');
const local = require('passport-local');
const { userModel } = require('../dao/models/user.model');
const { cartModel } = require('../dao/models/cart.model');
const { createHash, isValidatePassword } = require('../../utils');
const GitHubStrategy = require('passport-github2');

const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("register", new localStrategy(
        { passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;

            try {
                
                let user = await userModel.findOne({ email: username })

                const newCart = new cartModel({ user: null, products: [] });
                await newCart.save();

                
                if (user) {
                    console.log("El usuario ya existe.");
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart:newCart._id
                }

                //Rol System
                if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
                    newUser.rol = "admin"
                    await userModel.updateOne({ _id: newUser._id }, newUser);
                }


                let result = await userModel.create(newUser);

                newCart.user = result._id;
                await newCart.save();

                return done(null, result);

            } catch (error) {
                return done("Error al obtener el usuario." + error);
            }
        }
    ))


    passport.use("login", new localStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username }).populate("cart");

            if (!user) {
                console.log("Usuario ingresado no existe.");
                return done(null, false);
            }

            if (!isValidatePassword(user, password)) return done(null, false);

        
            return done(null, user);

        } catch (error) {
            return done(error);
        }
    }))


    //Github
    passport.use("github", new GitHubStrategy({

        clientID: "Iv1.c9becc63a9702b6c",
        clientSecret: "226488f6809f108026b5abedf489a5f0cd0f63da",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"

    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await userModel.findOne({ email: profile._json.email })
            const newCart = new cartModel({ user: null, products: [] });
            await newCart.save();

            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age:27,
                    email: profile._json.email,
                    password: "",
                    cart:newCart._id
                }


                let result = await userModel.create(newUser);

                done(null, result)

            } else {
                done(null, user)
            }

        } catch (error) {
            return done(error)
        }
    }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    })
}

module.exports = initializePassport;