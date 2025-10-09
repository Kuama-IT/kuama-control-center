# Coding Conventions (Next.js + TypeScript + Drizzle)

- Stack: Next.js App Router, TypeScript, Drizzle ORM, Zod.\
- **Reads** go through **.server** or **API routes**. **Writes** (upsert/delete) use **Server Actions**.\
- **Zod** validation is authoritative **on the server**.

## 1. General Principles

- **TypeScript-first:** avoid `any`; prefer precise types and Zod schemas.
- **Co-location, not duplication:** keep domain logic close. Logic for BE is in `.server`.
- **Conventional commits:** `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`

## 2. Project Structure

```plaintext
/modules/${kebabPlural}/
  ${kebabPlural}.actions.ts               // "use server" — controllers for writes only
  ${kebabPlural}.server.ts                // domain rules + Zod validation (authoritative)
  ${kebabPlural}.db.ts                    // Drizzle queries (1:1 with tables)
  ${kebabPlural}.service.ts               // optional shared helpers
  /components                             // UI building blocks for this module
  /queries/${kebabPlural}.queries.ts      // useQuery hooks (only for combobox/dictionaries)
  /mutations/${kebabPlural}.mutations.ts  // useMutation hooks calling Server Actions
  /schemas                                // Zod schemas (read/write DTOs)
  /mappings/${kebabPlural}.mappings.ts    // FE mappings (read → option for combobox)
  /utils/${kebabPlural}.utils.ts          // pure helpers specific to the module
```

### Mappings

- Purpose: centralize mapping logic (e.g., enum → label).
- Format: always export a single object.
- The file should be named ${kebabPlural}.mappings.ts

```ts
export const ${pascalSingular}Mappings = {
  map1() {},
  map2() {},
};
```

### Utils

- Purpose: pure helper functions related to the module, not fitting other layers.
- Format: always export a single object.
- The file should be named ${kebabPlural}.utils.ts

```ts
export const ${pascalSingular}Utils = {
  helper1() {},
  helper2() {},
};
```

### Routes

- Under `/app/**`, every route file is named `page.tsx` and imports components from `/modules/**`.

## 3. Read Conventions

### 3.1 Reads for selects/combobox — `useQuery` (client)

- Scope: small, cache-friendly lists for UI controls.
- Location: `/modules/${kebabPlural}/queries/${kebabPlural}.queries.ts`
- Key: `export const ${camelPlural}QueryKey = "${kebabPlural}";`

```ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const ${camelPlural}QueryKey = "${kebabPlural}";
const optionItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  disabled: z.boolean().optional()
});
const OptionItem = z.infer<typeof optionItemSchema>

export function use${pascalPlural}OptionsQuery() {
  return useQuery({
    queryKey: [${camelPlural}QueryKey, "options"],
    queryFn: async () => {
      const res = await fetch(`/api/${kebabPlural}/options`);
      if (!res.ok) throw new Error("Failed to fetch options");
      return z.array(OptionItem).parse(await res.json());
    },
  });
}
```

### 3.2 Tables / main reads — SSR (server components + API)

- Pages/components fetch server-side calling directly the needed `*.server` method.
- Use `<Suspense/>` with skeletons for client islands.

## 4. Write Conventions (Server Actions + `useMutation`)

- **Upsert/Delete** use **Server Actions** in `${kebabPlural}.actions.ts` (with `"use server"`).
- Server Actions call `${kebabPlural}.server.ts` → `${kebabPlural}.db.ts`.
- Client mutations live in `/modules/${kebabPlural}/mutations/${kebabPlural}.mutations.ts` and **always**:
    - invalidate queries using `${camelPlural}QueryKey`
    - call `router.refresh()` on success to re-render RSC pages

```ts
// modules/${kebabPlural}/${kebabPlural}.actions.ts
"use server";
import { upsert, remove } from "./${kebabPlural}.server";
export async function ${camelSingular}UpsertAction(input: unknown) { return upsert(input); }
export async function ${camelSingular}DeleteAction(id: string) { return remove(id); }
```

## 5. Naming Conventions

### Database (Drizzle)

- **Tables:** always **plural** (e.g., `customers`, `orders`).
- **Columns:** use the **external database column names as-is**; specify them explicitly in Drizzle to match the existing schema (no renaming at application level)

### Modules & folders

- Module folder under `/modules` is always **plural** (`/modules/customers`).
- Standard subfolders: `/components`, `/queries`, `/mutations`, `/schemas`, `/mappings`.

### Components in `/modules/${kebabPlural}/components`

- List: `${kebabPlural}.tsx`
- Detail: `${kebabSingular}.tsx`
- Upsert: `${kebabSingular}-create.tsx`, `${kebabSingular}-update.tsx`, `${kebabSingular}-upsert.tsx`

### Routes

- Under `/app`, route files are always `page.tsx` and delegate to `/modules/**/components`.

## 6. Database Conventions (Drizzle)

- **Tables:** plural names.
- **Columns:** use the **external database column names as-is**; specify them explicitly in Drizzle to match the existing schema (no renaming at application level).
- **Relations:** **do not** use `relations()`; we write queries by hand.
- **Foreign keys:** define **manually** to keep index names short and predictable.

```ts
export const orders = mysqlTable(
    "orders",
    {
        id: pk(),
        customerId: varchar("customer_id").notNull(),
    },
    (t) => [
        foreignKey({
            columns: [t.customerId],
            foreignColumns: [customers.id],
            name: "orders__customer_id_fk",
        }),
    ],
);
```

## 7. Read DTOs (shape & naming)

- **Base read (slim):** `${PascalSingular}Read` — 1:1 with the table; FKs as `xxxId`.
- **Extended read:** `${PascalSingular}ReadExtended` — extends base and, for each join, includes the **base Read** of the referenced entity.

```ts
export type CustomerRead = {
    id: string;
    name: string;
    addressId: string;
};

export type AddressRead = { id: string };

export type CustomerReadExtended = CustomerRead & {
    address: AddressRead | null;
};
```

### API response shapes (standard)

- **List (slim):** `GET /api/${kebabPlural}` → `items: ${PascalSingular}Read[]`
- **Detail (extended):** `GET /api/${kebabPlural}/[id]` → `${PascalSingular}ReadExtended`

### Query composition strategy

- Queries are written **by hand** in `.db`; the `.server` layer maps results to DTOs.
- For **complex joins**, prefer **two-step fetch**:
    1. fetch base rows
    2. fetch related entities (join or separate queries)
    3. compose the `*ReadExtended` in `.server`

## 8. Error Handling & Status Codes (baseline)

- **Validation errors (Zod):** 400 with `issues` payload.
- **Auth:** `401` (unauthenticated), `403` (forbidden).
- **Not found:** `404` (for detail endpoints).
- **Unexpected:** `5xx`.
- Client UI shows short, user-friendly messages; detailed errors are logged server-side.

## 9. Caching & Revalidation

- On successful writes: invalidate related query keys and on the `*.server.ts` method call `revalidatePath('/list/path/');`.

## 10. Write DTOs (Create / Update)

- File naming:
    - **Create:** `/modules/${kebabPlural}/schemas/${kebabSingular}.create.schema.ts`
    - **Update:** `/modules/${kebabPlural}/schemas/${kebabSingular}.update.schema.ts`
- Each file defines a **Zod schema** and exports the inferred type.

### Example

```ts
// modules/pippo/schemas/pippo.create.schema.ts
import { z } from "zod";

export const pippoCreateSchema = z.object({
    name: z.string().min(1),
    addressId: z.string(),
});

export type PippoCreate = z.infer<typeof pippoCreateSchema>;
```

```ts
// modules/pippo/schemas/pippo.update.schema.ts
import { z } from "zod";

export const pippoUpdateSchema = z.object({
    name: z.string().min(1),
    addressId: z.string(),
});

export type PippoUpdate = z.infer<typeof pippoUpdateSchema>;
```

- **Create DTO:** required fields for insertion.
- **Update DTO:** doesn't include `id`, which is later added as an extension parameter to the action params `PippoUpdate & {id: string}`.
- Both must be validated in the `.server` layer before calling the DB.

## 10. Write DTOs (Create/Update schemas)

- Create/Update DTOs are defined with Zod and exported as TypeScript types.

### File naming & location

- Per module, under `/modules/${kebabPlural}/schemas/`:
    - `/${kebabSingular}.create.schema.ts`
    - `/${kebabSingular}.update.schema.ts`

### Structure

Each file defines a Zod schema and exports the inferred TS type.

```ts
// /modules/${kebabPlural}/schemas/${kebabSingular}.create.schema.ts
import { z } from "zod";

export const ${pascalSingular}CreateSchema = z.object({
  name: z.string().min(1),
  // ... other fields required for creation
});

export type ${pascalSingular}Create = z.infer<typeof ${pascalSingular}CreateSchema>;
```

```ts
// /modules/${kebabPlural}/schemas/${kebabSingular}.update.schema.ts
import { z } from "zod";

export const ${pascalSingular}UpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  // ... fields that can be updated (optional by default)
});

export type ${pascalSingular}Update = z.infer<typeof ${pascalSingular}UpdateSchema>;
```

# Conventions

- `*CreateSchema` contains **required** fields to create the entity. Defaults and server-generated fields (e.g., `id`, timestamps) are **not** part of the create DTO.
- `*UpdateSchema` includes the entity **identifier** and only the fields that can change; mark them **optional** unless a specific update flow requires them.
- Server validation uses these schemas inside `${kebabPlural}.server.ts` before calling the `.db` layer.

## 11. BE Structure

**The entry point for the BE is either a server action or an HTTP controller (API route).**
- Use a server action when you need to mutate data (e.g., create, update, delete).
- Use an API route when you need to fetch data.

Regardless of the entry point, it must call a `.server` method.

**Inside a `.server` method:**
- Validate DTOs (if needed)
- Call 1–N `.db` methods
- (Optional) call one or more `.service` methods
- **Never** call other `.server` methods

**When to use a `.service`:**
- You have shared logic between two or more `.server` methods  
- You want to avoid code duplication in multiple `.server` methods

**When to avoid a `.service`:**
- If you can handle the logic by simply calling multiple `.db` methods, then a `.service` is not the right solution.

**Inside a `.service` method:**
- Call 1–N `.db` methods  
- Apply custom logic  
- **Never** call other `.service` methods. If you feel you need to, review your code: you likely need to refactor it.

**Inside a `.db` method:**
- Return the result of exactly one query  
- If possible, avoid left joins and build the result in `.server` by calling multiple `.db` methods  
- Make the method name explicit and descriptive, since it may be reused across different `.server` files  
- If calling a method that expects a single result (e.g., `getById`), return exactly one row or throw an error

---
