import TextField from '@mui/material/TextField';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

export type NumberInputFieldProps<T extends FieldValues> = {
    label: string;
    field: Path<T>;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    defaultValue?: string;
};

function NumberInputField<T extends FieldValues>({ label, register, field, errors, defaultValue }: NumberInputFieldProps<T>) {
    const helper = errors[field]?.message?.toString();
    return (
        <TextField
            label={label}
            type='number'
            {...register(field)}
            error={errors[field] != undefined}
            helperText={helper}
            defaultValue={defaultValue}
            sx={{ width: '100%', mb: 2 }}
        />
    );
}

export default NumberInputField;