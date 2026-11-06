// Admin felhasználó létrehozása. Futtatás: npm run admin -- felhasznalonev jelszo
// Ha a felhasználó már létezik, admin lesz és új jelszót kap.
// A jelszó nem kerül a kódba, mert a GitHub repó nyilvános.
require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/User");

async function createAdmin() {
    const [username, password] = process.argv.slice(2);
    if (!username || !password) {
        console.error("Használat: npm run admin -- felhasznalonev jelszo");
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    const hash = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
        { username },
        { username, password: hash, role: "admin" },
        { upsert: true }
    );
    console.log(`Admin felhasználó kész: ${username}`);
    await mongoose.disconnect();
}

createAdmin().catch(err => {
    console.error("Admin error:", err.message);
    process.exit(1);
});
