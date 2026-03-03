import mongoose from "mongoose";

const CategoryResultSchema = new mongoose.Schema({
    product_name: String,
    product_description: String,
    ai_output: mongoose.Schema.Types.Mixed,
    created_at: {
        type:Date,
        default: Date.now,
    }
});
export default mongoose.model("CategoryResult",CategoryResultSchema);