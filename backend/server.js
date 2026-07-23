const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so the Vue frontend can communicate with this API
app.use(cors());
app.use(express.json());

const COURSES_DIR = path.join(__dirname, '../courses');

// Helper to check if courses directory exists
if (!fs.existsSync(COURSES_DIR)) {
  fs.mkdirSync(COURSES_DIR, { recursive: true });
}

/**
 * Helper function to read all course markdown files and parse their metadata
 */
function getCoursesList() {
  try {
    const files = fs.readdirSync(COURSES_DIR);
    const courses = [];

    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(COURSES_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        // Make sure slug, title, category, etc. exist, fallback if needed
        const slug = data.slug || path.basename(file, '.md');
        courses.push({
          slug,
          title: data.title || slug,
          description: data.description || '',
          category: data.category || 'Général',
          difficulty: data.difficulty || 'Tout niveau',
          duration: data.duration || '5 min',
          order: data.order !== undefined ? data.order : 99,
          resources: data.resources || [],
          content: content || ''
        });
      }
    });

    // Sort by order parameter, then alphabetically by title
    return courses.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.title.localeCompare(b.title);
    });
  } catch (error) {
    console.error('Error reading courses directory:', error);
    return [];
  }
}

// Endpoint to list all courses (metadata only, no content, for light payload)
app.get('/api/courses', (req, res) => {
  const courses = getCoursesList();
  res.json(courses);
});

// Endpoint to get a specific course content and metadata by slug
app.get('/api/courses/:slug', (req, res) => {
  const { slug } = req.params;
  try {
    const files = fs.readdirSync(COURSES_DIR);
    let matchedFile = null;

    // Find the file that matches the slug (either in front-matter or file name)
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(COURSES_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        if (data.slug === slug || path.basename(file, '.md') === slug) {
          matchedFile = { data, content, file };
          break;
        }
      }
    }

    if (!matchedFile) {
      return res.status(404).json({ error: `Cours '${slug}' introuvable` });
    }

    res.json({
      slug: matchedFile.data.slug || path.basename(matchedFile.file, '.md'),
      title: matchedFile.data.title || slug,
      description: matchedFile.data.description || '',
      category: matchedFile.data.category || 'Général',
      difficulty: matchedFile.data.difficulty || 'Tout niveau',
      duration: matchedFile.data.duration || '5 min',
      order: matchedFile.data.order !== undefined ? matchedFile.data.order : 99,
      resources: matchedFile.data.resources || [],
      content: matchedFile.content
    });
  } catch (error) {
    console.error(`Error loading course ${slug}:`, error);
    res.status(500).json({ error: 'Erreur lors de la récupération du cours' });
  }
});

// Start the server only if run directly (development)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
