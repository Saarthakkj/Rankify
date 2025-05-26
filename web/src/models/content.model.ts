import mongoose, { Schema } from "mongoose"

interface IContent {
    content: string;
    url: string;
}

const contentModel = new Schema<IContent>({
    content: String,
    url: String
})

export default mongoose.models.Content || mongoose.model("Content", contentModel)