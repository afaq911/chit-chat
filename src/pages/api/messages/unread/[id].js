import db from "@/utils/db";
import Messages from "../../../../models/Message";

export default async function handler(req, res, next) {
  const Method = req.method;
  const { id } = req.query;

  if (Method === "POST") {
    await db.connect();
    let unReadMessages = await Messages.find({
      conversationId: id,
      isRead: false,
      senderId: { $ne: req.body.senderId },
    });
    await db.disconnect();
    res.status(200).json(unReadMessages);
  }
}
