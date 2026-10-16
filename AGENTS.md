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
