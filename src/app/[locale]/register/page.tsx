import { redirect } from "next/navigation";
import { ReactElement } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import AuthForm from "../login/_components/auth-form";

export default async function page(): Promise<ReactElement | undefined> {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <main>
      <AuthForm />
    </main>
  );
}
