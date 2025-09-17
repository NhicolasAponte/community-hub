import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { UserRoles } from "@/lib/data-model/enum-types";
import { eq, count } from "drizzle-orm";
import { z } from "zod";

const CreateAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Check if any admin users already exist
    const [adminCount] = await db
      .select({ count: count() })
      .from(usersTable)
      .where(eq(usersTable.role, UserRoles.ADMIN));

    if (adminCount.count > 0) {
      return NextResponse.json(
        { error: "Admin user already exists" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = CreateAdminSchema.parse(body);

    // Check if user with this email already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      saltRounds
    );

    // Create the admin user
    const [newUser] = await db
      .insert(usersTable)
      .values({
        email: validatedData.email,
        name: validatedData.name,
        hashedPassword,
        role: UserRoles.ADMIN,
        emailVerified: new Date(), // Mark as verified since this is initial setup
      })
      .returning();

    return NextResponse.json(
      {
        message: "Admin user created successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin user:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to check if setup is needed
export async function GET() {
  try {
    const [adminCount] = await db
      .select({ count: count() })
      .from(usersTable)
      .where(eq(usersTable.role, UserRoles.ADMIN));

    return NextResponse.json({
      setupRequired: adminCount.count === 0,
      adminCount: adminCount.count,
    });
  } catch (error) {
    console.error("Error checking admin setup status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
