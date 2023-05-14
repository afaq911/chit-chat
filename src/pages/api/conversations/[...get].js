import Conversations from "../../../models/Conversations";
import db from "../../../utils/db";

export default async function handler(req, res) {
  const Method = req.method;

  if (Method === "GET") {
    await db.connect();
    const Conversation = await Conversations.find({
      users: { $in: req.query.id },
    });
    res.status(200).json(Conversation);
    await db.disconnect();
  }
}
