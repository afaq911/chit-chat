import Users from "../../../models/Users";
import db from "../../../utils/db";

export default async function handler(req, res) {
  const Method = req.method;
  const { id } = req.query;

  if (Method === "GET") {
    await db.connect();
    const user = await Users.findOne({ email: id });
    res.status(200).json(user);
    await db.disconnect();
  }
}
