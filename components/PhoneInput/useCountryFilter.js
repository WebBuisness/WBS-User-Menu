import { useCallback, useState, useEffect } from 'react';

export const useCountryFilter = (countryList) => {
  const [filteredList, setFilteredList] = useState(countryList);

  useEffect(() => {
    setFilteredList(countryList);
  }, [countryList]);

  const [filter, setFilterState] = useState('');

  const setFilter = useCallback(
    (event) => {
      const val = event.target.value;
      setFilterState(val);
      
      if (val === '') {
        setFilteredList(countryList);
      } else {
        const nextCountries = countryList.filter(({ name, code }) =>
          name.toLowerCase().includes(val.toLowerCase()) || 
          code.includes(val)
        );
        setFilteredList(nextCountries);
      }
    },
    [countryList],
  );

  return { filter, setFilter, filteredList };
};
