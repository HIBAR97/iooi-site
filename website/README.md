# IOOI website

The public site for IOOI: home, support and privacy pages in Korean (`/ko/`, default) and English (`/en/`), plus `404.html`.
It exists for the App Store listing (Support URL, Privacy Policy URL) and is a plain static site: no external fonts, analytics or
CDNs; the only script is the language redirect on the root page. Plain Node (>= 20.6), no dependencies. The generator is the same one
the Touchstone site uses.

```bash
cd website
node build.mjs                    # src/ -> dist/ (placeholders allowed)
node build.mjs --release          # FAILS while an owner value is missing; run before deploying
node build.mjs --release --strict # also fails while the App Store link is missing
node build.mjs --serve --watch    # preview at http://127.0.0.1:8080/
```

- Owner values live in `site.config.json` (`supportEmail`, `effectiveDate`, `siteBaseURL`, `appStoreURL`). An empty `appStoreURL` renders
  a disabled "Coming soon" button, never a dead link. Fill it when the app is live, then rebuild and push.
- The privacy pages are rendered from `../docs/PRIVACY.md` (Korean part for `/ko/privacy/`, English part for `/en/privacy/`).
- Images: `python3 tools/make-assets.py` rebuilds the icon, favicons, Open Graph images and the device pictures from the app icon and
  `AppStore/screenshots/en-US/raw`. Re-run it whenever the UI or the icon changes.
- App Store Connect values: Support URL `<siteBaseURL>ko/support/` (or `en/support/`), Privacy Policy URL `<siteBaseURL>ko/privacy/` (or `en/privacy/`).

## Publishing

The site is published from its own **public** repo (`HIBAR97/iooi-site`, local copy `../iooi-site`), so the app's source stays private.
Edit here, run `scripts/export-website.sh`, then commit and `git push` in `iooi-site`; its workflow builds with `--release` and deploys
to GitHub Pages at https://hibar97.github.io/iooi-site/.
