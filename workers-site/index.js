/**
 * The core of this Worker, serving static files from Cloudflare Pages
 */

import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event) {
  try {
    // Try to serve static assets
    return await getAssetFromKV(event)
  } catch (e) {
    // Fall back to index.html for SPA routing or serve a 404
    let fallbackResponse

    try {
      fallbackResponse = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
      })
    } catch (e) {
      return new Response('Not Found', { status: 404 })
    }

    return fallbackResponse
  }
} 