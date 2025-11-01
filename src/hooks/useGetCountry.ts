import { UserIpInfo } from '@models/common';
import { useEffect, useState } from 'react';

interface UseGetCountryParams {
  setIpInfo: (ipInfo: UserIpInfo | undefined) => void,
  ipInfo: UserIpInfo | undefined;
}

function useGetCountry({ setIpInfo, ipInfo }:  UseGetCountryParams) {
  const [_, setLoading] = useState(true);

  useEffect(() => {
    
    if(!ipInfo || JSON.stringify(ipInfo) === "{}") {
      fetch(import.meta.env.VITE_PUBLIC_IP_LOC_API ?? '')
        .then(response => response.json())
        .then(data => {
          setIpInfo({
            countryName: data.country_name,
            latitude: data.latitude,
            longitude: data.longitude
          });
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [ipInfo]);

  return {};
}

export default useGetCountry;