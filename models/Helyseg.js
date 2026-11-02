const mongoose = require("mongoose");

// helyseg (az, nev, orszag)
const helysegSchema = new mongoose.Schema({
    az: { type: Number, required: true, unique: true },
    nev: { type: String, required: true },
    orszag: { type: String, required: true }
});

// 3. paraméter: a kollekció neve az Atlasban
module.exports = mongoose.model("Helyseg", helysegSchema, "helyseg");