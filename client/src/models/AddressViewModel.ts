import { z } from "zod";

const AddressViewModel = z.object({
    postalCode: z.string().min(1),
    city: z.string().min(1),
    street: z.string().min(1),
    number: z.string(),
    apartment: z.string().nullable(),
    additionalInfo: z.string().nullable(),
})

export default AddressViewModel;
export type AddressViewModelType = z.infer<typeof AddressViewModel>;