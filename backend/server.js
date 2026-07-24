const express = require('express');
const cors = require('cors');
const { getCoursesList, getCourseBySlug } = require('./services/courseService');
const { generateSitemap } = require('./services/sitemapService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Sitemap dynamique
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.send(generateSitemap());
});

// Endpoint to list all courses
app.get('/api/courses', (req, res) => {
  const courses = getCoursesList();
  res.json(courses);
});

// Endpoint to get a specific course content by slug
app.get('/api/courses/:slug', (req, res) => {
  const { slug } = req.params;
  try {
    const course = getCourseBySlug(slug);
    if (!course) {
      return res.status(404).json({ error: `Cours '${slug}' introuvable` });
    }
    res.json(course);
  } catch (error) {
    console.error(`Error loading course ${slug}:`, error);
    res.status(500).json({ error: 'Erreur lors de la récupération du cours' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
