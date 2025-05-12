const API_URL = import.meta.env.VITE_API_URL;

export interface CloudConfig {
  AWS: ProviderConfig;
  GCP: ProviderConfig;
  Azure: ProviderConfig;
}

export interface ProviderConfig {
  regions: { name: string; code: string }[];
  resources: { name: string; code: string }[];
  environments: { name: string; code: string }[];
}

export const getUserConfigPattern = async (): Promise<CloudConfig> => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/config`, {
      method: "GET",
      headers: {
        "X-App-Auth": token || "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch config, status: " + response.status);
    }

    const data = await response.json();

    if (!data.pattern_config) {
      throw new Error("Invalid response format: pattern_config missing.");
    }

    return data.pattern_config as CloudConfig;

  } catch (error: any) {
    console.error("Error fetching config:", error);
    throw new Error("Error fetching config: " + (error.message || error));
  }
};

export const setUserConfigPattern = async (updatedconfig: { config?: CloudConfig; data?: any; }) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/config`, {
      method: "POST",
      headers: {
        "X-App-Auth": token || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedconfig.config),
    });
    console.log(updatedconfig.config);
    return response;

  } catch (error: any) {
    console.error("Error saving config:", error);
    throw new Error("Error saving config: " + (error.message || error));
  }
};
