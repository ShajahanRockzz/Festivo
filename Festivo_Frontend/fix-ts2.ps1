(Get-Content -Raw src/app/Guest/guesthome/guesthome.ts) -replace '?
\s*contactForm: any = \{[\s\S]*?\};', '' | Set-Content src/app/Guest/guesthome/guesthome.ts
