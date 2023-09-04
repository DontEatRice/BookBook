import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Dayjs } from 'dayjs';
import { useState } from 'react';
import { Control, Controller, FieldValues, Path, UseFormRegister } from 'react-hook-form';

export type TimeInputFieldProps<T extends FieldValues> = {
  label: string;
  field: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  register: UseFormRegister<T>;
};

function TimeInputField<T extends FieldValues>({
  label,
  field,
  control,
  disabled,
  register,
}: TimeInputFieldProps<T>) {
  // const [value, setValue] = useState<Dayjs | null>(null);
  const { onChange, ...rest } = register(field);
  return (
    // <Controller
    //   control={control}
    //   name={field}
    //   render={({ field: { value, onChange, ...props } }) => (
    //     // <TimePicker format="HH:mm" ampm={false} label={label} value={value} onChange={(val) => {setValue(val); onChange(val)}} {...props} disabled={disabled} />
    <TimePicker
      format="HH:mm"
      ampm={false}
      label={label}
      disabled={disabled}
      {...rest}
      onChange={(val) => onChange({ target: { value: val } })}
    />
    //   )}
    // />
  );
}

export default TimeInputField;
