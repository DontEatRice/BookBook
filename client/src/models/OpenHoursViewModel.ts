import { z } from "zod";

const OpenHoursViewModel = z.object({
    mondayOpenTime: z.string().nullable(),
    mondayCloseTime: z.string().nullable(),
    tuesdayOpenTime: z.string().nullable(),
    tuesdayCloseTime: z.string().nullable(),
    wednesdayOpenTime: z.string().nullable(),
    wednesdayCloseTime: z.string().nullable(),
    thursdayOpenTime: z.string().nullable(),
    thursdayCloseTime: z.string().nullable(),
    fridayOpenTime: z.string().nullable(),
    fridayCloseTime: z.string().nullable(),
    saturdayOpenTime: z.string().nullable(),
    saturdayCloseTime: z.string().nullable(),
    sundayOpenTime: z.string().nullable(),
    sundayCloseTime: z.string().nullable(),
})

export default OpenHoursViewModel;
export type OpenHoursViewModelType = z.infer<typeof OpenHoursViewModel>;