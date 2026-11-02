const mongoose = require("mongoose");

// tavasz (sorszam, szalloda_az, indulas, idotartam, ar) – utazási ajánlatok
const utSchema = new mongoose.Schema({
    sorszam: { type: Number, required: true, unique: true },
    szalloda_az: { type: String, required: true },
    indulas: { type: Date, required: true },
    idotartam: { type: Number, required: true },  // nap
    ar: { type: Number, required: true }          // Ft / fő
});

// Kapcsolat: tavasz.szalloda_az - szalloda.az
utSchema.virtual("szalloda", {
    ref: "Szalloda",
    localField: "szalloda_az",
    foreignField: "az",
    justOne: true
});

module.exports = mongoose.model("Ut", utSchema, "tavasz");