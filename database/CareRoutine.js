const mongoose = require("mongoose");

const careRoutineSchema = new mongoose.Schema({
  type: String,
  frequency: Number,
  gap: { type: String, enum: ["Minutes", "Hours", "Days", "Weeks"] },
  lastCompleted: { type: Date, default: new Date() },
  nextDue: { type: Date, required: true},
});

const CareRoutine = mongoose.model("CareRoutine", careRoutineSchema);

module.exports = {"model": CareRoutine, "schema": careRoutineSchema};
