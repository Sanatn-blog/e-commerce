import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import Product from "@/models/Product";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({}).lean();
    const customers = await Customer.find({}).lean();
    const products = await Product.find({}).lean();

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Calculate revenue by status
    const completedOrders = orders.filter((o) => o.status === "Delivered");
    const completedRevenue = completedOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    // Monthly revenue (last 12 months)
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();

      const monthOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear()
        );
      });

      return {
        month: `${month} ${year}`,
        revenue: monthOrders.reduce((sum, order) => sum + order.total, 0),
        orders: monthOrders.length,
      };
    }).reverse();

    // Order status breakdown
    const statusBreakdown = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top selling products
    const productSales = orders
      .flatMap((order) => order.items)
      .reduce((acc, item) => {
        const key = item.productId;
        if (!acc[key]) {
          acc[key] = {
            productId: key,
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        acc[key].quantity += item.quantity;
        acc[key].revenue += item.price * item.quantity;
        return acc;
      }, {} as Record<string, any>);

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    // Customer analytics
    const newCustomersThisMonth = customers.filter((customer) => {
      const customerDate = new Date(customer.createdAt);
      const now = new Date();
      return (
        customerDate.getMonth() === now.getMonth() &&
        customerDate.getFullYear() === now.getFullYear()
      );
    }).length;

    // Average order value
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    return NextResponse.json({
      overview: {
        totalRevenue,
        completedRevenue,
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        avgOrderValue,
        newCustomersThisMonth,
      },
      monthlyRevenue,
      statusBreakdown,
      topProducts,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
