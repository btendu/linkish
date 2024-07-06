import connectDB from "@/lib/connectDB";
import userModel from "@/model/userModel";
export default async function handler(req, res) {
  try {
    await connectDB()
    const { userID } = req.body;
    console.log("data", userID,req.body);
    // Check if the user exists
    const user = await userModel.findOne({ _id : userID });
    console.log("data" , user)
    res.status(200).json({ message: "linkData", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}