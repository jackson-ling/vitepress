const fs = require('fs');
const path = require('path');

const DOCS_DIR = 'D:\\vitepress\\docs';

// Recursively find all .md files
function findMarkdownFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(findMarkdownFiles(fullPath));
    } else if (item.isFile() && item.name.toLowerCase().endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results;
}

// Extract image references from markdown content
function extractImagePaths(content) {
  const images = [];

  // Match markdown image syntax: ![alt](path)
  const mdImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;

  while ((match = mdImageRegex.exec(content)) !== null) {
    images.push(match[2]);
  }

  // Match HTML img tags: <img src="path"> or <img src='path'>
  const htmlImageRegex = /<img\s+[^>]*src=(["'])([^"']+)\1/gi;

  while ((match = htmlImageRegex.exec(content)) !== null) {
    images.push(match[2]);
  }

  return images;
}

// Check if path case matches exactly
function checkCaseMatch(filePath, expectedPath) {
  // Normalize the path separators
  const normalizedExpected = expectedPath.replace(/\//g, '\\');

  // Split the path into components
  const parts = normalizedExpected.split('\\').filter(p => p.length > 0);

  let currentDir = filePath;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    // Skip current/parent directory markers
    if (part === '.' || part === '..') {
      continue;
    }

    try {
      // Get actual directory contents
      const entries = fs.readdirSync(currentDir);

      // Find matching entry (case-insensitive comparison)
      const actualEntry = entries.find(entry => entry.toLowerCase() === part.toLowerCase());

      if (!actualEntry) {
        return { exists: false, expected: part, actual: null };
      }

      // Check if case matches exactly
      if (actualEntry !== part) {
        return { exists: true, expected: part, actual: actualEntry };
      }

      // Move to next directory level
      currentDir = path.join(currentDir, actualEntry);
    } catch (err) {
      return { exists: false, expected: part, actual: null };
    }
  }

  return { exists: true, expected: null, actual: null };
}

// Main function
function main() {
  console.log('Scanning for case mismatches in image references...\n');

  const mdFiles = findMarkdownFiles(DOCS_DIR);
  let mismatchesFound = 0;

  for (const mdFile of mdFiles) {
    const mdDir = path.dirname(mdFile);
    const content = fs.readFileSync(mdFile, 'utf8');
    const imageRefs = extractImagePaths(content);

    for (const imgRef of imageRefs) {
      // Skip external URLs and absolute paths that don't start with a relative path
      if (imgRef.startsWith('http://') || imgRef.startsWith('https://') || imgRef.startsWith('//')) {
        continue;
      }

      // Skip data URIs
      if (imgRef.startsWith('data:')) {
        continue;
      }

      // Skip paths that start with / (absolute from root)
      if (imgRef.startsWith('/')) {
        continue;
      }

      // Decode URL-encoded characters
      const decodedRef = decodeURIComponent(imgRef);

      // Check case match
      const result = checkCaseMatch(mdDir, decodedRef);

      if (result.exists && result.actual !== null) {
        // Case mismatch found
        if (mismatchesFound === 0) {
          console.log('CASE MISMATCHES FOUND:\n');
        }
        console.log(`FILE: ${path.relative(DOCS_DIR, mdFile)}`);
        console.log(`  REFERENCE: ${imgRef}`);
        console.log(`  ACTUAL:    ${result.actual}`);
        console.log('');
        mismatchesFound++;
      }
    }
  }

  if (mismatchesFound === 0) {
    console.log('No case mismatches found.');
  } else {
    console.log(`\nTotal mismatches found: ${mismatchesFound}`);
  }
}

main();
