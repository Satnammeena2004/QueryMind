import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: process.env.NEXT_BASE_URL as string,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: process.env.NEXT_BASE_URL as string + "/own",
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: process.env.NEXT_BASE_URL as string + "/explore",
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },

        {
            url: process.env.NEXT_BASE_URL as string + "/unicorns_data",
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
    ]
}