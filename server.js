const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   MONGOOSE CONNECTION
========================= */

mongoose.connect("mongodb://127.0.0.1:27017/vivienne").then(() => {
    console.log("✅ MongoDB Connected");
}).catch((err) => {
    console.log("❌ MongoDB Connection Failed");
    console.log(err);
});

/* =========================
   SCHEMAS & MODELS
========================= */

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true },
    image_url: { type: String, default: 'ethnic-sarees.png' }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
    customer_name: { type: String, required: true },
    item_name: { type: String, required: true },
    amount: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    seller_name: { type: String, default: 'Admin' }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
    res.send("🚀 Backend Running Successfully");
});

/* =========================
   REGISTER API
========================= */

app.post("/register", async (req, res) => {
    try{
        const { name, email, password, phone, role } = req.body;
        const Model = role === 'seller' ? Admin : User;

        if(!name || !email || !password){
            return res.json({ success:false, message:"All fields are required" });
        }

        const existingUser = await Model.findOne({ email });
        if(existingUser) {
            return res.json({ success:false, message:"Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        let newUserData = { name, email, password: hashedPassword };
        if (role === 'seller' && phone) {
            newUserData.phone = phone;
        }

        await Model.create(newUserData);
        
        return res.json({ success:true, message:"Registration Successful ✅" });
    }catch(error){
        console.error("Register Error:", error);
        return res.json({ success:false, message:"Server Error" });
    }
});

/* =========================
   LOGIN API
========================= */

app.post("/login", async (req, res) => {
    try{
        const { email, password, role } = req.body;

        if(!email || !password || !role){
            return res.json({ success:false, message:"All fields required" });
        }

        if (role === 'seller') {
            const admin = await Admin.findOne({ email });
            if(!admin) return res.json({ success:false, message:"Seller Not Found" });
            
            const isMatch = await bcrypt.compare(password, admin.password);
            if(!isMatch) return res.json({ success:false, message:"Wrong Password" });
            
            return res.json({
                success:true,
                message:"Login Successful 🎉",
                name:admin.name,
                role:'seller'
            });
        } else {
            const user = await User.findOne({ email });
            if(!user) return res.json({ success:false, message:"User Not Found" });
            
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.json({ success:false, message:"Wrong Password" });
            
            return res.json({
                success:true,
                message:"Login Successful 🎉",
                name:user.name,
                role:'user'
            });
        }
    }catch(error){
        console.error("Login Error:", error);
        return res.json({ success:false, message:"Server Error" });
    }
});

/* =========================
   PRODUCTS API
========================= */

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, products: products });
    } catch(err) {
        res.json({ success: false, message: "Database Error" });
    }
});

app.post("/api/products", async (req, res) => {
    try {
        const { name, category, price, image_url } = req.body;
        const newProduct = await Product.create({
            name, 
            category, 
            price, 
            image_url: image_url || 'ethnic-sarees.png'
        });
        res.json({ success: true, message: "Product Added Successfully", productId: newProduct._id });
    } catch(err) {
        res.json({ success: false, message: "Failed to add product" });
    }
});

app.delete("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.json({ success: true, message: "Product removed" });
    } catch(err) {
        res.json({ success: false, message: "Failed to remove product" });
    }
});

/* =========================
   ORDERS API
========================= */

app.get("/api/orders", async (req, res) => {
    try {
        const { seller_name } = req.query;
        let query = {};
        if (seller_name) {
            query.seller_name = seller_name;
        }
        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json({ success: true, orders: orders });
    } catch(err) {
        res.json({ success: false, message: "Database Error" });
    }
});

app.post("/api/orders", async (req, res) => {
    try {
        const { customer_name, item_name, amount, seller_name } = req.body;
        await Order.create({
            customer_name, 
            item_name, 
            amount, 
            seller_name: seller_name || 'Admin'
        });

        // SIMULATE TWILIO SMS NOTIFICATION
        const admin = await Admin.findOne({ name: seller_name || 'Admin' });
        if (admin && admin.phone) {
            console.log(`\n========================================`);
            console.log(`💬 [MOCK SMS] sent via Twilio to ${admin.phone}`);
            console.log(`Shop Owner: ${admin.name}`);
            console.log(`Message: "New Order! ${customer_name} has placed an order for ${item_name} (₹${amount}). Check your dashboard."`);
            console.log(`========================================\n`);
        } else {
            console.log(`\n💬 [MOCK SMS] Could not send SMS: Seller '${seller_name}' not found or has no phone number.\n`);
        }

        res.json({ success: true, message: "Order placed successfully" });
    } catch(err) {
        res.json({ success: false, message: "Failed to place order" });
    }
});

/* =========================
   STATIC CLIENT APP
   ========================= */

app.use(express.static(path.join(__dirname, "frontend/dist")));

app.use((req, res, next) => {
    if (!req.url.startsWith("/api") && req.url !== "/login" && req.url !== "/register") {
        res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
    } else {
        next();
    }
});

/* =========================
   START SERVER
========================= */

const PORT = 5500;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
