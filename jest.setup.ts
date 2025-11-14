import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import {jest} from '@jest/globals';

// Polyfills for Node.js environment
// TextEncoder and TextDecoder are browser APIs that don't exist in Node.js
// Many libraries (React, Framer Motion, Testing Library) expect these to exist
// We import them from Node's 'util' module to make them available in tests
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder as any;
}

//Mock environment variables

// Mock window.matchMedia (required by Framer Motion)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // Deprecated
    removeListener: () => {}, // Deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock IntersectionObserver (used by GameCard lazy loading)
class IntersectionObserverMock {
  observe = () => {};
  disconnect = () => {};
  unobserve = () => {};
  takeRecords = () => [];
  root = null;
  rootMargin = '';
  thresholds = [];
}

global.IntersectionObserver = IntersectionObserverMock as any;

// Mock ResizeObserver (might be needed by some components)
global.ResizeObserver = class ResizeObserver {
  observe = () => {};
  unobserve = () => {};
  disconnect = () => {};
} as any;

// Mock scrollTo (used in some navigation)
window.scrollTo = () => {};

// Mock HTMLElement.prototype.scrollIntoView
HTMLElement.prototype.scrollIntoView = () => {};

// Mock getComputedStyle for TruncatedText component
const mockGetComputedStyle = () => ({
  getPropertyValue: jest.fn().mockReturnValue('20px'),
  lineHeight: '20px',
});

Object.defineProperty(window, 'getComputedStyle', {
  value: mockGetComputedStyle,
});

// Suppress console errors during tests (optional)
// Uncomment if you want cleaner test output
// const originalError = console.error;
// beforeAll(() => {
//   console.error = jest.fn();
// });
// afterAll(() => {
//   console.error = originalError;
// });