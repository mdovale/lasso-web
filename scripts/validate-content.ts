/**
 * Validates every file in content/ against its schema, then checks
 * cross-references (people/projects/publications/news/media ids) and that
 * referenced local images and files actually exist under public/.
 *
 * Run with:  npm run validate:content
 * This also runs automatically at the start of `npm run build`.
 */
import { ContentError } from "../lib/content/loader";
import { validateCrossReferences } from "../lib/content/validate";

const files = [
  "site.yaml",
  "navigation.yaml",
  "pages.yaml",
  "people.yaml",
  "projects.yaml",
  "publications.yaml",
  "news.yaml",
  "media.yaml",
];

function main(): void {
  console.log("Validating content files...\n");

  let failed = false;

  // 1. Schema validation + cross-reference checks (loaders throw ContentError).
  try {
    const problems = validateCrossReferences();
    if (problems.length > 0) {
      failed = true;
      console.error("✗ Cross-reference problems found:\n");
      for (const p of problems) {
        console.error(`  content/${p.file}: ${p.message}`);
      }
      console.error("");
    }
  } catch (err) {
    failed = true;
    if (err instanceof ContentError) {
      console.error(`✗ ${err.message}\n`);
    } else {
      throw err;
    }
  }

  if (failed) {
    console.error(
      "Content validation FAILED. Fix the problems above and run `npm run validate:content` again.",
    );
    console.error("See MAINTAINERS.md for help with editing content files.");
    process.exit(1);
  }

  for (const f of files) {
    console.log(`  ✓ content/${f}`);
  }
  console.log("\nAll content is valid.");
}

main();
