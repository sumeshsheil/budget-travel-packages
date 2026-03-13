import { step1Schema, step2Schema } from "@/lib/validations/booking";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { step, data } = body;

    let validation;
    if (step === 1) {
      validation = step1Schema.safeParse(data);
    } else if (step === 2) {
      validation = step2Schema.safeParse(data);
    } else {
      return NextResponse.json({ error: "Invalid step" }, { status: 400 });
    }

    if (!validation.success) {
      // Flatten Zod errors to be more client-friendly
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue: any) => {
        // Create a path string: "primaryContact.firstName"
        const path = issue.path.join(".");
        // Just take the first error message for each field
        if (!errors[path]) {
          errors[path] = issue.message;
        }
      });

      return NextResponse.json(
        {
          success: false,
          errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Validation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
