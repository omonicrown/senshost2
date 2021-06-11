import configs from "../configs";
/**
 * Type is in and out for within or new tab
 * @param {ReactHistory} history The redux history object
 * @param {string} url The URL to navigate to
 * @param {boolean} replace Whether to replace or not
 * @param {boolean} newPage Whether to open in a new window or not
 * @param {boolean} redirect use this if you want to redirect the page to an external url within the same page
 */
export function navigate( url: string, replace?: boolean, newPage?: boolean, goBack?: boolean, redirect?: boolean): void {
    if (goBack) {
        configs.history.goBack();
        configs.history.goBack();
    }
    if (redirect) {
        configs.history.replace(url);
    } else if (newPage) {
        window.open(url, "_blank");
    } else {
        if (configs.history?.location?.pathname?.substr(1) !== url) {
            if (replace) {
                configs.history.replace(url);
            } else {
                configs.history.push(url);
            }
        }
    }
}
