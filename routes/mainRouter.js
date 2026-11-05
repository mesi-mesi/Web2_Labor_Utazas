const router = require("express").Router();
const controller = require("../controllers/mainController");
const uzenetController = require("../controllers/uzenetController");

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
module.exports = router;