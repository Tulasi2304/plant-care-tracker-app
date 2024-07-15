const mongoose = require("mongoose");
const careRoutineSchema = require("./CareRoutine.js").schema;

const plantSchema = new mongoose.Schema({
  name: String,
  scientificName: { type: String, default: "" },
  location: { type: String, default: "" },
  image: String,
  planted: {
    type: Date,
    default: new Date(),
  },
  careRoutines: [careRoutineSchema],
});

const Plant = mongoose.model("Plant", plantSchema);

module.exports = {"model": Plant, "schema": plantSchema};
