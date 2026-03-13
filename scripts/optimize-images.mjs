import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const images = [
  { src: 'public/images/heros/hero-background.png', dest: 'public/images/heros/hero-background.webp', width: 2000, quality: 80 },
  { src: 'public/images/city/delhi.png', dest: 'public/images/city/delhi.webp', width: 800, quality: 80 },
  { src: 'public/images/city/kolkata.png', dest: 'public/images/city/kolkata.webp', width: 800, quality: 80 },
  { src: 'public/images/city/mumbai.png', dest: 'public/images/city/mumbai.webp', width: 800, quality: 80 },
  { src: 'public/images/banner/family.jpeg', dest: 'public/images/banner/family.webp', width: 600, quality: 80 },
  { src: 'public/images/banner/honeymoon.jpeg', dest: 'public/images/banner/honeymoon.webp', width: 600, quality: 80 },
  { src: 'public/images/banner/adventure.jpeg', dest: 'public/images/banner/adventure.webp', width: 600, quality: 80 },
  { src: 'public/images/brands/citycarnival.png', dest: 'public/images/brands/citycarnival.webp', width: 300, quality: 80 },
  { src: 'public/images/brands/google-news.png', dest: 'public/images/brands/google-news.webp', width: 300, quality: 80 },
  { src: 'public/images/brands/indian-publisher.png', dest: 'public/images/brands/indian-publisher.webp', width: 300, quality: 80 },
  { src: 'public/images/brands/business-update.png', dest: 'public/images/brands/business-update.webp', width: 300, quality: 80 },
  { src: 'public/images/brands/fox-story.png', dest: 'public/images/brands/fox-story.webp', width: 300, quality: 80 },
  { src: 'public/images/brands/hindustan-time.png', dest: 'public/images/brands/hindustan-time.webp', width: 300, quality: 80 },
];

async function optimize() {
  for (const img of images) {
    const srcPath = path.resolve(process.cwd(), img.src);
    const destPath = path.resolve(process.cwd(), img.dest);
    
    if (fs.existsSync(srcPath)) {
      console.log(`Optimizing ${img.src}...`);
      await sharp(srcPath)
        .resize(img.width, null, { withoutEnlargement: true })
        .webp({ quality: img.quality })
        .toFile(destPath);
      console.log(`Saved to ${img.dest}`);
    } else {
      console.warn(`Source file not found: ${srcPath}`);
    }
  }
}

optimize().catch(console.error);
