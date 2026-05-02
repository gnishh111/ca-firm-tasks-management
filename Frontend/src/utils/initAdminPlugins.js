let initialized = false;

export async function initAdminPlugins() {
  if (initialized) return; // 🚫 prevent double init
  initialized = true;

  // jQuery
  const jqueryModule = await import("jquery");
  const $ = jqueryModule.default;
  window.$ = window.jQuery = $;

  // Moment (global for template scripts)
  const momentModule = await import("moment");
  window.moment = momentModule.default;

  // Bootstrap JS
  const bootstrap = await import("bootstrap");

  // Tooltips (safe re-init)
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
    if (!el._tooltip) {
      el._tooltip = new bootstrap.Tooltip(el);
    }
  });
}
