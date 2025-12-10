"use client";

import { Heading, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { ReactElement, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { authFormSchema, AuthFormType } from "@/interfaces/auth-interface";
import Form from "./form";
import ErrorMessage from "./error-message";

export default function RegisterForm(): ReactElement {
  const t = useTranslations("login");
  const router = useRouter();
  const [formAuthError, setFormAuthError] = useState<string>();
  const [isUserExist, setIsUserExist] = useState<boolean>();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const onSubmit: SubmitHandler<AuthFormType> = async (values: z.infer<typeof authFormSchema>) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "User already exists") {
          setIsUserExist(true);
        } else {
          setFormAuthError(data.error || "Registration failed");
        }
        return;
      }

      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      setFormAuthError("Registration failed");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Heading size="6" as="h1">
        {t("register")}
      </Heading>
      <Text color="gray">{t("sentence")}</Text>
      <Form submitFunction={onSubmit} formTypeName={t("register")} />
      {isUserExist && <ErrorMessage errorValue={t("form.errors.userExist")} errorType="2" />}
      {isSuccess && <ErrorMessage errorValue="Registration successful! Redirecting to login..." errorType="1" />}
      {formAuthError && <ErrorMessage errorValue={formAuthError} errorType="2" />}
    </div>
  );
}
