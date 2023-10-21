import TextField, { TextFieldProps, TextFieldVariants } from '@mui/material/TextField';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

export type TextInputFieldProps<T extends FieldValues> = {
  label: string;
  field: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  additionalProps?: { variant?: TextFieldVariants } & Omit<
    TextFieldProps,
    'label' | 'helperText' | 'error' | 'variant'
  >;
};

function TextInputField<T extends FieldValues>({
  label,
  register,
  field,
  errors,
  additionalProps,
}: TextInputFieldProps<T>) {
  const helper = errors[field]?.message?.toString();
  return (
    <TextField
      {...additionalProps}
      label={label}
      {...register(field)}
      error={errors[field] != undefined}
      helperText={helper}
      sx={{ width: '100%', mb: 2 }}
    />
  );
}

export default TextInputField;
