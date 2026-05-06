"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/app/types/auth/schemas/register-schema";
import { register } from "@/app/actions/auth/register";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckCircle2, Building2, User } from "lucide-react";

interface Props {
  onClose: () => void;
  onShowLogin: () => void;
}

export default function RegisterForm({ onClose, onShowLogin }: Props) {
  const t = useTranslations("auth.register");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      company_name: "",
      company_cif_nif: "",
      company_email: "",
      company_address_line: "",
      company_city: "",
      company_postal_code: "",
      user_name: "",
      user_email: "",
      user_password: "",
      user_password_confirm: "",
    },
  });

  const globalError = form.formState.errors.root?.message;

  const onSubmit = (values: RegisterFormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.set(k, v));

    startTransition(async () => {
      const result = await register(undefined, formData);
      if (!result) return;
      if ("success" in result) {
        setSuccess(true);
        toast.success(t("successToast"));
      } else if ("fieldError" in result) {
        form.setError(result.fieldError.field as keyof RegisterFormValues, {
          message: result.fieldError.message,
        });
        toast.error(result.fieldError.message);
      } else if ("error" in result) {
        form.setError("root", { message: result.error });
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="text-2xl font-light tracking-tight">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-xs font-light tracking-widest uppercase">
            {t("subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {success ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-medium text-center">
                {t("successTitle")}
              </h3>
              <p className="text-base text-muted-foreground text-center max-w-md">
                {t("successDescription")}
              </p>
              <Button onClick={() => { onClose(); onShowLogin() }} className="mt-6 px-8">
                {t("successCta")}
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-8"
              >
                {globalError && (
                  <Alert variant="destructive">
                    <AlertDescription>{globalError}</AlertDescription>
                  </Alert>
                )}

                {/* Sección empresa */}
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Building2 className="w-5 h-5 text-primary shrink-0" />
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {t("companySection")}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>{t("companyName")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("companyNamePh")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company_cif_nif"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("cifNif")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("cifNifPh")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("companyEmail")}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t("companyEmailPh")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company_address_line"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>{t("address")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("addressPh")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company_city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("city")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("cityPh")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company_postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("postalCode")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("postalCodePh")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Sección administrador */}
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <User className="w-5 h-5 text-primary shrink-0" />
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {t("adminSection")}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="user_name"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>{t("fullName")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("fullNamePh")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="user_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("email")}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t("emailPh")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div />
                    <FormField
                      control={form.control}
                      name="user_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("password")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t("passwordPh")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="user_password_confirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("passwordConfirm")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t("passwordConfirmPh")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2 pb-1">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-6 text-base"
                  >
                    {isPending ? t("submitPending") : t("submit")}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground mt-4">
                    {t("terms")}
                  </p>
                </div>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
