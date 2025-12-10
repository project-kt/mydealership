import { redirect } from "next/navigation";
import { ReactElement } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import AuthForm from "./_components/auth-form";

export default async function LoginPage(): Promise<ReactElement | undefined> {
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
