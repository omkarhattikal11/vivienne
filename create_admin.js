const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String }
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);

async function run() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/vivienne");
        console.log("Connected to MongoDB.");
        
        // Delete if already exists to ensure clean state
        await Admin.deleteOne({ email: "royal@rentals.com" });

        const hashedPassword = await bcrypt.hash("password123", 10);
        await Admin.create({
            name: "Royal Rentals",
            email: "royal@rentals.com",
            password: hashedPassword,
            phone: "9380021493"
        });
        
        console.log("Successfully created Royal Rentals admin!");
    } catch(err) {
        console.error("Error:", err);
    } finally {
        mongoose.disconnect();
    }
}
run();
