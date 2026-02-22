import bcrypt from "bcryptjs";
import connectDB from "../lib/mongodb";
import Admin from "../models/Admin";

async function resetAdminPassword() {
    try {
        await connectDB();

        // First, list all admins
        const admins = await Admin.find({}).select("email name createdAt");

        console.log("\n=== Existing Admins ===");
        if (admins.length === 0) {
            console.log("No admins found in database!");
            console.log("\nYou need to create an admin first.");
            console.log("Run: curl -X POST http://localhost:3000/api/admin/create \\");
            console.log('  -H "Content-Type: application/json" \\');
            console.log('  -d \'{"email":"admin@example.com","password":"admin123","name":"Admin"}\'');
            process.exit(1);
        }

        admins.forEach((admin, index) => {
            console.log(`${index + 1}. Email: ${admin.email}, Name: ${admin.name}`);
        });

        // Update these values based on the list above
        const adminEmail = "admin@example.com"; // Change to your admin email from the list above
        const newPassword = "admin123"; // Change to your new password

        console.log(`\n=== Resetting Password ===`);
        console.log(`Target email: ${adminEmail}`);

        const admin = await Admin.findOne({ email: adminEmail });

        if (!admin) {
            console.error(`\nAdmin with email "${adminEmail}" not found!`);
            console.log("Please update the adminEmail variable in the script with one of the emails listed above.");
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        admin.password = hashedPassword;
        await admin.save();

        console.log(`\n✓ Password successfully reset for ${adminEmail}`);
        console.log(`✓ New password: ${newPassword}`);
        console.log(`\nYou can now login with:`);
        console.log(`  Email: ${adminEmail}`);
        console.log(`  Password: ${newPassword}`);
        process.exit(0);
    } catch (error) {
        console.error("Error resetting password:", error);
        process.exit(1);
    }
}

resetAdminPassword();
