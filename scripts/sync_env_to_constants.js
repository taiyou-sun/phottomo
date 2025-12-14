#!/usr/bin/env node
// .env の GEMINI_API_URL / GEMINI_API_KEY を読み取り、constants/GEMINI.ts を上書きします
// 使い方: node scripts/sync_env_to_constants.js

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const url = process.env.GEMINI_API_URL || process.env.GEMINI_API_URL || '';
const key = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

if (!url || !key) {
  console.warn('WARN: GEMINI_API_URL または GEMINI_API_KEY が .env に見つかりません。');
}

const outPath = path.resolve(process.cwd(), 'constants', 'GEMINI.ts');
const content = `export const GEMINI_API_URL = ${JSON.stringify(url)};
export const GEMINI_API_KEY = ${JSON.stringify(key)};
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, content, 'utf8');
console.log('Wrote', outPath);
