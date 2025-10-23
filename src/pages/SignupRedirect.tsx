import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SignupRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    // Ensure mode=signup
    search.set('mode', 'signup');
    // Preserve ref and other params automatically
    navigate({ pathname: '/login', search: `?${search.toString()}` }, { replace: true });
  }, [location.search, navigate]);

  return null;
};

export default SignupRedirect;
