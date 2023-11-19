import { TextField } from '@mui/material';

function FilledField({ label, value }: { label: string; value: string }) {
  return (
    <TextField
      id={label + 'Id'}
      label={label}
      variant="filled"
      value={value}
      InputProps={{ readOnly: true }}
      size="medium"
      fullWidth
    />
  );
}

export default FilledField;

