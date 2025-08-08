import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function CalculationsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard since calculations happen there
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return null;
}