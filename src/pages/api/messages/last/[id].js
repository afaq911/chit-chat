import db from "@/utils/db";
import Messages from "../../../../models/Message";

export default async function handler(req, res, next) {
  const Method = req.method;
  const { id } = req.query;

  if (Method === "GET") {
    await db.connect();
    let lastMessage = await Messages.aggregate([
      { $match: { conversationId: id } },
      {
        $lookup: {
          from: "reactions",
          localField: "_id",
          foreignField: "messageId",
          as: "reacts",
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 1 },
    ]);
    await db.disconnect();
    res.status(200).json(lastMessage[0]);
  }
}
