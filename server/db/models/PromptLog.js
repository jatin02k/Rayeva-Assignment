import mongoose from "mongoose";

const PromptLogSchema = new mongoose.Schema({
    module: String,
    prompt: String,
    response: String,
    created_at: {
        type:Date,
        default: Date.now,
    }
});
export default mongoose.model("PromptLog",PromptLogSchema);