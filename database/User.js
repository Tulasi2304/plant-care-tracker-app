const mongoose = require("mongoose");
const plantSchema = require("./Plant.js").schema;

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, match: /^\d{10}$/ },
  password: String,
  plants: {type: [plantSchema], default: []}
});

// userSchema.pre("save", function (next) {
//   const user = this;

//   bcrypt.hash(user.password, 10, function (error, hash) {
//     user.password = hash;
//     next();
//   });
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
