import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.URL || mongoose.model("URL", UrlSchema);
