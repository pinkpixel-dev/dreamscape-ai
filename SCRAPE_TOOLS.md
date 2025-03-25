# Free Web Scraping APIs for Arbitrary Websites

Below are several publicly accessible web scraping APIs that meet the criteria (free tier, can scrape any URL, no self-hosting needed, and no strict short-burst limits). Each entry includes the API’s link, free tier limits, auth requirements, response format, key limitations, and an example usage.

## AllOrigins (allorigins.win)​[allorigins.win](https://allorigins.win/#:~:text=,origin%20policy%20problems)​[allorigins.win](https://allorigins.win/#:~:text=)

- **Free Tier & Rate Limits:** Completely free and open-source proxy API with no specified hard rate limits. Intended for lightweight use; content may be cached to reduce load (a `disableCache` parameter is available in some forks) – making 5+ quick requests is typically fine.
- **Authentication:** No API key or signup required (just call the endpoint directly)​[allorigins.win](https://allorigins.win/#:~:text=,origin%20policy%20problems).
- **Response Format:** Can return raw HTML text or JSON. Use the `raw` mode to get unprocessed HTML content​[allorigins.win](https://allorigins.win/#:~:text=) (otherwise the default /get returns JSON with the HTML in a contents field). The API also sets CORS headers so it can be called from a browser.
- **Limitations:** Being a free public service, it may cache responses for a short time and could throttle or block abuse. Large or heavy sites might not be fetched in real-time if cached. No JavaScript rendering (pure HTTP fetch).
- **Example:** To fetch a page’s HTML, call:

```txt
https://api.allorigins.win/raw?url=https://example.org/
```

This returns the raw HTML of **example.org**​[allorigins.win](https://allorigins.win/#:~:text=).

## CorsProxy.io (corsproxy.io)​[corsproxy.io](https://corsproxy.io/#:~:text=https%3A%2F%2Fcorsproxy)​[corsproxy.io](https://corsproxy.io/#:~:text=Is%20CorsProxy%20free%20to%20use%3F)

- **Free Tier & Rate Limits:** Free for development use without an account​[corsproxy.io](https://corsproxy.io/#:~:text=Is%20CorsProxy%20free%20to%20use%3F). There’s no fixed request limit mentioned for the free usage; in practice it supports at least dozens of requests (5+ in a burst is fine). Heavy or sustained use in production requires a paid plan.
- **Authentication:** No auth needed for the open dev tier. (Paid plans offer an API key and dashboard, but for casual use you just call the URL.)​[corsproxy.io](https://corsproxy.io/#:~:text=Is%20CorsProxy%20free%20to%20use%3F)
- **Response Format:** Returns the target page’s content (HTML, JSON, etc.) as-is, with CORS headers added. It’s essentially a proxy: you prepend the service URL and it relays the raw response.
- **Limitations:** Intended for front-end use to bypass CORS – so it simply fetches the URL. It won’t run scripts (no JS rendering). The free service might block certain domains or high-volume use in production. Also, no guarantee of content sanitization – it’s a direct proxy (use HTTPS for secure sites).
- **Example:** Prepend the proxy to your URL. For example:

```txt
https://corsproxy.io/?url=https://example.com/api/
```

will fetch **example.com** content with CORS enabled​[corsproxy.io](https://corsproxy.io/#:~:text=https%3A%2F%2Fcorsproxy). (No JSON wrapping – the response is the raw output from the target URL.)

## ScraperAPI (scraperapi.com)​[docs.scraperapi.com](https://docs.scraperapi.com/faq/plans-and-billing/free-plan-and-7-day-free-trial#:~:text=ScraperAPI%20offers%20a%20free%20plan,testing%20purposes%2C%20please%20contact%20support)​[boxpiper.com](https://www.boxpiper.com/posts/web-scraping-in-javascript-how-to-scrape-a-website-using-scraper-api#:~:text=Implementation%20is%20extremely%20simple%2C%20and,and%20they%E2%80%99ll%20handle%20the%20rest)

- **Free Tier & Rate Limits:** Offers a *free plan* of **1,000 API calls per month** (no expiration) with up to 5 concurrent requests​[docs.scraperapi.com](https://docs.scraperapi.com/faq/plans-and-billing/free-plan-and-7-day-free-trial#:~:text=ScraperAPI%20offers%20a%20free%20plan,testing%20purposes%2C%20please%20contact%20support). This means you can scrape ~33 pages/day and even hit 5 at once. During the first week after signup, the limit is temporarily boosted to 5,000 requests​[docs.scraperapi.com](https://docs.scraperapi.com/faq/plans-and-billing/free-plan-and-7-day-free-trial#:~:text=ScraperAPI%20offers%20a%20free%20plan,testing%20purposes%2C%20please%20contact%20support).
- **Authentication:** Requires an API key (provided at signup). You pass it as a query parameter (`api_key=YOUR_KEY`). No credit card needed for the free tier.
- **Response Format:** Returns the **raw HTML** of the target page by default​[boxpiper.com](https://www.boxpiper.com/posts/web-scraping-in-javascript-how-to-scrape-a-website-using-scraper-api#:~:text=Implementation%20is%20extremely%20simple%2C%20and,and%20they%E2%80%99ll%20handle%20the%20rest). (You can optionally enable auto-parsing to JSON, but that’s off by default​[scraperapi.com](https://www.scraperapi.com/blog/what-is-data-parsing/#:~:text=What%20Is%20Data%20Parsing%20in,get%205000%20free%20API).) The HTML comes through as the response body text, which you can feed into an LLM or parser.
- **Limitations:** The free plan uses ScraperAPI’s standard proxy pool (datacenter IPs). It may struggle on sites with heavy anti-bot measures unless you enable features (e.g. headless rendering or residential IPs) which can consume extra credits. JavaScript rendering is **not** automatic on free requests (it’s an option, costing additional credits). Also, CORS headers are **not** added by default – so if calling directly from a browser, you’ll hit CORS issues (best to call from server-side).
- **Example:** Using a GET request with your API key and target URL:

```bash
curl "http://api.scraperapi.com?api_key=YOUR_API_KEY&url=https://example.com"
```

This will return the HTML of **example.com** (for instance, using Node/axios, the `response.data` will contain the page HTML)​[boxpiper.com](https://www.boxpiper.com/posts/web-scraping-in-javascript-how-to-scrape-a-website-using-scraper-api#:~:text=Implementation%20is%20extremely%20simple%2C%20and,and%20they%E2%80%99ll%20handle%20the%20rest)​[boxpiper.com](https://www.boxpiper.com/posts/web-scraping-in-javascript-how-to-scrape-a-website-using-scraper-api#:~:text=async%20function%20scrapeWebsite%28url%29%20,YOUR_SCRAPERAPI_API_KEY).

## ScrapingAnt (scrapingant.com)​[scrapingant.com](https://scrapingant.com/#:~:text=match%20at%20L43%20From%20our,just%20what%20ants%20do%21%20%E2%80%8D)​[docs.scrapingant.com](https://docs.scrapingant.com/migration-guides/scrapingbee-migration#:~:text=Please%2C%20be%20aware%20that%20ScrapingAnt%27s,testing%20on%20smaller%20paid%20plans)

- **Free Tier & Rate Limits:** Provides a **free plan with 10,000 API credits** (requests)​[scrapingant.com](https://scrapingant.com/#:~:text=match%20at%20L43%20From%20our,just%20what%20ants%20do%21%20%E2%80%8D), advertised as *“Free for personal use!”*​[scrapingant.com](https://scrapingant.com/#:~:text=Choose%20your%20plan). This free tier has a concurrency limit of **1 request at a time**​[docs.scrapingant.com](https://docs.scrapingant.com/migration-guides/scrapingbee-migration#:~:text=Please%2C%20be%20aware%20that%20ScrapingAnt%27s,testing%20on%20smaller%20paid%20plans), so you must scrape pages sequentially (5 consecutive requests are fine, just not in parallel on free plan). The 10k credits are generous – enough for 10k pages if using basic requests. (Unused credits may not roll over; it’s likely 10k per month, given wording​[scrapingant.com](https://scrapingant.com/#:~:text=match%20at%20L43%20From%20our,just%20what%20ants%20do%21%20%E2%80%8D).)
- **Authentication:** Requires an API key (`x-api-key`) which you get by signing up (no credit card needed for the free tier). You include this key as a header or query parameter in requests​[scrapeops.io](https://scrapeops.io/proxy-providers/scrapingant/python-scrapingant-proxy-api-guide/#:~:text=def%20get_proxy_url%28url%29%3A%20payload%20%3D%20,com%2Fv2%2Fgeneral%3F%27%20%2B%20urlencode%28payload%29%20return%20proxy_url).
- **Response Format:** By default, returns the fetched page’s content. If you call the **“general”** endpoint with `browser=false`, it will return the **raw HTML** (no JS executed)​[scrapeops.io](https://scrapeops.io/proxy-providers/scrapingant/python-scrapingant-proxy-api-guide/#:~:text=def%20get_proxy_url%28url%29%3A%20payload%20%3D%20,com%2Fv2%2Fgeneral%3F%27%20%2B%20urlencode%28payload%29%20return%20proxy_url). ScrapingAnt also has options to auto-extract content to JSON or Markdown, but those are opt-in. The default HTML output is suitable for feeding to an LLM.
- **Limitations:** The free plan’s single-thread limit means slower throughput (no simultaneous crawling). If a target website uses heavy bot protections (Cloudflare, etc.), a basic request might fail – you could enable headless browser mode (`browser=true`) or other anti-bot measures, but that will cost more credits per request​[scrapeway.com](https://scrapeway.com/web-scraping-api/scrapingant#:~:text=ScrapingAnt%20is%20a%20credit,bot%20bypass)​[scrapeway.com](https://scrapeway.com/web-scraping-api/scrapingant#:~:text=Integrations%20Python%2C%20Javascript%20Proxy%20support,only%20Sessions%20Yes%2C%20persistent%20IP). Also, their proxy pool is good (datacenter by default, residential available at extra cost), but extremely large or complex scraping jobs might require a paid tier. CORS: responses likely do **not** include CORS headers, so treat it like a server-side API.
- **Example:** A typical GET request with API key and target URL:

```bash
curl "https://api.scrapingant.com/v2/general?x-api-key=YOUR_API_KEY&url=https://example.com&browser=false"
```

This fetches **example.com** HTML through ScrapingAnt’s API (with no JS rendering, using one credit).

## Scrapestack (scrapestack.com)​[scrapestack.com](https://scrapestack.com/pricing#:~:text=)​[scrapestack.com](https://scrapestack.com/documentation#:~:text=If%20your%20scraping%20request%20was,with%20your%20original%20API%20request)

- **API Link:** scrapestack.com – an Apilayer service.
- **Free Tier & Rate Limits:** “Free forever” plan with **100 requests per month**​[scrapestack.com](https://scrapestack.com/pricing#:~:text=)​[scrapestack.com](https://scrapestack.com/pricing#:~:text=,). No concurrency is explicitly stated on the free plan (it likely only allows a couple of parallel requests), but running 5 back-to-back scrapes is fine as long as you stay under the monthly 100 quota.
- **Authentication:** Requires an API access key (register on their site to get one). You include it as a query param `access_key=YOUR_KEY` in the request URL​[scrapestack.com](https://scrapestack.com/documentation#:~:text=Example%20API%20Request%3A).
- **Response Format:** Returns **raw HTML** of the target page by default if the request succeeds​[scrapestack.com](https://scrapestack.com/documentation#:~:text=If%20your%20scraping%20request%20was,with%20your%20original%20API%20request). You can append parameters for JS rendering (render_js=1) or to include HTTP headers in the output, but by default it’s just the HTML text of the page.
- **Limitations:** The free plan uses standard datacenter proxies only​[scrapestack.com](https://scrapestack.com/pricing#:~:text=,) – meaning some sites with strong anti-scraping might block these. (Premium proxies, geotargeting, and HTTPS are features of higher plans; notably, the free tier *does* support HTTPS URLs​[scrapestack.com](https://scrapestack.com/documentation#:~:text=%60access_key%60%20,along%20with%20your%20API%20response)​[scrapestack.com](https://scrapestack.com/documentation#:~:text=,this%20to%20technical%20customer%20support).) There is no JavaScript execution on the free plan unless you enable render_js, which might count as multiple requests. Also, scrapestack doesn’t inject CORS headers, so you can’t call it from client-side JS without a proxy. The 100/month limit is relatively low, so it’s best for testing or low-volume projects.
- **Example:** A basic usage to scrape a page:

```txt
https://api.scrapestack.com/scrape?access_key=YOUR_KEY&url=https://www.wikipedia.org
```

This will return Wikipedia’s HTML. If the call exceeds your free monthly 100 requests or uses a feature not in free plan, you’d receive an error (e.g., “usage_limit_reached”)​[scrapestack.com](https://scrapestack.com/documentation#:~:text=,specified%20an%20invalid%20or%20unsupported).

## PhantomJS Cloud (phantomjscloud.com)​[phantomjscloud.com](https://phantomjscloud.com/pricing.html#:~:text=,if%20I%20don%27t%20sign%20up)​[phantomjscloud.com](https://phantomjscloud.com/docs/#:~:text=The%20examples%20use%20the%20demo,012345)

- **Free Tier & Rate Limits:** The cloud-based headless browser API has a free tier of **500 pages per day** with a free account​[phantomjscloud.com](https://phantomjscloud.com/pricing.html#:~:text=,if%20I%20don%27t%20sign%20up). (Without an account, you can use their demo key for ~100 pages/day​[phantomjscloud.com](https://phantomjscloud.com/pricing.html#:~:text=,if%20I%20don%27t%20sign%20up).) This is quite generous and easily handles bursts of 5 requests in a row. The 500/day resets daily; if you exceed it, additional calls are rejected with HTTP 402 or require a paid plan.
- **Authentication:** If using the demo key, no auth needed (just use the demo API key in the URL). For full 500/day, sign up to get your personal API key (a GUID string)​[phantomjscloud.com](https://phantomjscloud.com/docs/#:~:text=The%20examples%20use%20the%20demo,012345) and include it in the request URL. No other auth (like OAuth) is required.
- **Response Format:** By default, PhantomJS Cloud will **render the page and return the final HTML** (after executing JavaScript) – essentially the fully-loaded DOM as HTML text​[phantomjscloud.com](https://phantomjscloud.com/docs/#:~:text=,form%2C%20including%20all%20response). You can specify renderType=html or plainText for HTML output (the default is an HTML/DOM result suitable for scraping)​[phantomjscloud.com](https://phantomjscloud.com/docs/#:~:text=,form%2C%20including%20all%20response). It can also return images or PDFs, but those are optional. The HTML output is raw and can be parsed by your application or passed to an LLM.
- **Limitations:** Because it runs a headless Chrome/PhantomJS, each request is heavier (counts against a CPU-time budget). Extremely large or complex pages might use more of your quota (the 500/day is an estimate based on ~2s and 50KB per page)​[phantomjscloud.com](https://phantomjscloud.com/pricing.html#:~:text=Each%20page%20you%20request%20takes,Time%20and%2050KB%20Data%20Out). Free-tier users abusing the service (for example, scraping one domain excessively or performing illicit scraping) may find those domains **blacklisted** for them​[phantomjscloud.com](https://phantomjscloud.com/pricing.html#:~:text=,if%20I%20don%27t%20sign%20up). Also, PhantomJS Cloud is overkill for simple static pages – it’s best suited for pages requiring JS. It doesn’t add CORS headers to responses by default, so treat it as a server-side tool.
- **Example:** Using the demo key for a quick test:

```bash
curl "https://phantomjscloud.com/api/browser/v2/a-demo-key-with-low-quota-per-ip-address/?url=https://example.com&renderType=html"
```

This returns the fully-rendered HTML of **example.com**. Replace `a-demo-key-with-low-quota-per-ip-address` with your API key to get 500 pages/day​[phantomjscloud.com](https://phantomjscloud.com/docs/#:~:text=The%20examples%20use%20the%20demo,012345) (and avoid the 100/day limit).

Each of these APIs is simple to use and allows scraping of arbitrary websites. Depending on your needs (speed, JavaScript support, volume, etc.), you can choose a solution ranging from lightweight proxies (AllOrigins, CorsProxy.io) to more robust scraping services (ScraperAPI, ScrapingAnt, Scrapestack) or a headless-browser approach (PhantomJS Cloud). All have free plans that should comfortably handle at least 5 sequential requests for HTML content.