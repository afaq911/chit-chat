import Messages from "../../../models/Message";
import db from "../../../utils/db";

export default async function handler(req, res) {
  const Method = req.method;
  const { id } = req.query;

  if (Method === "GET") {
    await db.connect();
    const messages = await Messages.aggregate([
      { $match: { conversationId: id } },
      {
        $lookup: {
          from: "reactions",
          localField: "_id",
          foreignField: "messageId",
          as: "reacts",
        },
      },
    ]);
    res.status(200).json(messages);
    await db.disconnect();
  }
}
