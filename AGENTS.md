<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Generate the app-shell /sw.js with vite-plugin-pwa into dist/client, with NetworkFirst documents, API/OAuth exclusions and only the guarded register-sw wrapper registering it; this prevents stale preview caches while retaining offline support.
- Keep messaging handlers in public/push-events.js imported by the generated worker at the same /sw.js scope; this preserves existing push subscriptions when updating offline caching.
 
- The admin student-access overview reads paginated profiles, subscriptions and payment submissions through the existing authenticated client and RLS; use subscription expiry plus account suspension for status, so students without payments remain visible and no separate access state drifts out of sync.
- The standalone Tutor uses public/tutor-memory.js with account-owned RLS history and profile records; clearing chat advances a visibility cursor instead of deleting messages, and model context retrieves recent and relevant saved messages without unbounded prompts.
- Bind every Tutor memory request to the current verified session token and invalidate pending work on account changes; this prevents stale-session RLS failures and cross-account writes.
- Library preparation runs sequentially in the signed-in administrator browser, resumes saved offsets and pauses on terminal AI errors; never mark truncated or interrupted books ready, because students must search complete sources.
- Shared-library retrieval uses match_library_chunks under caller RLS with per-book lateral top matches and statement-cached admin checks to avoid whole-library window sorts; cite retrieved page references and never claim current guideline verification without a current source.
- Retry transient shared-library read failures once under the same caller RLS and return a safe unavailable response on persistent failures; permissions must never be bypassed.
- The standalone library reader lives in public/library-reader.js and public/library-reader.css, using PDF.js lazy pages and EPUB navigation; persist extracted contents on user_books through admin RLS to reuse chapter indexes.
- Administrator sign-in verifies the role under the just-authenticated bearer token; a failed role request must never be treated as absent permissions or invalid credentials, to avoid false login denials.
- Clinical-case reads, inserts and completion updates bind to the current session owner's bearer token; recheck ownership after AI generation to prevent stale-session saves.
- Profile client writes use column-level grants; status changes go through the admin-verified RPC, signup fields are validated by the profile trigger, and Tutor/search check caller status before work to prevent self-reactivation and suspended use.

- Library reads (user_books, book_chunks, user-books storage) and /api/tutor, /api/books/search require public.has_access() (admin, or active profile with unexpired subscription); access-check failures return 503, never 402, so technical errors never lock students out.
- /api routes use src/lib/cors.server.ts with a fixed origin allowlist (never *) so the Capacitor app can call the published server.
- Tutor streaming uses plain UTF-8 deltas with an RS-delimited terminal record; display-only drafts stay outside account memory and sources attach only after verified completion, so interrupted responses cannot become saved answers.

- Pin iframe CDN scripts to exact versions with SHA-384 SRI on every loader call, keeping the shell client version and service-worker dependency URL aligned; this prevents unverified floating dependencies without changing synchronous bootstrap.
- Curated study additions live in separate public/temas/<id>.js files listed in temas/lista.js; parser-blocking study-topic-files.js loads them before study-topics-loader.js validates and merges entries before search initialization, isolating syntax failures. New IDs require explicit catalog placement.
- Apply shared topic presentation through public/study-reading.js and study-reading.css, preparing a non-mutating topic view with a dedicated citation pane; this keeps future topics consistent, avoids duplicated sources across lessons and resolves visual briefs into actual illustrations or source-derived diagrams.
- Public study summaries without verified publication dates use WebPage structured data, and share tags reference the same share-sized image rendered on the page; this avoids fabricated Article facts and mismatched previews.
- Generated study modules use a server-held source-only master prompt, caller-RLS staged drafts with leases, and immutable explicitly reviewed publications; data-only safe rendering and Markdown derived from canonical JSON preserve provenance without executing model HTML or modifying curated topics.
