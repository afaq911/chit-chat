import Reactions from "@/models/Reactions";
import db from "@/utils/db";

export default async function handler(req, res) {
  const Method = req.method;

  if (Method === "POST") {
    try {
      await db.connect();
      const isReaction = await Reactions.findOne({
        messageId: req.body.messageId,
        senderId: req.body.senderId,
      });

      if (isReaction) {
        const updatedReaction = await Reactions.findByIdAndUpdate(
          isReaction._id,
          {
            reaction: req.body.reaction,
          }
        );
        res.status(200).json(updatedReaction);
        await db.disconnect();
        return;
      } else {
        const newReaction = new Reactions(req.body);
        const savedReaction = await newReaction.save();
        res.status(200).json(savedReaction);
        await db.disconnect();
        return;
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
