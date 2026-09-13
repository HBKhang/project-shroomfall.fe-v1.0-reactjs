import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../clients/apiClient';
import { AUTH_KEYS } from '../../constants/auth.constants';
import type { LoginDTO } from '../../contracts/dto/feature/identity/command/login-dto'; 
import type { RegisterDTO } from '../../contracts/dto/feature/identity/command/register-dto'; 
import type { SteamAuthDTO } from '../../contracts/dto/feature/identity/command/steam-auth-dto';
import type { UpdateProfileDTO } from '../../contracts/dto/feature/identity/command/update-profile-dto'; 
import type { TokenDTO } from '../../contracts/dto/feature/identity/response/token-dto';

const handleAuthSuccess = (data: TokenDTO) => {
  localStorage.setItem(AUTH_KEYS.TOKEN, data.accessToken);
  localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, data.refreshToken);
  window.dispatchEvent(new Event('auth:login'));
};

export const useIdentity = () => {
  const queryClient = useQueryClient();

  // 1. Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (dto: LoginDTO): Promise<TokenDTO> => {
      const { data } = await apiClient.post<TokenDTO>('/identity/login', dto);
      return data;
    },
    onSuccess: (data) => handleAuthSuccess(data),
  });

  // 2. Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (dto: RegisterDTO): Promise<TokenDTO> => {
      const { data } = await apiClient.post<TokenDTO>('/identity/register', dto);
      return data;
    },
    onSuccess: (data) => handleAuthSuccess(data),
  });

  // 3. Steam Auth Mutation
  const steamAuthMutation = useMutation({
    mutationFn: async (dto: SteamAuthDTO): Promise<TokenDTO> => {
      const { data } = await apiClient.post<TokenDTO>('/identity/steam', dto);
      return data;
    },
    onSuccess: (data) => handleAuthSuccess(data),
  });

  // 5. Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (dto: UpdateProfileDTO): Promise<void> => {
      await apiClient.put('/identity/profile', dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });

  // 6. Update Preferred Locale Mutation
  const updateLocaleMutation = useMutation({
    mutationFn: async (locale: string): Promise<void> => {
      await apiClient.put(`/identity/preferred-locale/${locale}`);
    },
  });

  return {
    login: loginMutation,
    register: registerMutation,
    steamAuth: steamAuthMutation,
    updateProfile: updateProfileMutation,
    updateLocale: updateLocaleMutation,
  };
};