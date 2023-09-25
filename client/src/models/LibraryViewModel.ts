import { z } from 'zod'
import AddressViewModel from './AddressViewModel'
import OpenHoursViewModel from './OpenHoursViewModel'

const LibraryViewModel = z.object({
    id: z.string().uuid(),
    name: z.string(),
    reservationTime: z.number().int().positive(),
    hireTime: z.number().int().positive(),
    address: AddressViewModel,
    openHours: OpenHoursViewModel,
})

export default LibraryViewModel;
export type LibraryViewModelType = z.infer<typeof LibraryViewModel>;