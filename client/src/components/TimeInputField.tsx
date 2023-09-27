import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

export type TimeInputFieldProps<T extends FieldValues> = {
  label: string;
  field: Path<T>;
  control: Control<T>;
  disabled?: boolean;
};

function TimeInputField<T extends FieldValues>({ label, field, control, disabled }: TimeInputFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={field}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render={({ field: { value: _, ...props } }) => (
        <TimePicker format="HH:mm" ampm={false} label={label} {...props} disabled={disabled} />
      )}
    />
  );
}

export default TimeInputField;
