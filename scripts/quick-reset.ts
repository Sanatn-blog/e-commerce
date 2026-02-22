import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Admin Schema
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

async function quickReset() {
    try {
        const MONGODB_URL = process.env.MONGODB_URL;

        if (!MONGODB_URL) {
            console.error("MONGODB_URL not found in .env file");
            process.exit(1);
        }

        console.log("Connecting to database...");
        await mongoose.connect(MONGODB_URL);
        console.log("Connected!");

        // Find the first admin
        const admin = await Admin.findOne({});

        if (!admin) {
            console.log("\nNo admin found in database!");
            console.log("Creating a new admin...");

            const newPassword = "admin123";
            const hashedPassword = await bcrypt.hash(newPassword, 12);

            const newAdmin = await Admin.create({
                email: "admin@example.com",
                password: hashedPassword,
                name: "Admin"
            });

            console.log(`\n✓ Admin created successfully!`);
            console.log(`\nLogin with:`);
            console.log(`  Email: ${newAdmin.email}`);
            console.log(`  Password: ${newPassword}`);
        } else {
            const newPassword = "admin123";
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            admin.password = hashedPassword;
            await admin.save();

            console.log(`\n✓ Password reset successful!`);
            console.log(`\nLogin with:`);
            console.log(`  Email: ${admin.email}`);
            console.log(`  Password: ${newPassword}`);
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

quickReset();
