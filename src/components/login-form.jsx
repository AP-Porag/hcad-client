import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import { loginUser } from "@/services/auth/auth.service";

import { setAuth } from "@/lib/auth";

const loginSchema = z.object({
  email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email"),

  password: z
      .string()
      .min(1, "Password is required"),
});

export function LoginForm({
                            className,
                            ...props
                          }) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] =
      useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid,
    },
  } = useForm({
    resolver:
        zodResolver(loginSchema),

    mode: "onChange",

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);

      const response =
          await loginUser(values);

      setAuth(response.data);

      toast.success(
          "Login successful"
      );

      navigate("/admin");
    } catch (error) {
      toast.error(
          error?.response?.data
              ?.message ||
          "Login failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <form
          onSubmit={handleSubmit(
              onSubmit
          )}
          className={cn(
              "flex flex-col gap-6",
              className
          )}
          {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">
              Login to your
              account
            </h1>

            <p className="text-sm text-balance text-muted-foreground">
              Enter your email
              below to login to
              your account
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="email">
              Email
            </FieldLabel>

            <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="bg-background"
                {...register(
                    "email"
                )}
            />

            {errors.email && (
                <p className="text-sm text-red-500">
                  {
                    errors
                        .email
                        .message
                  }
                </p>
            )}
          </Field>

          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">
                Password
              </FieldLabel>
            </div>

            <Input
                id="password"
                type="password"
                required
                className="bg-background"
                {...register(
                    "password"
                )}
            />

            {errors.password && (
                <p className="text-sm text-red-500">
                  {
                    errors
                        .password
                        .message
                  }
                </p>
            )}
          </Field>

          <Field>
            <Button
                type="submit"
                className="w-full"
                disabled={
                    !isValid ||
                    isLoading
                }
            >
              {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Login
            </Button>
          </Field>
        </FieldGroup>
      </form>
  );
}
