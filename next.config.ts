import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  // ไฟล์ใน data/ ใช้เป็นข้อมูลเริ่มต้นของ Redis บน Vercel
  outputFileTracingIncludes: {
    '/**': ['./data/*.json'],
  },
};
export default nextConfig;
