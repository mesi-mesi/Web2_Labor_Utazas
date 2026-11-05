const Szalloda = require("../models/Szalloda");
const Helyseg = require("../models/Helyseg");

// Az űrlap mezői
function urlapAdat(body) {
    return {
        az: String(body.az || ""),
        nev: String(body.nev || ""),
        besorolas: String(body.besorolas || ""),
        helyseg_az: String(body.helyseg_az || ""),
        tengerpart_tav: String(body.tengerpart_tav || ""),
        repter_tav: String(body.repter_tav || ""),
        felpanzio: String(body.felpanzio || "")
    };
}

exports.index = async (req, res) => {
    const szallodak = await Szalloda.find().populate("helyseg").sort({ nev: 1 }).collation({ locale: "hu" });
    res.render("crud/index", { szallodak });
};

// GET /crud/uj
exports.newForm = async (req, res) => {
    const helysegek = await Helyseg.find().sort({ nev: 1 });
    res.render("crud/uj", { adat: {}, errors: {}, helysegek });
};

// POST /crud
exports.create = async (req, res) => {
    const adat = urlapAdat(req.body);
    const helysegek = await Helyseg.find().sort({ nev: 1 });
    const szalloda = new Szalloda(adat);
    try {
        // 1. a sémában megadott szabályok
        let errors = {};
        try {
            await szalloda.validate();
        } catch (err) {
            if (err.name !== "ValidationError") { throw err; }
            errors = err.errors;
        }

        if (!errors.az && await Szalloda.findOne({ az: szalloda.az })) {
            errors.az = { message: "Ilyen azonosítójú szálloda már van!" };
        }
        if (!errors.helyseg_az && !helysegek.some(h => h.az === szalloda.helyseg_az)) {
            errors.helyseg_az = { message: "Válasszon helységet a listából!" };
        }
        if (Object.keys(errors).length > 0) {
            return res.render("crud/uj", { adat, errors, helysegek });
        }
        await szalloda.save();
        req.session.message = `A(z) ${szalloda.nev} szálloda felvétele sikerült.`;
        res.redirect("/crud");
    } catch (err) {
        console.error(err);
        res.status(500).send("Szerverhiba történt.");
    }
};
