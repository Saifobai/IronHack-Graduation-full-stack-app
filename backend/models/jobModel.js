const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        task: { type: String, required: true },
        payload: { type: Object },
        result: { type: Object },
        status: {
            type: String,
            enum: ["processing", "finished", "failed"],
            default: "processing",
        },
        cost: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
