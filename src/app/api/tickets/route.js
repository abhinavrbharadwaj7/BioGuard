import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Ticket, Device, User } from "@/models";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    let query = {};
    if (session.user.role === "tenant") {
      query.hospitalId = session.user.id;
    } else if (session.user.role === "vendor") {
      query.assignedVendorId = session.user.id;
    }

    // Populate device and vendor info
    const tickets = await Ticket.find(query)
      .populate({ path: "deviceId", select: "name serialNumber location model" })
      .populate({ path: "assignedVendorId", select: "name email" })
      .populate({ path: "hospitalId", select: "name hospital" })
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ data: tickets });
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

    const newTicket = await Ticket.create({
      deviceId: body.deviceId,
      hospitalId: session.user.id,
      priority: body.priority,
      status: "received",
      issueDescription: body.issueDescription,
      errorCode: body.errorCode || "",
    });

    // Also update device status
    await Device.findByIdAndUpdate(body.deviceId, { status: "malfunctioning" });

    return NextResponse.json({ data: newTicket }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
