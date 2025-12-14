#!/usr/bin/env node
// .env の GENIMI_API_URL / GENIMI_API_KEY を読み取り、constants/genimi.ts を上書きします
// 使い方: node scripts/sync_env_to_constants.js

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const url = process.env.GENIMI_API_URL || process.env.GEMINI_API_URL || '';
const key = process.env.GENIMI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

if (!url || !key) {
  console.warn('WARN: GENIMI_API_URL または GENIMI_API_KEY が .env に見つかりません。');
}

const outPath = path.resolve(process.cwd(), 'constants', 'genimi.ts');
const content = `export const GENIMI_API_URL = ${JSON.stringify(url)};
export const GENIMI_API_KEY = ${JSON.stringify(key)};
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, content, 'utf8');
console.log('Wrote', outPath);
