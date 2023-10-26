import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth/useAuth';
import { useEffect } from 'react';

function ChangePassword() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <h2>Zmień hasło</h2>;
}

export default ChangePassword;
