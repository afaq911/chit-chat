import mongoose, { Types } from "mongoose";

const ReactionSchema = new mongoose.Schema(
  {
    messageId: { type: Types.ObjectId },
    senderId: { type: String },
    reaction: { type: Object },
  },
  { timestamps: true }
);

const Reactions =
  mongoose.models.Reactions || mongoose.model("Reactions", ReactionSchema);

export default Reactions;
