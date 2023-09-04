import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

const timeField = z
  .custom<Dayjs | null>((val) => val == undefined || val == null || dayjs.isDayjs(val))
  .optional()
  //   .transform(val)
  .transform((time) => (time ? time.format('HH:mm:ss').toString() : null));

const AddLibrary = z.object({
  name: z.string().nonempty(),
  reservationTime: z.preprocess((a) => parseInt(z.string().parse(a)), z.number().positive()),
  hireTime: z.preprocess((a) => parseInt(z.string().parse(a)), z.number().positive()),
  postalCode: z
    .string()
    .nonempty()
    .refine((value) => /^[0-9]{2}-[0-9]{3}$/.test(value), 'Kod pocztowy musi odpowiadać formatowi 00-000'),
  city: z.string().nonempty(),
  street: z.string().nonempty(),
  number: z.string(),
  apartment: z.string().nullable(),
  additionalInfo: z.string().nullable(),
  mondayOpenTime: timeField,
  mondayCloseTime: timeField,
  tuesdayOpenTime: timeField,
  tuesdayCloseTime: timeField,
  wednesdayOpenTime: timeField,
  wednesdayCloseTime: timeField,
  thursdayOpenTime: timeField,
  thursdayCloseTime: timeField,
  fridayOpenTime: timeField,
  fridayCloseTime: timeField,
  saturdayOpenTime: timeField,
  saturdayCloseTime: timeField,
  sundayOpenTime: timeField,
  sundayCloseTime: timeField,
});

export default AddLibrary;
export type AddLibraryType = z.infer<typeof AddLibrary>;
