import Conversations from "../../../models/Conversations";
import db from "../../../utils/db";

export default async function handler(req, res) {
  const Method = req.method;

  if (Method === "POST") {
    await db.connect();
    let data;

    const isExist = await Conversations.findOne({
      users: [req.body.senderId, req.body.recieverId],
    });

    if (isExist) {
      data = isExist;
    } else {
      const newConversation = new Conversations({
        users: [req.body.senderId, req.body.recieverId],
      });
      data = await newConversation.save();
    }

    res.status(200).json(data);
    await db.disconnect();
  }
}
