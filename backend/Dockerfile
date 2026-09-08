FROM node:22-bookworm-slim

# Install TeX Live, fonts, and Chrome's runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-xetex \
    texlive-latex-extra \
    texlive-pictures \
    fonts-liberation \
    ca-certificates \
    curl \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Pin the Puppeteer cache path via ENV so it's identical at build time
# (npm ci's postinstall downloads Chrome here) and at runtime (the app
# looks for Chrome here). This makes .puppeteerrc.cjs redundant/backup.
ENV PUPPETEER_CACHE_DIR=/app/.cache/puppeteer

COPY package*.json ./
RUN npm ci --omit=dev

# Force-remove any corrupted/partial cache, then install Chrome fresh
RUN rm -rf $PUPPETEER_CACHE_DIR \
    && npx puppeteer browsers install chrome

# Fail the BUILD (not silently fail later at runtime) if Chrome
# didn't actually get installed where we expect it.
RUN node -e "(async()=>{const p=require('puppeteer'); const fp=await p.executablePath(); const fs=require('fs'); console.log('Puppeteer expects Chrome at:', fp); if(!fs.existsSync(fp)){console.error('CHROME BINARY MISSING AT BUILD TIME'); process.exit(1);} console.log('Chrome binary verified present.');})();"

# Copy application source code
COPY . .

RUN npx prisma generate
RUN node scripts/download-fonts.js

EXPOSE 5000
CMD ["node", "server.js"]