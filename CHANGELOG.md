# v2.1.1 (Mon Aug 21 2023)

#### 🐛 Bug Fix

- Selecting specific element also applies pseudo state to all its descendants alternate [#85](https://github.com/chromaui/storybook-addon-pseudo-states/pull/85) ([@JonathanKolnik](https://github.com/JonathanKolnik))

#### Authors: 1

- Jono Kolnik ([@JonathanKolnik](https://github.com/JonathanKolnik))

---

# v2.1.0 (Thu Jun 22 2023)

#### 🚀 Enhancement

- Add support for custom root element [#65](https://github.com/chromaui/storybook-addon-pseudo-states/pull/65) ([@sag1v](https://github.com/sag1v) [@ghengeveld](https://github.com/ghengeveld))

#### Authors: 2

- Gert Hengeveld ([@ghengeveld](https://github.com/ghengeveld))
- Sagiv ben giat ([@sag1v](https://github.com/sag1v))

---

# v2.0.2 (Thu Jun 22 2023)

#### 🐛 Bug Fix

- Fix pseudo state selector menu for Storybook 7 [#78](https://github.com/chromaui/storybook-addon-pseudo-states/pull/78) ([@yasnbouz](https://github.com/yasnbouz) [@ghengeveld](https://github.com/ghengeveld))

#### Authors: 2

- Gert Hengeveld ([@ghengeveld](https://github.com/ghengeveld))
- Yassine El Bouziady ([@yasnbouz](https://github.com/yasnbouz))

---

# v2.0.1 (Wed Apr 19 2023)

#### 🐛 Bug Fix

- Remove redundant regex negative lookbehind [#73](https://github.com/chromaui/storybook-addon-pseudo-states/pull/73) ([@filipw01](https://github.com/filipw01))

#### Authors: 1

- Filip Wachowiak ([@filipw01](https://github.com/filipw01))

---

# v2.0.0 (Wed Apr 12 2023)

#### 💥 Breaking Change

- Set Storybook deps to v7 [#68](https://github.com/chromaui/storybook-addon-pseudo-states/pull/68) ([@JReinhold](https://github.com/JReinhold))
- Convert to TypeScript and upgrade to Storybook 7 [#47](https://github.com/chromaui/storybook-addon-pseudo-states/pull/47) ([@ghengeveld](https://github.com/ghengeveld))

#### 🐛 Bug Fix

- Fix media queries breaking rules override [#58](https://github.com/chromaui/storybook-addon-pseudo-states/pull/58) ([@filipw01](https://github.com/filipw01))
- Remove optional chaining in next [#70](https://github.com/chromaui/storybook-addon-pseudo-states/pull/70) ([@filipw01](https://github.com/filipw01) [@ghengeveld](https://github.com/ghengeveld) runner@fv-az491-751.is1xdb2m0b3ubcod5yxy40qnsg.phxx.internal.cloudapp.net [@kasperpeulen](https://github.com/kasperpeulen))

#### Authors: 5

- Filip Wachowiak ([@filipw01](https://github.com/filipw01))
- Gert Hengeveld ([@ghengeveld](https://github.com/ghengeveld))
- ghengeveld (runner@fv-az491-751.is1xdb2m0b3ubcod5yxy40qnsg.phxx.internal.cloudapp.net)
- Jeppe Reinhold ([@JReinhold](https://github.com/JReinhold))
- Kasper Peulen ([@kasperpeulen](https://github.com/kasperpeulen))

---

# v1.15.5 (Thu Mar 23 2023)

#### 🐛 Bug Fix

- Remove optional chaining [#52](https://github.com/chromaui/storybook-addon-pseudo-states/pull/52) ([@filipw01](https://github.com/filipw01))

#### ⚠️ Pushed to `main`

- 1.15.4 ([@ghengeveld](https://github.com/ghengeveld))

#### Authors: 2

- Filip Wachowiak ([@filipw01](https://github.com/filipw01))
- Gert Hengeveld ([@ghengeveld](https://github.com/ghengeveld))

---

# v1.15.2 (Tue Dec 13 2022)

#### 🐛 Bug Fix

- Fixes an issue with particular pseudo classes, which has classes applied on them [#45](https://github.com/chromaui/storybook-addon-pseudo-states/pull/45) ([@valentinpalkovic](https://github.com/valentinpalkovic) [@ghengeveld](https://github.com/ghengeveld))

#### Authors: 2

- Gert Hengeveld ([@ghengeveld](https://github.com/ghengeveld))
- Valentin Palkovic ([@valentinpalkovic](https://github.com/valentinpalkovic))

---

# v1.15.1 (Wed Jun 22 2022)

#### 🐛 Bug Fix

- Update react and react-dom peer dependencies level [#35](https://github.com/chromaui/storybook-addon-pseudo-states/pull/35) ([@dsueltenfuss](https://github.com/dsueltenfuss))

#### Authors: 1

- Dave Sueltenfuss ([@dsueltenfuss](https://github.com/dsueltenfuss))

---

# v1.15.0 (Thu Jun 16 2022)

#### 🚀 Enhancement

- Add support for targeting specific elements [#25](https://github.com/chromaui/storybook-addon-pseudo-states/pull/25) (sagiv.bengiat@appsflyer.com [@ghengeveld](https://github.com/ghengeveld) [@sag1v](https://github.com/sag1v))

#### Authors: 3

- Gert Hengeveld ([@ghengeveld](https://github.com/ghengeveld))
- Sagiv ben giat ([@sag1v](https://github.com/sag1v))
- sagiv.bengiat (sagiv.bengiat@appsflyer.com)

---

# v1.14.1 (Wed Jun 15 2022)

#### ⚠️ Pushed to `main`

- Fix toolbar toggles ([@ghengeveld](https://github.com/ghengeveld))
- Upgrade Storybook ([@ghengeveld](https://github.com/ghengeveld))

#### Authors: 1

- Gert Hengeveld ([@ghengeveld](https://github.com/ghengeveld))

---

# v1.0.0 (Tue May 24 2022)

#### 🚀 Enhancement

- Merge branch 'main' into feature/docs-support [#20](https://github.com/chromaui/storybook-addon-pseudo-states/pull/20) ([@ghengeveld](https://github.com/ghengeveld))
- Add support for custom elements using `:host(:hover)` like styling. [#17](https://github.com/chromaui/storybook-addon-pseudo-states/pull/17) (jeroen.zwartepoorte@iddinkgroup.com [@ghengeveld](https://github.com/ghengeveld))

#### 🐛 Bug Fix

- fix: only generate pseudo selector when the selector has a match [#30](https://github.com/chromaui/storybook-addon-pseudo-states/pull/30) ([@tobi-or-not-tobi](https://github.com/tobi-or-not-tobi) [@ghengeveld](https://github.com/ghengeveld))
- Use personal access token to be able to push to main ([@ghengeveld](https://github.com/ghengeveld))
- fix: Resolve crash for stories that use internal State [#28](https://github.com/chromaui/storybook-addon-pseudo-states/pull/28) (david.maulick@coinbase.com)
- Fix CSS selector splitting [#24](https://github.com/chromaui/storybook-addon-pseudo-states/pull/24) ([@ilanus](https://github.com/ilanus) [@ghengeveld](https://github.com/ghengeveld))
- Add support for slotted lit elements [#23](https://github.com/chromaui/storybook-addon-pseudo-states/pull/23) ([@ilanus](https://github.com/ilanus))
- Setup auto [#7](https://github.com/chromaui/storybook-addon-pseudo-states/pull/7) ([@ghengeveld](https://github.com/ghengeveld))

#### ⚠️ Pushed to `main`

- Update config to checkout repo using personal access token ([@ghengeveld](https://github.com/ghengeveld))
- Use chromatic@next ([@ghengeveld](https://github.com/ghengeveld))
- [skip release] Revert back to disabling CustomElement stories ([@ghengeveld](https://github.com/ghengeveld))
- Another attempt at dealing with IE ([@ghengeveld](https://github.com/ghengeveld))
- Don't disable stories, just ignore IE ([@ghengeveld](https://github.com/ghengeveld))
- Fix missing parameter ([@ghengeveld](https://github.com/ghengeveld))
- Disable snapshotting for CustomElements stories ([@ghengeveld](https://github.com/ghengeveld))
- 1.1.0 ([@ghengeveld](https://github.com/ghengeveld))
- Simplify ([@ghengeveld](https://github.com/ghengeveld))
- Small tweak ([@ghengeveld](https://github.com/ghengeveld))
- Upgrade Storybook ([@ghengeveld](https://github.com/ghengeveld))
- Ignore .env file ([@ghengeveld](https://github.com/ghengeveld))

#### Authors: 5

- David Maulick ([@dmaulick](https://github.com/dmaulick))
- Gert Hengeveld ([@ghengeveld](https://github.com/ghengeveld))
- Ilan ([@ilanus](https://github.com/ilanus))
- Jeroen Zwartepoorte ([@jpzwarte](https://github.com/jpzwarte))
- tobi-or-not-tobi ([@tobi-or-not-tobi](https://github.com/tobi-or-not-tobi))

---

# v1.0.0 (Sat Feb 27 2021)

#### 🐛 Bug Fix

- Setup auto [#7](https://github.com/chromaui/storybook-addon-pseudo-states/pull/7) ([@ghengeveld](https://github.com/ghengeveld))

#### ⚠️ Pushed to `main`

- Ignore .env file ([@ghengeveld](https://github.com/ghengeveld))

#### Authors: 1

- Gert Hengeveld ([@ghengeveld](https://github.com/ghengeveld))
