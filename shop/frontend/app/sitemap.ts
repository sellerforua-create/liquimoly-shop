import { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://liquimoly.ua', lastModified: new Date() },
    { url: 'https://liquimoly.ua/catalog', lastModified: new Date() },
    { url: 'https://liquimoly.ua/car-selector', lastModified: new Date() },
    { url: 'https://liquimoly.ua/about', lastModified: new Date() },
    { url: 'https://liquimoly.ua/faq', lastModified: new Date() },
    { url: 'https://liquimoly.ua/contacts', lastModified: new Date() },
  ]
}
