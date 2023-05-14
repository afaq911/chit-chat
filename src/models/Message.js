import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversationId: { type: String },
    senderId: { type: String },
    media: { type: Array },
    type: { type: Number, default: 1 },
    message: { type: String },
    isRecieved: { type: Array },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Messages =
  mongoose.models.Messages || mongoose.model("Messages", MessageSchema);

export default Messages;
