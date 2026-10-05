# Part 3 of 6 — Four complete pilot packs and worked AI-production examples

## 15. Four pilot drafts, extended into production examples

Distribution illustrative hai: Learning 4–5, Games 6–7, Rhymes 2–3, Stories 8–9. Har category other ages mein bhi possible hai. Selection four meaningful demands tests karta hai: concrete quantity, invariant shape, caregiver access, and narrative inference. **All content is draft/prototype, not educator-approved or child-tested. Images/audio: NOT GENERATED. No recorded or sung assets exist in these packs.** AI/editor desk review below is an analysis of drafts, not independent qualified sign-off.

Common controls proposed: Back/Stop, Repeat instruction, Help/Show me, Continue/Finish later; no timer, scores or autoplay; screen-reader/text alternatives; sound/reduced-motion respected. Current player does not already implement every control. Narration = final child script only; stage directions, answer keys and adult notes never spoken. On every screen/page, child may leave. Explicit explored action advances progress regardless of support in future player; correctness recorded separately only if approved. Progress semantics are proposals, not current API-compatible payloads.

Asset prompt header for ALL prompts below: “Use owner-supplied APPROVED_BOY_REFERENCE and APPROVED_PUPPY_REFERENCE only if characters appear. Preserve exact existing 2D face, hair/fur, clothing, proportions and palette; clay-style interface support, no 3D, new mascot or identity change. If references missing, generate props/layout brief only and mark character art blocked. No text/numbers inside generated images; reviewed UI overlays supplied separately. No unrelated decoration, reward symbols or dramatic reactions. Educational count/shape/spatial accuracy takes precedence. Output PNG candidate plus provenance; human check required.” Technical export values Part 5 are provisional; these are instructions, not assets.

### P-L: One for Each Bowl / हर कटोरी में एक — ages 4–5, Learning

**Brief.** Stable proposed ID `one-each-bowl`; objective `NUM.ONE_TO_ONE_3`: give exactly one item to each of three recipients; optional cardinality observation after rearrangement. Prereqs: know “one”, understand recipient by model, recognize small visible objects; numeral not required. Scope six units, roughly 3–6 minutes H including optional help; stop sooner. Setting toy picnic, no eating requirement. E13 supports number progression; specific unit learning benefit untested. B05 is its blueprint.

**Exact generation prompt:**

```text
Act as an educational-content drafting assistant, not a certified educator. Draft Kidsuu learning unit one-each-bowl for ages 4–5 in en-IN and hi-IN. Objective: place one large toy fruit in each of three bowls; optional identify same total after rearrangement. Inputs: this brief; E13 IES maths guidance summary; existing React Native/Expo text practice/reader limits; approved 2D boy/puppy references if visual planning. Keep one concept. No reading/numeral requirement, timer, score, streak, shame or mastery claim. Use intro, worked two-bowl model, guided three-bowl try, independent fresh arrangement, fresh three-plate quantity check, natural end; six screens, not five padding. Require tap-item-then-bowl alternative and caregiver/off-screen equivalent. Return complete English/Hindi per-screen narration, interaction state, correct key, error explanation, three hint levels, parent note, alt descriptions, scene/asset brief, completion meaning and proposed JSON fields. Keep exact object counts; no food/choking task. Label app gaps and all reviews pending; do not invent references/assets/test results. Missing references: plan props only, no character invention. Do not publish or edit code.
```

**Complete initial draft v0 and desk review.** This intentionally flawed first draft is a worked illustration, not an actual prior model output. It contains a common early-generation pattern:

| Screen | Full initial child script v0               |
| ------ | ------------------------------------------ |
| L01    | “Ready to win three stars? Count fast!”    |
| L02    | “Two bowls need two apples. Tap 2.”        |
| L03    | “Three bowls. Choose 2, 3 or 4.”           |
| L04    | “Three bowls again. Choose 2, 3 or 4.”     |
| L05    | “You tapped three. You know counting now!” |
| L06    | “Play again to keep Puppy happy.”          |

Desk findings: reward/speed/guilt inappropriate; symbolic choice precedes correspondence; middle answer repeated; no model/hints/transfer; taps mistaken for learning. **Explicit revision:** replace answer quiz with one-item-per-bowl action, use a different layout and fresh plate example, remove intelligence/mastery/reward/guilt. Correct feedback explains correspondence, end allows rest. Qualified educator still must review.

**Final proposed script v1 (complete bilingual child-facing and narration text):**

| Screen / image description                                                 | English narration/display                                                                                                        | Hindi narration/display                                                                                           | Interaction/logic                                                                                                                                                |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L01 intro: three empty bowls, three toy fruits                             | “Let's get our toy picnic ready. We can put one fruit in each bowl. You can ask for help.”                                       | “खिलौनों की दावत तैयार करें। हर कटोरी में एक फल रखेंगे। मदद भी ले सकते हो।”                                       | Start/Repeat/Back. Adult may say दावत means pretend picnic; no child data                                                                                        |
| L02 model: two empty bowls, two fruit tokens                               | “Watch. One fruit here. One fruit here. Every bowl has one. Two fruits altogether.”                                              | “देखो। एक फल यहाँ। एक फल यहाँ। हर कटोरी में एक है। कुल दो फल।”                                                    | Explicit Show model; reveal static step A then B or reduced-motion equivalent. No child response scored                                                          |
| L03 guided: three bowls row, three tokens                                  | “Put one fruit in each bowl. Tap a fruit, then a bowl.”                                                                          | “हर कटोरी में एक फल रखो। पहले फल पर, फिर कटोरी पर टैप करो।”                                                       | Choose unplaced token then target; undo; if occupied bowl, do not place silently. Check when all placed; support available                                       |
| L04 independent: three bowls triangular layout, three new toy-fruit tokens | “Here are different bowls. Put one fruit in each. Take your time.”                                                               | “अब कटोरियाँ अलग तरह से रखी हैं। हर कटोरी में एक फल रखो। आराम से करो।”                                            | Fresh layout; same one-to-one state; optional help means supported response. No public score                                                                     |
| L05 fresh check: three plates; option trays with 2, 4, 3 tokens            | “Choose a tray with one fruit for every plate.”                                                                                  | “ऐसी थाली चुनो जिसमें हर प्लेट के लिए एक फल हो।”                                                                  | Picture choices IDs `two`, `four`, `three`; correct `three`, position 3 in this draft. Same-size tokens/areas; count visible; practice number symbols not needed |
| L06 end: finished three-place picnic                                       | “Our toy picnic is ready. We put one in each place. We can stop here. If you like, try it with a grown-up away from the screen.” | “खिलौनों की दावत तैयार है। हर जगह एक फल रखा। अब यहीं रुक सकते हैं। चाहो तो स्क्रीन से दूर किसी बड़े के साथ खेलो।” | Finish/Rest/Home; replay is explicit, no automatic new unit                                                                                                      |

**All hints and feedback:**

| Context              | English                                                               | Hindi                                                           |
| -------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------- |
| L03/L04 correct      | “One in every bowl. Three altogether.”                                | “हर कटोरी में एक। कुल तीन।”                                     |
| Occupied target      | “This bowl already has one. Let's find an empty bowl.”                | “इस कटोरी में एक फल है। खाली कटोरी देखें।”                      |
| Empty target remains | “One bowl is empty. Which fruit could go there?”                      | “एक कटोरी खाली है। कौन-सा फल वहाँ रख सकते हैं?”                 |
| L05 two              | “One plate would be empty. Let's give one to each.”                   | “एक प्लेट खाली रह जाएगी। हर प्लेट के लिए एक रखें।”              |
| L05 four             | “There is one extra fruit. We need one for each of the three plates.” | “एक फल ज़्यादा है। तीन प्लेटों में हर एक के लिए एक फल चाहिए।”   |
| L05 correct          | “Each of the three plates can have one.”                              | “तीनों प्लेटों में एक-एक फल आ सकता है।”                         |
| Hint 1               | “Look at the places, one at a time.”                                  | “एक-एक करके जगहों को देखो।”                                     |
| Hint 2               | “Let's start with this empty bowl.”                                   | “इस खाली कटोरी से शुरू करें।”                                   |
| Hint 3 / model       | “I'll show one. Then we can try together, or stop.”                   | “मैं एक करके दिखाऊँ। फिर साथ में कर सकते हैं, या रुक सकते हैं।” |
| Repeated difficulty  | “Would you like to watch, try together, or finish for now?”           | “देखना चाहोगे, साथ में करना, या अभी रुकना?”                     |

Hint 3 reveal counts as supported/modelled; fresh independent evidence must come from another equivalent example before help. Once correct show feedback, require explicit Continue. Every unsuccessful response remains recoverable; skip after model acceptable. Auto-placement/all-correct-loop not counted independent.

**Parent note:** “We practised one for each, with three places. A finished activity means the screens were explored. Try three large bowls and large toy objects, supervise throughout. Notice whether your child gives one to each without your prompt; help or stopping is fine.” Hindi: “तीन जगहों पर एक-एक चीज़ रखने का अभ्यास हुआ। पूरा होने का मतलब स्क्रीन देखना/आजमाना है। बड़े, सुरक्षित खिलौनों और कटोरियों से साथ में खेलें। बच्चे को मदद चाहिए या वह रुकना चाहे, दोनों ठीक हैं।” No real-food dose/feeding advice.

**Accessibility/asset instructions:** Instructions replayable and text equivalent; quantity can be described through focused recipient/token labels, no colour-only grouping. Blind access may use tactile real-object correspondence with adult; don't count spoken revealed quantities as an independent visual check. Six image briefs: L01 static toy-picnic arrangement; L02 two empty bowls + two separate fruit tokens, later composites one-per; L03 three clear bowls and reusable single fruit token; L04 same with rotated layout, tokens not overlapped; L05 three plates plus distinct 2/4/3 trays; L06 exactly three occupied bowls. Character only margin, no pointing that gives answer. **Exact illustration prompt for L05:** “Make a static, uncluttered clay-style 2D toy-picnic scene. Exactly three empty plates above. Below, three separate equal-sized trays: left exactly two toy fruits, middle exactly four, right exactly three. Fruits identical size, fully visible, equal background salience. No words, numerals, logos, mascot clues or extra countable decoration. Apply approved-reference header only if adding margin character. Reject if counts wrong; human compositing of reviewed token duplicates preferred.”

**Audio:** Six narration segments exactly table v1; separately error/hint segments from feedback table. en-IN calm everyday accent, hi-IN native natural; “कटोरी”, “दावत”, “एक-एक”, “तीनों” must be checked by a native reviewer; no completed human pronunciation review recorded. Pause between model placements; no music during instruction. Timing tied to explicit model step, not approximate audio duration. Spoken recordings optional/not generated; existing TTS cannot drive this placing activity without new implementation.

**Proposed data (illustrative, not drop-in):**

```json
{
  "contentId": "one-each-bowl",
  "schemaVersion": "0.1.0",
  "contentVersion": "0.1.0",
  "language": "en-IN",
  "ageBand": "4–5",
  "category": "learning",
  "learningObjectiveIds": ["NUM.ONE_TO_ONE_3"],
  "prerequisites": ["familiar-one", "shared-instruction-access"],
  "interactionType": "one-to-one-placement",
  "contentStructure": {
    "unitIds": ["L01", "L02", "L03", "L04", "L05", "L06"],
    "freshCheck": {
      "unitId": "L05",
      "optionIds": ["two", "four", "three"],
      "correctOptionId": "three"
    }
  },
  "narration": { "mode": "spoken", "status": "not-generated", "scriptSource": "script.en.md" },
  "hints": { "source": "feedback.en.md", "levels": 3 },
  "feedback": { "source": "feedback.en.md" },
  "accessibilityAlternatives": ["tap-then-tap", "adult-real-object", "text-equivalent"],
  "parentNotes": { "source": "parent.en.md" },
  "progressSemantics": { "kind": "units-explored", "unitCount": 6, "notMastery": true },
  "evidenceReferences": ["E13", "E02"],
  "editorialReviewStatus": "pending",
  "safetyReviewStatus": "pending",
  "assetLicenseMetadata": { "status": "pending" },
  "publicationStatus": "draft"
}
```

Hindi edition copies keys/quantity logic, changes language/script paths; it needs its own review and progress edition. Proposed manifest: `L01.png` through `L06.png` + reusable `bowl.png`, `fruit.png`; `L01.en.wav`…`L06.en.wav` and Hindi counterparts; `alt.en.md`, `alt.hi.md`, both feedback/parent files; all binary status `not-generated`, hashes `null`, rights `pending`. Do not create zero-byte pretend assets. Accept only: count keys independently checked, one-to-one model correct, no accidental answer cues, all texts read aloud by language reviewer, human safety approval, path/state/audio/device checks. Current practice no picture-placement/hints/skip; six-step new unit also fails existing known-ID constraints. Integration pending, no effectiveness claim.

### P-G: Triangle Workshop / त्रिकोण की खोज — ages 6–7, Games

**Brief.** `triangle-workshop`, `SPACE.TRIANGLE_INVARIANT`: classify closed three-straight-sided shapes under changed orientation/side length. Prereqs straight/closed/side demonstrated; reading optional. Six units, 4–8 minutes H. Skill is central mechanic: choosing shape completes a finite workshop display. No hidden-card memory or general-IQ claim. E02/E13-informed; B10.

**Exact generation prompt:**

```text
Draft Kidsuu finite game triangle-workshop, ages 6–7, complete en-IN/hi-IN editions. Role: content design assistant, no certification. Objective: identify a closed shape with three straight sides under rotation and different side lengths. Inputs: this brief, E02/E13 summaries, approved 2D boy/puppy references (if missing, plan props only), current app limits (text choice, five steps, no geometry game). Six units: model, familiar choice, rotated choice, narrow/scalene choice, optional reason, workshop end. Three challenge rounds only, no lives/time/rank/currency. Provide exact shape definitions by option ID, independently correct key, bilingual narration, error explanation, hint ladder, tap and non-motor access, parent/offline note, completion vs evidence, proposed structured data and asset manifest. No image-embedded words, no new mascots/3D. Do not invent educator approval, child outcomes or compatibility. Label drafts/pending reviews. Do not edit repository or publish.
```

**Complete illustrative initial draft v0:** G01 “Pick the pointy triangle.” G02 “Tap the yellow triangle”; G03 “Tap it before the clock ends”; G04 “The narrow triangle is wrong”; G05 “You are a geometry genius”; G06 “Win ten coins and keep playing.” Desk findings: visual prototype/colour/rotation misconception, punitive timer, false label and infinite loop. **Revision:** define geometric boundary, include rotated/scalene examples, feature-specific non-punitive feedback, finite end.

**Final proposed script and exact logic:**

| Unit                | English narration                                                                                   | Hindi narration                                                                        | Options / correct / action                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| G01 model           | “A triangle has three straight sides joined all the way round. Let's follow them: one, two, three.” | “त्रिकोण के तीन सीधे किनारे होते हैं। वे मिलकर बंद आकार बनाते हैं। देखें—एक, दो, तीन।” | Show reviewed triangle; explicit reveal side 1/2/3; still alternative. Start workshop        |
| G02 familiar round  | “Find a triangle.”                                                                                  | “त्रिकोण ढूँढ़ो।”                                                                      | IDs `closed-tri`, `oval`, `square`; correct `closed-tri`, position 1                         |
| G03 rotated round   | “A shape can turn. Which is still a triangle?”                                                      | “आकार घूम सकता है। कौन-सा अब भी त्रिकोण है?”                                           | `circle`, `rectangle`, `turned-tri`; correct `turned-tri`, position 3                        |
| G04 variation round | “Triangles can look different. Find one with three straight sides joined all the way round.”        | “त्रिकोण अलग-अलग दिख सकते हैं। तीन सीधे किनारों वाला बंद आकार ढूँढ़ो।”                 | `open-three`, `scalene-tri`, `curved-three`; correct `scalene-tri`, position 2               |
| G05 optional reason | “What helped you choose? You can point, tell a grown-up, or move on.”                               | “चुनने में किस बात ने मदद की? इशारा करो, किसी बड़े को बताओ, या आगे बढ़ो।”              | No automatically graded oral explanation; no microphone. Optional replay of shape boundaries |
| G06 end             | “Our triangle workshop is finished. Turning a triangle did not change its sides. We can stop here.” | “त्रिकोण की खोज पूरी हुई। घुमाने से उसके किनारे नहीं बदले। अब यहीं रुक सकते हैं।”      | Three found/revealed examples displayed; Finish/Home. Complete even if supported             |

Geometry asset specification: `closed-tri` vertices (20,80),(50,20),(80,80); `turned-tri` vertices (20,20),(80,50),(20,80); `scalene-tri` vertices (15,85),(40,15),(85,65), all coordinates in normalized 100×100 design box, closed paths. These are authoring values D, converted responsively by engineer. `open-three` same path but one gap clearly visible after three segments; `curved-three` closed figure with one genuinely curved boundary; square/circle/oval/rectangle matched stroke weight/space. Review mathematical correctness and visual ambiguity at tablet size. Generated picture alone is not trusted geometry key. Background doesn't add triangle arrows or corners that cue answer.

**Feedback/hints full:** Correct each round “Three straight sides, joined all the way round.” / “तीन सीधे किनारे—पूरा बंद आकार।” Circle/oval: “This edge curves. Let's look for straight sides.” / “इसका किनारा मुड़ा हुआ है। सीधे किनारे देखें।” Square/rectangle: “This has four sides. We are looking for three.” / “इसमें चार किनारे हैं। हमें तीन चाहिए।” Open shape: “There is a gap. A triangle is closed.” / “यहाँ जगह खुली है। त्रिकोण बंद होता है।” Curved-three: “One edge curves. A triangle's sides are straight.” / “एक किनारा मुड़ा है। त्रिकोण के किनारे सीधे होते हैं।” Hint 1 “Check the boundary.” / “बाहर के किनारे देखो।” Hint 2 “Count the straight sides.” / “सीधे किनारे गिनो।” Hint 3 “Let's follow this example together.” / “इस उदाहरण के किनारे साथ में देखें।” Then fresh example or Stop; modelled key counts supported. Repeated difficulty “Would you like to see one, or finish for now?” / “एक करके दिखाऊँ, या अभी रुकें?”

**Parent note:** “We practised triangle features, not speed. Draw a large tilted/narrow triangle and a curved non-example. Ask what makes it a triangle; accept pointing and support. A finished set doesn't certify shape mastery.” Hindi: “त्रिकोण के किनारों को पहचानने का अभ्यास हुआ। बड़ा, तिरछा त्रिकोण बनाएँ। पूछें कि वह त्रिकोण कैसे है। इशारा और मदद ठीक हैं। पूरा खेल कौशल में महारत का प्रमाण नहीं है।” Paper drawing, no scissors needed.

**Visual/audio production:** Accurate outlines should be drawn/composited deterministically; AI may draft background framing only. Illustration prompt: “Create uncluttered clay-style 2D workshop background with empty centre for reviewed geometry overlay, no tools/sharp objects, no embedded triangles/numbers/text. Existing approved boy/puppy may appear small at edge only with references. Keep centre plain, static expression.” G01–G06 exact narration above; “triangle/त्रिकोण/सीधे किनारे/बंद” native pronunciation review. Pause between side numbers; no SFX/music over sides. Alt text describes each selectable shape's visual properties consistently but should not merely label correct choice “triangle” if target assessment is classification; accessible variant may necessarily change evidence, record mode.

**Proposed data:**

```json
{
  "contentId": "triangle-workshop",
  "schemaVersion": "0.1.0",
  "contentVersion": "0.1.0",
  "language": "en-IN",
  "ageBand": "6–7",
  "category": "games",
  "learningObjectiveIds": ["SPACE.TRIANGLE_INVARIANT"],
  "prerequisites": ["straight-closed-model"],
  "interactionType": "finite-shape-choice",
  "contentStructure": {
    "unitIds": ["G01", "G02", "G03", "G04", "G05", "G06"],
    "rounds": [
      {
        "unitId": "G02",
        "optionIds": ["closed-tri", "oval", "square"],
        "correctOptionId": "closed-tri"
      },
      {
        "unitId": "G03",
        "optionIds": ["circle", "rectangle", "turned-tri"],
        "correctOptionId": "turned-tri"
      },
      {
        "unitId": "G04",
        "optionIds": ["open-three", "scalene-tri", "curved-three"],
        "correctOptionId": "scalene-tri"
      }
    ]
  },
  "narration": { "mode": "spoken", "status": "not-generated", "scriptSource": "script.en.md" },
  "hints": { "levels": 3, "source": "feedback.en.md" },
  "feedback": { "source": "feedback.en.md" },
  "accessibilityAlternatives": ["tap-choice", "adult-paper-shapes", "described-response"],
  "parentNotes": { "source": "parent.en.md" },
  "progressSemantics": { "kind": "units-explored", "unitCount": 6, "notMastery": true },
  "evidenceReferences": ["E02", "E13"],
  "editorialReviewStatus": "pending",
  "safetyReviewStatus": "pending",
  "assetLicenseMetadata": { "status": "pending" },
  "publicationStatus": "draft"
}
```

Manifest: `workshop.png`; reviewed `shapes.json`/outline assets for nine named shape IDs; six en/hi narration segments; feedback segments; alt/scripts/parent files; every binary not-generated, null hash, pending license. Acceptance: geometry desk key check on every option; rotated/scalene recognition target; three distinct answer positions; no timer; static/tap access; all scripts and paths checked. Engineer must add geometry choices/model/hints/skip and new ID/edition progress; mathematical educator, Hindi editor and device reviews pending. No trial results invented.

### P-R: Up and Down, Then Rest / ऊपर, नीचे, फिर आराम — ages 2–3, Rhymes

**Brief.** `up-down-rest`, `ORAL.UP_DOWN_SHARED`: caregiver shares direction language; child may listen/watch/point or gesture. No movement accuracy, rhythm matching, reading or speech requirement. Four units including intro, two identical brief verse presentations, ending. 1–3-minute invitation H, stop sooner. E04/E09/E17 support shared interactions; no specific rhythm/language gain demonstrated. B03. English/Hindi are parallel direction-language editions, not literal meter translation.

**Exact generation prompt:**

```text
Act as an original spoken-rhyme drafting assistant for Kidsuu ages 2–3, caregiver co-use required. Objective ORAL.UP_DOWN_SHARED: enjoyable shared up/down/rest language. Produce en-IN and natural Devanagari hi-IN versions. Inputs: this brief, E04/E09/E17 summaries, current spoken-not-sung device TTS limits, approved puppy/boy references if available. Four units: caregiver invitation, short verse, optional same verse again, rest ending. One adult-controlled large soft cloth; no food, jumping, loud claps, forced smiling/speech/movement or body manipulation. Quiet seated watching equally valid. Separate lyrics, adult movement note, narration and optional future song task. Return complete scripts, visual briefs, optional participation, accessibility, parent note, progress meaning, proposed JSON and pending manifest. Check rhythm aloud with human review required; no fake syllable certification, no copied lyrics or recognizable tune. Missing references means no character-generation attempt. All draft, no invented tests/rights/approvals. No code edits/publication.
```

**Complete illustrative initial draft v0:** R01 “Stand up and shout!” R02 “Jump up high, clap to the sky, be the best, don't stop to rest!” R03 “Repeat faster ten times.” R04 “You got it perfect. Sing again!” Desk findings: unsafe/stressful mandatory motor/loud action, comparison and speed, TTS falsely singing. **Revision:** seat/watch/point invitation, soft adult cloth, short repeated direction verse, rest, no correctness scoring. Hindi independently rhythmic, not distorted literal lyric.

**Final proposed script:**

| Unit                      | Complete English child/narration                                                  | Complete Hindi child/narration                                                    | Scene/action                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| R01                       | “Let's listen with a grown-up. You can watch, point, or move gently if you like.” | “किसी बड़े के साथ सुनें। चाहो तो देखो, इशारा करो, या हल्का-सा हिलो।”              | Seated caregiver illustration/note; static approved puppy watching cloth. Start/Stop                   |
| R02 verse                 | “Up and down,\nSoft and slow.\nNow we rest.\nThere we go.”                        | “कपड़ा ऊपर ले जाएँ,\nफिर नीचे ले आएँ।\nअब हम थोड़ा रुक जाएँ,\nचाहें तो मुस्काएँ।” | Adult raises/lower large soft cloth within comfortable range; ends on adult lap. Never child compelled |
| R03 optional repeat verse | “Up and down,\nSoft and slow.\nNow we rest.\nThere we go.”                        | “कपड़ा ऊपर ले जाएँ,\nफिर नीचे ले आएँ।\nअब हम थोड़ा रुक जाएँ,\nचाहें तो मुस्काएँ।” | Same verse, same directions; optional “again” adult button or skip; no autoplay                        |
| R04                       | “Our rhyme is finished. We can rest now.”                                         | “हमारी कविता पूरी हुई। अब आराम करें।”                                             | Cloth resting, quiet static scene. Finish/Home                                                         |

Lyrics lines in generated JSON use newline characters; narration pipeline preserves pause at line ends. Hindi मुस्काएँ optional explicitly “चाहें तो”; remove if reviewer finds emotional-performance demand in target setting. English “There we go” may be unfamiliar; language reviewer may prefer “Time to go” but must check ending meaning. These are known review questions, not approved copy.

**Interaction/hints/feedback:** Only Start, optional Again, Continue/Finish later; no response key. English acknowledgement “You chose to listen.” Hindi “तुमने सुनना चुना।” Use only if choice known; don't assert child listened from button tap. Generic “We can stop here” / “यहीं रुक सकते हैं” always true. Correct/error fields are **not applicable**, not fabricated. Hint = adult says “Up” when cloth rises; “Down” when lowers; pointing or simply listening fine. If no participation, no error feedback or automatic retry. Parent may model without moving child's arms.

**Parent note:** “Share this short spoken rhyme. You can move a large soft cloth, or keep it still and describe the pictures. The child can watch or decline. Avoid covering anyone's face, forced stretching or keeping a beat. This is spoken rhythm, not a recorded song.” Hindi: “छोटी कविता साथ में बोलें। बड़ा मुलायम कपड़ा हल्का ऊपर-नीचे कर सकते हैं, या केवल तस्वीरें देखें। बच्चा न करना चाहे तो ठीक है। चेहरे पर कपड़ा न रखें, हाथ-पैर न खींचें। यह बोली हुई कविता है, रिकॉर्ड किया गीत नहीं।”

**Accessibility/off-screen:** Seated eye-point/listen/adult description; no fine-motor or audio-only navigation. Hearing-inaccessible mode uses direction pictures/gesture and parent signed language if family's established method; no claim of sound-awareness equivalence. Rest at any time; optionally cloth/toy up/down with adult, safe no falling object on child.

**Illustration prompts:** R01 “Approved puppy seated beside one large soft cloth resting on a low surface, calm still scene, no instructional text”; R02 “Same approved puppy, same cloth held by an adult hand above low surface, central clear up position; second variant cloth below that position, fully visible, no arrows/text, no child stretching”; R03 reuse R02 approved artwork, no new character drift; R04 “Same cloth on adult lap/low surface, puppy resting nearby, plain background, no sadness/excitement.” Existing reference header applies; counts/relative positions human checked. Rest image shouldn't imply sleepy child or medical calming effect.

**Audio/song:** Four spoken segments exactly final text, including two repeated verse takes; a native adult checks each word and comfortable line pauses. No fixed WPM prescription; small unit listen-back on tablet. Use calm normal voice, not imitation child voice/cloning. Song variant optional **not generated/not approved**: composer or suitable licensed generator receives ONLY reviewed lyrics, requests short simple original melody, no recognizable artist/song imitation, no added lyrics, optional low accompaniment; human music/language/rights review plus player engineering required. If unavailable, keep label “Spoken rhyme / बोली हुई कविता”; existing TTS never singing.

**Proposed data:**

```json
{
  "contentId": "up-down-rest",
  "schemaVersion": "0.1.0",
  "contentVersion": "0.1.0",
  "language": "hi-IN",
  "ageBand": "2–3",
  "category": "rhymes",
  "learningObjectiveIds": ["ORAL.UP_DOWN_SHARED"],
  "prerequisites": ["caregiver-co-use"],
  "interactionType": "shared-spoken-rhyme",
  "contentStructure": {
    "unitIds": ["R01", "R02", "R03", "R04"],
    "optionalUnitIds": ["R03"],
    "answerKey": null
  },
  "narration": {
    "mode": "spoken",
    "status": "not-generated",
    "scriptSource": "script.hi.md",
    "songStatus": "not-generated"
  },
  "hints": { "source": "parent.hi.md", "levels": 0 },
  "feedback": { "noPerformanceScoring": true },
  "accessibilityAlternatives": ["listen-watch", "seated-point", "adult-description"],
  "parentNotes": { "source": "parent.hi.md" },
  "progressSemantics": {
    "kind": "units-explored",
    "unitCount": 4,
    "optionalUnitsMayBeSkipped": true,
    "notMastery": true
  },
  "evidenceReferences": ["E04", "E09", "E17"],
  "editorialReviewStatus": "pending",
  "safetyReviewStatus": "pending",
  "assetLicenseMetadata": { "status": "pending" },
  "publicationStatus": "draft"
}
```

Manifest: intro/up/down/rest PNG candidates; four spoken segments per language; no song path until produced; bilingual lyrics/adult notes/alt; not-generated/null hash/pending rights. Completion explicitly allows skipped optional unit and supported navigation; engineer must define skipped/explored distinction, not backfill listening. Four-unit variable reader, edition progress and Hindi narration needed; current five-verse reader can only host a separately authored purposeful five-verse draft, not pad this one. Acceptance: natural aloud delivery, optional motor/voice, safe cloth cue, no sound-only dependency, no sing claim, toddler educator/caregiver review, device voice checks. No independent toddler-use or calming outcome claim.

### P-S: The Dry Place on the Bench / बेंच की सूखी जगह — ages 8–9, Stories

**Brief.** `dry-bench-story`, `LIT.INFERENCE_CLUE`: enjoy story, optionally infer why a paper picture is moved using at least one story clue. Six narrative pages; end discussion outside narrative checkpoint, no compulsory quiz. 5–10 minutes H; read-aloud/parent support retained. Prereqs rain/roof/paper familiarity, short event sequence; glossary optional “shelter/छज्जा”. Existing approved boy/puppy central, supporting trusted adult present, no redesign. E12 narrative/inferential-language guidance has a minimal evidence rating; E03 addresses illustration coherence. This is a design rationale, not evidence this story teaches inference; B16. No moral/prosocial or science-learning claim.

**Exact generation prompt:**

```text
Write an original Kidsuu story dry-bench-story for ages 8–9 in simple en-IN and natural hi-IN, six pages. Role: storytelling/content assistant, not certified educator. Objective optional evidence-linked inference: why the boy moves a shared paper picture to a dry place. Inputs: this brief, E12/E03 summaries, approved 2D boy/puppy references, no approved character names. Keep boy/puppy consistent and unnamed; trusted grown-up present in sheltered shared courtyard. Light rain only, no threat, going out alone, moral lecture, quiz every page or assumption every family has a private garden. Plot: shared drawing; raindrop/wet-edge clue; dry bench section under roof; puppy changes position; boy asks before moving paper; satisfying dry-space resolution. Return full English/Hindi page narration, precise illustrations/alt text, optional end discussion accepting multiple evidence-supported interpretations, hint/feedback, parent/offline note, glossary, proposed data and not-generated manifest. If references missing, plan scenes only. Label all drafts/reviews pending. Do not invent sources, human approvals, assets or child study outcomes; no code changes/publication.
```

**Complete illustrative initial draft v0:**

| Page | Initial text                                             |
| ---- | -------------------------------------------------------- |
| S01  | “The boy and Puppy drew a perfect picture.”              |
| S02  | “A terrifying storm began. They ran outside alone.”      |
| S03  | “Puppy was selfish and sat on the bench.”                |
| S04  | “The boy knew Puppy was bad and shouted.”                |
| S05  | “Puppy obeyed, so the boy saved the drawing.”            |
| S06  | “Always share or nobody will like you. Answer the quiz.” |

Desk findings: fear, unsafe independence, judgemental motive labels, coercion, moral and comprehension demand. **Revision:** light rain with adult/shelter, visible wet/dry clue, ambiguous actions rather than emotion certainty, ask before moving picture, enjoyable resolution and optional evidence discussion. No claim revision improves measured behaviour; it improves stated safety/pedagogical design criteria.

**Final proposed story — full English/Hindi page text; narration exactly same:**

| Page | English                                                                                                                                                                                                  | Hindi                                                                                                                                                                     |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S01  | “The boy and Puppy were making a paper picture in the shared courtyard. A grown-up sat nearby. The boy drew a long blue line. Puppy watched a leaf land beside it.”                                      | “बच्चा और पपी साझा आँगन में कागज़ पर चित्र बना रहे थे। पास में एक बड़े व्यक्ति बैठे थे। बच्चे ने लंबी नीली रेखा बनाई। पपी ने देखा, उसके पास एक पत्ता आ गिरा।”             |
| S02  | “A few raindrops fell. One touched the corner of the picture. The paper curled a little. The grown-up called, ‘Let's stay under the roof.’ They were only a few steps away.”                             | “बारिश की कुछ बूँदें गिरीं। एक बूँद चित्र के कोने पर पड़ी। कागज़ थोड़ा मुड़ गया। बड़े ने कहा, ‘छत के नीचे रहें।’ वे बस कुछ कदम दूर थे।”                                   |
| S03  | “Under the roof stood a bench. One end was wet where the rain blew in. Near the wall, the bench was dry. Puppy sniffed the wet end, then stepped closer to the wall.”                                    | “छत के नीचे एक बेंच थी। हवा के साथ आई बारिश से उसका एक सिरा गीला था। दीवार के पास बेंच सूखी थी। पपी ने गीले सिरे को सूँघा, फिर दीवार के पास चला गया।”                     |
| S04  | “The boy held the picture over the dry place. Puppy looked up at it. ‘May I put our picture here?’ the boy asked. Puppy stepped aside. The boy set the paper down gently.”                               | “बच्चे ने चित्र को सूखी जगह के ऊपर पकड़ा। पपी ने उसकी ओर देखा। ‘हमारा चित्र यहाँ रखूँ?’ बच्चे ने पूछा। पपी एक तरफ हो गया। बच्चे ने कागज़ धीरे से रख दिया।”                |
| S05  | “They looked at the curled corner. The long blue line was still there. The boy placed the fallen leaf beside it. ‘It looks like a little boat,’ he said. Puppy wagged once.”                             | “दोनों ने मुड़े हुए कोने को देखा। लंबी नीली रेखा अभी भी थी। बच्चे ने गिरा हुआ पत्ता उसके पास रखा। ‘यह छोटी नाव जैसी लग रही है,’ उसने कहा। पपी ने एक बार पूँछ हिलाई।”      |
| S06  | “Rain tapped beyond the roof. The picture rested on the dry bench, and the grown-up stayed beside them. The boy added one small sail. For a little while, their boat picture had a quiet place to wait.” | “छत के बाहर बारिश टप-टप कर रही थी। चित्र सूखी बेंच पर रखा था। बड़े उनके पास ही थे। बच्चे ने एक छोटा पाल बना दिया। नाव के उनके चित्र को थोड़ी देर ठहरने की जगह मिल गई थी।” |

Further desk revision: S01 names a grown-up more clearly without imposing parent gender; S06 now explicitly refers to a boat picture, not a folded paper boat. Final draft review issues openly remaining: Hindi editor must check natural aloud phrasing; `Puppy` translated पपी is a placeholder nickname, so owner must confirm the existing character's approved localized name. Illustration must show the same drawn picture throughout. No actual weather/scientific demonstration implied.

**Optional end panel (not each page):** “Why might the boy have chosen that place for the picture? What in the story helps your idea?” / “बच्चे ने चित्र रखने के लिए वह जगह क्यों चुनी होगी? कहानी में किस बात से तुम्हें ऐसा लगा?” Responses via telling adult/pointing/revisiting page, not microphone. Accept keep paper dry (wet corner + dry bench), keep drawing together in shelter (roof/adult), or another plausible supported reason. Do not declare one emotional motive as fact. If unsupported: “That could be an idea. Shall we look for a clue in the story?” / “ऐसा सोचा जा सकता है। कहानी में कोई सुराग देखें?” If “don't know”: “We can look together, or just enjoy the ending.” / “साथ में देख सकते हैं, या बस कहानी का अंत सुनें।” Hint 1 revisit S02/S03; hint 2 “What happened to the paper corner?” / “कागज़ के कोने को क्या हुआ?” Hint 3 adult models “The corner got wet; this place was dry.” / “कोना गीला हुआ था; यह जगह सूखी थी।” Model = supported discussion, not correct independent result. Positive “You used the wet-corner clue.” only if actually observed; no intelligent/kind child label.

**Parent/off-screen note:** Read first without interruption if child prefers. Ask one optional clue question after ending. Don't assess kindness or diagnose emotion. Discuss another possible ending, or draw a dry/wet bench picture. Real rain exploration not required; never send child outside alone. Hindi: “पहली बार कहानी बिना रोके पढ़ सकते हैं। अंत में चाहो तो एक सुराग पर बात करें। बच्चे की भावनाओं या अच्छाई का मूल्यांकन न करें। कागज़ पर दूसरी तस्वीर बनाएँ; बारिश में बाहर जाना ज़रूरी नहीं।”

**Six scene prompts (with common header):** S01 “Shared modest courtyard, approved boy drawing paper, approved puppy watching one leaf beside paper, trusted adult nearby, long blue line visible, dry”; S02 “Same geography, few raindrops, one curled/wet paper corner, roof shelter nearby and adult inviting, no storm/fear”; S03 “Bench partly under roof, far end visibly damp, near-wall end dry, puppy steps near wall, clear roof–wall–bench relation”; S04 “Boy holds same paper over dry bench section, puppy moves aside, adult nearby, gentle expression, no textual speech bubble”; S05 “Same curled corner and long blue line, one leaf beside line creating boat-like picture, puppy slight wag implied by still pose, no folded boat”; S06 “Same picture with one small drawn sail on dry section, roof outside rain and trusted adult present, quiet resolved composition, no gold stars.” Every scene human checks geometry/character identity, wet/dry and paper continuity. Generated instructions never guarantee exact counts/consistency. Alt descriptions convey rain/wet/dry clues to avoid inaccessible inference dependence on picture alone.

**Audio:** Six full pages, natural conversational English/Hindi, pause around dialogue and event change. Use adult narrator with gentle differentiated dialogue, no scary thunder or caricature accent; avoid crying/animal SFX over clues. Text equivalent exact. Glossary adult note “sail: cloth shape on a boat / पाल: नाव पर हवा पकड़ने वाला कपड़ा”; image is a drawing. Retakes at complete sentence; native language reviewer listens to “courtyard”, “curled”, “sail”, “आँगन”, “गीले”, “पाल”, “चित्र”. No pause/resume promise beyond current Stop/restart implementation.

**Proposed data:**

```json
{
  "contentId": "dry-bench-story",
  "schemaVersion": "0.1.0",
  "contentVersion": "0.1.0",
  "language": "en-IN",
  "ageBand": "8–9",
  "category": "stories",
  "learningObjectiveIds": ["LIT.INFERENCE_CLUE"],
  "prerequisites": ["rain-roof-paper-familiarity", "supported-short-narrative"],
  "interactionType": "illustrated-reader",
  "contentStructure": {
    "unitIds": ["S01", "S02", "S03", "S04", "S05", "S06"],
    "optionalDiscussion": { "scored": false, "source": "discussion.en.md" }
  },
  "narration": { "mode": "spoken", "status": "not-generated", "scriptSource": "script.en.md" },
  "hints": { "source": "discussion.en.md", "levels": 3 },
  "feedback": { "source": "discussion.en.md", "acceptEvidenceSupportedAlternatives": true },
  "accessibilityAlternatives": ["text-narration", "scene-description", "adult-point-discussion"],
  "parentNotes": { "source": "parent.en.md" },
  "progressSemantics": {
    "kind": "pages-explored",
    "unitCount": 6,
    "discussionNotRequired": true,
    "notMastery": true
  },
  "evidenceReferences": ["E12", "E03"],
  "editorialReviewStatus": "pending",
  "safetyReviewStatus": "pending",
  "assetLicenseMetadata": { "status": "pending" },
  "publicationStatus": "draft"
}
```

Manifest: `S01.png`…`S06.png`, six narration segments per language, alt/script/discussion/parent/glossary files; binaries not-generated, hash null, rights pending. Completion means six page explorations accepted by future player; discussion optional/non-scored. Human educator inference/key alternatives review, both language reviews, sensitive safety, illustration/narration rights, actual six-page/edition integration and tablet QA pending. Current reader five pages/common category icon/English TTS, so this proposal is not drop-in. No child-testing/learning-gain claim.

### Every pilot's editorial acceptance checklist

Every item checked on **each unit and language edition**, reviewer name/date recorded only after actual review:

1. Single primary objective, age/prereqs and shared/independent mode clear; no exaggerated gain.
2. Correct facts/keys, plausible singular foils or stated open alternatives; every count/shape correct.
3. Full instructions, hints, retry/skip/end; no performance/reading/motor requirement hidden.
4. Natural language and cultural flexibility; no English-phonics literal Hindi translation.
5. Child may stop; no punitive sound, guilt, urgency, intelligence labels or endless reward loop.
6. Relevant static/accessible visuals; preserved approved characters; text separately reviewed.
7. Narration follows final script word-for-word; TTS/spoken/sung labels honest; rights documented.
8. Progress is exploration; any performance separately supported/independent, retention not inferred.
9. Files/schema/path/reference checks pass; missing assets stay explicitly missing.
10. Review status stays draft until genuine human sign-offs; integration/device/study statuses separate.

Desk review is complete as a drafting example. All qualified, owner, rights, child-usability and physical-device checks remain pending.
