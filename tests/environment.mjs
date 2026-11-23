import site from '../src/data/site.json' with { type: 'json' };
export const basePath = process.env.BASE_PATH ?? site.base;
export const isCI = Boolean(process.env.CI);
