const mongoose = require("mongoose");

/* 1. Schema */

const kittySchema = new mongoose.Schema({
name: String,
time: Number,
});

kittySchema.methods.speak = function speak() {
const greeting = this.name
? "Meow name is " + this.name
: "I don't have a name";
console.log(greeting);
};

/* 2. model */
const Kitten = mongoose.model("Kitten", kittySchema);
module.exports = { Kitten };