# Optimization Guide

This project has been optimized for high performance (Lighthouse scores 90+). Below are tips for maintaining and further improving speed.

## 1. Fast Image Response
Currently, images are optimized using Next.js built-in Image Optimization. To make them even faster:

- **Use a Dedicated Image CDN:** Consider using **Cloudinary** or **Imgix**. They specialize in ultra-fast image delivery.
- **Supabase Storage:** If you upload your own images to Supabase Storage, they are served via a CDN. 
- **AVIF Support:** I have enabled AVIF in `next.config.js`. This provides ~20-30% better compression than WebP.

## 2. Fast Way to Upload
Instead of manually copy-pasting URLs from Unsplash/Pexels:

- **Upload to Supabase:** Use the Supabase Dashboard to upload images to a bucket (e.g., `menu-images`). Use the public URL in your database.
- **Bulk Import Script:** If you have many images, you can use a script to upload them to Supabase Storage and update the database in one go.

## 3. LCP (Largest Contentful Paint)
- The first 4 items in the menu are marked with `priority`. This tells the browser to start loading them immediately.
- I've disabled the entrance animation for these 4 items to eliminate "Render Delay".

## 4. Reducing JavaScript
- Avoid adding large libraries for small tasks.
- Keep `framer-motion` usage light on the home page.
- Use Server Components where possible (though the home page is currently a Client Component for interactivity).

## 5. Deployment
- Deploy to **Vercel** or **Netlify**. They have built-in Edge Networks that serve your content from the closest location to the user.
- Ensure your Supabase region matches your deployment region (e.g., if you deploy to AWS US-East, put Supabase in US-East).
