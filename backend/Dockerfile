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

# Pin the Puppeteer cache path so build-time and runtime agree on location
ENV PUPPETEER_CACHE_DIR=/app/.cache/puppeteer

COPY package*.json ./

# PUPPETEER_SKIP_DOWNLOAD=true prevents the postinstall script from
# attempting a Chrome download during npm ci (which often fails/corrupts
# in Docker). We install Chrome explicitly in the next step instead.
RUN PUPPETEER_SKIP_DOWNLOAD=true npm ci --omit=dev

# Now install Chrome into a guaranteed-clean cache directory
RUN npx puppeteer browsers install chrome

# Fail the BUILD if Chrome didn't actually get installed
RUN node -e "(async()=>{const p=require('puppeteer'); const fp=await p.executablePath(); const fs=require('fs'); console.log('Chrome at:', fp); if(!fs.existsSync(fp)){console.error('CHROME BINARY MISSING'); process.exit(1);} console.log('Chrome verified.');})()"

# Copy application source code
COPY . .

RUN npx prisma generate
RUN node scripts/download-fonts.js

EXPOSE 5000
CMD ["node", "server.js"]