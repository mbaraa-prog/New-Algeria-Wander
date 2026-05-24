const cache = {};

export const getCache = (key) => cache[key] || null;

export const setCache = (key, data) => {
    cache[key] = data;
};

export const clearCache = (key) => {
    delete cache[key];
};

export const clearAllCache = () => {
    Object.keys(cache).forEach(key => delete cache[key]);
};