import { AuthError, Session } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { ReactElement } from "react";
import supabaseServer from "@/supabase/config";
import AuthForm from "./_components/auth-form";

export default async function LoginPage(): Promise<ReactElement | undefined> {
  const { data, error }: { data: { session: Session | null }; error: AuthError | null } =
    await supabaseServer().auth.getSession();

  if (error) {
    console.error(error);
  }

  if (data.session) {
    redirect("/");
  } else {
    return (
      <main>
        <AuthForm />
      </main>
    );
  }
}
