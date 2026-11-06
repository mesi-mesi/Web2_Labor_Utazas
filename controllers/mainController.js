const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.homeIndex = (req, res) => { res.render("home"); };

exports.registerGet = (req, res) => { res.render("register"); };
exports.registerPost = async (req, res) => {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");
    if (username.length < 3 || password.length < 6) {
        req.session.message = "A felhasználónév legalább 3, a jelszó legalább 6 karakter legyen!";
        return res.redirect("/register");
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        req.session.message = "Ez a felhasználónév már foglalt!";
        return res.redirect("/register");
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash, role: "user" });
    req.session.message = "Sikeres regisztráció! Most már bejelentkezhetsz.";
    res.redirect("/login");
};

exports.loginGet = (req, res) => { res.render("login"); };
exports.loginPost = async (req, res) => {
    const user = await User.findOne({ username: String(req.body.username || "").trim() });
    if (!user) {
        req.session.message = "Hibás felhasználónév vagy jelszó!";
        return res.redirect("/login");
    }
    const ok = await bcrypt.compare(String(req.body.password || ""), user.password);
    if (!ok) {
        req.session.message = "Hibás felhasználónév vagy jelszó!";
        return res.redirect("/login");
    }
    req.session.user = { id: user._id, username: user.username, role: user.role };
    res.redirect("/");
};
exports.logout = (req, res) => {
    req.session.destroy(() => { res.redirect("/"); });
};