"use client";

import { Heading, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ReactElement, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { authFormSchema, AuthFormType } from "@/interfaces/auth-interface";
import { useUserSessionStore } from "@/stores/session-store";
import ErrorMessage from "./error-message";
import Form from "./form";

export default function LoginForm(): ReactElement {
  const t = useTranslations("login");
  const router = useRouter();
  const [formAuthError, setFormAuthError] = useState<string>();
  const setUser = useUserSessionStore((state) => state.setUser);

  const onSubmit: SubmitHandler<AuthFormType> = async (values: z.infer<typeof authFormSchema>) => {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setFormAuthError("Invalid email or password");
    } else if (result?.ok) {
      // Fetch session to update user store
      const { useSession } = await import("next-auth/react");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Heading size="6" as="h1">
        {t("title")}
      </Heading>
      <Text color="gray">{t("sentence")}</Text>
      <Form submitFunction={onSubmit} formTypeName={t("title")} />
      {formAuthError && <ErrorMessage errorValue={formAuthError} errorType="2" />}
    </div>
  );
}
