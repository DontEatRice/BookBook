import TextField, { TextFieldProps, TextFieldVariants } from '@mui/material/TextField';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

export type TextInputFieldProps<T extends FieldValues> = {
  label: string;
  field: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  rows: number;
  defaultValue?: string;
  additionalProps?: { variant?: TextFieldVariants } & Omit<
    TextFieldProps,
    'label' | 'helperText' | 'error' | 'variant'
  >;
};

function TextInputBox<T extends FieldValues>({
  label,
  register,
  field,
  errors,
  additionalProps,
  rows,
  defaultValue
}: TextInputFieldProps<T>) {
  const helper = errors[field]?.message?.toString();
  return (
    <TextField
      multiline
      {...additionalProps}
      label={label}
      {...register(field)}
      error={errors[field] != undefined}
      helperText={helper}
      rows={rows}
      defaultValue={defaultValue}
      sx={{ width: '100%', mb: 2 }}
    />
  );
}

export default TextInputBox;
