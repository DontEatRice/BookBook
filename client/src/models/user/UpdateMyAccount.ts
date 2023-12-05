import { z } from 'zod';
import { pictureSchema, userNameSchema } from '../../utils/zodSchemas';
import LibraryViewModel from '../LibraryViewModel';

const UpdateMyAccount = z.object({
  avatarPicture: pictureSchema,
  name: userNameSchema,
  avatarImageUrl: z.string().url().nullable(),
  library: LibraryViewModel.optional().nullable(),
  street: z.string().optional(),
  number: z.string().optional(),
  apartment: z.string().nullable().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  includeAddress: z.boolean()
})
.refine((input) => 
  !input.includeAddress || input.city?.length! > 0, {
    message: 'To pole jest wymagane',
    path: ['city']
  }
)
.refine((input) => 
  !input.includeAddress || /^[0-9]{2}-[0-9]{3}$/.test(input.postalCode!), {
    message: 'Kod pocztowy musi odpowiadać formatowi 00-000',
    path: ['postalCode']
  }
)
.refine((input) => 
  !input.includeAddress || /^\d+[A-Z]{0,1}$/.test(input.number!), {
    message: 'Wprowadź poprawny numer budynku',
    path: ['number']
  }
)
.refine((input) => 
  !input.includeAddress || input.street!.length > 0, {
    message: 'To pole jest wymagane',
    path: ['street']
  }
)
.superRefine((input) => {
  if(input.includeAddress == false){
    input.street = undefined;
    input.number = undefined;
    input.apartment = undefined;
    input.city = undefined;
    input.postalCode = undefined;
  }
});

export default UpdateMyAccount;
export type UpdateMyAccountType = z.infer<typeof UpdateMyAccount>;
