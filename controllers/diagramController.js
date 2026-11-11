const Ut = require("../models/Ut");
const Szalloda = require("../models/Szalloda");

// GET /diagram – szállodánkénti átlagár a 8 és 15 napos utakra (Chart.js)
exports.index = async (req, res) => {
    // az átlagot a MongoDB számolja: csoportosítás szálloda + időtartam szerint
    const atlagok = await Ut.aggregate([
        { $match: { idotartam: { $in: [8, 15] } } },
        { $group: {
            _id: { szalloda: "$szalloda_az", idotartam: "$idotartam" },
            atlagAr: { $avg: "$ar" },
            darab: { $sum: 1 }
        } }
    ]);

    // a szállodák nevéhez és helységéhez a szalloda + helyseg tábla
    const szallodak = await Szalloda.find().populate("helyseg");

    const adatok = szallodak.map(sz => {
        const atlag = (nap) => {
            const talalat = atlagok.find(a => a._id.szalloda === sz.az && a._id.idotartam === nap);
            return talalat ? Math.round(talalat.atlagAr) : null;
        };
        return {
            nev: sz.helyseg ? `${sz.nev} (${sz.helyseg.nev})` : sz.nev,
            nap8: atlag(8),
            nap15: atlag(15)
        };
    })
    .filter(a => a.nap8 !== null || a.nap15 !== null)   // csak az a szálloda, amelyiknek van útja
    .sort((a, b) => (b.nap15 || 0) - (a.nap15 || 0));   // a legdrágább felül

    res.render("diagram", { adatok });
};