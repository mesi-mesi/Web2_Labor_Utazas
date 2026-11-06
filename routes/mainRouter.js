const router = require("express").Router();
const controller = require("../controllers/mainController");
const uzenetController = require("../controllers/uzenetController");
const szallodaController = require("../controllers/szallodaController");

isLoggedIn=(req,res,next)=>{
    if(req.session.user){return next();}
    res.redirect("/login");
}
isAdmin=(req,res,next)=>{
    if(req.session.user && req.session.user.role==="admin"){return next();}
    res.redirect("/");
}

router.get("/", controller.homeIndex);
router.get("/register", controller.registerGet);
router.post("/register", controller.registerPost);
router.get("/login", controller.loginGet);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/kapcsolat", uzenetController.kapcsolatGet);
router.post("/kapcsolat", uzenetController.kapcsolatPost);
router.get("/uzenetek", isLoggedIn, uzenetController.uzenetekIndex);
router.get("/crud", isAdmin, szallodaController.index);
router.get("/crud/uj", isAdmin, szallodaController.newForm);
router.post("/crud", isAdmin, szallodaController.create);
router.get("/crud/:id/szerkeszt", isAdmin, szallodaController.editForm);
router.post("/crud/:id", isAdmin, szallodaController.update);
router.post("/crud/:id/torol", isAdmin, szallodaController.delete);
module.exports = router;