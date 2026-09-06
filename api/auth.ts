import { client } from './client';

export const authApi = {
  register: async (data: any) => {
    return await client('/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  verifyEmail: async (data: any) => {
    return await client('/users/verification-code', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
