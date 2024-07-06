import userModel from "@/model/userModel";
import connectDB from "@/lib/connectDB";
export default async function handler(req, res) {
  try {
    await connectDB()
    const { title, link, status, userId } = req.body;
    console.log("Data getting" , title, link, status, userId)
    // Check if the user exists
    const user = await userModel.findOne({_id : userId});
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
console.log("Data found" , user)
    // Push new link object to the links array
    user.links.push({ title, link, status });

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Link added successfully", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
