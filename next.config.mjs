import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const basePath = raw === '/' ? '' : raw.replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  // GitHub Pages serves a project repo under /<repo>; empty at a domain root.
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
};

/* `next build` and `next dev` share .next by default, so building while the
   dev server runs deletes its compiled chunks: every page then loads with no
   CSS or JavaScript, and the home page answers 500. The dev server gets a
   folder of its own (Next 16 does this by default). */
export default (phase) => ({
  ...nextConfig,
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
});
