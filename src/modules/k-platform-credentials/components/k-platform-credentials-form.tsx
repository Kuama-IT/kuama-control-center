"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  kPlatformCredentialsFormSchema,
  KPlatformCredentialsValidForm,
  KSupportedPlatforms,
} from "@/modules/k-platform-credentials/schemas/k-platform-credentials-schemas";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

import createKPlatformCredentials from "@/modules/k-platform-credentials/actions/k-platform-credentials-create-action";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { isFailure } from "@/utils/server-action-utils";
import { toast } from "sonner";

type Props = {
  clientId: number;
};

export const KPlatformCredentialsForm = ({ clientId }: Props) => {
  const form = useForm<KPlatformCredentialsValidForm>({
    resolver: zodResolver(kPlatformCredentialsFormSchema),
    defaultValues: {
      platform: KSupportedPlatforms.options[0],
      name: "",
      persistentToken: "",
      endpoint: "",
    },
  });

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const onCredentialsValidAction = async (
    credentials: KPlatformCredentialsValidForm,
  ) => {
    startTransition(async () => {
      const res = await createKPlatformCredentials({
        ...credentials,
        clientId,
      });
      if (isFailure(res)) {
        toast("Error during credentials creation, check server logs", {
          className: "bg-error text-foreground",
        });
        return;
      }
      router.refresh();
      form.reset();
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 min-w-48 p-8 bg-accent rounded text-foreground"
        onSubmit={form.handleSubmit(onCredentialsValidAction, console.error)}
      >
        <p className="text-2xl uppercase font-bold">Add new credentials</p>
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pick a platform" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Platform</SelectLabel>
                    {KSupportedPlatforms.options.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <FormDescription>
                The external tracker platform to import spent time from.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="A talking name"
                  {...field}
                  autoComplete="one-time-code"
                />
              </FormControl>
              <FormDescription>
                A human readable name for this credentials.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="persistentToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persistent token</FormLabel>
              <FormControl>
                <Input
                  placeholder="******"
                  type="password"
                  {...field}
                  autoComplete="one-time-code"
                />
              </FormControl>
              <FormDescription>The api secret token.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endpoint</FormLabel>
              <FormControl>
                <Input
                  placeholder="http://a.domain"
                  {...field}
                  autoComplete="one-time-code"
                />
              </FormControl>
              <FormDescription>
                The api endpoint to be used in order to read spent time.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button size="lg" disabled={isPending || !form.formState.isValid}>
          Save
        </Button>
      </form>
    </Form>
  );
};
