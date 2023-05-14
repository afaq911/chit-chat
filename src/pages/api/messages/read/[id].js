import Messages from "../../../../models/Message";
import db from "../../../../utils/db";

export default async function handler(req, res) {
  const Method = req.method;
  const { id } = req.query;

  if (Method === "POST") {
    await db.connect();
    await Messages.updateMany(
      { conversationId: id, senderId: { $ne: req.body.senderId } },
      {
        isRead: true,
      }
    );
    res.status(200).json("Marked as read");
    await db.disconnect();
  }
}
