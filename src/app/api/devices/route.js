import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Device } from "@/models";
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const API_URL = process.env.BACKEND_URL || "http://localhost:4000";
    const res = await fetch(`${API_URL}/api/devices?tenantId=${session.user.id}&role=${session.user.role}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const isDemo = searchParams.get("demo") === "1";

    let tenantId;
    if (isDemo) {
      tenantId = "60d5ecb8b392d700153ee101";
    } else {
      const session = await getServerSession(authOptions);
      if (!session || session.user.role !== "tenant") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      tenantId = session.user.id;
    }

    const body = await request.json();
    const devicesToInsert = body.devices.map(d => ({
      ...d,
      tenantId: tenantId,
      status: "operational",
      createdAt: new Date().toISOString()
    }));

    const API_URL = process.env.BACKEND_URL || "http://localhost:4000";
    const res = await fetch(`${API_URL}/api/devices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devicesToInsert })
    });
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
