import { GoogleAuth } from 'google-auth-library';

export async function getIdentityToken(targetAudience: string): Promise<string> {
  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(targetAudience);
  const token = await client.idTokenProvider.fetchIdToken(targetAudience);
  return token;
}
