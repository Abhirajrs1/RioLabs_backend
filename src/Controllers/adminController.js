import { User } from "../Models/userCollection.js";

const adminController={
    getAllUsers:async(req,res)=>{
        try {
            if (req.user.role !== "admin") {
                return res.status(403).json({ success: false, message: "Access denied" });
            }
            const users = await User.find({ role: "user" });
            return res.status(200).json({ success: true, users });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    changeUserToAdmin: async (req, res) => {
        const { id } = req.params;
        const { role } = req.body;
        console.log(id,"ID")
        console.log(role,"ROle")
        try {
            await User.findByIdAndUpdate(id, { role });
            res.status(200).json({ message: 'User role updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update role' });
        }
    }
}
export default adminController