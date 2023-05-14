import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    users: { type: Array },
    isStarted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Conversations =
  mongoose.models.Conversations ||
  mongoose.model("Conversations", ConversationSchema);
export default Conversations;
