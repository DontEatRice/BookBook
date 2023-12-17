import { z } from "zod";

const AddressViewModel = z.object({
    postalCode: z.string(),
    city: z.string(),
    street: z.string(),
    number: z.string(),
    apartment: z.string().nullable(),
    additionalInfo: z.string().nullable(),
})

export default AddressViewModel;
export type AddressViewModelType = z.infer<typeof AddressViewModel>;