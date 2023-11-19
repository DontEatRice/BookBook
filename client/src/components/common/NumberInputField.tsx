import TextField from '@mui/material/TextField';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

export type NumberInputFieldProps<T extends FieldValues> = {
    label: string;
    field: Path<T>;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
};

function NumberInputField<T extends FieldValues>({ label, register, field, errors }: NumberInputFieldProps<T>) {
    const helper = errors[field]?.message?.toString();
    return (
        <TextField
            label={label}
            type='number'
            {...register(field)}
            error={errors[field] != undefined}
            helperText={helper}
            sx={{ width: '100%', mb: 2 }}
        />
    );
}

export default NumberInputField;