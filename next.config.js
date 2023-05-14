/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "img.freepik.com",
      "i.pinimg.com",
      "images.unsplash.com",
      "hope.be",
      "firebasestorage.googleapis.com",
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
