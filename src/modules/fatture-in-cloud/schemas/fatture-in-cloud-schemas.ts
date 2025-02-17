import { z } from "zod";

export const fattureInCloudClientSchema = z.object({
  vat_number: z.string().nonempty(),
  name: z.string().nonempty(),
  id: z.number().positive(),
});
