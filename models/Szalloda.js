const mongoose = require("mongoose");

// szalloda (az, nev, besorolas, helyseg_az, tengerpart_tav, repter_tav, felpanzio)
const szallodaSchema = new mongoose.Schema({
    az: {
        type: String, trim: true, uppercase: true, unique: true,
        required: [true, "Az azonosító megadása kötelező!"],
        match: [/^[A-Z]{2}$/, "Az azonosító 2 betű legyen (pl. BS)!"]
    },
    nev: {
        type: String, trim: true,
        required: [true, "A név megadása kötelező!"],
        minlength: [3, "A név legalább 3 karakter legyen!"],
        maxlength: [100, "A név legfeljebb 100 karakter lehet!"]
    },
    besorolas: {
        type: Number, cast: "A besorolás szám legyen!",
        required: [true, "A besorolás megadása kötelező!"],
        min: [1, "A besorolás 1 és 5 csillag között lehet!"],
        max: [5, "A besorolás 1 és 5 csillag között lehet!"],
        validate: { validator: Number.isInteger, message: "A besorolás egész szám legyen!" }
    },
    helyseg_az: {
        type: Number, cast: "Válasszon helységet a listából!",
        required: [true, "Válasszon helységet a listából!"]
    },
    tengerpart_tav: {                                          // méter
        type: Number, cast: "A tengerpart távolsága szám legyen!",
        required: [true, "A tengerpart távolságának megadása kötelező!"],
        min: [0, "A távolság nem lehet negatív!"]
    },
    repter_tav: {                                              // km
        type: Number, cast: "A repülőtér távolsága szám legyen!",
        required: [true, "A repülőtér távolságának megadása kötelező!"],
        min: [0, "A távolság nem lehet negatív!"]
    },
    felpanzio: { type: Boolean, default: false, cast: "Válasszon ellátást a listából!" }  // true: félpanzió, false: teljes ellátás
});

// Kapcsolat: szalloda.helyseg_az - helyseg.az
szallodaSchema.virtual("helyseg", {
    ref: "Helyseg",
    localField: "helyseg_az",
    foreignField: "az",
    justOne: true
});

module.exports = mongoose.model("Szalloda", szallodaSchema, "szalloda");