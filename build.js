import fs from 'fs';
import path from 'path';

const ROADMAP_DIR = path.resolve('./roadmaps');
const OUTPUT_PATH = path.resolve('./public/maps.json');
const COLOR_PALETTE = ['#57e0c9', '#b98bf0', '#ff8ad4', '#7fa8f0', '#f3c25c'];

function parseMarkdown(source) {
  const frontmatterMatch = source.match(/^---\s*\n([\s\S]*?)\n---\s*/);
  const meta = {};

  if (frontmatterMatch) {
    const lines = frontmatterMatch[1].split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (match) meta[match[1].trim()] = match[2].trim();
    }
  }

  const body = frontmatterMatch ? source.slice(frontmatterMatch[0].length) : source;
  const lines = body.split(/\r?\n/);

  let title = meta.title || 'Untitled Roadmap';
  let currentTopic = null;
  const topics = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      currentTopic = {
        title: heading[1].trim(),
        subtopics: []
      };
      topics.push(currentTopic);
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.+?)(?::\s*(.*))?$/);
    if (bullet && currentTopic) {
      const name = bullet[1].trim();
      const description = bullet[2]?.trim() || 'Core skill area';
      currentTopic.subtopics.push({ name, description });
      continue;
    }
  }

  if (!topics.length) {
    topics.push({ title: 'Core Track', subtopics: [{ name: 'Foundation', description: 'Launch the roadmap' }] });
  }

  return {
    title,
    tagline: meta.tagline || 'Capability roadmap',
    color: meta.color || '#57e0c9',
    accent: meta.accent || '#b98bf0',
    topics
  };
}

function main() {
  if (!fs.existsSync(ROADMAP_DIR)) {
    throw new Error(`Roadmap directory not found: ${ROADMAP_DIR}`);
  }

  const files = fs.readdirSync(ROADMAP_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort();

  const maps = files.map((file, index) => {
    const filePath = path.join(ROADMAP_DIR, file);
    const source = fs.readFileSync(filePath, 'utf8');
    const parsed = parseMarkdown(source);

    return {
      id: file.replace(/\.md$/, ''),
      file,
      color: parsed.color || COLOR_PALETTE[index % COLOR_PALETTE.length],
      accent: parsed.accent || '#ffffff',
      title: parsed.title,
      tagline: parsed.tagline,
      topics: parsed.topics
    };
  });

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(maps, null, 2) + '\n');
  console.log(`✅ Built ${maps.length} roadmap entries in public/maps.json`);
}

main();
