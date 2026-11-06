const mongoose = require("mongoose");

const uzenetSchema = new mongoose.Schema({
    nev: {
        type: String,
        trim: true,
        required: [true, "A név megadása kötelező!"],
        minlength: [3, "A név legalább 3 karakter legyen!"],
        maxlength: [100, "A név legfeljebb 100 karakter lehet!"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Az e-mail cím megadása kötelező!"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Érvénytelen e-mail cím!"],
        maxlength: [100, "Az e-mail cím legfeljebb 100 karakter lehet!"]
    },
    targy: {
        type: String,
        trim: true,
        required: [true, "A tárgy megadása kötelező!"],
        minlength: [3, "A tárgy legalább 3 karakter legyen!"],
        maxlength: [150, "A tárgy legfeljebb 150 karakter lehet!"]
    },
    szoveg: {
        type: String,
        trim: true,
        required: [true, "Az üzenet szövege kötelező!"],
        minlength: [10, "Az üzenet legalább 10 karakter legyen!"],
        maxlength: [2000, "Az üzenet legfeljebb 2000 karakter lehet!"]
    },
    kuldes_ideje: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Uzenet", uzenetSchema, "uzenet");
