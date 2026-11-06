// Helpers callable from templates as {{@name key=value}}. Each returns trusted HTML.
import { escapeHtml as esc } from "./template.mjs";

export const placeholder = (key) => `<span class="placeholder">[[${key}]]</span>`;

/** mailto link built from site.config.json; a visible placeholder (release builds refuse it) if the value is missing. */
function email({ label, subject }, { config }) {
  if (!config.supportEmail) return placeholder("supportEmail");
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `<a href="mailto:${esc(config.supportEmail)}${query}">${esc(label ?? config.supportEmail)}</a>`;
}

/** A store button. No value in the config yet: a disabled button with a "coming soon" label, never a dead link. */
function button({ key, label, variant = "primary" }, { config, t }) {
  const href = config[key];
  if (href) return `<a class="btn btn-${variant}" href="${esc(href)}" rel="noopener">${esc(label)}</a>`;
  return `<button class="btn btn-${variant} is-soon" type="button" disabled>${esc(label)}<span class="soon">${esc(t.soon)}</span></button>`;
}

/** The effective date from the config, written the way the page's language writes dates. */
function date(_, { config, lang }) {
  if (!config.effectiveDate) return placeholder("effectiveDate");
  const value = new Date(`${config.effectiveDate}T00:00:00Z`);
  const text = new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-US", { dateStyle: "long", timeZone: "UTC" }).format(value);
  return `<time datetime="${esc(config.effectiveDate)}">${esc(text)}</time>`;
}

// Small decorative icons (24x24, stroke only); colour comes from CSS.
const ICONS = {
  mail: '<rect x="3.5" y="6" width="17" height="12" rx="3"/><path d="M4.5 8.2l7.5 5.3 7.5-5.3"/>',
  paper: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M12 4.5v15"/>',
  folder: '<path d="M3.5 8a2 2 0 0 1 2-2h3.6l2 2.2h7.4a2 2 0 0 1 2 2v7.3a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2z"/>',
  sticker: '<path d="M5 5.5h14v8.5l-5.5 5.5H5z"/><path d="M13.5 19.5V14H19"/>',
  pencil: '<path d="M5 19l1-4.2L15.8 5a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L9.2 18z"/><path d="M14 7l3 3"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="3"/><path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11"/>',
  draw: '<path d="M4 17c3-9 5-9 6-4s3 5 5-1 3-5 5-4"/>',
  fold: '<path d="M12 4v16"/><path d="M4.5 7.5l5 1.5v8l-5 1.5zM19.5 7.5l-5 1.5v8l5 1.5z"/>',
  mirror: '<path d="M12 3.5v17" stroke-dasharray="2 3"/><path d="M9 8c-2.5.2-4.5 2-4.5 4.2 0 2.4 2 4.3 4.5 4.3M15 8c2.5.2 4.5 2 4.5 4.2 0 2.4-2 4.3-4.5 4.3"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
};

function icon({ name }) {
  const body = ICONS[name];
  if (!body) throw new Error(`unknown icon "${name}"`);
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
}

export const helpers = { email, button, date, icon };
