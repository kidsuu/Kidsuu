# Reader art provenance — internal draft

Generated/composed 6 October 2026. **Human/editorial/rights review: pending.** No vendor licensing or source-rights attestation is claimed. AI source images were made through the Arena image tool; the descriptions below summarize the working briefs, not a verbatim prompt log.

## Retained inputs

Generated sources are retained in the agent workspace `reader-scene-sources/`; original pair remains in `reference-assets/character-references/clean-pair.png`. Raw backgrounds/rejected drafts are not bundled or committed. Full source SHA-256 identities are also bound into `scenePack.json`. Source files are needed only for optional recomposition, not normal app builds/CI.

| Source ID               | Dimensions | SHA-256                                                            | Brief / origin                                                                                 |
| ----------------------- | ---------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `paper-start`           | 1264×848   | `76954570f2f4359f56285d7e917706b8b1f9cba65601ed4979e963e7b526f198` | Quiet courtyard table, paper with one blue wave, leaf and crayon; no characters.               |
| `paper-rain`            | 1264×848   | `703471dc504c146390f24dc8fa01ffd8265e49d47ccde3a17a36995ce6a423e7` | Same paper/table after rain; damp curled corner, still readable blue line; no thunder.         |
| `bench-empty`           | 1264×848   | `f5094af207e6178dc37aaff5989b2f93451dfde59cdc38181a258eb7d9e06afb` | Roof and pale wall; wet exposed left end of bench, dry wall-side right end; no characters.     |
| `cloth-background-rest` | 1264×848   | `68b6f2d683526e51e7d233bc8dd5d88b804e91726eb3d07a4f1aa8a475a5a36f` | Low table on right, blue cloth flat, adult sleeve/hand; empty left for original puppy.         |
| `cloth-background-up`   | 1264×848   | `f5e84150d7efe40b1d900736b758c6ddeba6bf69221efbf0d26a9f475f79d986` | Related composition; adult hand holds one blue cloth above table, face area clear; empty left. |
| `approved-pair`         | 420×355    | `11ce1b5a6a4210bc3defa83ecccae61c8c687aecc2bc0914779b4b6c54f07277` | Owner-supplied approved boy/puppy reference. Existing artwork, not generated in this batch.    |

## Composition recipe

`scripts/compose-reader-scenes.py`, Python/Pillow 12.3.0 in this run. Script SHA-256: `29b75d0e389e8c706056489b2364f108319108d54f14bd3d0bb224f4ef3edbe8`. No diffusion/generative edit runs in this script. Exact hashes verified by a fresh recomposition of all nine files. Other Pillow versions/encoders may produce different bytes; never silently rewrite the versioned manifest.

- Story 01/02: crop `(70,340,1190,820)` from corresponding AI table sources; resize to 960×411. Tight object views remove inconsistent distant furniture.
- Story 03: resize empty-bench source to 960×644. `ai-crop` origin category includes resizing an AI source without newly painted content.
- Story 04–06: use exactly the same bench, plus deterministically drawn paper, wave and corner. Leaf is added in 05; blue outlined sail/mast in 06. Shared paper quadrilateral in source pixels: `(650,530),(978,685),(813,743),(500,581)`. Procedural overlays are not claimed to be hand-illustrated or professionally approved.
- Rhyme up/rest: crop original pair at `(192,155,420,355)`, alpha-trim, resize puppy to width 300, composite at x=80 with foot baseline y=770 on the generated 1264×848 background; add subtle floor shadow; final 960×644. The puppy is resampled, not repainted, with identical pose in both images.
- Cast reference: byte-for-byte original 420×355 RGBA, not a transformed/generated replacement. Its hash must equal the approved-pair source hash.
- No separate down image exists. Requests for an additional leaf scene/down frame hit the turn generation limit; those outputs were not created. The leaf/sail use procedural composition; down honestly reuses rest.

Optional reproduction (from repository root with Pillow installed; these are local source paths, not URLs):

```sh
python scripts/compose-reader-scenes.py --sources /path/to/reader-scene-sources --reference /path/to/clean-pair.png --output /path/to/review-output
```

Compare hashes before replacing any app asset. CI validates the already committed files and does not require Python/Pillow or private raw references.

## Final files

| Asset                | Dimensions | Bytes  | SHA-256                                                            | Composition category    |
| -------------------- | ---------- | ------ | ------------------------------------------------------------------ | ----------------------- |
| `cast-reference.png` | 420×355    | 145232 | `11ce1b5a6a4210bc3defa83ecccae61c8c687aecc2bc0914779b4b6c54f07277` | owner-reference         |
| `rhyme-rest.png`     | 960×644    | 573939 | `b429ac72b48540aebf58b0ca17f311656282af4f89ff70a8d97b7ffd1cd4b8b6` | ai-background-composite |
| `rhyme-up.png`       | 960×644    | 650611 | `2722c12556d9261a494ad4710cd38eab6ae23e9ad406a5893be4cb844bea95ae` | ai-background-composite |
| `story-01.png`       | 960×411    | 436932 | `741ac41c9305adc4fea0163b2fe696dd669df85aeb20fb6fe3ee9977c5dc0737` | ai-crop                 |
| `story-02.png`       | 960×411    | 481396 | `b379c1732a52ac96a4f64154fb0bb239e3df11059113f7e1dff21df769fd02b3` | ai-crop                 |
| `story-03.png`       | 960×644    | 804666 | `6c9a1e284dcf2843b468875e2e72c1cb676092c169cad185c5ab1b867761fc71` | ai-crop                 |
| `story-04.png`       | 960×644    | 779981 | `3e5c4fd2ea45a4f5464109d35acd76c043889e422190e60e1e9d4912f57b769e` | ai-background-composite |
| `story-05.png`       | 960×644    | 782737 | `c68d6b483ba0dd1cb94cb34d6b691603768bd3394595436cea193b7968402fa0` | ai-background-composite |
| `story-06.png`       | 960×644    | 784313 | `b5004796754b4b55e89f0ae4cc5a712ca0d7eb9d563147865a367cc13b0d8f0a` | ai-background-composite |

## Rejected or unused sources

Full-character `bench-01.png` and `cloth-rest.png` plus attempted corrections were desk-rejected for character/proportion drift. Their first attempts were overwritten by the corrections. Neither latest candidate is used. `bench-paper.png` (AI hand lowering paper) is also unused; deterministic paper continuity was preferred. Raw files remain workspace-only for review, not as active app assets. No failed output is described as approved.

| Latest retained unused file | SHA-256                                                            |
| --------------------------- | ------------------------------------------------------------------ |
| `bench-01.png`              | `6476327fccab306c5c86560069948e007f05c51af88d61b41d0b2acdc00e0283` |
| `cloth-rest.png`            | `d516394474b4237a9defe132078958b4022fc3f5ca5cc163f4c8b2a71006dcdf` |
| `bench-paper.png`           | `14b733a99cfd020b8eb2b7b678ffe3fa9871281033dc8b3a6d4443d8c02569d6` |

## Review status

AI desk review inspected all eight scene outputs and the approved reference; no native tablet/child study was performed. Qualified art, educator, language, safety and rights reviews remain pending. Exact owner source/design reuse does not itself prove copyright/commercial-use clearance. In particular, inspect the small paper fold and sail at real display size, procedural/AI style continuity, rain amount, Hindi naming/description quality and whether object-only scenes meet the desired reading experience. See ILLUSTRATED-READERS.md for explicit device cases.
