(Get-Content -Raw src/app/Guest/guesthome/guesthome.ts) -replace '?
interface ContactForm \{[\s\S]*??
\}', '' | Set-Content src/app/Guest/guesthome/guesthome.ts
