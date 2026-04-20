'use client';

import { 
  Listbox, 
  ListboxButton, 
  ListboxOption, 
  ListboxOptions, 
  Input 
} from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';
import { useCountrySelect } from './useCountrySelect';
import { useCountryFilter } from './useCountryFilter';
import { cn } from '@/lib/utils';

/**
 * @typedef {import('../../lib/countryList').CountryConfig} CountryConfig
 */

export const CountryCodeInput = ({ countryList, value, onChange }) => {
  const { selectedFlag, handleSelect, selected } = useCountrySelect({
    onChange,
    countryList,
    value,
  });

  const { filter, setFilter, filteredList } = useCountryFilter(countryList);

  return (
    <div className="w-[100px] shrink-0">
      <Listbox value={selected} onChange={handleSelect}>
        <ListboxButton
          className={cn(
            'relative w-full h-[54px] rounded-2xl bg-neutral-900 px-3 py-4 text-sm text-white',
            'flex items-center gap-2 border border-neutral-800 transition-all duration-200',
            'focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
          )}
        >
          <span className="text-xl leading-none">{selectedFlag}</span>
          <span className="grow text-left font-mono">{selected}</span>
          <ChevronDown className="size-4 shrink-0 text-neutral-500" />
        </ListboxButton>

        <ListboxOptions
          anchor="bottom start"
          className={cn(
            'z-50 mt-2 w-64 rounded-2xl border border-neutral-800 bg-neutral-950 p-2 shadow-2xl',
            'origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0',
            'focus:outline-none'
          )}
        >
          {countryList.length > 5 && (
            <div className="p-2 border-b border-neutral-900 mb-2">
              <Input
                value={filter}
                onChange={setFilter}
                placeholder="Country name..."
                className={cn(
                  'w-full rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white',
                  'focus:outline-none focus:ring-1 focus:ring-orange-500 border border-transparent focus:border-orange-500'
                )}
              />
            </div>
          )}
          
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800">
            {filteredList.length === 0 ? (
              <div className="py-6 text-center text-sm text-neutral-500">
                No results found
              </div>
            ) : (
              filteredList.map(({ code, flag, name }) => (
                <ListboxOption
                  key={code}
                  value={code}
                  className={cn(
                    'group flex cursor-pointer select-none items-center gap-3 rounded-xl p-2.5 transition',
                    'data-[focus]:bg-orange-500/10'
                  )}
                >
                  <div className="flex size-5 items-center justify-center">
                    <Check
                      className="hidden size-4 text-orange-500 group-data-[selected]:block"
                      strokeWidth={3}
                    />
                  </div>
                  <span className="text-xl leading-none">{flag}</span>
                  <div className="w-10 shrink-0 text-left text-sm font-mono text-neutral-400 group-data-[selected]:text-orange-500">
                    {code}
                  </div>
                  <div className="truncate text-sm text-neutral-500 group-data-[focus]:text-white group-data-[selected]:text-white">
                    {name}
                  </div>
                </ListboxOption>
              ))
            )}
          </div>
        </ListboxOptions>
      </Listbox>
    </div>
  );
};
