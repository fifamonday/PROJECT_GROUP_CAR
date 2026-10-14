import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
export default defineConfig([
  ...nextVitals,
  {
    rules: {
      // รูปรถมาจาก URL ภายนอกหลายเว็บ จึงใช้ <img> ธรรมดาแทน next/image
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([".next/**", "node_modules/**"])
]);
