import localFont from 'next/font/local';

export const righteous = localFont({
  src: '../fonts/Righteous-Regular.ttf', // ✅ points to the *real* file
  display: 'swap',
  variable: '--font-righteous',
});
