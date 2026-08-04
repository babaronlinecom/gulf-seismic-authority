import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";
import bcrypt from "bcryptjs";

/** POST /api/admin/settings/users — create a new admin user (admin role only) */
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await db.adminUser.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);
  const user = await db.adminUser.create({
    data: { name, email: email.toLowerCase(), passwordHash: hash, role: "editor" },
    select: { id: true, email: true, name: true, role: true },
  });

  return NextResponse.json({ ok: true, user });
}
