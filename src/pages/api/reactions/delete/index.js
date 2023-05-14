import Reactions from "@/models/Reactions";
import db from "@/utils/db";

export default async function handler(req, res) {
  const Method = req.method;

  if (Method === "POST") {
    try {
      await db.connect();
      await Reactions.deleteOne({
        senderId: req.body.senderId,
        messageId: req.body.messageId,
      });
      res.status(200).json("Reaction Removed");
      await db.disconnect();
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
