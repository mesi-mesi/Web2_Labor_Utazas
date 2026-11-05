const Uzenet = require("../models/Uzenet");

exports.kapcsolatGet = (req, res) => {
    res.render("kapcsolat", { adat: {}, errors: {} });
};

exports.kapcsolatPost = async (req, res) => {
    const adat = {
        nev: String(req.body.nev || ""),
        email: String(req.body.email || ""),
        targy: String(req.body.targy || ""),
        szoveg: String(req.body.szoveg || "")
    };
    try {
        await Uzenet.create(adat);
        req.session.message = "Köszönjük, az üzenetét megkaptuk!";
        res.redirect("/kapcsolat");
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.render("kapcsolat", { adat, errors: err.errors });
        }
        console.error(err);
        res.status(500).send("Szerverhiba történt.");
    }
};

exports.uzenetekIndex = async (req, res) => {
    const uzenetek = await Uzenet.find().sort({ kuldes_ideje: -1 });
    res.render("uzenetek", { uzenetek });
};
