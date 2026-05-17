// IP-based geolocation via Geoapify — no browser permission required.
// City-level accuracy, good enough to bias autocomplete and nearby spots.
// Module-level cache so only one request is made per page session.

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

let cached  = null;
let promise = null;

export function getCoords() {
    if (cached)  return Promise.resolve(cached);
    if (promise) return promise;

    promise = fetch(`https://api.geoapify.com/v1/ipinfo?apiKey=${API_KEY}`)
        .then((r) => r.json())
        .then((data) => {
            console.log(data)
            const lat = data.location?.latitude  ?? data.city?.lat ?? null;
            const lng = data.location?.longitude ?? data.city?.lon ?? null;
            cached = (lat !== null && lng !== null) ? { lat, lng } : null;
            return cached;
        })
        .catch(() => null);

    return promise;
}
