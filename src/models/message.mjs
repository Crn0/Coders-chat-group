import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  title: { type: String, minLength: 1, maxLength: 100, required: true },
  message: { type: String, minLength: 1, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  secret: { type: Boolean, default: false },
  date: { type: Date, default: Date },
});

messageSchema.virtual("dateFormatted").get(function () {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return this.date
    .toLocaleDateString([], options)
    .split(" ")
    .slice(1)
    .join(" ");
});

export default mongoose.model("Message", messageSchema);
