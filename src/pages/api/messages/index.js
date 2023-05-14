import Messages from "../../../models/Message";
import Conversations from "../../../models/Conversations";
import db from "../../../utils/db";

export default async function handler(req, res) {
  const Method = req.method;

  if (Method === "POST") {
    await db.connect();
    const newMessage = new Messages(req.body);
    const savedMessage = await newMessage.save();
    await Conversations.findByIdAndUpdate(req.body.conversationId, {
      updatedAt: new Date(),
      isStarted: true,
    });
    res.status(200).json(savedMessage);
    await db.disconnect();
  }
}
