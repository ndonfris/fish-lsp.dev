/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Augment Alpine.js global on window
import type { Alpine } from 'alpinejs';

declare global {
  interface Window {
    Alpine: Alpine;
  }
}
