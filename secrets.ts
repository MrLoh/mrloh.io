import 'server-only';

if (!process.env.BLUESKY_APP_PASSWORD) throw new Error('BLUESKY_APP_PASSWORD is not set');

export const BLUESKY_APP_PASSWORD = process.env.BLUESKY_APP_PASSWORD;
