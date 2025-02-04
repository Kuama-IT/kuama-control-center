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
import { useTransition } from "react";
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

type Props = {
  clientId: number;
  onCredentialsValid: (credentials: KPlatformCredentialsValidForm) => void;
};

export const KPlatformCredentialsForm = ({
  clientId,
  onCredentialsValid,
}: Props) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<KPlatformCredentialsValidForm>({
    resolver: zodResolver(kPlatformCredentialsFormSchema),
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 min-w-48 p-8"
        onSubmit={form.handleSubmit(onCredentialsValid, console.error)}
      >
        <p className="text-2xl uppercase font-bold">Add new credential</p>
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Input placeholder="A talking name" {...field} />
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
                <Input placeholder="******" type="password" {...field} />
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
                <Input placeholder="http://a.domain" {...field} />
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
