import { Dayjs } from "dayjs";
import { z } from "zod";

const AddLibrary = z.object({
    name: z.string().nonempty(),
    reservationTime: z.preprocess(
        (a) => parseInt(z.string().parse(a)),
        z.number().positive()),
    hireTime: z.preprocess(
        (a) => parseInt(z.string().parse(a)),
        z.number().positive()),
    postalCode: z.string().nonempty().refine((value) => /^[0-9]{2}-[0-9]{3}$/.test(value), "Kod pocztowy musi odpowiadać formatowi 00-000"),
    city: z.string().nonempty(),
    street: z.string().nonempty(),
    number: z.string(),
    apartment: z.string().nullable(),
    additionalInfo: z.string().nullable(),
    mondayOpenTime: z.custom<Dayjs>()
        .refine((time) => time ? time.format('HH:mm:ss').toString() : null),
    mondayCloseTime: z.custom<Dayjs>()
        .refine((time) => time ? time.format('HH:mm:ss').toString() : null),
    // tuesdayOpenTime: z.string().nullable(),
    // tuesdayCloseTime: z.string().nullable(),
    // wednesdayOpenTime: z.string().nullable(),
    // wednesdayCloseTime: z.string().nullable(),
    // thursdayOpenTime: z.string().nullable(),
    // thursdayCloseTime: z.string().nullable(),
    // fridayOpenTime: z.string().nullable(),
    // fridayCloseTime: z.string().nullable(),
    // saturdayOpenTime: z.string().nullable(),
    // saturdayCloseTime: z.string().nullable(),
    // sundayOpenTime: z.string().nullable(),
    // sundayCloseTime: z.string().nullable(),
})

export default AddLibrary;
export type AddLibraryType = z.infer<typeof AddLibrary>;