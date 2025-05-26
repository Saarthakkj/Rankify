import mongoose, { Schema } from "mongoose"
interface IContent {
    content: string;
    url: string;
    sortedHashmap: Record<string, number>;  // ← new
}

const contentModel = new Schema<IContent>({
    content:   { type: String, required: true },
    url:       { type: String, required: true },
    sortedHashmap: {                // ← new
      type: Map,
      of: Number,
      default: {}
    }
})

export default mongoose.models.Content || mongoose.model("Content", contentModel)