import Messages from "@/models/Message";
import db from "@/utils/db";
import { Types } from "mongoose";

export default async function handler(req, res) {
  const Method = req.method;
  if (Method === "POST") {
    await db.connect();
    const data = await Messages.aggregate([
      { $match: { _id: Types.ObjectId(req.body.messageId) } },
      {
        $lookup: {
          from: "reactions",
          localField: "_id",
          foreignField: "messageId",
          as: "reacts",
        },
      },
    ]);

    res.status(200).json(data);
    await db.disconnect();
  }
}
