import TextField, { TextFieldProps, TextFieldVariants } from '@mui/material/TextField';
import { Control, Controller, FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

export type TextInputFieldProps<T extends FieldValues> = {
  label: string;
  field: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  defaultValue?: string;
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
  defaultValue,
}: TextInputFieldProps<T>) {
  const helper = errors[field]?.message?.toString();
  return (
    <TextField
      {...additionalProps}
      label={label}
      {...register(field)}
      error={errors[field] != undefined}
      helperText={helper}
      defaultValue={defaultValue}
      sx={{ width: '100%', mb: 2 }}
    />
  );
}

export type TextInputFieldProps2<T extends FieldValues> = {
  label: string;
  field: Path<T>;
  control: Control<T>;
  additionalProps?: { variant?: TextFieldVariants } & Omit<
    TextFieldProps,
    'label' | 'helperText' | 'error' | 'variant' | 'defaulfValue'
  >;
};

export function TextInputField2<T extends FieldValues>({
  label,
  field,
  control,
  additionalProps,
}: TextInputFieldProps2<T>) {
  return (
    <Controller
      name={field}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          label={label}
          {...field}
          error={!!error}
          helperText={error?.message}
          {...additionalProps}
          sx={{ width: '100%', mb: 2 }}
        />
      )}
    />
  );
}

export default TextInputField;
