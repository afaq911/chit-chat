import Conversations from "@/models/Conversations";
import Messages from "@/models/Message";
import db from "@/utils/db";

export default async function handler(req, res) {
  const Method = req.method;
  const { id } = req.query;

  if (Method === "POST") {
    try {
      await db.connect();
      const Conversation = await Conversations.find({ users: { $in: id } });
      for (let i = 0; i < Conversation.length; i++) {
        let item = Conversation[i];
        await Messages.updateMany(
          {
            conversationId: item?._id,
            senderId: { $ne: id },
            isRecieved: { $nin: id },
          },
          {
            $push: { isRecieved: id },
          }
        );
      }
      res.status(200).json("Messages Recieved");
      await db.disconnect();
      // Conversation?.map(async (item) => {});
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
