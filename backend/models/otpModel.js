const mongoose = require("mongoose");
const Schema=mongoose.Schema

const otpSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "user",
		unique: true,
	},
	otp: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, expires: 600 },//10 min
});

module.exports = mongoose.model("otp", otpSchema);