const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  links: [
    {
      title: { type: String },
      link: { type: String },
      status: { type: String },
    },
  ],
});
module.exports =mongoose.models.User || mongoose.model('User', userSchema);
// module.exports = mongoose.model("User", userSchema);
