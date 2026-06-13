import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Ticket, Device, User } from "@/models";
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const API_URL = process.env.BACKEND_URL || "http://localhost:4000";
    const res = await fetch(`${API_URL}/api/tickets?tenantId=${session.user.id}&role=${session.user.role}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
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

    const body = await request.json();
    const newTicketData = {
      _id: Math.random().toString(36).substr(2, 9),
      deviceId: body.deviceId,
      hospitalId: session.user.id,
      priority: body.priority,
      status: "received",
      issueDescription: body.issueDescription,
      errorCode: body.errorCode || "",
      createdAt: new Date().toISOString()
    };

    const API_URL = process.env.BACKEND_URL || "http://localhost:4000";
    const res = await fetch(`${API_URL}/api/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket: newTicketData, deviceId: body.deviceId })
    });
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
