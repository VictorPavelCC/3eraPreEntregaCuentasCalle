const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ticketSchema = new mongoose.Schema({
  code: { type: String,default: uuidv4(), unique: true, required: true },
  purchase_datetime: { type: Date, default: Date.now, required: true },
  amount: {type: Number, required: true},
  purchaser: {type: String, required: true}
});

const ticketModel = mongoose.model("tickets", ticketSchema);

module.exports = { ticketModel };