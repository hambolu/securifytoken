declare module 'securifytoken' {
    export function encode(payload: object, secretKey: string, options?: { expiresIn?: string | number }): string;
    export function decode(token: string, secretKey: string): object;
    export function verify(token: string, secretKey: string): boolean;
  }
  