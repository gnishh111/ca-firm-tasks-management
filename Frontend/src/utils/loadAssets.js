export function loadStyle(href) {
    return new Promise((resolve, reject) => {
        // Prevent duplicates
        if (document.querySelector(`link[href="${href}"]`)) {
            return resolve();
        }
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.onload = () => resolve();
        link.onerror = () => reject(`Failed to load style: ${href}`);
        document.head.appendChild(link);
    });
}

export function loadScript(src) {
    return new Promise((resolve, reject) => {
        // Prevent duplicates
        if (document.querySelector(`script[src="${src}"]`)) {
            return resolve();
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(`Failed to load script: ${src}`);
        document.body.appendChild(script);
    });
}

/**
 * Helper for page-level loading
 * @param {*} assets { css: [], js: [] }
 */
export function loadAssets(assets = {}) {
    const { css = [], js = [] } = assets;

    const cssPromises = css.map(loadStyle);
    const jsPromises = js.map(loadScript);

    return Promise.all([...cssPromises, ...jsPromises]);
}
