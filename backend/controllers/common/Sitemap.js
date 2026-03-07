const CreateShow = require('../../models/CreateShow')

const SITE_URL = 'https://mw-bay.vercel.app'

const staticUrls = [
  { loc: SITE_URL,                             changefreq: 'daily',   priority: '1.0' },
  { loc: `${SITE_URL}/top-rated`,              changefreq: 'daily',   priority: '0.9' },
  { loc: `${SITE_URL}/most-liked`,             changefreq: 'daily',   priority: '0.9' },
  { loc: `${SITE_URL}/recently-released`,      changefreq: 'daily',   priority: '0.9' },
  { loc: `${SITE_URL}/About`,                  changefreq: 'monthly', priority: '0.7' },
  { loc: `${SITE_URL}/Contact`,                changefreq: 'monthly', priority: '0.6' },
  { loc: `${SITE_URL}/Login`,                  changefreq: 'yearly',  priority: '0.5' },
  { loc: `${SITE_URL}/SignUp`,                 changefreq: 'yearly',  priority: '0.5' },
]

exports.GenerateSitemap = async (req, res) => {
  try {
    const shows = await CreateShow.find(
      { uploaded: true, VerifiedByTheAdmin: true },
      '_id updatedAt title'
    ).lean()

    const movieUrls = shows.map(show => ({
      loc: `${SITE_URL}/Movie/${show._id}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: show.updatedAt
        ? new Date(show.updatedAt).toISOString().split('T')[0]
        : undefined,
    }))

    const allUrls = [...staticUrls, ...movieUrls]

    const urlEntries = allUrls.map(u => {
      const lastmodTag = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''
      return `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${lastmodTag}
  </url>`
    }).join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`

    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
    return res.status(200).send(xml)
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return res.status(500).json({ success: false, message: 'Failed to generate sitemap' })
  }
}
