import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Device } from "@/models";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    let query = {};
    if (session.user.role === "tenant") {
      query.tenantId = session.user.id;
    } else if (session.user.role === "vendor") {
      // Vendors don't typically query the global device list
      return NextResponse.json({ data: [] });
    }

    const devices = await Device.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ data: devices });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "tenant") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    const devicesToInsert = body.devices.map(d => ({
      ...d,
      tenantId: session.user.id,
      status: "active"
    }));

    const result = await Device.insertMany(devicesToInsert);

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
