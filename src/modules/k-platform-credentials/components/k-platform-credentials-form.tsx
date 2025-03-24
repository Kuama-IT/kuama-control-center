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
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { isFailure } from "@/utils/server-action-utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { KClientListAllAction } from "@/modules/k-clients/actions/k-client-list-all-action";
import { FaSync } from "react-icons/fa";

type Props = {
  clientId?: number;
  employeeId?: number;
  projectId?: number;
  clients?: KClientListAllAction;
};

export const KPlatformCredentialsForm = ({
  clientId,
  employeeId,
  projectId,
  clients,
}: Props) => {
  if (!clients && !clientId) {
    throw new Error("[DEV] Missing clients or clientId prop");
  }

  const form = useForm<KPlatformCredentialsValidForm>({
    resolver: zodResolver(kPlatformCredentialsFormSchema),
    defaultValues: {
      platform: KSupportedPlatforms.options[0],
      name: "",
      persistentToken: "",
      endpoint: "",
      clientId: clientId?.toString(),
      employeeId: employeeId?.toString(),
      projectId: projectId?.toString(),
    },
  });

  const formClientId = form.watch("clientId");
  const formProjectId = form.watch("projectId");

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const onCredentialsValidAction = async (
    credentials: KPlatformCredentialsValidForm,
  ) => {
    startTransition(async () => {
      const res = await createKPlatformCredentials({
        ...credentials,
      });
      if (isFailure(res)) {
        notifyError("Error during credentials creation, check server logs");
        return;
      }
      notifySuccess("Credentials created");
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
                  <SelectTrigger className="w-[180px] bg-background">
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
                The external tracker platform to import data from.
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
                  className="bg-background"
                />
              </FormControl>
              <FormDescription>
                A human readable name for this credentials.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {clients && (
          <FormField
            control={form.control}
            name="clientId"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <FormControl>
                  <SearchableCombobox
                    value={value?.toString()}
                    onChange={onChange}
                    options={clients.map(({ id, name }) => ({
                      id: id.toString(),
                      name,
                    }))}
                    label="Select client..."
                    searchLabel="Select client..."
                    noResultsLabel="No client found"
                  />
                </FormControl>
                <FormDescription>
                  Client related to these credentials (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {clients && formClientId && (
          <FormField
            control={form.control}
            name="projectId"
            render={({ field: { onChange, value } }) => {
              const clientProjects =
                clients.find(
                  (client) => client.id.toString() === formClientId.toString(),
                )?.projects ?? [];
              return (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <SearchableCombobox
                      label="Select project..."
                      searchLabel="Select project..."
                      noResultsLabel="No project found"
                      value={value?.toString()}
                      onChange={onChange}
                      options={clientProjects.map(({ id, name }) => ({
                        id: id.toString(),
                        name: name ?? "",
                      }))}
                    />
                  </FormControl>
                  <FormDescription>
                    Projects related to these credentials (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        {clients && formClientId && formProjectId && (
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field: { onChange, value } }) => {
              const clientProjects =
                clients.find(
                  (client) => client.id.toString() === formClientId.toString(),
                )?.projects ?? [];

              const projectEmployees =
                clientProjects.find(
                  (project) =>
                    project.id.toString() === formProjectId.toString(),
                )?.team ?? [];
              return (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <FormControl>
                    <SearchableCombobox
                      label="Select employee..."
                      searchLabel="Select employee..."
                      noResultsLabel="No employee found"
                      value={value?.toString()}
                      onChange={onChange}
                      options={projectEmployees.map(
                        ({ id, name, surname, fullName }) => ({
                          id: id.toString(),
                          name: fullName ?? `${name} ${surname}`,
                        }),
                      )}
                    />
                  </FormControl>
                  <FormDescription>
                    Employee related to these credentials (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        <FormField
          control={form.control}
          name="persistentToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persistent token</FormLabel>
              <FormControl>
                <Input
                  className="bg-background"
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
                  className="bg-background"
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

        <Button
          size="lg"
          type="submit"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending && <FaSync className="animate-spin" />}
          Save
        </Button>
      </form>
    </Form>
  );
};

const SearchableCombobox = ({
  value,
  options,
  onChange,
  label,
  searchLabel,
  noResultsLabel,
}: {
  value: undefined | string;
  options: { id: string; name: string }[];
  onChange: (value: string) => void;
  label: string;
  searchLabel: string;
  noResultsLabel: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={options.length === 0}
          className="w-[200px] justify-between"
        >
          {value
            ? options.find(
                (option) => option.id.toString() === value?.toString(),
              )?.name
            : label}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchLabel} />
          <CommandList>
            <CommandEmpty>{noResultsLabel}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  onSelect={() => {
                    if (value !== option.id) {
                      onChange(option.id);
                    }
                    setOpen(false);
                  }}
                >
                  {option.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
