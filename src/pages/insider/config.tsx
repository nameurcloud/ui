import React, { useEffect, useState } from "react";
import { getUserConfigPattern } from "@/services/configService";

interface Resource {
  id: string;
  name: string;
  [key: string]: any;
}

interface Region {
  resources: Resource[];
  [key: string]: any;
}

interface ProviderConfig {
  [regionName: string]: Region;
}

interface ConfigData {
  providerConfigs: { [provider: string]: ProviderConfig };
  regionConfigs: { [provider: string]: ProviderConfig };
  [key: string]: any;
}

const ConfigPage = () => {
  const [configData, setConfigData] = useState<ConfigData | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserConfigPattern();
      setConfigData(data);
    };
    fetchData();
  }, []);

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    setSelectedRegion(null);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };

  const regionConfig = configData?.regionConfigs?.[selectedProvider ?? ""];
  const currentRegion = selectedRegion ? regionConfig?.[selectedRegion] : undefined;
  const resources = currentRegion?.resources ?? [];

  return (
    <div>
      <h2>Provider Configuration</h2>

      {/* Provider selection */}
      <select onChange={(e) => handleProviderChange(e.target.value)} value={selectedProvider ?? ""}>
        <option value="">Select Provider</option>
        {Object.keys(configData?.providerConfigs ?? {}).map((provider) => (
          <option key={provider} value={provider}>
            {provider}
          </option>
        ))}
      </select>

      {/* Region selection */}
      {selectedProvider && (
        <select onChange={(e) => handleRegionChange(e.target.value)} value={selectedRegion ?? ""}>
          <option value="">Select Region</option>
          {Object.keys(configData?.regionConfigs?.[selectedProvider] ?? {}).map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      )}

      {/* Resource list */}
      {resources.map((item: Resource, index: number) => (
        <div key={item.id || index}>
          <strong>{item.name}</strong>
        </div>
      ))}
    </div>
  );
};

export default ConfigPage;
