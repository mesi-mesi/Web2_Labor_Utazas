const Ut = require("../models/Ut");
const Szalloda = require("../models/Szalloda");
const Helyseg = require("../models/Helyseg");

// GET /adatbazis – a 3 tábla adatai együtt: tavasz (utak) + szalloda + helyseg
exports.index = async (req, res) => {
    // szűrők az URL-ből, pl. /adatbazis?orszag=Egyiptom&szalloda=BS
    const orszag = String(req.query.orszag || "");
    const szallodaAz = String(req.query.szalloda || "");

    const helysegek = await Helyseg.find().sort({ orszag: 1, nev: 1 });
    const szallodak = await Szalloda.find().populate("helyseg").sort({ nev: 1 });

    // melyik szállodák útjai kellenek
    let szallodaAzok = szallodak.map(sz => sz.az);
    if (orszag) {
        szallodaAzok = szallodak.filter(sz => sz.helyseg && sz.helyseg.orszag === orszag).map(sz => sz.az);
    }
    if (szallodaAz) {
        szallodaAzok = szallodaAzok.filter(az => az === szallodaAz);
    }

    // utak + a hozzájuk tartozó szálloda + a szálloda helysége (virtual populate)
    const utak = await Ut.find({ szalloda_az: { $in: szallodaAzok } })
        .populate({ path: "szalloda", populate: { path: "helyseg" } })
        .sort({ indulas: 1, ar: 1 });

    const orszagok = [...new Set(helysegek.map(h => h.orszag))];
    res.render("adatbazis", { utak, szallodak, orszagok, orszag, szallodaAz });
};