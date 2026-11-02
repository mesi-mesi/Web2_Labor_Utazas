// Az Utazás adatok betöltése a MongoDB Atlasba. Futtatás: node seed.js
// A helyseg, szalloda és tavasz kollekciókat törli és újratölti!
require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");
const Helyseg = require("./models/Helyseg");
const Szalloda = require("./models/Szalloda");
const Ut = require("./models/Ut");

const load = (fajl) => JSON.parse(fs.readFileSync("data/" + fajl, "utf8"));

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is connected.");

    const helysegek = load("helyseg.json");
    const szallodak = load("szalloda.json");
    // a JSON-ban az indulas {"$date": "..."} formában van -> Date
    const utak = load("tavasz.json").map(u => ({ ...u, indulas: new Date(u.indulas.$date) }));

    await Helyseg.deleteMany({});
    await Szalloda.deleteMany({});
    await Ut.deleteMany({});
    await Helyseg.insertMany(helysegek);
    await Szalloda.insertMany(szallodak);
    await Ut.insertMany(utak);
    console.log(`Betöltve: ${helysegek.length} helység, ${szallodak.length} szálloda, ${utak.length} út.`);

    await mongoose.disconnect();
}

seed().catch(err => {
    console.error("Seed error:", err.message);
    process.exit(1);
});