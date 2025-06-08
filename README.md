# Portfolio Website

This site showcases my work and runs entirely in the browser. Most third-party
libraries are stored locally in the `assets/` folder so the page can be viewed
offline. Icons from [Font Awesome](https://fontawesome.com) are currently loaded
from their CDN; download the stylesheet if you require complete offline support.

## Offline setup

1. Ensure the following files are present in `assets/`:
   - `assets/js/three.min.js`
   - `assets/js/aos.js`
   - `assets/css/aos.css`
   - `assets/js/vanilla-tilt.min.js`
   - Roboto font files referenced in `assets/fonts/roboto.css`
   - *(optional)* Font Awesome files if you wish to remove the CDN dependency
2. Open `index.html` directly in your browser. The site will use the local
   assets, but icons will attempt to load from the CDN unless you provide a
   local copy.

**Note:** The repository may contain placeholder files if the assets could not be downloaded in the Codex environment. Replace them with the actual library files for full functionality.
