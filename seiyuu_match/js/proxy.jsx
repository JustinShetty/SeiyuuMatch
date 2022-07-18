const PROXY_ROOT = '/mal_proxy';

export function malRouteToUrl(route) {
    return `${PROXY_ROOT}/${route}`
}