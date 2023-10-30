const sessionsController = require("../controllers/sessions.controller")
const { Router } = require("express");
const router = Router();
const passport = require('passport');



router.get("/register", sessionsController.renderRegister )
router.get("/", sessionsController.renderLogin)
router.get('/profile', sessionsController.renderProfile);
router.get('/restore', sessionsController.renderRestore)
router.get("/logout", sessionsController.logout)
router.post("/register", passport.authenticate("register", {failureRedirect:"/api/sessions/failRegister"}), sessionsController.register)
router.get('/failRegister', sessionsController.failRegister)
router.post('/', passport.authenticate("login", { failureRedirect: "/api/sessions/failLogin" }), sessionsController.login)
router.get("/failLogin", sessionsController.failLogin)
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), sessionsController.githubAuth)
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/api/sessions" }), sessionsController.githubAuthCallback)
router.post('/restore', sessionsController.restorePassword)

module.exports = router;


