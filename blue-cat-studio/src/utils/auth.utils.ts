import { Role } from '../contracts/enum/identity-domain/role'; 
import type { UserSession } from '../models/UserSession';

interface JwtPayload {
  [key: string]: any;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  exp?: number;
}

export function parseTokenToSession(token: string | null): UserSession | null {
  if (!token) return null;

  try {
    // 1. JWTs are split into [Header, Payload, Signature]. We grab the Payload (index 1).
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    // 2. Convert base64url format back to standard base64 strings
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // 3. Decode base64 to string handling multi-byte UTF-8 characters gracefully
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload: JwtPayload = JSON.parse(jsonPayload);

    // 4. Validate Token Expiration (Optional safety measure)
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null; // Token is expired
    }

    // 5. Extract keys mapped by your backend framework (e.g., ASP.NET Core Identity claims)
    const nameId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    const rawRole = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (!nameId || !rawRole) return null;

    return {
      name: nameId,
      role: rawRole as Role, // Casts the string token claim seamlessly to your enum
    };
  } catch (error) {
    console.error('Failed to parse authentication token signature:', error);
    return null;
  }
}