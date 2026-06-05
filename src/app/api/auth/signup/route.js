import dbConnect from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";
import { getRoleHome, isValidRole } from "@/lib/roles";
import { User } from "@/models";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();
    const email = body.email?.toLowerCase().trim();
    const password = body.password;
    const role = body.role;

    if (!name || !email || !password || !role) {
      return Response.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!isValidRole(role)) {
      return Response.json({ error: "Please choose a valid role." }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return Response.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const user = await User.create({
      name,
      email,
      passwordHash: await hashPassword(password),
      role,
    });

    return Response.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectTo: getRoleHome(user.role),
    }, { status: 201 });
  } catch (error) {
    console.error("Signup failed", error);
    return Response.json({ error: "Unable to create account right now." }, { status: 500 });
  }
}
