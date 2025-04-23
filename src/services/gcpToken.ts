export async function getIdToken(targetAudience: string): Promise<string> {
    const res = await fetch(
      `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${targetAudience}`,
      {
        headers: {
          "Metadata-Flavor": "Google",
        },
      }
    );
  
    if (!res.ok) {
      throw new Error(`Failed to get ID token: ${res.statusText}`);
    }
  
    return res.text();
  }
  