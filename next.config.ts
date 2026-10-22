import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hostinger's build machine reports dozens of CPUs but limits threads; one build worker
  // per CPU (each loading Prisma's engine) crashes with "OS can't spawn worker thread"
  experimental: {
    cpus: 2,
    workerThreads: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
