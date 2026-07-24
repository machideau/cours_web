const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const COURSES_DIR = path.join(__dirname, '..', 'courses');

if (!fs.existsSync(COURSES_DIR)) {
  fs.mkdirSync(COURSES_DIR, { recursive: true });
}

function formatCourseData(data, content, fileOrSlug) {
  const slug = data.slug || path.basename(fileOrSlug, '.md');
  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    category: data.category || 'Général',
    difficulty: data.difficulty || 'Tout niveau',
    duration: data.duration || '5 min',
    order: data.order !== undefined ? data.order : 99,
    image: data.image || '',
    resources: data.resources || [],
    content: content || ''
  };
}

function getCoursesList() {
  try {
    const files = fs.readdirSync(COURSES_DIR);
    const courses = [];

    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(COURSES_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        courses.push(formatCourseData(data, content, file));
      }
    });

    return courses.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });
  } catch (error) {
    console.error('Error reading courses directory:', error);
    return [];
  }
}

function getCourseBySlug(slug) {
  const files = fs.readdirSync(COURSES_DIR);
  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = path.join(COURSES_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      if (data.slug === slug || path.basename(file, '.md') === slug) {
        return formatCourseData(data, content, file);
      }
    }
  }
  return null;
}

module.exports = {
  getCoursesList,
  getCourseBySlug
};
