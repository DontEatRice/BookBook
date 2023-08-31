import { z } from "zod";

const AddressViewModel = z.object({
    postalCode: z.string().nonempty(),
    city: z.string().nonempty(),
    street: z.string().nonempty(),
    number: z.string(),
    apartment: z.string().nullable(),
    additionalInfo: z.string().nullable(),
})

export default AddressViewModel;
export type AddressViewModelType = z.infer<typeof AddressViewModel>;