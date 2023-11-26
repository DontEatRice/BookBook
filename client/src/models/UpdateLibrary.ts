import { z } from 'zod';

const timeField = z.string().nullable().optional();

const UpdateLibrary = z.object({
  name: z.string().min(1, 'Pole jest wymagane'),
  reservationTime: z.preprocess((a) => {
    if (typeof a === 'number') {
      return a;
    }
    return parseInt(z.string().parse(a));
  }, z.number().positive()),
  //   reservationTime: z.number().positive(),
  hireTime: z.preprocess((a) => {
    if (typeof a === 'number') {
      return a;
    }
    return parseInt(z.string().parse(a));
  }, z.number().positive('Wartość musi być dodatnią liczbą całkowitą')),
  emailAddress: z.string().email('Nieprawidłowy format adresu e-mail'),
  phoneNumber: z
    .string()
    .min(1, 'To pole jest wymagane')
    .refine(
      (value) => /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]{4,10}$/.test(value.replace(/\s/g, '')),
      'Nieprawidłowy format numeru telefonu'
    ),
  postalCode: z
    .string()
    .trim()
    .min(1, 'Pole jest wymagane')
    .refine((value) => /^[0-9]{2}-[0-9]{3}$/.test(value), 'Kod pocztowy musi odpowiadać formatowi 00-000'),
  city: z.string().min(1, 'Pole jest wymagane'),
  street: z.string().min(1, 'Pole jest wymagane'),
  number: z.string().min(1, 'Pole jest wymagane'),
  apartment: z.string().nullable(),
  additionalInfo: timeField,
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

export default UpdateLibrary;
export type UpdateLibraryType = z.infer<typeof UpdateLibrary>;
