import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    
    let query = {};
    if (role) {
      query.role = role;
    }

    // Don't return password hashes
    const users = await User.find(query).select("-passwordHash").sort({ name: 1 });
    return NextResponse.json({ data: users });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
