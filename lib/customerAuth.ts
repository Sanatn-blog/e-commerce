import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
);

export async function createCustomerToken(payload: {
  customerId: string;
  email: string;
  name?: string;
  phone?: string;
}) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  return token;
}

export async function verifyCustomerToken(token: string) {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch (err) {
    return null;
  }
}

export async function getCustomerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customer-token")?.value;

  if (!token) return null;

  return await verifyCustomerToken(token);
}

export async function setCustomerSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("customer-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

export async function clearCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete("customer-token");
}
