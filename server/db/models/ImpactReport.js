import mongoose from "mongoose";

const ImpactReportSchema = new mongoose.Schema({
    order_data: mongoose.Schema.Types.Mixed,
    ai_output: mongoose.Schema.Types.Mixed,
    impact_statement: String,
    created_at: {
        type:Date,
        default: Date.now,
    }
});
export default mongoose.model("ImpactReport",ImpactReportSchema);