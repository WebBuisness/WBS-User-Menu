import { useMemo } from 'react';
import { useMask as useMaskVanilla } from '@react-input/mask';

export const useMask = ({ mask }) => {
  const options = useMemo(
    () => ({
      mask,
      replacement: { _: /\d/ },
      showMask: true,
    }),
    [mask],
  );

  const inputRef = useMaskVanilla(options);

  const hasEmptyMask = !mask || mask.split('').every((char) => {
    return char === '_' || char === ' ' || char === '-' || char === '(' || char === ')';
  });

  return { options, inputRef, hasEmptyMask };
};
