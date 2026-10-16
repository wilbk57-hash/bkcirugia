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
 
- The admin student-access overview reads paginated profiles, subscriptions and payment submissions through the existing authenticated client and RLS; use subscription expiry plus account suspension for status, so students without payments remain visible and no separate access state drifts out of sync.
- The standalone Tutor uses public/tutor-memory.js with account-owned RLS history and profile records; clearing chat advances a visibility cursor instead of deleting messages, and model context retrieves recent and relevant saved messages without unbounded prompts.
- Library preparation runs sequentially in the signed-in administrator browser, resumes saved offsets and pauses on terminal AI errors; never mark truncated or interrupted books ready, because students must search complete sources.
- Shared-library retrieval uses match_library_chunks under caller RLS with per-book diversity; cite retrieved page references and never claim current guideline verification without a current source.
- The standalone library reader lives in public/library-reader.js and public/library-reader.css, using PDF.js lazy pages and EPUB navigation; persist extracted contents on user_books through admin RLS to reuse chapter indexes.
