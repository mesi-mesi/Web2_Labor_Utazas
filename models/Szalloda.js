const mongoose = require("mongoose");

// szalloda (az, nev, besorolas, helyseg_az, tengerpart_tav, repter_tav, felpanzio)
const szallodaSchema = new mongoose.Schema({
    az: { type: String, required: true, unique: true },
    nev: { type: String, required: true },
    besorolas: { type: Number, required: true, min: 1, max: 5 },
    helyseg_az: { type: Number, required: true },
    tengerpart_tav: { type: Number, required: true, min: 0 },  // méter
    repter_tav: { type: Number, required: true, min: 0 },      // km
    felpanzio: { type: Boolean, default: false }               // true: félpanzió, false: teljes ellátás
});

// Kapcsolat: szalloda.helyseg_az - helyseg.az
szallodaSchema.virtual("helyseg", {
    ref: "Helyseg",
    localField: "helyseg_az",
    foreignField: "az",
    justOne: true
});

module.exports = mongoose.model("Szalloda", szallodaSchema, "szalloda");