import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function createAdmin() {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;

    if (!MONGODB_URL) {
      console.error("❌ MONGODB_URL not found in .env file");
      process.exit(1);
    }

    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URL);
    console.log("✅ Connected to MongoDB");

    const email = process.argv[2] || "admin@example.com";
    const password = process.argv[3] || "Admin123!";
    const name = process.argv[4] || "Admin User";

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("⚠️  Admin with this email already exists");
      console.log("Email:", existingAdmin.email);
      console.log("Name:", existingAdmin.name);
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("👤 Creating admin...");
    const admin = await Admin.create({
      email,
      password: hashedPassword,
      name,
    });

    console.log("\n✅ Admin created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:", admin.email);
    console.log("👤 Name:", admin.name);
    console.log("� Passlword:", password);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n🌐 Login at: http://localhost:3000/admin/login");

    await mongoose.connection.close();
    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

createAdmin();
