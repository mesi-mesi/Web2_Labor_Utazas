const Helyseg = require("../models/Helyseg");
const Szalloda = require("../models/Szalloda");
const Ut = require("../models/Ut");

// GET / – Főoldal: bemutatkozás + élő adatok az adatbázisból
exports.index = async (req, res) => {
    const helysegek = await Helyseg.find().sort({ orszag: 1, nev: 1 });
    const szallodak = await Szalloda.find();
    const utakSzama = await Ut.countDocuments();
    const legolcsobb = await Ut.findOne().sort({ ar: 1 }).populate("szalloda");

    // helységenként a szállodák száma
    const varosok = helysegek.map(h => ({
        az: h.az,
        nev: h.nev,
        orszag: h.orszag,
        szallodaSzam: szallodak.filter(sz => sz.helyseg_az === h.az).length
    }));

    res.render("home", { varosok, szallodaSzam: szallodak.length, utakSzama, legolcsobb });
};