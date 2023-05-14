import Users from "../../../models/Users";
import bcrypt from "bcryptjs";
import db from "../../../utils/db";

const handler = async (req, res) => {
  const Method = req.method;

  if (Method === "POST") {
    await db.connect();
    const saltrounds = 10;
    if (req.body.password) {
      req.body.password = await bcrypt.hash("1234", saltrounds);
    }

    const isEmail = await Users.findOne({ email: req.body.email });

    if (isEmail) {
      res.status(401).json("Email Already Taken");
      return;
    }

    const newUser = new Users(req.body);
    await newUser.save();
    await db.disconnect();
    res.status(200).json("Registered Successfully");
  }
};

export default handler;
