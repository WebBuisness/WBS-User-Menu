'use client';

import { useCallback } from 'react';
import { Input } from '@headlessui/react';
import { format } from '@react-input/mask';
import { useMask } from './useMask';
import { cn } from '@/lib/utils';

export const PhoneNumberInput = ({
  id,
  mask = '______________',
  onChange,
  value: valueProp,
  placeholder = 'Phone number'
}) => {
  const { options, hasEmptyMask, inputRef } = useMask({ mask });

  // Apply masking to the displayed value
  const value = format(valueProp, options);

  const handleChange = useCallback(
    (event) => {
      // Return the unmasked value to the parent
      onChange(format(event.target.value, options));
    },
    [onChange, options],
  );

  return (
    <Input
      placeholder={hasEmptyMask ? placeholder : mask}
      ref={inputRef}
      id={id}
      className={cn(
        'w-full rounded-2xl bg-neutral-900 px-4 py-4 text-sm tabular-nums text-white border border-neutral-800 transition-all duration-200',
        'focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500',
        'placeholder:text-neutral-600'
      )}
      type="tel"
      onChange={handleChange}
      value={value}
    />
  );
};
