import fs from 'fs';
import MarkdownIt from 'markdown-it';

const GUIDES_FOLDER = 'guides'; // the folder containing the .md guides written by developers
const TYPEDOC_OUTPUT_FOLDER = 'docs';
const GUIDES_PREFIX = 'guide_';

const guides = fs.readdirSync(GUIDES_FOLDER)
    .filter(guide => guide.endsWith('.md')) // selecting only .md files
    .map(guide => guide.slice(0, -3));      // removing .md extension from filenames

const pageWithGuidesNavigation = fs.readFileSync(`${TYPEDOC_OUTPUT_FOLDER}/index.html`, 'utf8').replace(
    /tsd-navigation primary[^<]+<ul>/m, // this pattern looks for the navigation links
    `$&
    <li class="globals current"><a href="index.html"><em>Index</em></a></li>
    <li class="label tsd-is-external"><span>Guides</span></li>` +
    guides.map(guide => `<li><a href="${GUIDES_PREFIX}${guide}.html">${guide}</a></li>`).join('') + // injecting guides' links
    `<li class="label tsd-is-external"><span>Annotations</span></li>`
);

fs.writeFile(`${TYPEDOC_OUTPUT_FOLDER}/index.html`, pageWithGuidesNavigation, error => {
    if (error) throw error;
    console.log('index.html rewritten.');
});

const md = new MarkdownIt();

for (const guide of guides) {
    fs.writeFile(`${TYPEDOC_OUTPUT_FOLDER}/${GUIDES_PREFIX}${guide}.html`, pageWithGuidesNavigation
        .replace(
            /(<div .+container-main[^]+tsd-panel tsd-typography">)([^]+?)(<\/div>)/m, // this pattern looks for the page main content
            '$1' + md.render(fs.readFileSync(`${GUIDES_FOLDER}/${guide}.md`, 'utf8')) + '$3'
        ), error => {
            if (error) throw error;
            console.log(`${GUIDES_PREFIX}${guide}.html generated.`);
        }
    );
}
