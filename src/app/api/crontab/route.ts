import { mailTransporter } from "@/mailer";
import { query } from "@/db/config";
import { Tables } from "../../../../types/database.types";

export async function GET() {
  const isEmailActive: string | undefined = process.env.NEXT_EMAIL;

  if (isEmailActive && isEmailActive === "true") {
    try {
      const result = await query<Tables<"Car">>('SELECT * FROM "Car" LIMIT 1');

      if (result.rows.length > 0 && result.rows[0].carId > 0) {
        try {
          await mailTransporter.sendMail({
            to: process.env.NEXT_EMAIL_TO,
            subject: "My Dealership website check",
            text: "Database connection verified. System is operational.",
          });

          return new Response("Email sent", { status: 200 });
        } catch (error) {
          return new Response("Send email error", { status: 400 });
        }
      }
    } catch (error) {
      console.error("Database error:", error);
      return new Response("Database error", { status: 500 });
    }
  }

  return new Response("Wrong body", { status: 400 });
}
