import { useCallback, useEffect, useMemo, useState } from 'react';

export const useCountrySelect = ({ value, onChange, countryList }) => {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = useCallback(
    (selectedCode) => {
      onChange(selectedCode);
      setSelected(selectedCode);
    },
    [onChange],
  );

  const selectedFlag = useMemo(
    () => countryList.find(({ code }) => code === selected)?.flag,
    [countryList, selected],
  );

  return { selected, handleSelect, selectedFlag };
};
