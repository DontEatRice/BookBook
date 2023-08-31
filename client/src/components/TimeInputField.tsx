import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";

export type TimeInputFieldProps<T extends FieldValues> = {
    label: string;
    field: Path<T>;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
};

function TimeInputField<T extends FieldValues>({ label, register, field, errors }: TimeInputFieldProps<T>) {
    return (
        <TimePicker
            format="HH:mm"
            ampm={false}
            label={label}
            errors={errors[field] != undefined}
            {...register(field)}
        />
    );
}

export default TimeInputField;