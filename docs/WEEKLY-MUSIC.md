# Update the weekly top five

Edit **`src/data/listening.json`** once a week. This is a manually curated list, not Spotify history or live playback. It needs no account connection, API key, or scheduled task.

1. Set `weekOf` to the start date of your chosen week, using `YYYY-MM-DD`.
2. Add exactly five real songs, ranked in array order. Each needs a title, artist, and a full HTTP/HTTPS track link (Spotify, YouTube, Bandcamp, or another destination).
3. Run `npm run check` and `npm run build`, then use the normal deployment workflow when ready.

The structure is shown below. Replace **all** example values with your actual picks before using it; these examples are not published listening history.

```json
{
  "weekOf": "2026-11-16",
  "tracks": [
    { "title": "First song title", "artist": "Artist name", "url": "https://example.com/song-1" },
    { "title": "Second song title", "artist": "Artist name", "url": "https://example.com/song-2" },
    { "title": "Third song title", "artist": "Artist name", "url": "https://example.com/song-3" },
    { "title": "Fourth song title", "artist": "Artist name", "url": "https://example.com/song-4" },
    { "title": "Fifth song title", "artist": "Artist name", "url": "https://example.com/song-5" }
  ]
}
```

Both About and Chaos read the same file. The date stays visible if you skip a week; the site does not invent fresh picks or rename an old list as this week’s listening.

Until you supply the first five songs, the shipped file stays empty:

```json
{ "weekOf": null, "tracks": [] }
```

Validation rejects partial lists, invalid dates, missing titles/artists, duplicate links, and non-web URL schemes. Keep credentials out of this public content file.
