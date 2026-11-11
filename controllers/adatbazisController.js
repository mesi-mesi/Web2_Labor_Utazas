const Ut = require("../models/Ut");
const Szalloda = require("../models/Szalloda");
const Helyseg = require("../models/Helyseg");

// GET /adatbazis – a 3 tábla adatai együtt: tavasz (utak) + szalloda + helyseg
exports.index = async (req, res) => {
    // szűrők az URL-ből, pl. /adatbazis?orszag=Egyiptom&helyseg=4&szalloda=CL
    const orszag = String(req.query.orszag || "");
    const helysegAz = String(req.query.helyseg || "");
    const szallodaAz = String(req.query.szalloda || "");

    const helysegek = await Helyseg.find().sort({ orszag: 1, nev: 1 });
    const szallodak = await Szalloda.find().populate("helyseg").sort({ nev: 1 });

    // azok a szállodák, amelyek minden megadott feltételnek megfelelnek
    const szallodaAzok = szallodak
        .filter(sz => !orszag || (sz.helyseg && sz.helyseg.orszag === orszag))
        .filter(sz => !helysegAz || String(sz.helyseg_az) === helysegAz)
        .filter(sz => !szallodaAz || sz.az === szallodaAz)
        .map(sz => sz.az);

    // utak + a hozzájuk tartozó szálloda + a szálloda helysége (virtual populate)
    const utak = await Ut.find({ szalloda_az: { $in: szallodaAzok } })
        .populate({ path: "szalloda", populate: { path: "helyseg" } })
        .sort({ indulas: 1, ar: 1 });

    const orszagok = [...new Set(helysegek.map(h => h.orszag))];
    res.render("adatbazis", { utak, helysegek, szallodak, orszagok, orszag, helysegAz, szallodaAz });
};