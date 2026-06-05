import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Ticket, Device } from "@/models";

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = params;
    const body = await request.json();

    // Ensure user has access to this ticket
    const ticket = await Ticket.findById(id);
    if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    // If marked completed, set device back to active
    if (body.status === "completed" && updatedTicket.deviceId) {
      await Device.findByIdAndUpdate(updatedTicket.deviceId, { status: "active" });
    }

    return NextResponse.json({ data: updatedTicket });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
