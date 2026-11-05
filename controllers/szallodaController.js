const Szalloda = require("../models/Szalloda");
require("../models/Helyseg");

exports.index = async (req, res) => {
    const szallodak = await Szalloda.find().populate("helyseg").sort({ nev: 1 });
    res.render("crud/index", { szallodak });
};
