import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'zxegjnjilxnyoqvyxtca.supabase.co' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' }
    ],
  },
};

export default nextConfig;
