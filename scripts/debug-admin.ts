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

async function debugAdmin() {
    try {
        const MONGODB_URL = process.env.MONGODB_URL;

        if (!MONGODB_URL) {
            console.error("MONGODB_URL not found in .env file");
            process.exit(1);
        }

        console.log("Connecting to database...");
        await mongoose.connect(MONGODB_URL);
        console.log("Connected!\n");

        // List all admins
        const admins = await Admin.find({});

        console.log(`Found ${admins.length} admin(s):\n`);

        admins.forEach((admin, index) => {
            console.log(`Admin ${index + 1}:`);
            console.log(`  Email: ${admin.email}`);
            console.log(`  Name: ${admin.name}`);
            console.log(`  Password Hash: ${admin.password.substring(0, 20)}...`);
            console.log(`  Created: ${admin.createdAt}\n`);
        });

        if (admins.length > 0) {
            // Test password verification
            const testPassword = "admin123";
            console.log(`Testing password "${testPassword}" against first admin...`);

            const isMatch = await bcrypt.compare(testPassword, admins[0].password);
            console.log(`Password match: ${isMatch}\n`);

            if (!isMatch) {
                console.log("Password doesn't match. Resetting now...");
                const newHashedPassword = await bcrypt.hash(testPassword, 12);
                admins[0].password = newHashedPassword;
                await admins[0].save();

                // Verify the new password
                const verifyMatch = await bcrypt.compare(testPassword, admins[0].password);
                console.log(`New password set and verified: ${verifyMatch}\n`);

                console.log(`✓ Password has been reset!`);
                console.log(`\nLogin credentials:`);
                console.log(`  Email: ${admins[0].email}`);
                console.log(`  Password: ${testPassword}`);
            } else {
                console.log(`✓ Password is already set to "${testPassword}"`);
                console.log(`\nLogin credentials:`);
                console.log(`  Email: ${admins[0].email}`);
                console.log(`  Password: ${testPassword}`);
            }
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

debugAdmin();
