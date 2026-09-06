import { useState } from 'react';
import { authApi } from '../api/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ status?: number, message: string } | null>(null);

  const register = async (data: Record<string, any>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(data);
      if (response.status === 201) {
        const responseData = await response.json();
        return { success: true, id: responseData.id };
      } else if (response.status === 409) {
        setError({ status: 409, message: 'Este e-mail já está cadastrado' });
        return { success: false, status: 409 };
      } else {
        setError({ status: response.status, message: 'Erro ao registrar usuário' });
        return { success: false, status: response.status };
      }
    } catch (err) {
      console.error('Erro na requisição de register:', err);
      setError({ message: 'Network error ou falha na requisição' });
      return { success: false, status: 500 };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (userId: string, code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyEmail({ userId, code });
      if (response.status === 204) {
        return { success: true };
      } else if (response.status === 400) {
        setError({ status: 400, message: 'Código inválido, tente novamente' });
        return { success: false, status: 400 };
      } else if (response.status === 404) {
        setError({ status: 404, message: 'Usuário não encontrado' });
        return { success: false, status: 404 };
      } else if (response.status === 410) {
        setError({ status: 410, message: 'Código expirado' });
        return { success: false, status: 410 };
      } else {
        setError({ status: response.status, message: 'Erro genérico ao verificar e-mail' });
        return { success: false, status: response.status };
      }
    } catch (err) {
      console.error('Erro na requisição de verifyEmail:', err);
      setError({ message: 'Network error ou falha na requisição' });
      return { success: false, status: 500 };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, verifyEmail, isLoading, error, setError };
};
