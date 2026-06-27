/** @type {import('next').NextConfig} */

const SECURITY_HEADERS = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig = {
  reactStrictMode: true,

  // 🚀 Enable SWC minifier (faster builds + smaller JS)
  swcMinify: true,

  // ⭐ Strong global image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // Cache images for 30 days
    domains: [
      "poshkaarofficial.vercel.app",
      "www.poshkaarofficial.vercel.app",
      "poshkaarkashmir.com",
      "www.poshkaarkashmir.com",
    ],
  },

  // 🔥 Improve bundle size & performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
    ],
    serverMinification: true,
  },

  // 🗺 Generate static sitemap automatically
  output: "standalone",

  // SEO & URL routing rules
  async rewrites() {
    return [
      {
        source: "/shop",
        destination: "/collection",
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/collections",
        destination: "/collection",
        permanent: true,
      },
    ];
  },

  // 🛡️ Security headers for production
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

module.exports = nextConfig;
