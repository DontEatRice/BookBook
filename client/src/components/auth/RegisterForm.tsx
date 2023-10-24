import { SxProps, Theme } from '@mui/material/styles';
import { LoginRequestType } from '../../models/LoginRequest';
import Box from '@mui/material/Box';
import TextInputField from '../TextInputField';

type RegisterFormProps = {
  onSubmit: (data: LoginRequestType) => void;
  sx?: SxProps<Theme>;
};

function RegisterForm({ onSubmit, sx }: RegisterFormProps) {
  return (
    <Box sx={sx}>
      <TextInputField
        errors={errors}
        field="email"
        label="E-mail"
        register={register}
        additionalProps={{ variant: 'filled', type: 'email' }}
      />
    </Box>
  );
}

export default RegisterForm;
