import React from 'react';
import { StarIcon } from './components/icons/StarIcon';
import { RulerIcon } from './components/icons/RulerIcon';
import { PaletteIcon } from './components/icons/PaletteIcon';
import { ZapIcon } from './components/icons/ZapIcon';

// This object maps icon names to their respective React components.
// It's used in the 'benefits' section to dynamically render icons based on
// the string name provided in the configuration from WordPress.
export const ICONS: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  StarIcon,
  RulerIcon,
  PaletteIcon,
  ZapIcon
};

// The main AppConfig object has been removed from this file.
// The application now dynamically fetches its configuration from a
// custom WordPress REST API endpoint on startup. See `api.ts` and `App.tsx`.
