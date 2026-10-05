| Item                           | Confirmed context                                                                 | Assumption or uncertainty                                                        |
| ------------------------------ | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| React Native/Expo target       | Supplied context aur inspected package/config dono confirm karte hain             | Runtime/device behaviour independently tested nahi                               |
| Ages 2–9                       | Bands 2–3, 4–5, 6–7, 8–9 catalog/contracts mein hain                              | Age learning level ka reliable substitute nahi                                   |
| Existing 2D identity preserved | Approved boy/puppy aur clay interface project direction hai                       | Reference artwork ka visual audit is research mein nahi hua                      |
| Four categories                | Learning, Games, Rhymes, Stories inspected catalog mein                           | Category label educational effectiveness prove nahi karta                        |
| Current prototypes             | Four text-choice practice samples; 16 age-wise reader drafts; five checkpoints    | Curriculum, audio quality aur learning outcomes unvalidated                      |
| Offline demo                   | SQLite implementation and docs read; dummy family snapshot persists               | Real-child encrypted storage, asset downloads aur offline TTS approved nahi      |
| Authentication                 | Supplied context and readiness docs: real login/consent/cloud integration pending | Live endpoints/auth tested nahi; app production-ready nahi                       |
| Language                       | Current fixed narration language `en`; inspected content English                  | Hindi-first/English-first/bilingual strategy owner decision hai                  |
| Source inspection              | C:\Users\Umesh\Kidsuu files actually read on feature/family-app                   | Local working copy has many uncommitted changes; remote branch parity unverified |

This report focuses on educational content, learning experience and child wellbeing. It does not propose a Flutter migration or mascot redesign.

# Kidsuu — Educational research and executable AI-content production guide

Verification date: **5 October 2026**, Asia/Colombo. Explanations Hinglish mein; child copy English/Hindi editions mein. Yeh evidence-informed design synthesis hai, systematic review nahi. Main educator, psychologist, speech/language therapist ya lawyer hone ka claim nahi karta. Qualified reviews, actual assets, integration, device QA aur child-effectiveness evidence alag pending deliverables hain.

**Audit revision 0.2:** targeted source/claim and script desk-audit completed; [findings and remaining blockers](RESEARCH-AUDIT.md). Yeh same AI assistant ka second pass hai, independent educator/legal verification nahi. Four pilot scripts remain drafts; full serialized packages, optional-unit completion policy, human approvals, assets, integration and device/child evidence pending. [Current source recheck](SOURCE-INSPECTION-RECHECK.json) cannot retroactively prove byte identity with the initial read. Original documents archived before corrections.

## 1. Scope, access and method

Read-only research: project code, dependencies, assets, databases aur deployment change nahi kiye. Deliverables separate research workspace mein hain. Git HEAD `ec57148149f5738b52f924e6d4d3722a0b145d14`; current branch `feature/family-app`. Inspected working-tree contents HEAD se differ kar sakte hain. No build/test suite, device test, live cloud test or child study was run for this report. Repository README ke historical test claims independently reproduce nahi kiye.

Actually inspected: `package.json`, `app.json`, `README.md`; catalog/types; practice.ts, readings.ts, PracticeScreen.tsx, ReadingScreen.tsx, readerProgress.ts, deviceNarration.ts; FamilyStore.ts, FamilyRepository.ts; offline snapshot, SQLite port, wrapper and composition; shared contracts; backend validation plus relevant progress repository/routes; FAMILY-PREVIEW, READERS, OFFLINE-STORAGE, PRODUCTION-READINESS, ANDROID-DEVICE-QA. Credentials, .env, signing files aur actual child database/records inspect nahi kiye. No additional upload needed for this audit. Future assistant ke paas access na ho toh first six useful files: README, sampleCatalog.json, practice.ts, readings.ts, contracts index, PRODUCTION-READINESS. Edition/audio work ke liye then readerProgress, both screens and deviceNarration useful honge.

Research search domains: child-learning systematic reviews; guided play/shared reading; foundational literacy/numeracy; Indian curriculum; screen wellbeing; child privacy; AI production capabilities. Stronger review/official evidence ko preference diya. Available abstracts, full-text pages aur official PDFs verify kiye; full-text access incomplete jahan hai bibliography mein note hai. Search all databases exhaustively nahi hua; India-specific app trials aur Hindi early-literacy intervention synthesis incomplete hain. Commercial docs sirf capabilities/terms support karte hain.

Throughout report:

- **R — research finding:** intervention/observational result; population and limitation attached.
- **G — professional guidance:** pediatric/educator consensus; app efficacy trial nahi.
- **P — educational policy/framework:** alignment target; Kidsuu par statutory curriculum mandate assume nahi.
- **L — law; PL — platform policy:** effective dates/application lawyer/store reviewer confirm karein.
- **D — product-design judgment:** proposed rule, local validation required.
- **A — assumption; H — unvalidated hypothesis:** explicit working choice, measured outcome nahi.

Confidence high = source/claim trustworthy in its own scope; moderate = supporting evidence with heterogeneity; low = direct Kidsuu/India/age transfer uncertain. High confidence in a guideline ka matlab high confidence in an app benefit nahi. All examples, durations, item counts, hint thresholds and sequences below **D/H** hain unless explicitly linked to research/guidance.

## 2. Executive summary

Kidsuu ko **small reviewed learning units** banana chahiye: one observable objective, a demonstration where needed, optional guided attempts, fresh independent examples, useful hints, safe stopping, and off-screen application. Four categories same curriculum ko different experiences se reinforce karein. Stories/rhymes ko compulsory quizzes mein convert na karein.

First priority younger children ki access hai. Existing practice player text prompts aur word/number buttons use karta hai. Ages 2–3 ke liye independent learning claim remove; adult-shared pointing, naming, listening and real-object play choose karein. Ages 4–5 mein visual choices + replayable instruction preferable. Older children ke liye reading ability/language familiarity confirm karke symbolic work offer karein.

Existing strengths: untimed practice; supportive generic retry; optional narration; no reader autoplay; explicit explored-page semantics; quiet participation in rhymes; story drafts often respect choice/help-seeking. In strengths ko preserve karein. Main gaps: concept teaching absent, practice answers predictable, mixed objectives, no targeted hints, no instructional pictures in practice, generic reader art, same progress across age editions, English-only narration, and fixed five-page typing/player assumptions.

AI drafting ko speed de sakta hai, approval replace nahi. First four units ko eight language editions ke draft packages banayein, ek low-risk spoken rhyme se workflow test karein, then quantity activity, shape game and inference story. Child pilots consent/assent aur secure separate study records ke saath; current demo mein only dummy profiles. Reviewed package, integrated package, device-tested app and validated intervention four distinct states hain.

## 3. Evidence table

| ID/type                                                                                                                                                                    | Age, setting, medium                                                                                                            | Main finding/guidance                                                                                                             | Limitations                                                                                                                                                         | Kidsuu implication and confidence                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| E01 R: [Kim et al., 2021](https://journals.sagepub.com/doi/10.1177/23328584211004183)                                                                                      | Preschool–Grade 3; 36 educational-app intervention studies across varied settings; digital                                      | Average achievement benefit, substantial variability; researcher-developed/narrow measures gave larger effects                    | Specific apps/populations, no guaranteed broad transfer; stories/SEL not included                                                                                   | Define small skill and use novel reassessment; moderate evidence, low confidence for Kidsuu efficacy                         |
| E02 R: [Skene et al., 2022](https://srcd.onlinelibrary.wiley.com/doi/10.1111/cdev.13730)                                                                                   | Study samples with mean ages 1–8 eligible; 39 studies, 17 meta-analyzed; human-guided play, computer-provided guidance excluded | Some advantages for early maths/shape knowledge and spatial vocabulary; no consistent advantages across all literacy/SEL outcomes | Heterogeneous guidance, many pooled outcomes few studies                                                                                                            | Child choice plus relevant adult/scaffold support; moderate, digital adaptation uncertain                                    |
| E03 R: [Takacs et al., 2015](https://journals.sagepub.com/doi/full/10.3102/0034654314566989)                                                                               | Children 3–10; 43 studies; technology-enhanced stories across TV/CD-ROM/e-book and other digital formats                        | Relevant multimedia can support vocabulary/comprehension; extraneous interactive features can distract                            | Designs/comparators vary; not all animation helpful; relevant article methods/results rechecked during audit, underlying trials not individually reviewed           | Illustrate narrated event; avoid reward hotspots mid-story; moderate                                                         |
| E04 R: [Dowdall et al., 2020](https://pubmed.ncbi.nlm.nih.gov/30737957/)                                                                                                   | 19 randomized parent picture-book intervention trials; sample mean child ages 1–6 years; predominantly non-digital              | Parent book-sharing training supports child language and parent sharing skill                                                     | Does not prove independent TTS is equivalent; abstract-level access                                                                                                 | Shared reader with optional conversation; moderate; stronger relevance to co-use than autonomous app                         |
| E05 R: [Madigan et al., 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7091394/)                                                                                           | Samples mean age ≤12; screen use and child language observational studies                                                       | More quantity/background exposure associated with weaker language; educational content/co-viewing with stronger language          | Confounding, caregiver report and reverse causality; association is not causal dose estimate                                                                        | Protect conversation/play; no claim that more Kidsuu time improves language; moderate for association, low causal confidence |
| E06 G: [WHO 2019](https://www.who.int/news-room/detail/24-04-2019-to-grow-up-healthy-children-need-to-sit-less-and-play-more)                                              | Under five; whole-day sedentary screen guidance                                                                                 | Age two and ages three–four: no more than one hour; less is better; includes sleep/activity context                               | Not one-app learning prescription; not guidance for age five–nine                                                                                                   | Parent notice with natural endings; high confidence in guidance, no efficacy implication                                     |
| E07 G: [WHO 2020](https://www.who.int/publications/i/item/9789240015128)                                                                                                   | Ages 5–17; whole-day health guidance                                                                                            | Limit sedentary time, particularly recreational screen use                                                                        | Does not supply a precise Kidsuu dose                                                                                                                               | Age five and older: family context and displacement, not invented hour limit; high guidance confidence                       |
| E08 G: [AAP 2026 official summary](https://www.healthychildren.org/English/news/Pages/creating-a-child-friendly-digital-world-AAP-releases-new-media-recommendations.aspx) | Children/adolescents; digital ecosystems                                                                                        | Child-centred content, family support and design environment matter beyond minutes                                                | US context; policy guidance, not app trial; full policy PDF inaccessible here                                                                                       | No manipulative retention; caregiver support; high guidance/moderate India transfer                                          |
| E09 G: [NAEYC DAP](https://www.naeyc.org/resources/position-statements/dap/contents)                                                                                       | Birth–8; educator practice                                                                                                      | Development, individual variation and social/cultural context guide appropriate practice                                          | Professional framework; eight–nine requires extension; no app outcome estimate                                                                                      | Age-band defaults with flexible support; high guidance confidence                                                            |
| E10 P: [NCF Foundational Stage 2022](https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf)                                                                               | India ages 3–8; education framework, largely real-world practice                                                                | Play-based integrated learning, familiar/home language, holistic goals                                                            | Formal institutional stage is 3–8; document also discusses 0–3 home context; not an independent toddler-app curriculum or efficacy study                            | Map objectives, preserve play; high confidence in framework                                                                  |
| E11 P: [NCF School Education 2023](https://dsel.education.gov.in/sites/default/files/update/ncf_2023.pdf)                                                                  | India school stages; preparatory 8–11 relevant                                                                                  | Broader language/maths/environment/art progression                                                                                | Cannot assume child's grade or school-language readiness                                                                                                            | Eight–nine units add explanation/inquiry with supported reading; high framework confidence                                   |
| E12 G/R: [IES foundational reading guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/21/Published)                                                                          | Kindergarten–Grade 3; mostly English school teaching, non-digital                                                               | Oral/narrative language; sound–letter links; decoding; connected-text reading                                                     | Narrative/inferential-language recommendation minimal; sound–letter/decoding strong; connected text moderate. English-specific; official page revised December 2019 | Use explicit English decoding progression; Hindi needs its own specialist sequence; moderate transfer                        |
| E13 G/R: [IES maths guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/18)                                                                                                   | Preschool/pre-K/K; classroom, non-digital                                                                                       | Developmental number/operations progression rated moderate; other recommendations minimal evidence                                | Not all recommendations equally supported, US classroom context                                                                                                     | Quantity before symbols, shape variability; moderate for number progression, limited for specific game                       |
| E14 R: [Leonard et al., 2024](https://pubs.asha.org/doi/10.1044/2024_JSLHR-23-00528)                                                                                       | 28 children age 4–5, half DLD; controlled novel-word tasks, two sessions and one-week check                                     | Expanding vs equally spaced retrieval converged on final checks despite early differences                                         | Small/specialist study; not a universal optimal schedule or treatment proposal                                                                                      | Optional later recall; label interval choice H; limited confidence                                                           |
| E15 R: [spacing/orthographic learning study](https://pubmed.ncbi.nlm.nih.gov/34753014/)                                                                                    | Grade 3–4, mean 8y7m, 37 children; written novel words                                                                          | Spaced exposure improved delayed written-word recognition, not spelling recall                                                    | Small narrow task; abstract-level result, not a broad or preschool/app dose claim                                                                                   | Supports investigating spacing; no fixed schedule asserted; low for app prescription                                         |
| E16 R: [Kamins & Dweck, 1999](https://pubmed.ncbi.nlm.nih.gov/10380873/)                                                                                                   | Ages 5–6, experimental role-play praise/setbacks; non-digital                                                                   | Person-oriented evaluation associated with less helpful coping than process-oriented feedback                                     | Small/artificial task; not proof all process praise works                                                                                                           | Describe action/help rather than intelligence; limited–moderate                                                              |
| E17 G: [Harvard responsive interactions](https://developingchild.harvard.edu/key-concept/serve-and-return/)                                                                | Infants/young children; human relationships                                                                                     | Responsive back-and-forth interaction is central developmental support                                                            | Mascot/TTS is not responsive human relationship                                                                                                                     | Leave room for caregiver noticing/responding; high guidance, app benefit untested                                            |
| E18 standards: [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                                                                   | Web accessibility standard; all ages                                                                                            | Alternatives to colour, captions/labels, target and motion criteria                                                               | Not a native-child-usability certification                                                                                                                          | Translate principles to React Native plus TalkBack/native testing; high standard, D for tablet target sizes                  |
| E19 G: [UNICEF AI/children 3.0](https://www.unicef.org/innocenti/reports/policy-guidance-ai-children)                                                                      | Child rights, 2025 guidance                                                                                                     | Safety, privacy, inclusion, transparency and oversight                                                                            | Guidance, not proof AI content appropriate                                                                                                                          | Adult authoring pipeline; protect children and correction process; high guidance confidence                                  |
| E20 G: [UNESCO GenAI guidance](https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research?hub=195885)                                                | Education/research governance                                                                                                   | Human oversight, privacy and age-appropriate access                                                                               | Not direct preschool content-effectiveness evidence                                                                                                                 | Owner uses AI; no default open-ended child chatbot; high guidance confidence                                                 |

No pooled effect size is used to forecast Kidsuu gains. Enjoyment, autonomy and cognitive-load rules below combine these sources with conservative D/H decisions; they require observation in intended Indian families, languages and devices.

## 4. Age-wise developmental design

These are planning ranges, not milestone tests. A child can need simpler response access while enjoying more complex ideas. Select language/reading support separately from age; do not name levels “slow”, “weak” or “gifted”. [NAEYC DAP](https://www.naeyc.org/resources/position-statements/dap/contents) supports attending to individual and cultural variation.

| Dimension                     | 2–3                                                                              | 4–5                                                                              | 6–7                                                                 | 8–9                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Receptive/expressive language | Familiar naming/action words; pointing, gaze, gesture or vocal response accepted | Short conversational instructions; describe one feature; adult expands utterance | Explain simple strategy; vocabulary depends on home/school exposure | Discuss reasons, compare explanations; unfamiliar vocabulary still scaffolded    |
| Reading independence          | No independent-reading assumption                                                | No independent-reading assumption; print exploration optional                    | Highly variable; narration with text and decoding support           | Often increasing independence; never infer from age alone                        |
| Instruction complexity        | One action shown now                                                             | One action, then optional next cue                                               | Short sequence shown stepwise                                       | Multi-step plans visible; one decision per screen                                |
| Working-memory demand         | Keep referent visible; no remembering previous screen                            | Rule/example stays visible                                                       | Checklist, counters or story recap available                        | External notes/recap for inference; reduce simultaneous rules                    |
| Concrete/abstract             | Real object/photo/simple illustration; avoid arbitrary symbols                   | Small visible collections, familiar shapes before numeral labels                 | Link collections/diagrams to number expressions                     | Model relationships before abstract representations                              |
| Touch/motor                   | Large single taps, no precision drag; adult can operate                          | Tap then destination alternative to drag                                         | Drag optional with tap alternative                                  | Optional arranging/writing with non-motor alternative                            |
| Symbol understanding          | Home/help icons demonstrated by adult                                            | Icons paired with words/audio and demonstration                                  | Consistent symbols; no mystery reward currencies                    | Symbols explained, legends persist                                               |
| Errors/frustration            | Adult responds; no locked pass condition                                         | Show example and offer help/skip                                                 | Strategy hint and recoverable try                                   | Specific explanation and another strategy                                        |
| Repetition                    | Same short routine, familiar object with one change                              | Stable task with varied examples                                                 | Revisit skill in other category/context                             | Mixed application, explain differences                                           |
| Adult involvement             | Default caregiver-child experience; offline may be better                        | Co-use for new task, unfamiliar language, movement                               | Available for new rules and emotional discussion                    | Available for sensitive topics and planning; autonomy respected                  |
| Response forms                | Point, look, name, listen, adult-assisted tap                                    | Picture choice, sorting by tap, oral answer                                      | Model, oral explanation, picture/text choice                        | Explain using voice to adult, drawing, structured choices; no recording required |

| Band | Suitable objectives/formats                                                                                                                                 | Adult co-use tasks                                                                                | Barriers and excessive load                                                                                                 | Feedback, stop, offline transfer and level adjustment                                                                                                                                                            |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2–3  | Jointly notice familiar object, act on “up/down”, match one identical picture, distinguish one vs another small collection through play; shared mini-reader | All first-use learning; counting/gesture interpretation; movement; matching screen to real object | Text-only options; unfamiliar accent; tiny targets; moving/counting objects plus narration; two rules; lack of illustration | “You found the cup / कप मिल गया।” End after one exchange or any disengagement. Find a real cup with adult. Reduce to one object; older-interest story can still be shared. No early-reading performance pressure |
| 4–5  | One-to-one counts up to an individually suitable small quantity; shape features; story order; familiar sound play; clear picture choices                    | New rule, quantity explanation, print exploration and any movement                                | Spoken multi-clause prompt + digits + distractor animation; colour-only identification; forced speed                        | “One for each bowl.” End after short concept cycle. Set toy picnic. Reduce collection/options; extend by a fresh arrangement, not timer                                                                          |
| 6–7  | Sound–letter/decoding if prerequisites; quantity addition models; rotated shapes; simple cause/sequence; tap game                                           | Unfamiliar script/phonics, science explanation, emotional interpretation                          | Large symbolic arithmetic before quantity model; mixed phonics/rhyme/antonym quiz; language memory mistaken for reasoning   | “You checked the three sides.” End a finite challenge set. Find a triangle in a drawing. Keep same concept with narrated simpler text; extend by explaining non-example                                          |
| 8–9  | Inference with textual evidence, multi-representation number reasoning, fair comparison/inquiry, original writing/patterns                                  | Sensitive conflict, privacy discussions, real-world experiments with risk                         | Several new concepts at once; long dense page; infer motive + arithmetic under time; spelling grade in non-spelling task    | “That sentence supports your idea.” End at story resolution/complete plan. Discuss another explanation/draw a model. Keep read-aloud; offer richer inquiry without public rank                                   |

Suggested pilot scope **H**: 2–3 one shared 1–3-minute invitation; 4–5 roughly 3–6 minutes; 6–7 4–8; 8–9 5–10. These are authoring/usability estimates, not medical doses, attention-span formulas or minimums. Stop sooner when child declines or adult chooses; longer conversation can happen off-screen. Age × minutes formula reject karein.

## 5. Actual current-content audit

Inspected source mein every practice edition has five questions. `count` and older `shapes` answer index always 1. Other question arrays use repeated 0,1,2,0,1 pattern; randomized placement absent. `pairs` uses the same questions at all ages. Practice advances only after correct choice and accepted save; guessing/retrying can satisfy it. There is no worked-example/hint schema or practice narration in this screen. Readers use five-string tuples, common category art and a conversation prompt on every page; device voice fixed `en`, rate .85. Good code comments/disclosures honestly limit completion claims.

| Activity | Current concept/interaction                                                                                         | Age-fit concerns                                                                                                          | Learning goal to retain/select                                                 | Main weakness                                                                                                                | Small improvement → future version                                                                                                                           | Engineering implication                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| colours  | Younger: object colour word quiz. Older: rhyme, initial sound, missing vowel, antonym, animal label                 | Non-readers see word choices; strawberry/sky/banana require worldly familiarity; older mix five skills                    | Younger identify visible colour; older one oral/reading goal per unit          | No depicted colour; recall of typical object substitutes perceptual matching; title changes conceal unrelated strands        | Keep examples only as adult conversation, clarify uncertainty “usually”; then visible colour matching. Split older word goals                                | Content edits C; images/narration U; new IDs and editions D                             |
| count    | Young: star glyph counting 1–3 repeating; old: unmodelled addition                                                  | Digits/English instructions for toddlers; star repeats narrow; symbolic sums jump abruptly                                | One-to-one and cardinality before symbolic addition                            | Always middle answer; distractors both greater than answer; no explanation; learned middle-tap can pass                      | Curate balanced option positions and both lower/higher errors; demonstrate quantity. Future give one item per recipient                                      | C for question content; worked example/hints U; quantity action N; edition ledger D     |
| shapes   | Young: names/side counts; older number sequences +2                                                                 | Preschool text; “four equal sides” not sufficient mathematical definition of square; older Logic island not logic breadth | Identify closed three straight-sided triangle; later one clear repeating rule  | Shape-to-number strand switch; identical rule/answer-position repetition                                                     | Clarify square has four equal sides and four right-angle corners with image; rename specific pattern task; future rotated/varied triangle game               | C plus U/N for geometry drawings; avoid generated inaccurate shape art; D for new units |
| pairs    | Five semantic pair/size/same-picture questions at every age                                                         | No actual memory mechanic; mixed size/association; same easy tasks at 8–9                                                 | One relation: same picture or functional pair                                  | “Memory meadow”, “Puzzle quest” overpromise; absurd distractors; interpretation can vary by household                        | Rename “Which goes with…?” and make relation explicit; accept culturally plausible alternatives. Future finite face-up partner game                          | C; matching player N; no general-memory/IQ claim                                        |
| clap     | Five spoken-verses per age: gentle movement, counting, patterns, rhyme making                                       | 2–3 lines/meta choices lengthy; 4–5 uneven phrasing; older several different rhythmic forms                               | Shared rhythm/optional participation; later repeating unit and rhyme sound     | “pattern for our test”, “Spoken rhythm, not a song” put product/testing explanations inside poetry                           | Retain optional quiet participation; move technical disclosures to adult/player copy; read aloud and revise meter. Future separate one clear rhythm per unit | C for poem review; U for prompt toggle; recorded/song player N                          |
| rainbow  | 2–3 animal sounds; 4–5 colour list including indigo/violet; 6–7 beats→skip count by 2 and 5; 8–9 rhythm composition | Indigo/violet unfamiliar, broad jump in numeric demands; counting beat not quantity proof                                 | Animal sound play / optional colour vocabulary / repeat a chosen rhythmic unit | Home hint “Sing & wiggle” and “musical” description despite spoken TTS; `rainbow` ID not youngest concept                    | Keep IDs as historical identifiers, correct public copy “Listen & play”; split numerical objectives. Future one rhythm with optional licensed song           | C; no re-ID history without migration; N for audio; D for editions                      |
| moon     | 2–3 bedtime fantasy; 4–5 blanket search; 6–7 path test; 8–9 kindness map                                            | Youngest needs pictures/adult; apple tree/picnic not universal; younger conflict small and safe                           | Listening, sequence, clue/strategy inference as edition-specific objectives    | Common category icon cannot show events; every-page generic prompt can interrupt; Moon fantasy vs science must stay explicit | Keep gentle texts, optional conversation at meaningful point/end; localize setting without copying facts. Future scene reader                                | C/U; illustration slots N/U; variable pages & D editions                                |
| bear     | Greetings; shared art/choice; speaking anxiety/help; accessible kindness project                                    | Some younger paragraphs long; older ending explicit moral; speech-anxiety story not therapy                               | Listening, choice/help-seeking, evidence of needs                              | Broad “kindness” claim; illustrations absent; response to emotion may vary                                                   | Retain trusted-adult/help/opt-out language; avoid app praising bravery as compulsory; invite differing interpretations. Future optional story discussion     | C/U; no diagnosing; specialist safety review for anxiety framing                        |

Legend: **C content-only**, **U small UI**, **N new interaction/player**, **D data-model/API**, **S research/specialist review**. All pedagogical revisions S too. Count/position bias can be verified statically; TTS mispronunciations are **risk to test**, not observed failures. Story quality/cultural familiarity concerns are editorial judgments, not child-test results.

Do not replace artwork to fix these issues. Current reader has no compulsory quiz, so preserve that; make existing page pauses optional. “All five steps complete” remains participation wording. Small content edits can retain step total, but changing objective/difficulty under the same ID must not silently reinterpret historical completion.

## 6. Curriculum architecture

Curriculum map child ke prereqs se route kare, catalog ke four tabs se strand break na ho. Each unit has one primary objective and at most one optional reinforcement objective. `ORAL`, `LIT`, `NUM`, `SPACE`, `PAT`, `INQ`, `CREATE`, `SEL` proposed IDs hain; official competency IDs copy/invent nahi kiye. Educator later NCF mapping verifies. Below is a D curriculum proposal informed by E09–E13, not an approved course.

| Strand                         | Prerequisite → observable progression                                                                                                                        | Examples/non-examples; misconception                                                                          | Activity and parent support                                                     | Other category and off-screen transfer                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Listening/oral language        | Shared attention access → point/name familiar referent → follow one visible direction → retell event → explain reason                                        | “Put cup beside bowl”; not sentence repetition as understanding; silence ≠ inability                          | Shared naming, wait for response; adult expands without forcing speech          | Story/rhyme reuse word; find/describe home objects                              |
| Vocabulary                     | Familiar concept in home language → meaning in scene → contrasting examples → word used in fresh context                                                     | Empty cup/full cup; not empty=small                                                                           | Picture contrast and child/adult description; parent accepts home-language word | Story shows empty basket; fill container safely                                 |
| Sound awareness                | Enjoy listening → recognize repeated end sound → syllable play → initial phoneme comparison when ready                                                       | English cat/hat; sun non-rhyme; letters not required for oral rhyme                                           | Spoken rhyme with familiar items; adult models; Hindi independently authored    | Rhythm/rhyme echoes, no forced phonemic testing at two; name-sound conversation |
| Emergent literacy              | Interest in books/symbols → page/text direction → meaningful print → script familiarity                                                                      | Label indicates object, icon is not letter; letter names ≠ decoding                                           | Shared book/labels; point to print optionally                                   | Story cover/title, signs encountered with adult                                 |
| Decoding/comprehension         | Oral vocabulary + specified taught correspondences → blend known English patterns / Hindi akshara–matra sequence → short controlled text → meaning/inference | English “sat” only with taught sounds; not unpredictable picture guessing; Hindi matra variation changes word | Explicit model and accessible connected text, educator-designed prerequisites   | Decodable micro-story then broader read-aloud; reading a familiar label         |
| Sequencing/narrative           | Recognize event → first/next two events → cause chain → perspective/evidence                                                                                 | Wet road after rain; event order not same as cause                                                            | Sort two/three scene cards; parent retells with child                           | Stories and sequence game; recount preparing snack                              |
| Number sense                   | Small collections/one-to-one → cardinality → same quantity rearranged → compare → compose/decompose → represented operations                                 | Three cups remain three spread out; “longer row” ≠ more                                                       | One object per recipient, tap counter; adult uses safe large toys               | Quantity rhyme/story; setting places at table                                   |
| Shapes/spatial                 | Match perceptually → name one attribute → categorize varied orientations/sizes → compose → explain relation                                                  | Rotated scalene triangle vs curved/open figure; triangle ≠ only point-up equilateral                          | Trace/count boundaries; parent sketches                                         | Shape game/roof story; large paper shapes, no sharp tools                       |
| Patterns                       | Notice repeated routine → copy AB unit → predict/extend → identify repeat vs growth → create/explain rule                                                    | Leaf/stone/leaf/stone vs ever-growing pile                                                                    | Keep unit visible; parent repeats objects/sounds                                | Rhythm and pattern game; large household-object arrangement                     |
| Problem-solving                | Try one action → select relevant feature → compare strategies → test and revise                                                                              | Check quantity vs pick prettier tray; one failed try ≠ failure label                                          | Hint ladder; adult asks what changed                                            | Game/plot obstacles; solve toy storage problem                                  |
| Scientific curiosity           | Notice → describe observable change → predict → compare with one change → distinguish observation/explanation                                                | “This paper got wet” vs “all things dissolve”; fantasy Moon not astronomy lesson                              | Safe pictures or adult-led dry paper comparison; no heat/chemicals              | Weather story; shadow observation with supervision, never sun-gazing            |
| Creativity                     | Choice of sound/mark → combine → change one element → explain artistic choice                                                                                | Many acceptable rhythms; not AI-preferred “perfect” answer                                                    | Open response to adult/drawing, no automatic grading                            | Rhyme/story alternate ending; make paper scene                                  |
| Social-emotional understanding | Notice feeling/action → name possibility → ask/help/decline → multiple perspectives → consider impact                                                        | “Maybe worried” vs infer emotion from face as certainty                                                       | Story conversation accepts reasons; adult trusted support                       | Cooperative game; ask before joining/offering help; no diagnosis                |

Progression is skill-specific; an eight-year-old can use quantity objects without “younger” labeling. Interests vary examples, not evidence threshold. Scripts remain supplemental to real relationships, school instruction and play.

## 7. Flexible 12-week reference sequences

**H:** an owner may offer 2–3 optional short app invitations per week, with one familiar revisit and related off-screen play. This is a manageable pilot production rhythm, not evidence-based screen dose. Weeks are planning folders, not deadlines. Skip, repeat, reorder around prereqs, illness/interests; no streak, catch-up or unlock penalty. A week offers L learning, G game, R rhyme, S story links; owner need not produce four new units weekly.

| Week | 2–3: caregiver chooses; all shared                                                                      | 4–5: co-use on new task                                                                | 6–7: support remains available                                                                              | 8–9: reading support optional                                                                              |
| ---- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1    | L name cup; G same cup picture; R hello; S greeting                                                     | L one for each bowl; G face-up same; R gentle count; S picnic                          | L quantities before +; G varied triangle; R repeat beats; S find clue                                       | L show reasoning from picture; G route plan; R word choice; S rain-shelter inference                       |
| 2    | L up/down with adult; G large one-tap location; R Up and Down; S toy rests                              | L quantities 1–3; G enough places; R repeat three; S empty/full                        | L oral sounds known language; G sound-picture choices; R English rhyme; S broad read-aloud                  | L context vocabulary; G choose evidence; R sound and meaning; S reread one clue                            |
| 3    | L inside/outside toy basket; G same big picture; R in/out; S basket search                              | L shape boundary; G circle/triangle; R corners optional; S paper picture               | L taught English correspondences or Hindi reviewed unit; G match by sound; R known words; S controlled text | L compare quantities/representations; G equal shares; R grouping rhythm; S fair solution with alternatives |
| 4    | L one spoon for adult; G one recipient; R one/two play; S snack scene                                   | L same count spread out; G matching amounts; R count optional; S table story           | L part/whole concrete addition; G make total; R number pattern; S toy collection                            | L observe vs infer; G select fair comparison; R observation words; S two explanations                      |
| 5    | L notice big/small same object; G choose identical; R soft/loud contrast optional; S big box            | L familiar syllable/rhyme play; G picture oral rhyme; R original couplet; S repetition | L new examples in known decoding pattern; G word build; R pattern language; S meaning check                 | L repeat vs grow pattern; G explain rule; R create unit; S patterned map                                   |
| 6    | Repeat preferred unit; new real object; no test                                                         | Revisit quantity on new objects; adult observes                                        | Fresh shape/number check; no timer                                                                          | New story clue task; optional delayed discussion                                                           |
| 7    | L action words; G point picture; R tap/listen; S help with toy                                          | L first/next two scenes; G reorder; R routine; S getting ready                         | L three-event cause order; G scene sequence; R sequencing words; S short cause plot                         | L character viewpoints; G compare stated/possible; R dialogue rhythm; S two voices                         |
| 8    | L colour noticing with texture cue; G same picture; R colour word; S cloth scene                        | L AB copy; G choose next; R leaf/stone beat; S repeating search                        | L AB/AAB unit; G rule detective; R pause is part; S route markers                                           | L plans with constraints; G accessible path; R revise rhythm; S different route                            |
| 9    | L notice daytime shadow with adult; G same outline; R shade word; S indoor shade                        | L wet/dry pictures; G sort examples; R rain sounds; S coat/roof                        | L one-change safe comparison; G predict/check; R observation; S garden test                                 | L data in small table; G test explanation; R exact descriptive words; S revise idea                        |
| 10   | L choose/help/stop gestures; G invitation; R goodbye; S ask to join                                     | L ask/decline in story; G optional sharing; R together/alone; S friend's choice        | L feeling possibilities; G action options; R reassuring language; S trusted help                            | L privacy/consent in fiction; G choose respectful plan; R invitation; S unnamed community map              |
| 11   | L choose favourite sound/object; G arrange with adult; R child-chosen repeat; S invented two-event tale | L explain simple choice; G create pattern; R new line with adult; S alternate ending   | L transfer quantity/shape; G create challenge; R chosen pattern; S oral retell                              | L explain solution with evidence; G construct puzzle; R two original lines; S alternative ending           |
| 12   | Revisit child-selected shared moment; parent reflects, no badge                                         | Fresh amount/sequence; parent note, optional replay                                    | Novel item + off-screen illustration; separate help from independence                                       | Delayed novel inference/problem; child chooses next domain; no graduation/mastery declaration              |

## 8. Learning, game, rhyme and story design rules

| Principle / evidence scope       | Applicable ages and limitation                          | Specific design rule                                                                   | Good / bad example                                                           | Evaluation                                                                   |
| -------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Guided play E02                  | Mostly early years; digital transfer uncertain          | Offer choice within meaningful problem; adult/player gives relevant cue                | Choose tray then compare recipients / random tapping unlocks trophy          | Can child describe/point to relevant relation in new example?                |
| Scaffolding E12/E13 + D          | All with age-tuned support; exact ladder untested       | Repeat → feature cue → demonstrate → supported fresh try                               | “One in each bowl” / repeat same vague “try again”                           | Observe help level and exit comfort, no diagnosis                            |
| Cognitive load/coherence E03 + D | All; toddler memory assumptions conservative            | One concept/instruction; example remains; suppress decorative reaction during thinking | Static three bowls / moving puppy, confetti, sound and instructions together | Look for lost-place/request-repeat/device layout problems, not gaze tracking |
| Meaningful variation E13 + D     | All; transfer must be checked                           | Change orientation/objects while holding target relation                               | Same triangle rotated / same answer memorized five times                     | Novel objects/orientations; human key check                                  |
| Retrieval E14, E12 + D           | Optional preschool pointing/naming; more explicit 6–9   | Invite recall after learning; immediate information after errors                       | “Which tray has enough?” / speed test before familiarization                 | New answer before hint; count supported separately                           |
| Spacing E14/E15                  | Direct evidence narrow; no universal schedule           | Offer later voluntary revisit, e.g. 2–3 days then roughly a week H                     | Fresh three-cup task / daily streak penalty                                  | Delayed novel check, record interval; no optimized-dose claim                |
| Feedback E16 + D                 | Praise evidence 5–6 narrow; rules all ages conservative | Describe relevant action; error supplies information                                   | “Three sides, even turned” / “genius” or buzzer                              | Educator review; child frustration/help/stop observation                     |
| Choice/autonomy E09 + D          | All, choice count adjustable                            | Help/repeat/finish-later always acceptable                                             | Choose listen/point / sad mascot on exit                                     | Can child stop without bargaining? Parent observations                       |
| Curiosity E10 + D                | All; impact untested                                    | Predict safe event, then reveal and discuss difference                                 | “What might keep paper dry?” / artificial countdown mystery loot             | Voluntary question/description; no attention-improvement claim               |
| Multimedia E03                   | Young storybook evidence; not all children/devices      | Narration and illustration express same event; accessible text stays                   | Illustration shows umbrella/roof context / unrelated tappable stars          | Recount event plus adult/a11y QA                                             |
| Concrete→symbolic E13/E12 + D    | Maths 4–9; preschool familiar forms first               | Quantity action → visible model → optional numeral/expression                          | Give three then show 3 / toddler answer 7+5 from text                        | Transfer between objects/diagram/symbol if ready                             |

### Learning creation specification

AI brief selects one verb you can observe: point, count with one-to-one mapping, compare, identify boundary, explain using a clue. Not “understand colours” without response criterion. Draft sequence: optional prereq invitation; model with narration matching visible example; guided try; short independent opportunities; hint ladder; one fresh example; parent/offline ending. Number of screens depends on concept. No school-style pretest for toddlers. Don't use adult-only note as child narration.

Distractors diagnose a **task misconception**, not intelligence: count one too many/few; curved boundary versus straight closed triangle. Alternatives plausible and singularly correct unless open response. Equal visual salience; no colour/length cue, absurd foil or repeated correct position. Balance across bank; if shuffling, bind answer by stable option ID and keep order stable within retry. Offer demonstrating/finishing after repeated difficulty; do not trap child behind correct-answer lock. Current generic player needs UI/data changes for this.

### Educational-game specification

Quiz under Games remains a practice quiz unless mechanic carries target relation. Proposed finite games:

| Game               | Objective/mechanic/age                                   | Progression                                        | Access, recovery and ending                                                       | Claim boundary/off-screen                                                       |
| ------------------ | -------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Toy partner        | Same-picture relation; two face-up choices; 2–3 shared   | One familiar pair then one new object              | Adult points/taps; no memory burden; explain match; end after child-selected pair | Visual relation only; use large toy pictures                                    |
| Enough places      | One-to-one small collections; 4–5                        | 2 then 3 recipients; rearrange                     | Tap-item then recipient; adult equivalent; undo, model; finite picnic ends        | Quantity practice, no general intelligence; real table toys                     |
| Triangle workshop  | Identify three straight closed sides under rotation; 6–7 | Familiar triangle→rotated/scalene→near non-example | Tap alternatives to trace; still model; no lost lives; three finds then rest      | Classification of target shapes; no broad spatial gains; paper shape comparison |
| Route with reasons | Meet two visible constraints; 8–9                        | One constraint→two→explain different plan          | Tap nodes, legend, spoken adult explanation; undo; one complete route             | Specific planning task; no executive-function cure; floor-map puzzle            |

Reward: resulting picnic/scene/solution provides closure; no currencies, random drops, lives, streaks or public rankings. These mechanics need new interaction/player except adult-facilitated text prototypes.

### Rhyme creation specification

Five distinct outputs: written rhyme; spoken read-aloud script; rhythm-play invitation; optional recorded song; optional movement directions. Write original language-native lines, repeat a useful phrase, check stresses/syllables by **actual spoken performance**, not AI counting alone. One vocabulary/rhythm aim; don't distort language to teach every number. Hindi कविता may use rhythm/repetition without forced English-style rhyme.

Quiet listen, seated gesture, eye-point, caregiver response and no movement are equally valid. No jumping/running near tablet, holding breath, forced claps, loud screams or body comparison. Singing is a separate melody/voice/rights task. Current device TTS is spoken fallback; no song claim. Parent/page instructions stay separate from lyrics.

### Story creation specification

Character wants something concrete; small obstacle makes a meaningful change; action and consequence support resolution. Youngest: very short familiar shared scene, predictable language and mild conflict. Four–five: goal/search/solution; six–seven: sequence/cause; eight–nine: motives/clues/multiple plausible interpretations. Word scope selected with language reviewer, no universal word-count law.

Plan illustration and narration per event. Offer perhaps one prediction at a turning point and one end discussion **D**, neither compulsory nor score-bearing. First read can be uninterrupted enjoyment; second read/conversation can explore vocabulary. Accept “maybe” feelings and alternative interpretations with reasons. Don't make every page quiz, every ending moral, or every upset character cheerful immediately. Existing boy/puppy can frame story; supporting characters are scene characters, no identity redesign.

## 9. Feedback and emotional safety

Use calm neutral tone, no punishment sound. Mascot may briefly point at relevant object or acknowledge a completed action; return to stillness and respect reduced motion. No sadness/guilt on leaving; help text carries instruction, not mascot's emotional needs. Exact scripts are D drafts requiring Hindi/English editorial review.

| Event               | English child copy                             | Hindi child copy                           | Behaviour                                                                                       |
| ------------------- | ---------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Correct             | “One for each bowl. There are three.”          | “हर कटोरी में एक। कुल तीन हैं।”            | Explain target feature; no fireworks                                                            |
| Incorrect           | “One bowl is empty. Let's check together.”     | “एक कटोरी खाली है। आओ, साथ में देखें।”     | Show relevant cue, permit retry/help                                                            |
| Repeated difficulty | “Would you like me to show you, or stop here?” | “मैं करके दिखाऊँ, या यहीं रुकें?”          | Offer demonstration/exit; H trigger after two unsuccessful attempts, not fixed ability judgment |
| Asking help         | “Let's do the first one together.”             | “पहला हम साथ में करें।”                    | Help never removes reward/access                                                                |
| Different strategy  | “You checked each one. What did you notice?”   | “तुमने एक-एक करके देखा। क्या दिखा?”        | Describe observed action only                                                                   |
| Leaving unfinished  | “We can stop here.”                            | “हम यहीं रुक सकते हैं।”                    | Save valid checkpoint only, no guilt                                                            |
| Returning           | “Shall we continue or start again?”            | “आगे चलें या फिर से शुरू करें?”            | Explicit replay/continue; no missed-streak mention                                              |
| Complete            | “Our picnic is ready. You can rest now.”       | “हमारा खेल तैयार है। अब आराम कर सकते हैं।” | Natural endpoint and offline option                                                             |

Do not use “smart”, “best child”, “you disappointed Puppy”, sibling comparisons, “only one more”, false praise after random tapping, distress-triggered rewards or personalized inferred emotion. Animation/media remain supporting elements.

## 10. Screen use and healthy engagement

Age two and age three–four: WHO's whole-day sedentary screen ceiling is one hour, less better, **not a target** and not Kidsuu entitlement. Age five belongs to older guidance; don't extend the under-five number automatically. For five–nine, prioritize appropriate content and protect physical play, sleep, school, conversation and family routine; WHO 2020 calls for limiting sedentary/recreational screen time without prescribing this app's dose. [WHO under-five](https://www.who.int/news-room/detail/24-04-2019-to-grow-up-healthy-children-need-to-sit-less-and-play-more), [WHO 2020](https://www.who.int/publications/i/item/9789240015128).

AAP's 2026 ecosystem approach adds attention to manipulative design and family context; old 2016 minute advice should not be presented as the complete latest position. [AAP official 2026 summary](https://publications.aap.org/aapnews/news/34088/Beyond-screen-time-Policy-discusses-how-to).

| Mode             | Product meaning                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Total screen use | Parent considers all devices/content and displacement; app knows only its own access, current app does not measure time |
| One activity     | Estimated authoring length H; natural endpoint, stop sooner allowed                                                     |
| Independent      | Requires accessible instruction + suitable task, not inferred from age or taps                                          |
| Shared           | Adult notices response/talks/follows child; co-use does not erase screen time                                           |
| Passive          | Listening/watching may be enjoyable; not evidence of learning or inattention                                            |
| Interactive      | Relevant action may practise skill; repeated taps alone not learning                                                    |
| Off-screen       | Real-object/talk/art extension; optional, not another compulsory assignment                                             |

Now: remove inaccurate “Sing & wiggle” claims; tell parents dailyGoalMinutes is a preference, not a timer/medical dose. Next: hide child countdowns, make end screen Rest/Back to Home and optional off-screen invitation; no autoplay next unit. Later: only parent-requested transparent usage estimate if privacy/use case approved. Avoid infinite feeds, urgency, ads in activities, loss aversion and public rank.

## 11. Hindi–English and Indian localization

Familiar/home language supports access in NCF-FS; India includes many home languages, so Hindi is not every Indian child's L1. Framework guidance is not a bilingual-app efficacy experiment. [NCF-FS](https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf).

| Option             | Best fit / uncertainty                                                                     | Proposed implementation                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hindi-first        | Hindi-familiar families; may exclude non-Hindi homes                                       | Hindi oral version with optional English labels after concept; specialist authored Hindi literacy                                                             |
| English-first      | Families choosing English with adequate oral comprehension; non-readers still need support | Simple English audio/visuals; parent can select Hindi explanation; no superiority claim                                                                       |
| Bilingual editions | Family preference, varying exposure; dual simultaneous input may increase load             | **D recommended pilot:** separate complete hi-IN/en-IN editions, parent chooses; optional manual switch at boundary, not duplicated narration on every screen |

Before approval, interview a small purposive range of Indian parents/educators across language exposure, region, family forms and device access; no representative-market claim from that small sample. Ask which object/phrase familiar, who co-uses, desired narration and script instruction. Don't assume one accent, family structure, festival, religion, school system, diet or paid resources. Neutral everyday objects plus alternatives.

English phonics and Hindi literacy are separate sequences. Hindi uses akshara/consonant–vowel combinations and matras; English has its own grapheme–phoneme irregularities. “cat/hat” doesn't translate into a Hindi rhyming lesson. Oral rhyme examples can be तारा/प्यारा where meaningful; sound/akshara exercises require reviewer checking pronunciation, schwa behaviour and decoding scope. No universal schwa rule generated by AI.

Use natural spoken Hindi: “आओ, गिनें” rather than stiff “गणना प्रारंभ करें”. Code-switch only where families find natural and goal permits: concept conversation may accept any home-language response; a targeted English initial-sound item must clearly specify English. Do not grade accent, speech difference or home-language answer as failure on maths.

Devanagari QA: मात्रा placement (कि/की, कु/कू), conjuncts where used, reph/halant, line breaks, font fallback, text scaling and selection/screen-reader language. Don't split grapheme clusters. Digits 0–9 versus Devanagari digits ०–९: choice is an owner/educator decision; ensure numerals and speech agree. Current device narrator fixed `en`, so swapping Hindi text alone is not a verified audio adaptation. Engine voice selection, hi-IN/en-IN availability, pronunciation and airplane-mode voice behaviour need device checks. Narration must never send child nickname/progress to cloud voice.

## 12. Accessibility and ethical personalization

Native tablet checklist **D**, inspired by [WCAG](https://www.w3.org/TR/WCAG22/): no colour-only cues; large targets with space (existing docs say 48+ dp; preschool pilot aim 56–64 dp H, verify actual physical tablet); no precision drag/timing; tap then tap alternative; clear object boundaries; text scaling/scrolling; predictable Help/Repeat/Back position; labels and logical TalkBack order; accessible item states; optional audio and equal text/visual equivalents; sound/reduced-motion controls; non-moving explanation; no flash. Contrast/style decisions audited in implementation, clay identity retained. WCAG web compliance alone doesn't certify native child usability.

If target is colour naming, blind/colour-vision-limited access cannot magically become the same perceptual task through labels. Offer an equivalent accessible objective (texture/object-language sorting) and explain difference. If objective is quantity/shape, accessible spoken/tactile-offline alternative can target the same relation; keep support/mode in observations.

| Signal    | Need and limits                                                            | Currently recorded?                                           | Privacy/retention proposal D                                                                                 | Local enough?                 |
| --------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| Age band  | Default content/support; cannot establish developmental or reading ability | Yes profile                                                   | Min band, no DOB required for pedagogy; retain while profile exists under production policy; demo dummy only | Yes                           |
| Interests | Voluntary choice of examples; not personality                              | Bookmarks yes; explicit interest field no                     | Let choices be session-only unless parent saves; no inferred religion/SES; avoid free text                   | Yes                           |
| Responses | Fresh task evidence; cannot isolate comprehension from motor/language/help | Selection transient in practice; no response-history contract | Opt-in later; aggregate narrow outcomes, avoid raw trails; research protocol decides retention               | Usually yes; no cloud default |
| Hints     | Support provided; not a disability signal or low ability label             | No hint events/schema                                         | Session hint state by default; optional supported/independent summary; don't store speculative reasons       | Yes                           |
| Attempts  | Retry design/access difficulty; guessing/accidental taps confound          | No attempt count                                              | Session-only, bounded counters; analytics require explicit justification/law review                          | Yes                           |

Provisional study retention example H: de-identified usability notes 30 days for coding then delete; consent forms separately per ethics/legal retention. This is **not** a legal default; lawyer may require distinct security-log retention. Production profile/progress retention must be separately approved, not keep-everything forever. No fixed ability labels, diagnoses, microphone attention tracking, face recognition or psychological inference. Parent preferences explainable and reversible. Don't add analytics merely because AI suggests it.

## 13. Measure learning, not taps

| Construct             | Legitimate observation                                                                 | Not justified                                                          |
| --------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Participation         | Opened/explored, optional response, adult reports joined                               | Attention, enjoyment or listening duration from Next taps              |
| Completion            | Explicit configured steps explored and saved                                           | All words listened/read, concept mastered                              |
| Immediate performance | Correct first response on specified fresh task, support/mode known                     | Broad ability or learning gain from corrected/retried answer           |
| Retention             | Voluntary short different-item delayed check with interval recorded                    | Durable learning from same-session repetition                          |
| Transfer              | Relation applied to changed context/objects or off-screen task                         | General intelligence/attention or school success                       |
| Independence/support  | Adult observer notes unprompted / instruction repeated / hint / model / adult-operated | “Independent” inferred from no app hint tap; off-screen adult may help |

Current completedSteps loses first choice, retries, hint/support, comprehension, edition and time. Correct-only advance still permits elimination/guessing; reader Next permits unexplored narration. Five checkpoint completion cannot substantiate mastery. Parent UI “activities explored” is honest; replace “mastered”/“learned minutes” claims if introduced later.

Low-stress evaluation D: baseline one familiar task without teaching, recorded by trained adult outside demo; practise with model; new item immediately; optional one-item check 2–3 days later H; off-screen task near a week H. Child may refuse; no penalty. Parent note “needed counting together” useful, but not equivalent to blinded standardized assessment. Keep baseline/reassessment quantity/difficulty comparable while object arrangement differs. Never reuse exact answer/option position as proof.

Pilot examples: quantity give one large toy per three bowls; shape choose rotated scalene triangle among carefully matched outlines; rhyme caregiver notices recognition/participation without speech requirement; story explain a plausible reason with a specific clue. Rhyme enjoyment need not be converted into attainment score.

Child work: parental informed consent + age-appropriate ongoing assent, stop at distress/refusal, minimal data, accessible participation, fair compensation if applicable, documented ethics/legal review route. Demo only dummy profiles; consent/study notes in approved separate secure system. No photos/audio needed by default, no covert observation/attention surveillance. A small usability pilot identifies design issues, **does not prove effectiveness**. Later educational-effect study requires qualified investigator, preregistered outcomes, adequate sample/comparison, appropriate ethics and transparent null/adverse results.

Next report parts: Part 2 sixteen blueprints; Part 3 four complete bilingual pilot/AI examples; Part 4 schema, engineering/workflow/roadmap and bibliography; Part 5 AI production SOP/toolchain; Part 6 complete prompt library and final executable roadmap.

---

# Part 2 of 6 — Sixteen detailed content blueprints

## 14. Sixteen blueprints

All units below **proposed drafts** hain, validated interventions nahi. Evidence rationale Part 1 E-IDs ko refer karta hai; specific screen counts/designs D/H hain. C=content-only, U=small UI, N=new interaction/player, D=data-model/API, S=specialist/research. Each requires educator/editor, language, safety/accessibility review. Full assets not generated. Existing approved boy/puppy identity and animation intact; new supporting scene props only. Current compatibility means inspected source capabilities, actual integration/device pass nahi.

### B01 — Cup Is Here / कप यहाँ है

- **Age/category/objective:** 2–3, Learning. Shared scene mein familiar cup point/name/indicate kare, speech compulsory nahi.
- **Prerequisites:** Caregiver available; familiar cup concept; pointing/looking or adult-assisted response possible.
- **Rationale:** E04/E17 human book-sharing/responding supports oral interaction; no independent app efficacy claim.
- **Child instruction:** “Here is a cup. Shall we find one?” / “यह कप है। एक कप ढूँढ़ें?”
- **Sequence:** 1 shared large cup model; 2 cup/spoon scene with adult invitation; 3 different cup and optional real-cup ending. No forced quiz/checkpoint padding.
- **Correct/error:** “You found the cup.” / “That is the spoon. Here is the cup.” Hindi: “कप मिल गया।” / “यह चम्मच है। कप यहाँ है।”
- **Hints:** Adult points to outline; shows real cup; accepts home-language name.
- **Accessibility:** High contrast outline, narration/text, adult description and safe real-object tactile exploration; no shape/icon-only controls.
- **Parent role:** Operates screen, follows child's interest and stops at refusal; avoid repeated testing.
- **Stop/off-screen:** Any exchange; find large unbreakable cup with adult. No hot liquid.
- **Completion/measure:** Invitation explored; caregiver may observe referent recognition in fresh object, not language mastery.
- **Localization:** कप/प्याला familiarity check; household cup styles vary; English word need not replace home-language response.
- **Assets:** Two reviewed cup pictures, spoon, optional approved mascot corner; 3 short narration texts, accessible descriptions.
- **Compatibility/change:** Current text choice only usable caregiver-read prototype; visual demonstration U/N; three-unit player N; new stable unit/edition progress D; S.

### B02 — Find the Toy Partner / वैसा खिलौना ढूँढ़ो

- **Age/category/objective:** 2–3, Games; select identical pictured large toy among two visibly different objects, shared.
- **Prerequisites:** Adult, familiar toy, joint picture attention; no memory/reading needed.
- **Rationale:** E09/E13-informed perceptual relation practice, game benefit H, no memory/IQ claim.
- **Instruction:** “Which looks the same?” / “कौन-सा वैसा ही दिखता है?” Adult demonstrates first.
- **Sequence:** Sample ball with one identical partner → child chooses ball vs block → fresh block vs cup round → finish any time.
- **Feedback/hints:** “Both are balls.” / “This is a block. Let's look for the ball.” Outline/caregiver model; don't say failure.
- **Accessibility:** Tap or adult-operated/real-object same relation; no fine-motor drag, colour dependence or hidden cards.
- **Parent role:** Clarify “same picture”, follow child choice, provide support without demanding speech.
- **Stop/off-screen:** Two optional matches then goodbye; match two large safe toy objects/pictures.
- **Completion/measure:** Finite rounds explored; identical-match fresh response with help noted, not general memory improvement.
- **Localization:** Familiar locally available objects; names optional, no branded toy.
- **Assets:** Exact duplicated toy images for intended matches, alternate objects, optional existing mascot acknowledgement; text/audio scripts.
- **Compatibility/change:** Existing `pairs` is semantic text quiz, not this game. Prototype as adult cards; face-up player N; hints U; IDs/edition D; S.

### B03 / pilot R — Up and Down, Then Rest / ऊपर, नीचे, फिर आराम

- **Age/category/objective:** 2–3, Rhymes; share spoken “up/down/rest” language with optional gesture/pointing/listening.
- **Prerequisites:** Caregiver, comfortable seated/listening access; no rhythm/speech expectation.
- **Rationale:** E04/E09/E17 support shared language contexts; this particular rhyme's learning impact H.
- **Instruction:** “Listen, point, or watch with me.” / “सुनो, इशारा करो, या साथ में देखो।” Adult supports.
- **Sequence:** Intro with adult → verse up/down → repeat with pictured cloth position → quiet rest ending. Four units including intro; only two short spoken verses, no padded five.
- **Feedback/error/hints:** No correct/incorrect movement scoring. “You chose to listen.” only after an explicit observed choice; tapping Next cannot establish listening. Parent models direction if wanted; all participation accepted.
- **Accessibility:** Silent illustrated/text read-aloud, seated eye/point response, adult raises picture rather than child's arms, no motor requirement.
- **Parent role:** Shares rhythm, doesn't move child's limbs or enforce action.
- **Stop/off-screen:** Rest verse or any earlier stop; move large soft toy up/down in adult's hand.
- **Completion/measure:** Verses explored, not sung/listened/skill mastered; parent can note familiar direction recognition later without test pressure.
- **Localization:** Hindi native short rhythmic lines, not literal English meter; “ऊपर/नीचे” pronounced naturally.
- **Assets:** Approved puppy observing one soft cloth at two positions and rest, narration text; optional future music separately licensed, none generated.
- **Compatibility/change:** Text reader idea fits; current FivePages/readingCheckpoint fixed five, so this four-unit proposal N/D. Spoken-only now with adult read-aloud; Hindi narrator U; S. Full pack in Part 3.

### B04 — Puppy Finds a Resting Place / पपी की आराम की जगह

- **Age/category/objective:** 2–3, Stories; share familiar rest scene and notice puppy/mat; no sleep promise.
- **Prerequisites:** Caregiver; resting-place vocabulary familiar or shown.
- **Rationale:** E04 shared book context; E03 coherent illustration; bedtime efficacy not claimed.
- **Instruction:** “Let's look with Puppy.” / “पपी के साथ देखें।”
- **Sequence:** 1 puppy looks at mat; 2 blanket beside mat; 3 puppy rests, adult can say goodnight. Gentle no-threat plot.
- **Feedback/hints:** No quiz/error gate. “There's the mat.” Adult points or names; child may think quietly.
- **Accessibility:** Narrated/text image description, static art, no mandatory dark screen or sound.
- **Parent role:** Read responsively; optional “Where is Puppy?” once; leave story uninterrupted if preferred.
- **Stop/off-screen:** Resolution or any page; arrange large soft toy on cloth without covering child's face.
- **Completion/measure:** Pages explored; recognition/word use only voluntary adult observation, not improved sleep.
- **Localization:** Mat/bed/floor alternatives; no assumption every child has separate bedroom.
- **Assets:** Three scene illustrations, three texts/narrations, alt descriptions; reuse approved puppy.
- **Compatibility/change:** Current `moon` young story supports similar shared mood but three-page structure and scene art require N/U and new edition ledger D; S.

### B05 / pilot L — One for Each Bowl / हर कटोरी में एक

- **Age/category/objective:** 4–5, Learning; make one-to-one correspondence for three recipients and recognize total three after arrangement change.
- **Prerequisites:** Familiar one/each, can attend to small visible set; pointing/tap or adult-operated access. Baseline invitation no scored pretest.
- **Rationale:** E13 number progression; E02 guided support; relation in action before numeral.
- **Instruction:** “Put one toy fruit in each bowl.” / “हर कटोरी में एक खिलौना फल रखो।”
- **Sequence:** Intro/prereq → two-bowl model → three-bowl guided → independent fresh three → quantity recognition with different layout → optional off-screen end. Six units.
- **Feedback/hints:** “One in every bowl. Three altogether.” Empty/doubled bowl cue, highlight one recipient, model then new try.
- **Accessibility:** Tap fruit then bowl, no drag; adult places real large objects; described recipient list for screen-reader access; no colour rule.
- **Parent role:** Read if needed; observes helping level, doesn't complete covertly then report independent.
- **Stop/off-screen:** At any completed action; set three large bowls for three large toy fruits; no real-food choking task.
- **Completion/measure:** Cycle explored even with model/skip; separate fresh first response and off-screen correspondence, not mastery.
- **Localization:** कटोरी/bowl picture familiarity; “हर…एक” natural; quantities same in both editions.
- **Assets:** Three bowls, three identical large toy fruits, plate/group art, exact-count diagrams, six narration segments.
- **Compatibility/change:** Current count text quiz lacks placing/model/hints; U/N + D six-unit edition. Adult prototype possible without code. Full Part 3 pack; S.

### B06 — Garden Pattern Path / बगीचे का क्रम

- **Age/category/objective:** 4–5, Games; continue one visible AB repeating unit.
- **Prerequisites:** Recognize two familiar shapes/objects; can choose one of two; “next” demonstrated.
- **Rationale:** E13 limited guidance on patterns; D finite meaningful task, no broad logic claim.
- **Instruction:** “Leaf, stone, leaf, stone. What comes next?” / “पत्ता, पत्थर, पत्ता, पत्थर। अब क्या आएगा?”
- **Sequence:** Model AB twice → guided leaf/stone choice → independent large flower/cup abstracted as drawn markers → reveal path → end. Four rounds/units if intro combined.
- **Feedback/hints:** “Leaf follows stone in this pattern.” On error, bracket AB and speak unit; model if wanted.
- **Accessibility:** Shape/texture plus colour; tap not drag; audio/text object labels; large safe object offline equivalent.
- **Parent role:** Explain repeat by pointing, no need child use letter “AB”.
- **Stop/off-screen:** Finite path, no infinite terrain; arrange large paper leaf/circle cards.
- **Completion/measure:** Path explored; novel AB extension with support noted, not general reasoning ability.
- **Localization:** Familiar objects; natural Hindi क्रम for adult note, child phrase “बार-बार यही”.
- **Assets:** Two pairs of distinctly shaped markers, static path, narration, hint bracket.
- **Compatibility/change:** Current shapes older numeric sequences don't implement this; choice prototype C if new set; picture/path feedback U/N; new IDs/progress D; S.

### B07 — Hear the Ending / आख़िर की आवाज़

- **Age/category/objective:** 4–5, Rhymes; enjoy/listen to familiar repeated ending sound, optional identify one rhyming pair.
- **Prerequisites:** Oral familiarity with selected words, listening access or adapted rhythm objective; print unnecessary.
- **Rationale:** E12 oral sound awareness, adapted cautiously from K–3; no expectation preschool rhyming predicts an individual outcome.
- **Instruction:** “Listen: cat, hat. Say it if you like.” Hindi separate “तारा, प्यारा—सुनो।” Not a translation of phonics.
- **Sequence:** Short two-line couplet → echo → same pair in scene → quiet ending; four units; optional pair discussion outside verse.
- **Feedback/hints:** No performance requirement; if pair choice offered, model end sound with natural pronunciation, not alphabet spelling.
- **Accessibility:** Text/scene meaningful without audio but cannot claim identical sound-discrimination practice; offer word-meaning/visual rhythm alternative.
- **Parent role:** Native-language familiar-word confirmation; accept watching/no echo.
- **Stop/off-screen:** Two repetitions sufficient H; talk about familiar rhymes from licensed/original sources.
- **Completion/measure:** Verses explored; optional correct oral pair task separately, no early-reading pressure.
- **Localization:** Hindi lines must make sense; English cat/hat cannot reuse answer keys under translation.
- **Assets:** Familiar-object scenes, separate language scripts, optional adult-recorded speech with rights; no song implied.
- **Compatibility/change:** Reader spoken rhyme approach fits, but four units/Hindi and optional responses require U/N/D. Can retain existing five-verse draft as separately reviewed prototype; S.

### B08 — The Missing Scarf / दुपट्टा कहाँ गया?

- **Age/category/objective:** 4–5, Stories; recount first/search/found with pictured clues.
- **Prerequisites:** Familiar cloth/scarf and location terms; adult story support.
- **Rationale:** E04 shared narrative; E03 event illustration; D one optional end sequencing conversation.
- **Instruction:** “Let's see where the cloth went.” / “देखें, कपड़ा कहाँ गया।” Final title reviewed for object: दुपट्टा vs scarf vs soft cloth.
- **Sequence:** 1 cloth used in pretend picnic; 2 boy notices missing; 3 puppy points at bench; 4 cloth found safely folded; 5 return/rest. Five purposeful pages.
- **Feedback/hints:** No quiz gate. “It was on the bench.” If child mixes order, adult retells with two scenes; no “wrong story”.
- **Accessibility:** Alt descriptions and text/narration; recall via pointing instead of speaking; scene cards optional later.
- **Parent role:** One invitation after ending; vary setting if unfamiliar.
- **Stop/off-screen:** Story resolution; hide/find large cloth in safe visible places, no climbing or covering face.
- **Completion/measure:** Pages explored; optional two-event recall with support, not comprehension certified.
- **Localization:** Replace private garden/picnic assumptions with familiar shared room/bench; family role neutral.
- **Assets:** Five approved-character scenes, five narration texts, alt text; rights review.
- **Compatibility/change:** Five text pages can use current reader editorial shape under a reviewed new ID plan; scene art U/N, Hindi U, new IDs D. Not automatic JSON import; S.

### B09 — Three Can Be Two and One / तीन: दो और एक

- **Age/category/objective:** 6–7, Learning; represent three as two and one, link to 2+1=3 only if symbols taught.
- **Prerequisites:** Small quantity/cardinality and numerals if symbolic edition; narration support.
- **Rationale:** E13 number progression, D concrete-to-symbolic bridge.
- **Instruction:** “Move one counter. How many here and here?” / “एक निशान दूसरी तरफ रखो। यहाँ कितने, वहाँ कितने?”
- **Sequence:** Three visible tokens → model split two/one → guided new layout → independent split choice → optional expression → fresh four as extension only if ready → end. Core five units; extension separate.
- **Feedback/hints:** “Two here, one there, three altogether.” Count both groups; preserve original total; error shows double count gently.
- **Accessibility:** Large selectable tokens, tap group, adult drawing alternative; not colours alone; screen-reader described counts without revealing target answer prematurely.
- **Parent role:** Ask child to show relation, not recite expression; support notation.
- **Stop/off-screen:** One completed split; split three large paper cards on table.
- **Completion/measure:** Explored representation; fresh split explanation independent/supported, no arithmetic fluency claim.
- **Localization:** “निशान/गिनती की चीज़ें” tested for naturalness; Hindi number wording exact.
- **Assets:** Controlled tokens/group mats, optional numeral overlays, scripts, model/hint diagrams.
- **Compatibility/change:** Text symbolic quiz can be revised C, but movable models U/N; new objective ID/editions D; S.

### B10 / pilot G — Triangle Workshop / त्रिकोण की खोज

- **Age/category/objective:** 6–7, Games; identify triangle regardless of rotation/side lengths using three straight closed sides.
- **Prerequisites:** Familiar straight/side/closed or demonstration; untimed choice access.
- **Rationale:** E02/E13-informed shape practice; specific game unvalidated.
- **Instruction:** “Find the shape with three straight sides, joined all the way round.” / “तीन सीधी भुजाएँ ढूँढ़ो, जो मिलकर बंद आकार बनाती हैं।” Child-language review needed; simpler “तीन सीधे किनारे…”.
- **Sequence:** Goal/model → familiar find → rotated find → narrow/scalene find → optional reason→workshop end. Six units including optional reason/end; no five-round obligation.
- **Feedback/hints:** Relevant side tracing; open/curved foil explanations, demonstrate and retry fresh example; no lives.
- **Accessibility:** Tap answer or sequential focus/choose; large shape; adult tactile paper/raised outline if available; no timed tracing.
- **Parent role:** Read terms and count sides if needed; don't tell correct shape secretly.
- **Stop/off-screen:** Three finds then complete display; draw several triangles and one curved non-example.
- **Completion/measure:** Set explored; rotated first-choice and supported classification; not general spatial ability.
- **Localization:** किनारे child-friendly vs भुजा school term; exact geometry remains; square as distractor need not imply all four-sided shapes squares.
- **Assets:** Deterministic reviewed shape drawings preferred over AI object-count generation; approved mascot static framing; text/audio.
- **Compatibility/change:** Existing shapes is text quiz; graphic/hints U/N, finite-game/state N, new ID/edition D; S. Full pack Part 3.

### B11 — Tap, Tap, Pause / थप, थप, विराम

- **Age/category/objective:** 6–7, Rhymes; reproduce or describe repeating sound–sound–pause unit optionally.
- **Prerequisites:** Perceive/listen or visualize unit; no exact motor timing requirement.
- **Rationale:** E13 pattern guidance limited; D cross-category repeat-unit practice, no music/attention claim.
- **Instruction:** “Say, tap, point, or listen.” / “बोलो, हल्का थपथपाओ, इशारा करो, या सुनो।”
- **Sequence:** Model two taps/pause → repeat → show three symbols with pause distinct → child may choose equivalent pattern → rest. Five units if meaningful lines stay short.
- **Feedback/hints:** No perfect-beat grade. Point at repeating unit; adult slow model; “The pause comes again.”
- **Accessibility:** Still visual sequence; no audio-only goal when hearing inaccessible; optional adult description; hands at rest allowed.
- **Parent role:** Observe preference, no rhythm diagnosis, don't require performance.
- **Stop/off-screen:** After two repeats or chosen ending; three large pattern cards on table.
- **Completion/measure:** Verse explored; optional unit recognition, not measured listening from TTS callback.
- **Localization:** “विराम” adult term; child phrase “थोड़ा रुकें”; Hindi meter authored separately.
- **Assets:** Tap/pause symbol legend, five short texts, spoken narration; optional future music rights separate.
- **Compatibility/change:** Five spoken pages suit reader draft shape; meaningful symbols/hints U/N, Hindi narrator U, new ledger D; S.

### B12 — A Light for the Path / रास्ते पर रोशनी

- **Age/category/objective:** 6–7, Stories; connect problem→test→revision using explicit events.
- **Prerequisites:** Basic sequence vocabulary; adult available for real-world safety.
- **Rationale:** E03 relevant illustrations/E12 narrative reasoning; D safe problem-solving story.
- **Instruction:** “Read or listen. We can talk at the end.” / “पढ़ो या सुनो। अंत में बात कर सकते हैं।”
- **Sequence:** Path unclear → adult brings light → child proposes marker → supervised test shows gap → revised marker → safe visit/end. Six pages.
- **Feedback/hints:** Optional “What changed?” adult can show test/revision pages; no mandatory correct response.
- **Accessibility:** Narration/text/alt, high contrast path marks not colour-only; tactile drawing equivalent.
- **Parent role:** Clarify outdoor/night tasks need trusted adult, no child sent outside alone.
- **Stop/off-screen:** Resolution or save any page; compare two paper path drawings, not real night exploration.
- **Completion/measure:** Pages explored; identify one revision and its reason, not scientific mastery.
- **Localization:** Shared corridor/garden alternative; different living settings accepted.
- **Assets:** Six scene drawings with consistent path relationships, scripts, alt; approved characters.
- **Compatibility/change:** Current moon 6–7 close concept, but six-page edition requires N/D; optional end prompt U; S.

### B13 — Change One Thing / एक चीज़ बदलकर देखें

- **Age/category/objective:** 8–9, Learning; identify which pictured comparison changes only one chosen factor.
- **Prerequisites:** Can compare two attributes; language explanation support; no prior experiment terminology needed.
- **Rationale:** E11 inquiry framework, D fair-test content; not laboratory-effect evidence.
- **Instruction:** “We want to compare paper size. What should stay the same?” / “कागज़ के आकार की तुलना करनी है। क्या एक जैसा रखें?”
- **Sequence:** Two-paper picture and question → model same paper type/different size → guided compare → independent new pair → explain one kept-same attribute → optional safe offline → end. Seven units.
- **Feedback/hints:** “Same kind, different size.” Foil changes size and type; highlight attributes; example first.
- **Accessibility:** Text/voice descriptions, large side-by-side attributes with labels; oral explanation to adult, no typing required.
- **Parent role:** Adult can conduct dry paper-folding comparison; no water/electricity/heat experiments.
- **Stop/off-screen:** One reasoned comparison; fold two sizes of same paper with adult, no sharp scissors.
- **Completion/measure:** Unit explored; narrow comparison reasoning, not scientist/IQ label.
- **Localization:** Everyday paper wording not jargon; actual inference/evidence translated by meaning.
- **Assets:** Accurate paper diagrams/tables and accessible labels, scripts; no decorative gadgets.
- **Compatibility/change:** Choice text prototype C; attribute panels/hints U/N, seven units/editions D; S educator/science review.

### B14 — Two Ways Home / घर के दो रास्ते

- **Age/category/objective:** 8–9, Games; choose a fictional map route meeting two visible constraints and explain tradeoff.
- **Prerequisites:** Understand map legend from demonstration; sequence access; read/listen to two rules.
- **Rationale:** E11 problem-solving framework; D finite planning puzzle; no far-transfer claim.
- **Instruction:** “Choose a route that visits the library and uses the wide path.” / “ऐसा रास्ता चुनो जो पुस्तकालय से जाए और चौड़े रास्ते का उपयोग करे।”
- **Sequence:** Legend/model → one-rule route → two-rule route with persistent list → optional alternative explanation → end. Five units possible, routes have few nodes.
- **Feedback/hints:** Highlight satisfied/missing rule; allow undo; model one route; no wrong-turn penalty.
- **Accessibility:** Tap-node navigation or linear route list; symbols + text; fictional map, no child's real location.
- **Parent role:** Check legend; discuss alternate valid solutions, no demand for shortest route unless objective says so.
- **Stop/off-screen:** One valid plan or assisted demonstration; draw imaginary room map.
- **Completion/measure:** Puzzle explored; specific constraint application, not navigation safety skill.
- **Localization:** Library may need explanation, add familiar community destination edition; no GPS/address data.
- **Assets:** Small verified map, route key, two rule icons/texts, narration/alt descriptions.
- **Compatibility/change:** Current engine no route state; list-choice prototype C/U, route player N, new ledger D; S.

### B15 — Two Lines, My Choice / मेरी दो पंक्तियाँ

- **Age/category/objective:** 8–9, Rhymes; create two meaningful lines, optionally use repeated sound and explain a word choice.
- **Prerequisites:** Can dictate/read/listen to short lines; writing optional; rhyme meaning shown.
- **Rationale:** E11 creative/language goals; D invitation, no automatic creativity score.
- **Instruction:** “Make two lines about something you noticed. They can rhyme, or not.” / “जो देखा, उस पर दो पंक्तियाँ बनाओ। तुक हो सकती है, ज़रूरी नहीं।”
- **Sequence:** Original example → notice word/meaning → optional rhyme alternatives → compose to adult/on paper → share only if willing → end. Six units.
- **Feedback/hints:** “Which word fits your idea?” no best poem; offer familiar vocabulary bank; adult reads options.
- **Accessibility:** Oral-to-adult, paper drawing, select word cards; no microphone/upload or fine-motor requirement.
- **Parent role:** Scribe with consent, preserve child's words, don't upload personal stories to AI.
- **Stop/off-screen:** Chosen line or no line; draw observation, keep poem private.
- **Completion/measure:** Invitation explored; optional word-choice rationale; not talent/intelligence score.
- **Localization:** Separate Hindi/English creative possibilities, no forced literal rhyme; dialect accepted.
- **Assets:** Two example verse cards, optional word bank, scripts; no generated child poem records.
- **Compatibility/change:** Reader-only invitation possible, six units and optional composing interface N/D; use offline composition now; S.

### B16 / pilot S — The Dry Place on the Bench / बेंच की सूखी जगह

- **Age/category/objective:** 8–9, Stories; infer why a character moves a shared paper picture, citing one clue; accept multiple supported explanations.
- **Prerequisites:** Listen/read six brief events, understand rain/roof/paper; narration/recap available.
- **Rationale:** E12 narrative/inferential-language guidance rated minimal + E03 coherent illustration; D story, no inference/prosocial-effect claim.
- **Instruction:** “Read or listen. You can talk about it when the story ends.” / “पढ़ो या सुनो। कहानी के बाद चाहो तो बात करें।”
- **Sequence:** Shared drawing → light rain under adult supervision → wet paper corner/dry bench clue → puppy stands near the dry place → boy asks, puppy steps aside and picture moves to dry bench → resolved boat drawing → optional end discussion. Six narrative pages plus separate parent prompt, not checkpoint quiz.
- **Feedback/hints:** “What clue supports that?” Accept protect paper/make dry space if reason shown; recap exact clue without inventing feelings.
- **Accessibility:** Text/narration/alt, picture detail explained; oral/point/page-reference response; no forced reading exam.
- **Parent role:** One end question, accepts “not sure”; discuss asking permission; no unsupervised rain activity.
- **Stop/off-screen:** Resolution; compare dry/wet paper illustrations, no real child data collection.
- **Completion/measure:** Pages explored; optional evidence-linked inference with support, not kindness/mastery proof.
- **Localization:** Bench/छज्जा/roof explained naturally; public-space/family details neutral; existing boy/puppy names owner approved before assets.
- **Assets:** Six consistent scenes (wet/dry relations accurate), narrator script, accessible descriptions; existing 2D references required.
- **Compatibility/change:** Current five-page reader cannot take this six-page unit drop-in; variable player N, optional prompt U, hi/en and new ID progress D; S. Full pack Part 3.

---

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

---

# Part 4 of 6 — Content handoff, engineering gaps, review and sources

## 16. Proposed content schema and engineering gaps

This schema is **a proposed authoring format**, not an existing Kidsuu API or verified drop-in JSON. Content authoring documents can be prepared now; integration requires reviewed engineering work later. No code changes are authorized by this report. Typescript existing `Question` has only prompt/options/answer; reader `Reading` has ID/age/kind/title/FivePages/version:1. Family API sends only completedSteps/totalSteps for known activity ID. Backend validation accepts totals 1–200, but stored activity total cannot change; player/readings enforce five. Educationally suitable length comes first, compatibility change second.

| Proposed field            | Meaning and validation                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| contentId                 | Stable semantic unit slug; never reuse for unrelated objective                                                                   |
| schemaVersion             | Authoring schema version, independent of educational content version                                                             |
| contentVersion            | Immutable released revision; record changes and compatibility impact                                                             |
| language                  | BCP-47 locale (hi-IN/en-IN proposed); distinguish language from child's home-language identity                                   |
| ageBand                   | Default edition audience, not developmental diagnosis                                                                            |
| category                  | learning/games/rhymes/stories exact enum                                                                                         |
| learningObjectiveIds      | Reviewed objective references; nonempty; no invented official competency codes                                                   |
| prerequisites             | Observable/access prereqs, with simpler fallback                                                                                 |
| contentStructure          | Ordered units, scene/page IDs, optional branches, worked examples, response tasks; stable IDs rather than array index alone      |
| interactionType           | Required player capability, no unsupported pretend mechanic                                                                      |
| narration                 | Spoken/sung mode, script/segment IDs, locale, optional paths/status; stage directions excluded                                   |
| hints                     | Ordered support levels, explicit model/reveal semantics                                                                          |
| feedback                  | Informative responses by condition, optional open-response criteria                                                              |
| accessibilityAlternatives | Text/alt, non-motor, sound-free/reduced-motion, assisted equivalent; note objective changed if necessary                         |
| parentNotes               | Co-use, practised skill, stopping and safe off-screen extension                                                                  |
| progressSemantics         | Explored units, skipped optional units, supported tasks; explicitly no mastery inference                                         |
| evidenceReferences        | Verified source IDs plus narrow rationale; no fabricated citations                                                               |
| editorialReviewStatus     | pending/revision-required/approved; actual review records separately                                                             |
| safetyReviewStatus        | pending/revision-required/approved; never AI-certified                                                                           |
| assetLicenseMetadata      | Rights holder/source/tool generation date/plan/permission/constraints; unknown blocks publication                                |
| publicationStatus         | draft/reviewed/approved/integrated/withdrawn; integrated does not mean publicly released                                         |
| Additional useful fields  | editionId, assetManifest, reviewRecords, knownLimitations, changeHistory, integrationStatus, deviceQAStatus, effectivenessStatus |

Small illustrative JSON exists in each Part 3 pilot. Use its complete ordered scripts plus manifest, not JSON metadata alone. AI structured output helps format conformance, but doesn't check answer truth, safety or curriculum validity. [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [Ajv](https://ajv.js.org/).

### Progress/version policy proposal

Proposed content identity `(contentId, ageBand, language, contentVersion)` packaged as editionId; progress includes child-scoped unit/edition identity. The precise server/database key remains engineering decision. Objective history distinct from navigation history. Language switch must never claim target-language exposure/performance because another language edition is finished. If objective is language-neutral, parent can see linked practice history but not automatically complete other edition. Change age preserves history; newly appropriate edition begins separate exploration unless an explicit compatible migration is approved.

Typo-only compatible revision: educator/engineer designate no changed objective, ordering, correct answer or units; retain prior history with original version and explicit compatibility mapping. Changed target/answers/page sequence/total: create new immutable version/edition, retain historical explored status; do not reset old progress or reinterpret it. Bookmarks can point to stable unit with current approved edition resolution; “continue” pinned to saved old compatible edition or clear parent message when withdrawn. Withdrawn safety-error unit unavailable; preserve history labelled withdrawn, offer reviewed replacement without claiming its completion. Snapshot migration must be explicit, transactional/tested and never erase unknown/newer/corrupt state. No migration is run here.

| Recommendation                                                  | Class   | Inspected evidence/gap                                                                                                                                                 | Expected benefit, risk, effort, validation                                                                                                             |
| --------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Curate unbiased keys/clear prompt language                      | C + S   | count/older shapes always middle; current Question supports changed arrays                                                                                             | Less position guessing; repeated content history risk; low editing; static key audit plus fresh-item observation                                       |
| Match public titles to objective; “spoken” rhyme label          | C + S   | Catalog mixed strands and Sing & wiggle                                                                                                                                | Honest expectations; cosmetic titles not efficacy; low; editorial consistency check                                                                    |
| Optional reader prompts; informative hints, safe skip/model     | U + S   | Common prompt each page; practice generic retry and correct-only lock                                                                                                  | Less disruption/frustration; support event distinction required; small–medium; adult/child usability observation                                       |
| Visual non-reading choices and repeatable practice instructions | U/N + S | Text-only practice; no prompt narration                                                                                                                                | Accessible quantity/shape access; graphic/key errors possible; medium; target-tablet/TalkBack and co-use pilot                                         |
| Variable unit structures                                        | N + D   | FivePages, READING_STEPS, resumeReading; PracticeScreen resume uses completedSteps<5 and Finish label uses step===4; actual end branch already uses questions.length-1 | Natural lengths; old progress compatibility risk; medium; new-state/resume/skip tests and historical fixtures                                          |
| New content library IDs and edition-aware progress              | D       | ACTIVITY_IDS fixed eight; snapshot cardinality eight; server route enum and listProgress LIMIT 8; no language/version                                                  | New library without losing history; schema/storage migration; substantial; isolated contract/snapshot/API migration review                             |
| Differentiate performance/support from explored ledger          | D + S   | ProgressInput only counts; no attempts/hints                                                                                                                           | Honest evaluation; data/privacy risk; moderate; consent/legal and educator-measurement review before recording                                         |
| Hindi locale/voice selection                                    | U + S   | deviceNarration uses language en                                                                                                                                       | Correct adaptation; voice quality/engine processing uncertain; moderate; native-speaker audible-device QA                                              |
| Recorded spoken/song playback                                   | N + S   | expo-speech only, no bundled media player in inspected screen                                                                                                          | Reliable reviewed performance if files distributed; rights/size/offline/cache risk; moderate–substantial; player/stop/lifecycle/airplane-mode QA       |
| Offline content assets                                          | N/D     | SQLite contains family data, not media manifest/cache                                                                                                                  | Predictable offline availability; storage/corruption/download/revoke considerations; substantial; packaged-binary cold launch/integrity/deletion tests |
| Broader curriculum/efficacy claims                              | S       | Samples not curriculum or study                                                                                                                                        | Credible educational evaluation; cannot infer benefit; substantial; qualified study with ethics/statistical design                                     |

Existing upstream tests/security gaps are release prerequisites documented by project, not reasons to change dependencies during research. Source inspection cannot prove real auth or production readiness. Font/motion accessibility has some existing handling; physical-device proof pending.

## 17. Content safety and production-review workflow

| Stage              | Responsible role                                                       | Required output / review criteria                                                 | Approval condition / version rule                                                                     |
| ------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Research           | Research assistant + educator lead                                     | Verified evidence card, population/setting/limitations; separate R/G/P/D/H        | Educator accepts relevant scope; date source packet; do not overclaim                                 |
| Objective          | Educator + owner                                                       | One observable target, prerequisites, language/access demand                      | Target suitable and measurable; objective ID versioned                                                |
| Script             | AI draft + adult editor                                                | Full script, keys, hints, ends; original provenance                               | Editorial completeness before art; draft version                                                      |
| Educational review | Relevant early-childhood/literacy/numeracy specialist                  | Facts, misconceptions, cognitive-load review, feedback/assessment boundary        | Every key/critical fact verified; pending findings resolved, record actual reviewer/date              |
| Safety review      | Child-content editor; psychologist/safeguarding expertise where needed | Conflict, movement, emotion, non-manipulation, data/consent risks                 | No unresolved high-severity safety issue; sensitive units paused; safety version record               |
| Language/culture   | Native Hindi/English education editor                                  | Natural copy, script-specific phonology, vocabulary and cultural adaptability     | Both editions separately approved; no automatic translation approval                                  |
| Accessibility      | Accessibility specialist + adult/device tester                         | Non-colour, sound/motor alternatives, focus/text/motion checklist                 | Equivalent access defined; objective-change alternatives named; versioned QA                          |
| Implementation     | React Native engineer                                                  | Reviewed package adapter/player integration, paths/assets/progress migration plan | Tests pass, historical progress preserved; content and app commit pinned                              |
| Usability test     | Researcher + consenting caregiver/child                                | Approved plan, assent/stop rules, observed issues not inferred attention          | Ethical readiness first; resolve critical barriers; records securely retained under plan              |
| Pilot evaluation   | Educator/researcher                                                    | Fresh tasks, independent/support mode, delayed/transfer where appropriate         | Publish only narrow supported claims; usability alone insufficient efficacy; protocol/results version |
| Publication        | Owner + release engineer                                               | All sign-offs, rights, app/device/production gates, rollback route                | Approved/integrated/device tested all distinguishable; immutable release manifest                     |
| Revision           | Content lead + affected reviewers                                      | Error log, root cause, units affected, correction/withdrawal                      | Re-review every affected fact/key/safety/language; new content version, history kept                  |

Original provenance: save AI prompt/model/tool/date, inputs (approved licensed references only), drafts and human revisions. Copyright ownership by contract is distinct from statutory copyrightability/non-infringement. AI originality/similarity check only flags risk; doesn't clear rights. Do not request famous franchise imitation, living artist copying, recognizable song/tune, scraped children's photos or unlicensed voice. Existing artwork license and permission to upload as reference must be owner-provided; no assumption ownership implies unrestricted vendor upload. No real child info/voice/photo or private credentials sent to AI services.

### Indian privacy: law vs policy vs best practice

**L:** DPDP Act 2023 defines child as under eighteen; section 9 addresses verifiable parental consent, detrimental processing and tracking/behavioural monitoring/targeted advertising restrictions with defined exceptions. Statute alone isn't proof all sections are already commenced. [Official Act](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf).

**L, phased position in retrieved notifications; comprehensive latest-law clearance pending:** 2025 commencement notification G.S.R.843(E) brings provisions in groups; sections 7–10 (including child section 9) in eighteen-month group. Final Rules G.S.R.846(E) put Rule 10 child consent in eighteen-month group too; some institutional provisions start immediately and Rule 4 after a year. As of 5 October 2026, don't call whole framework fully effective. Date arithmetic from Gazette publication and any later amendments/notifications need lawyer confirmation before launch. Rule 10 requires technical/organizational checks for identifiable adult parental consent; an app PIN/demo gate is not that. Read Rules with December 2025 corrigendum. [Commencement](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf), [Final Rules](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf), [Corrigendum](https://www.meity.gov.in/static/uploads/2025/12/3c7ebbae0e5456f493f486e6845df86b.pdf).

Exception language for education is conditional; Kidsuu shouldn't assume it qualifies as an educational institution or can freely track children. **Qualified Indian legal review required:** current commencement/amendments; lawful bases/consent route and parent identity; profiling/learning events vs prohibited monitoring; notices/languages; deletion/retention and security logs; processors/cloud/AI transfers; other currently applicable Indian law. This report is not compliance certification.

**PL:** Google Play Families requirements concern declared child audience, content/data/SDKs/monetization and store review; they are distinct from law and research ethics. [Official Families policy](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en). No store policy compliance asserted.

**G/D best practice:** minimize data, clear parent control, no ads/trackers in pilot activities, no covert monitoring; adult AI authoring only. **Current operational rule:** no real child data in unencrypted development demo; research with children uses dummy in-app profiles and separately approved secure observations. [UNICEF research ethics](https://www.unicef.org/innocenti/reports/ethical-research-involving-children).

## 18. Prioritized implementation roadmap

Effort is relative authoring/engineering, no price quote. Expected benefits are objectives/hypotheses until measured. Research strength refers to general rationale, not Kidsuu effect.

| Priority / action                                                                                                                                            | Evidence strength                                    | Expected benefit                          | Risk/uncertainty                                            | Effort                                           | Validation                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------- |
| Now: annotate catalog goals/true mode/age co-use; correct spoken-rhyme label                                                                                 | High source inspection; D pedagogy                   | Honest access/expectations                | Labels alone won't teach                                    | Low                                              | Catalog/script editorial audit                             |
| Now: balanced answer positions, accurate shape definitions, one goal per authored draft                                                                      | Moderate E13 + definite source issues                | Reduce guessing/ambiguity                 | New editions can invalidate interpretation of past progress | Low content; version plan needed before shipping | Independent key/distractor check, novel item               |
| Now: adult-mediated existing readers; remove poem tool jargon in drafts; preserve opt-out                                                                    | Moderate E03/E04 + G                                 | Better shared narrative/word experience   | Need actual read-aloud review                               | Low–medium                                       | Editor/native speaker read-through                         |
| Now: four bilingual draft packages; source/style/glossary/rights packet                                                                                      | G oversight + D workflow                             | Reviewable production without scope drift | No qualified reviewer availability yet                      | Medium                                           | Package/coverage checklist; status stays draft             |
| Next: optional page prompts; help/model/finish-later; picture choice and practice narration                                                                  | Moderate/general + D                                 | Lower access/frustration burden           | Feedback/audio/geometry must be accurate                    | Medium                                           | Adults then ethical child usability; TalkBack/rotation     |
| Next: Hindi voice routing and Devanagari QA                                                                                                                  | Framework/G + source gap                             | Language access                           | Engine accent/offline/network uncertainty                   | Medium                                           | Hindi editor plus target tablets                           |
| Next: reviewed pilot batch integrated behind appropriate preview workflow                                                                                    | D + scoped learning evidence                         | Concrete usability feedback               | App production/child-data gates unresolved                  | Medium                                           | Dummy profiles, consented study outside data demo          |
| Later: variable players/edition progress/IDs/storage limits                                                                                                  | Strong source inspection, D design                   | Suitable length/library/history           | Migration can corrupt/reinterpret history                   | Substantial                                      | Engineer-reviewed contracts, old fixtures, lifecycle QA    |
| Later: controlled recorded media/offline packages                                                                                                            | D, E03 limited                                       | Predictable reviewed audio/art            | Rights/size/download/key errors                             | Substantial                                      | Every asset audited; embedded offline binary test          |
| Later: effectiveness evaluation with comparison/retention/transfer                                                                                           | R identifies need; G ethics                          | Defensible narrow claims                  | Sample/context/measurement constraints                      | Substantial specialist work                      | Protocol, ethics, justified sample and transparent results |
| Avoid: migration/mascot redesign, manipulative rewards/streaks, unsupervised toddler claims, generic IQ/brain training, AI-certified curriculum, TTS-as-song | Out of scope/G safety; no supporting Kidsuu evidence | Avoid misrepresentation and harm          | No reason to implement                                      | None                                             | Release lint + editorial gate                              |

## 19. Open owner decisions

Only genuine dependencies: primary launch home-language groups and complete-edition switching behaviour; whether pilot aims shared home use or educator-facilitated use; current approved boy/puppy reference pack and upload permission; reviewer identities/budget/availability; physical tablet model/OS/test build; exact quantity/reading prereq scope; owner policy for private research data/consent/ethics; whether spoken-only first batch is acceptable (recommended minimum); engineering edition/migration design; whether any paid generation is approved. These need answers before relevant production steps, not before completing research drafts. Part 6 gives owner checklist and sequential prompts.

## 20. Verified bibliography

Verification date for all entries: **5 October 2026**. Source publication year is separate from retrieval date. Evidence sources aren't permissions to reproduce textbooks/lyrics. Primary sources below were retrieved through live research. “Abstract/index” means claims kept narrow; no fabricated full-text review. Detailed methodological appraisal and a Hindi-specific systematic review remain future specialist research.

| ID   | Source / publication                                                                                                                                                                                                                                                                                                                    | Access and role                                                                                                                                                                  |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E01  | Kim, Gilbert, Yu & Gale (2021), [Measures Matter](https://journals.sagepub.com/doi/10.1177/23328584211004183), AERA Open                                                                                                                                                                                                                | Article text; digital intervention meta-analysis                                                                                                                                 |
| E02  | Skene et al. (2022), [Guided play systematic review/meta-analysis](https://srcd.onlinelibrary.wiley.com/doi/10.1111/cdev.13730), Child Development                                                                                                                                                                                      | Article/result text; heterogeneous guided-play evidence                                                                                                                          |
| E03  | Takacs, Swart & Bus (2015), [Benefits and pitfalls of multimedia](https://journals.sagepub.com/doi/full/10.3102/0034654314566989), Review of Educational Research                                                                                                                                                                       | Initially abstract/indexed access; relevant article methods/results accessible and rechecked in detailed audit; underlying trials not individually reassessed                    |
| E04  | Dowdall et al. (2020), [Shared Picture Book Reading Interventions](https://pubmed.ncbi.nlm.nih.gov/30737957/), Child Development                                                                                                                                                                                                        | Verified indexed abstract; PubMed full-page access restricted                                                                                                                    |
| E05  | Madigan et al. (2020), [Screen Use and Child Language](https://pmc.ncbi.nlm.nih.gov/articles/PMC7091394/), JAMA Pediatrics                                                                                                                                                                                                              | Indexed article text; direct open browser challenge; observational                                                                                                               |
| E06  | WHO (2019), [Under-five guidelines](https://www.who.int/publications/i/item/9789241550536) and [official summary](https://www.who.int/news-room/detail/24-04-2019-to-grow-up-healthy-children-need-to-sit-less-and-play-more)                                                                                                           | Official guidance and age-specific summary                                                                                                                                       |
| E07  | WHO (2020), [Physical activity/sedentary behaviour](https://www.who.int/publications/i/item/9789240015128)                                                                                                                                                                                                                              | Official guideline; [child evidence summary](https://pmc.ncbi.nlm.nih.gov/articles/PMC7691077/) indexed                                                                          |
| E08  | AAP (2026), [Child-friendly digital world](https://www.healthychildren.org/English/news/Pages/creating-a-child-friendly-digital-world-AAP-releases-new-media-recommendations.aspx); [AAP policy news](https://publications.aap.org/aapnews/news/34088/Beyond-screen-time-Policy-discusses-how-to)                                       | Official public summaries; full policy PDF retrieval blocked; don't claim full independent policy appraisal                                                                      |
| E09  | NAEYC (2020), [DAP position statement](https://www.naeyc.org/resources/position-statements/dap/contents)                                                                                                                                                                                                                                | Official text; [technology position](https://www.naeyc.org/resources/topics/technology-and-media-0/technology-and-interactive-media-position-statement) is professional guidance |
| E10  | NCERT (2022), [NCF Foundational Stage](https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf)                                                                                                                                                                                                                                          | Official PDF, retrieved reprinted edition; India 3–8                                                                                                                             |
| E11  | Ministry/NCERT (2023), [NCF School Education](https://dsel.education.gov.in/sites/default/files/update/ncf_2023.pdf)                                                                                                                                                                                                                    | Official PDF indexed; school-stage framework                                                                                                                                     |
| E12  | IES/WWC (2016; official page revised December 2019), [Foundational reading guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/21/Published)                                                                                                                                                                                               | Official guide/recommendations; English K–3; narrative/inference minimal, sound–letter and decoding strong, connected text moderate                                              |
| E13  | IES/WWC (2013), [Teaching Math to Young Children](https://ies.ed.gov/ncee/wwc/PracticeGuide/18)                                                                                                                                                                                                                                         | Official recommendations with evidence ratings                                                                                                                                   |
| E14  | Leonard et al. (2024), [Retrieval/word learning](https://pubs.asha.org/doi/10.1044/2024_JSLHR-23-00528), JSLHR 67:1530–1547                                                                                                                                                                                                             | Full article text; small preregistered preschool study                                                                                                                           |
| E15  | Wegener et al., [The effects of spacing and massing on children's orthographic learning](https://pubmed.ncbi.nlm.nih.gov/34753014/) (2021 online; 2022 issue)                                                                                                                                                                           | Abstract/index only; delayed recognition benefit, no spelling-recall benefit; no broad/app prescription                                                                          |
| E16  | Kamins & Dweck (1999), [Person versus process praise/criticism](https://pubmed.ncbi.nlm.nih.gov/10380873/), Developmental Psychology                                                                                                                                                                                                    | Indexed abstract; narrow experimental context                                                                                                                                    |
| E17  | Harvard Center on the Developing Child, [Serve and Return](https://developingchild.harvard.edu/key-concept/serve-and-return/)                                                                                                                                                                                                           | Expert developmental-science interpretation, human interaction                                                                                                                   |
| E18  | W3C (2023/2024 recommendation), [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                                                                                                                                                                                                               | Official web standard, native adaptation needs QA                                                                                                                                |
| E19  | UNICEF Innocenti (2025), [Guidance on AI and Children 3.0](https://www.unicef.org/innocenti/reports/policy-guidance-ai-children)                                                                                                                                                                                                        | Official guidance                                                                                                                                                                |
| E20  | UNESCO (2023), [GenAI education/research guidance](https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research?hub=195885)                                                                                                                                                                                         | Official guidance; not app trial                                                                                                                                                 |
| E21  | UNICEF (2013), [Ethical Research Involving Children](https://www.unicef.org/innocenti/reports/ethical-research-involving-children)                                                                                                                                                                                                      | Official research ethics resource                                                                                                                                                |
| L01  | Government of India (2023), [DPDP Act](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf)                                                                                                                                                                                                            | Official law; read with commencement                                                                                                                                             |
| L02  | MeitY (2025), [G.S.R.843(E)](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf)                                                                                                                                                                                                                      | Official commencement PDF                                                                                                                                                        |
| L03  | MeitY (2025), [Final Rules G.S.R.846(E)](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf)                                                                                                                                                                                                          | Official 41-page Gazette PDF, Rule 1/10 and conditional exceptions checked                                                                                                       |
| L04  | MeitY (2025), [December corrigendum](https://www.meity.gov.in/static/uploads/2025/12/3c7ebbae0e5456f493f486e6845df86b.pdf)                                                                                                                                                                                                              | Official corrective PDF                                                                                                                                                          |
| PL01 | Google Play, [Families Policy](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en)                                                                                                                                                                                                                            | Current official platform requirements                                                                                                                                           |
| T01  | OpenAI, [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [image generation](https://developers.openai.com/api/docs/guides/image-generation), [API data controls](https://developers.openai.com/api/docs/guides/your-data)                                                                        | Official current capabilities/privacy; not educational effectiveness                                                                                                             |
| T02  | Google, [structured output](https://ai.google.dev/gemini-api/docs/structured-output), [Gemini API terms](https://ai.google.dev/gemini-api/terms)                                                                                                                                                                                        | Official capability/paid–unpaid data distinction                                                                                                                                 |
| T03  | ElevenLabs, [TTS](https://elevenlabs.io/docs/overview/capabilities/text-to-speech), [pronunciation](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices), [commercial license](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform)             | Official speech/language/rights; per-model/plan limits                                                                                                                           |
| T04  | ElevenLabs, [Music](https://elevenlabs.io/docs/overview/capabilities/music), [music terms](https://elevenlabs.io/music-terms), [data-use opt-out](https://elevenlabs.io/docs/help-center/legal/is-my-data-used-to-improve-eleven-labs-ai-models), [zero retention](https://elevenlabs.io/docs/eleven-api/resources/zero-retention-mode) | Official capabilities and conditional rights/privacy; Hindi singing not specifically confirmed                                                                                   |
| T05  | Krita, [license](https://krita.org/en/about/license/), [PNG format](https://docs.krita.org/en/general_concepts/file_formats/file_png.html)                                                                                                                                                                                              | Official local artwork cleanup/export                                                                                                                                            |
| T06  | Audacity, [record/edit/export](https://manual.audacityteam.org/man/basic_recording_editing_and_exporting.html), [loudness normalization](https://www.audacityteam.org/manual/effects/volume-and-compression/loudness-normalisation/)                                                                                                    | Official audio editing/export capabilities                                                                                                                                       |
| T07  | Ajv, [schema validation](https://ajv.js.org/)                                                                                                                                                                                                                                                                                           | Official validator; semantic checks still custom/human                                                                                                                           |
| T08  | Expo, [Speech](https://docs.expo.dev/versions/latest/sdk/speech/)                                                                                                                                                                                                                                                                       | Official device TTS; installed project behaviour determined by inspected adapter and target device, not latest docs alone                                                        |

Commercial prices, model names, quotas, account availability and terms can change: verify at purchase/generation, save dated terms. No paid plan, tool installation, upload or generation authorized/executed by this research.

---

# Part 5 of 6 — AI production responsibility, tools and SOP

## 23. Research se actual AI content production tak

Owner pehle shared source/style/vocabulary packet ready kare, phir **one unit** ka objective→brief→script→human reviews lock kare. Uske baad scene/audio, structured files, automated checks, integration review, device QA aur ethical usability pilot. Bulk generation review se pehle nahi. Part 3 examples reusable initial pilot packages hain; binaries not generated. AI draft ko app-ready ya educator-approved kehna prohibited hai jab tak actual approval/integration evidence na ho.

Minimum viable setup: available AI assistant for text/proposed JSON; owner/editor + qualified educator/language reviewers; approved reusable 2D references/props; manual local image cleanup; caregiver/editor spoken reading or current optional device TTS; local folders/manifest and validation. **Paid plan assumption nahi.** Optional purchased narration/reference-image generator/music are authoring services, not app runtime dependencies. Children's data/recordings/photos/credentials never upload. Local private repository source only minimum authorized non-secret excerpts; don't dump project into vendor merely to write a rhyme.

## 24. Production responsibility matrix

In this table every output remains draft if required qualified reviewer unavailable. AI checking is risk flagging, never developmental/copyright/child-safety certification. Automated checks mean deterministic checks in proposed authoring tool, not tests already installed in Kidsuu.

| Output                     | AI can draft                                         | AI may flag, cannot certify                    | Automated validation                                            | Adult editor approval                     | Qualified review                                             | Child observation before efficacy claim                  |
| -------------------------- | ---------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| Curriculum/objectives      | Scope map, observable verbs/prereqs                  | Alignment accuracy, sequence gaps              | IDs, prereq cycles, missing objectives                          | Scope completeness                        | Early-childhood educator; literacy/numeracy specialist       | Transfer/prereq fit and later justified study            |
| Briefs/question banks      | Models, items, foils, keys                           | Difficulty, ambiguity, correctness             | Key in option IDs, counts, duplicate/order bias                 | Every item/key/wording                    | Relevant subject educator                                    | Fresh-item performance/support, not taps                 |
| Stories/dialogue/narration | Original page draft, clue map                        | Emotional interpretation, originality          | Page IDs, script/text parity, prohibited claims                 | Narrative/safety/original provenance      | Children's editor/educator; psychologist for sensitive topic | Enjoyment/usability observations; inference claim study  |
| Rhymes/rhythm/movement     | Original lines, spoken cues, optional movement       | Meter/stress, movement suitability, similarity | Text completeness, no mandatory action/scoring                  | Native spoken performance and safe option | Early-years educator/language editor; musician if sung       | Voluntary participation/access; learning outcome study   |
| Game rules/examples/help   | Finite rule set, progression, recovery               | Mechanics teach intended skill                 | Reachable end, keys, no timer/reward traps, paths               | Play through every branch                 | Educator + child interaction designer                        | Can use/stop/recover; learning needs fresh/delayed tasks |
| Illustration/background    | Reference-based candidates/scene brief               | Counts/shapes/identity/safe scene              | Dimensions/format/hash/path; deterministic shape geometry       | Every scene/count/identity/rights         | Educator checks instructional art; accessibility reviewer    | Perception/touch/usability, no image-learning claim      |
| Spoken/sung audio          | Exact-script candidate; singing only capable service | Pronunciation/omissions/style; rights          | File decode/duration/peak/loudness/script alignment flag        | Listen 100%; text-equivalent and rights   | Native language reviewer; music specialist for song          | Comfortable comprehension/usability; no therapy claim    |
| Hindi/English adaptation   | Parallel goal-preserving editions                    | Dialect/culture/phonology                      | Locale, script/grapheme tests, number/key parity                | Native editor every edition               | Language-learning/literacy specialist                        | Families with intended language exposure                 |
| Parent/offline notes       | Explanation and safe extension                       | Accessibility/feasibility                      | Required notes, no mastery/medical claim                        | Clarity/safety                            | Educator/safeguarding reviewer where needed                  | Can caregiver implement, optionality clear               |
| JSON/manifest              | Serialize locked scripts/data                        | API drop-in compatibility                      | JSON Schema, semantic refs, paths, hashes, statuses             | No hidden content drift                   | Engineer accepts loading/progress; rights reviewer           | Device/use observation; no efficacy inference            |
| Review/revision            | Issue lists, before/after and dependency impact      | Human approval, safety or efficacy             | Required signatures/statuses, version diff, impacted-unit index | Editor accepts resolved evidence          | Required specialist re-signs affected scope                  | Re-test changed interaction as protocol requires         |

Unavailable educator/language/safety expertise: status `draft`, `editorialReviewStatus: pending`, `safetyReviewStatus: pending`; adults may desk-test internal prototype with dummy data. No public release, toddler-independent label, curriculum-validation or child-learning-effect claim. Human approval must name real reviewer/date/scope; AI never generates pretend signature.

## 25. Practical capability-based AI toolchain

Verification **5 October 2026**; costs below planning assumptions, not subscription quotes. Tool support/terms recheck at generation; no installation/subscription performed. Owner can use manual workflow on failure, not repeatedly pay for broken generations.

| Tool/approach and exact role                                                      | Why fits / inputs→outputs                                                                                            | Limits and Hindi/English checks                                                                                                                                                                      | Rights/privacy                                                                                                                                                                                                                 | Cost/fallback                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Available AI text assistant + local editor: curriculum/brief/scripts/parent notes | Reusable prompts + evidence cards/goal/prereqs→Markdown full bilingual drafts                                        | Cannot certify educator/safety/translation; hallucinated references and awkward Hindi possible; editorial comparison required                                                                        | Only fictional content, minimal authorized source; owner's actual service settings/terms checked, no zero-retention assumption                                                                                                 | Use existing access within quota, incremental spend can be ₹0; fallback human outline/write/review                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Optional OpenAI API Structured Outputs: locked-script JSON serialization          | JSON Schema + approved script/data→schema-constrained JSON; separate authoring step, no app migration                | Format adherence != correct keys/facts; handle refusals/truncation; prompt/version snapshots saved. Hindi text still human checked                                                                   | API data controls differ from consumer chat; default abuse logs may retain content; no zero retention assumption, check endpoint/organization eligibility                                                                      | Pay-as-used only if owner approves cap; model/price not assumed; fallback plain generated JSON + local validator/manual correction. [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [data controls](https://developers.openai.com/api/docs/guides/your-data)                                                                                                                                                                                                                                                   |
| Optional Gemini API structured output: alternate serialization/drafting           | Schema+same locked brief→JSON; supports subset of JSON Schema                                                        | Not proven superior at Hindi/educational accuracy; semantics can be wrong; parity check                                                                                                              | Unpaid-service terms can allow submitted/generated content for service/model improvement; paid-service terms differ. Do not upload confidential references unless approved vendor terms meet needs                             | Use account's actual quota if available, no assumed free entitlement; human/local fallback. [Schema docs](https://ai.google.dev/gemini-api/docs/structured-output), [terms](https://ai.google.dev/gemini-api/terms)                                                                                                                                                                                                                                                                                                                                    |
| OpenAI reference image editing/generation: candidate supporting 2D scene          | Approved licensed boy/puppy references + exact scene brief→PNG/other supported raster candidate; edit loop possible  | Recurring identity, exact count/layout/text can drift; no character guarantee. Hindi/English instructional text excluded, overlay reviewed separately                                                | Commercial ownership/non-infringement must be checked against actual service agreement and reference licenses; neither guaranteed. Only licensed fictional references; API retention controls checked                          | Optional capped paid generation; stop after bounded repairs; lower-cost reuse approved character cutouts + manually drawn props; human illustrator fallback. [Official image docs](https://developers.openai.com/api/docs/guides/image-generation)                                                                                                                                                                                                                                                                                                     |
| Krita local cleanup/composition/export                                            | Licensed scene/cutouts→layered .kra master + flattened PNG, manual count repair, crop/transparency                   | Doesn't certify rights or educational geometry; inspect Hindi overlay rendering separately in app, not bake text into art                                                                            | Software permits commercial creation; rights of imported material separate. Local files, skip cloud upload; maintain source/license manifest                                                                                   | No software purchase needed; manual drawing/compositing fallback, existing owner editor equivalent. [License](https://krita.org/en/about/license/), [PNG](https://docs.krita.org/en/general_concepts/file_formats/file_png.html)                                                                                                                                                                                                                                                                                                                       |
| Existing Expo device speech: spoken prototype narration                           | Fixed reviewed editorial text + locale/voice engine→device spoken output; matches app's current supporting approach  | Inspected language currently en; Hindi routing needs UI/adapter work. Engine pronunciation/offline/network varies; no singing/recorded export guarantee                                              | Only fixed scripts, no child nickname/progress; engine may process off-device, review installed engine policy                                                                                                                  | Lowest extra vendor-generation spend; adult read-aloud fallback. [Expo Speech](https://docs.expo.dev/versions/latest/sdk/speech/)                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Optional ElevenLabs TTS: recorded narration authoring                             | Locked English/Hindi script+licensed adult voice+pronunciation aliases→speech WAV/MP3 (format/quality plan-specific) | Hindi listed for multilingual models; still test accent/schwa/matras/names, dictionary support differs by model/tool. Alias fallback, sentence retake; don't promise perfect phonemes                | Free output is noncommercial; paid/beta restrictions require actual license check. Choose permitted stock adult voice; no child/adult cloning without permission. Data retained by default; opt-out != deletion/zero-retention | Optional paid generation only after commercial plan approved; no assumed subscription. Adult authorized recording + Audacity fallback. [TTS](https://elevenlabs.io/docs/overview/capabilities/text-to-speech), [pronunciation](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices), [license](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform), [data use](https://elevenlabs.io/docs/help-center/legal/is-my-data-used-to-improve-eleven-labs-ai-models) |
| Optional Eleven Music: actual sung/music draft, only after lyrics lock            | Original reviewed lyrics+desired gentle melody/structure→vocal/instrumental WAV/MP3                                  | Official docs support vocals/multilingual output, but Hindi singing specifically not established here; lyric additions/mispronunciation/melody complexity possible. Music specialist listens/reviews | Music-specific terms and subscription/content-generation date govern allowed in-app uses; don't infer from TTS license. No recognizable-song/style/voice imitation or unlicensed reference audio                               | Optional upgrade, commercial terms verified before any use; exact price/account quota unverified. Spoken-rhyme fallback recommended first batch, or authorized human composer/singer. [Capability](https://elevenlabs.io/docs/overview/capabilities/music), [music terms](https://elevenlabs.io/music-terms)                                                                                                                                                                                                                                           |
| Audacity local recording/editing/loudness                                         | Licensed adult recordings/generation→edited master WAV + delivery candidate; normalize, trim, consistent segments    | Automatic leveling doesn't make words correct or listening volume safe; no severe compression/robotic stretching. Native listeners compare all segments                                              | Rights/voice release saved separately; use local workflow, don't invoke optional cloud sharing. Software license doesn't grant imported audio rights                                                                           | No software purchase assumption; owner audio editor/manual retake fallback. [Recording/export](https://manual.audacityteam.org/man/basic_recording_editing_and_exporting.html), [loudness](https://www.audacityteam.org/manual/effects/volume-and-compression/loudness-normalisation/)                                                                                                                                                                                                                                                                 |
| Local JSON Schema/Ajv + semantic linter: packaging QC                             | Proposed schema+JSON+manifest→errors by file/unit and readiness report                                               | Schema proves structure only; custom checks key/ref/count declarations, files; human checks visuals/pronunciation/safety                                                                             | Local content validation sufficient; no child data. Open-source tool license/version checked before optional adoption; no Kidsuu dependency installed now                                                                      | Local validator without service spend; manual checked JSON/table fallback for initial prototype. [Ajv](https://ajv.js.org/)                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Local folders + Git or owner-approved archive: provenance/versioning              | Scripts/master assets/manifests/rights/reviews→immutable release snapshot with hashes                                | No Git proof of review; don't put child study/credentials into repo; large originals/exports policy engineer sets                                                                                    | Keep licensed source references restricted; adult study data separate; backups/access/retention owner approved                                                                                                                 | Existing local tools, no paid DAM required; manual dated immutable archive fallback                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

Recommendation rationale: no need for a many-tool stack. Text assistant + manual reference composition + spoken fallback is viable for drafts. Recorded songs and elaborate media optional; educational review investment precedes paid assets. Comparative Hindi quality of vendors was not benchmarked. TTS output can sound fluent and still teach/pronounce a word incorrectly.

## 26. Numbered end-to-end SOP

Each row is one step. `Approval` authorizes next production stage **only**, not a public release. File names refer to proposed per-unit folder in section 31. AI instruction is literal task direction that combines with corresponding complete prompt P01–P20 in Part 6. Owner needn't know coding to run script/brief prompts; engineer controls integration.

| # / purpose                        | Exact inputs                                                                             | AI instruction                                                                     | Output saved                             | Acceptance criteria                                                                   | Failure examples                                       | Revision action                                         | Approval                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------- |
| 1 Select band/domain: bound scope  | Owner audience/use mode; Part 1 age matrix; curriculum map                               | “List candidate band/domain pairs; explain access needs, mark uncertainty.” P01    | planning.md                              | One band/domain and shared/independent intention; no framework drift                  | “2–9 all children” unit                                | Split scope                                             | Owner+educator                                    |
| 2 Select observable objective      | Candidate domain; E cards; band                                                          | “Choose one measurable action with fresh task and prereqs.” P02                    | objective.md                             | Concrete target, no IQ/brain/general attention claim                                  | “Improve intelligence”                                 | Rewrite as specific relation                            | Educator                                          |
| 3 Prereqs/language demand          | Objective; selected locale; family-language assumptions                                  | “Separate target skill from reading/motor/language demands.” P03                   | brief.md prereqs                         | Non-reader or assisted access defined; skill gaps not labels                          | English text toddler autonomy                          | Co-use/visual redesign                                  | Educator+language editor                          |
| 4 Difficulty/scope/length          | Prereqs; item examples; healthy-use section                                              | “Choose minimal useful cycle and H duration; include early stops.” P03             | brief.md scope                           | No forced five, time/streak pressure; difficulty described by features                | Add ten rounds to lengthen use                         | Cut to coherent cycle                                   | Educator+owner                                    |
| 5 Format choice                    | Objective/mechanics; inspected player limits                                             | “Choose category where action supports target; classify player gap.” P03/P06       | format-decision.md                       | Learning mechanic genuine; compatibility honest                                       | Quiz called memory game                                | Rename or define real mechanic                          | Editor+engineer for gap                           |
| 6 Educational brief                | Approved 1–5; source cards; safe contexts                                                | “Fill all brief fields, objective/prereqs/errors/access/stop/assets.” P03          | brief.v0.1.md                            | Every blueprint field; no fabricated evidence                                         | Vague make engaging                                    | Add exact task/cue/example                              | Educator                                          |
| 7 Full first draft                 | Locked brief; chosen category                                                            | “Write all child copy/logic, adult notes and pending reviews.” P04/05/06/07        | script.v0.1.md; interactions.json draft  | Complete sequence/hints, one objective; not merely ideas                              | Missing feedback/end or broad mixed quiz               | Fill/simplify                                           | Adult editor, draft only                          |
| 8 Accuracy/load desk review        | Draft; keys; evidence packet                                                             | “Flag facts, ambiguity, hidden demands, position bias; don't approve.” P15         | reviews/ai-accuracy.md                   | Every key independently human checked; model/fresh task clear                         | AI says all scientifically proven                      | Remove claim; verify each item                          | Qualified educator                                |
| 9 Development/safety               | Scripts/all branches; age/co-use; policy                                                 | “Audit shame/threat/movement/consent/pressure; list fixes.” P16                    | reviews/safety.md                        | No critical issue; stop/help always acceptable                                        | Sad mascot exit, mandatory shout                       | Neutral exit; optional safe cue                         | Child-content reviewer; specialist when sensitive |
| 10 Language/cultural revision      | Reviewed source draft; glossary; locales                                                 | “Adapt meaning and target, don't literal translate phonics.” P09/P10               | script.en.md; script.hi.md; glossary.tsv | Natural native read-through; equivalent intended concept, correct script              | Wrong matra or Hindi cat/hat lesson                    | Independently author sound set; review                  | Hindi/English specialists                         |
| 11 Plan scenes/interactions        | Locked bilingual scripts, approved refs/styles, player constraints                       | “Create exact scene map, count/geometry and UI overlay separation.” P11            | scenes.md; interaction-spec.md           | One visual purpose, accurate counts, no distracting decoration                        | Wrong counted background objects                       | Specify countable set/exclude decor                     | Editor+educator+engineer                          |
| 12 Generate/reuse visual assets    | Approved scene map; licensed actual references; upload permission                        | “Generate one reference-based candidate; preserve identity; no text.” P12          | assets/source; provenance; candidate PNG | Human checks each character/count/shape; reject missing refs                          | New puppy colour/clothes, 4 instead of3                | Bounded targeted repair; approved cutout/manual compose | Owner art approver+educator                       |
| 13 Narration/song generation/check | Final script hashes; voice/license; pronunciation notes                                  | “Prepare exact narration; separate spoken/song; omit stage directions.” P13        | audio/source; script; retake log         | Every word native-listened, rights and text-equivalent; no auto-generated approval    | Added lyric, omitted negative, cloud child voice       | Sentence retake; spoken fallback; don't clone           | Language/audio reviewer+rights owner              |
| 14 Structured package              | Locked scripts/logic; proposed schema/manifest; asset statuses                           | “Serialize without rewrite, mark missing files and approvals honestly.” P14        | content.json; manifest.json              | Full content, not metadata-only; stable keys/locale/version                           | New wording in JSON; fake asset path exists            | Compare script; not-generated state                     | Editor+engineer                                   |
| 15 Validate all references         | Package/schema; objective/source glossary; files                                         | “Run/report syntax+semantic checks; never override failed gate.” P20               | validation-report.json/md                | Keys, units, paths, unique IDs, status/source references; missing assets block final  | Key points absent option; hash mismatch                | Fix source and regenerate; revalidate                   | Engineer/editor checks own scope                  |
| 16 App compatibility assessment    | Actual branch contracts/loading/screens/progress; package                                | “Map supported/gaps; propose adapter plan; do not edit in research.” P20           | compatibility.md                         | C/U/N/D classified; edition history and offline limits explicit                       | Claim import JSON already loads                        | Engineering design/review separately                    | React Native engineer                             |
| 17 Adult/editor final review       | All files/assets/reports; human review records                                           | “Assemble evidence, pending gate list; no fake signature.” P17/P20                 | reviews/signoffs.json pending or actual  | All per-unit critical and each language approvals real                                | AI self-review sets approved                           | Revert to draft; secure real review                     | Owner+relevant specialists                        |
| 18 Ethical small usability pilot   | Reviewed prototype; plan/consent/assent; secure notes; dummy app profile                 | “Prepare short observation tasks and stop rules; no attention inference.” P19      | study-plan.md, secure external notes     | Ethics route cleared, informed parent, child may decline; no real data in demo        | Record child voice into AI; app signup with real child | Remove capture; secure minimal study setup              | Researcher/ethics reviewer+parent/ongoing assent  |
| 19 Revise observed problems        | De-identified approved notes; exact versions; no child identities                        | “Separate observed issue from hypothesis; change minimum necessary.” P18/P19       | revision-log.md; new script/data version | Every fix traceable; no invented result, rechecks affected areas                      | Assume learning because smiles                         | Reframe usability; fresh measurement plan               | Educator/editor; re-pilot as needed               |
| 20 Approve/version/release         | Final sign-offs; integrated build/tests; actual device results; production/privacy gates | “List pass/fail evidence; propose immutable release only when all gates pass.” P20 | release-manifest.json; change history    | Reviewed content + integrated/device-tested/rights + actual production gates all pass | Public ship draft with unresolved auth                 | Stop publication; retain internal prototype             | Owner+release engineer+legal/privacy review       |
| 21 Monitor/correct/withdraw        | Approved issue channel; no child PII; release dependency index                           | “Find affected units, severity, correction route; preserve history.” P17/P20       | issue/withdrawal log + revised release   | Critical errors contained; all related units checked; parent notice if warranted      | Silently change answer under completed ID              | Withdraw version; reviewed replacement/mapping          | Content lead+owner+engineer                       |

No external release/upload/send occurs under this research task. SOP is a future execution guide; source edits require separate content/integration authorization. Qualified approval unavailable means stop dependent asset/publication stage, continue low-risk drafting with pending status.

---

# AI production prompt library

## 27. Twenty reusable copy-paste prompts

Har code block self-contained hai. Bracket fields paste/fill karein; unavailable/pending explicitly allowed, so assistant does not guess. Common constraints deliberately har prompt mein included hain. Evidence packet = relevant narrow source card from Part 1 plus verified URL/limitations; no need entire copyrighted paper paste karna. `[REVIEW_RECORDS]` defaults pending, `[APPROVED_REFERENCES]` defaults unavailable, `[APP_CAPABILITIES]` must distinguish inspected facts from supplied assumptions. P01/P02 may use objective “not selected”. No secret/child data.

### P01 — Curriculum-to-content planning

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Map the supplied curriculum/source packet to a SMALL first content batch, not a complete instant validated curriculum. If objective not selected, choose candidate objectives and mark proposed. Distinguish policy alignment, research and product judgment. Build prerequisite links and reinforcement across four categories; keep language-specific literacy separate.
Output: table unitId/band/locale/one objective/prereqs/category/exact interaction/other-category reinforcement/off-screen transfer/evidence scope/C-U-N-D-S class/reviewer/dependency; followed by gaps, first-unit order and saveable curriculum-plan.md.
Acceptance: actionable narrow goals, young co-use, workload/review realistic, no invented NCERT competency IDs. Prohibit generic “make engaging”, forced weekly streak, category count as educational evidence or app support claimed without inspection.
```

### P02 — Age-specific learning-objective selection

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Select ONE objective for supplied age/language/domain; if objective not selected, propose up to three and choose a conservative draft candidate with reason. Separate conceptual target from reading, speech, motor and language demands; choose fresh-task observation.
Output: objective card with verb/referent/observable response/prereqs/examples/non-examples/common misconception/access alternative/co-use/what not measurable/source limits/support-needed variant/extension.
Acceptance: target testable by low-pressure fresh example; not a milestone diagnosis. Prohibit early-reading pressure, age×minutes attention formulas, silence=failed understanding, adult research extrapolated silently. Missing educator alignment remains pending.
```

### P03 — Educational activity brief

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Turn objective into complete brief. Choose format on educational grounds and actual supported interactions. Specify minimal coherent length; duration label design hypothesis. Include worked example, guided/independent task, hints, stop and transfer when appropriate.
Output Markdown brief: title, ID/version, band/locale/category, objective, prereqs, rationale+limits, full instruction, ordered units/action/key, foils/misconceptions, hint ladder, feedback, access, parent role, safe offline, completion semantics, legitimate measurement, localization, exact asset needs, compatibility/gaps, reviews. For Learning, also provide a separate COMPLETE ordered child/narration-script table for introduction, worked example, guided try, fresh independent opportunity, transfer check and end; include every correct/error/help/skip/exit branch. This remains a draft pending educator review; do not stop at a brief or question bank.
Acceptance: every field filled or explicit blocker, no five-step padding. Prohibit mixed-objective quiz, current-engine capability invented, repeated tapping as mastery.
```

### P04 — Story writing

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Write original complete story for selected band/objective. Use clear character goal/obstacle/actions/resolution, relevant vocabulary, mild age-appropriate conflict and optional meaningful end conversation. First read may be uninterrupted enjoyment. If actual refs unavailable, scene plan only.
Output: page table ID/full English or Hindi text/narration/illustration brief/alt; character/clue/vocabulary map; optional prediction or end prompt accepting reasoned alternatives, support response, parent/offline note; length rationale and pending reviews.
Acceptance: coherent enjoyable narrative, no page quiz gate, no forced moral/feeling certainty; approved characters preserved, supporting cast not replacement identity. Prohibit shame, unsafe unsupervised behaviour, therapy claim or copied franchise plot.
```

### P05 — Rhyme writing

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Produce original language-native short rhyme/spoken rhythm with one learning purpose. Separate written lyrics, spoken narration, rhythm invitation, optional song brief and safe optional movement. Actual native aloud check required; don't claim perfect meter from AI counts.
Output: complete verses in selected locale; repetition/rhythm/stress notes; non-motor/quiet/seated options; caregiver cues outside lyrics; narration-only text; optional sung-task specification labelled not-generated; parent/offline/completion and rights review checklist.
Acceptance: natural words, optional participation, clear rest ending. Prohibit device TTS called singing, forced shout/jump/clap/smile, recognizable tune/lyrics, unnatural Hindi for English rhyme pattern. If singing unavailable keep explicitly spoken version.
```

### P06 — Educational game design

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Design finite game where target skill is inside mechanic. Define learning purpose of every action; one-rule demonstration, gradual relevant difficulty, retries/undo/show model and natural end. Distinguish text-choice prototype from new-player mechanics.
Output: goal/mechanic/complete rules, ordered state-transition table with correct/error/help/skip/exit, worked round plus fresh rounds, keys, difficulty and non-timed/non-motor variants, rewards as task closure, parent/offline, measurement limits/assets/engineering class.
Acceptance: child can recover and stop; every branch reaches safe end; no broad memory/IQ claim. Prohibit quiz merely renamed game, lives/penalties, autoplay, loot/streak/currency compulsion or unimplemented engine implied available.
```

### P07 — Question and distractor bank

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Draft [ITEM_COUNT] items (if absent use three illustrative draft items) for ONE objective with matched difficulty. Provide worked example separately; at least one fresh-context transfer item. Each distractor tied to plausible misconception, equal salience, one correct ID unless explicit open answer.
Output JSON/table itemId/prompt/narration/visual brief/optionIds+texts/correctOptionId/explanation/distractor reasons/support/fresh-example marker/locale requirements; answer-position distribution report.
Acceptance: human verifies every key, no repeating predictable position or absurd foil; response doesn't rely on unrelated reading/culture. Prohibit generation of scores/mastery from correct-after-retries. Count/geometry claims in illustrations must be independently checked.
```

### P08 — Supportive hints and error feedback

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Write concise informative feedback for every supplied response condition and common misconception; ladder repeat instruction→relevant feature cue→worked model. Separate asking-help/trying-strategy/leaving/returning/finishing. Avoid false observation claims.
Output condition table English/Hindi (selected locale full; alternate if brief requires)/trigger/visible cue/support level/progress effect; repeated-difficulty offer and accessible quiet versions.
Acceptance: practical information, no shame/overpraise/intelligence label, help doesn't reduce access, modelled success never independent. Prohibit “try again” alone as full instructional strategy, punitive sound, guilt mascot or fabricated child action. Missing error logic flagged rather than invented as current app behaviour.
```

### P09 — Hindi localization

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Adapt supplied reviewed source to natural hi-IN with same conceptual target, not literal translation. For literacy/sound objective design Hindi-specific example set with specialist review; do not map English phonics by word translation. Identify home-language/cultural uncertainty and intended code-switching.
Output full Devanagari script/page and feedback table, glossary/pronunciation notes, changed-example/key parity report, matra/conjunct/font/TTS QA cases, parent/offline adaptation, outstanding language-specialist decisions.
Acceptance: meaning and correct quantity/logic retained, natural spoken register, no universal India=Hindi assumption. Prohibit unverifiable phonology/schwa rules, dialect shaming, same rhyme key reused after translation or pretend native review. Current en narrator adaptation must be flagged.
```

### P10 — English localization

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Adapt supplied reviewed content to simple en-IN suitable to actual oral/reading exposure. Keep Indian familiar contexts without accent caricature; separate English phonics prerequisites from general vocabulary. Preserve concept and explain any example change.
Output full child/narration/feedback/parent texts; vocabulary/pronunciation glossary, decoding-scope check if applicable, cultural alternatives, key/logic parity, missing review questions.
Acceptance: clear short instructions, non-reading access where needed, no English superiority claim; native/editor read-through pending. Prohibit importing unfamiliar Western vocabulary unnecessarily, correcting home-language maths response as conceptual error, or asserting tested English comprehension without observations.
```

### P11 — Scene-by-scene illustration plan

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Plan visuals from LOCKED scripts. Before generation map every scene's educational purpose, exact object count/shape/spatial relations, continuity and approved-reference usage. Keep text separate native overlay; minimise unrelated decoration.
Output scene table ID/script line/purpose/objects and exact counts/pose/composition/character refs/continuity/alt/overlay/access variant/export candidate; precise prompts and every-scene human checklist.
Acceptance: no scene adds answer clue unintentionally; varied contexts don't alter objective; unavailable refs block character drawing. Prohibit new mascot, invented reference traits, decorative counted stars, burned-in instructional Hindi or unverified device export specs treated fixed.
```

### P12 — Reference-based visual generation

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Generate ONE candidate scene only if actual required approved reference images and upload permission are attached. Otherwise produce exact visual prompt and missing-input list, no invented character. Use [SCENE_ID_AND_PLAN] (if absent choose no scene and wait for plan).
Output candidate asset if tool available, plus intended path/dimensions/format/transparent flag/reference IDs/tool/date/provenance and checklist; no file existence claim without actual output. Keep exact 2D traits and plain educational centre, no embedded text/numbers, no new animation workflow.
Acceptance: human side-by-side identity/count/shape/continuity review pending; after two failed repair cycles propose approved-cutout/manual composition. Prohibit guaranteeing consistency/copyright, silently replacing approved production assets, artist/franchise imitation or fabricated download links.
```

### P13 — Narration preparation and pronunciation review

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Convert LOCKED final script into exact narration segments; song only if specifically approved capable tool/licensing, otherwise spoken fallback. Preserve approved words; directions separate, no child data/voice cloning.
Output unit/locale/version filenames, narration-only text, pause/emphasis notes, voice criteria, pronunciation lexicon and retake checklist, text-equivalent, required rights, not-generated statuses. If audio files supplied, flag suspected mismatches and require native 100% listening; don't approve pronunciation automatically.
Acceptance: script hash alignment, spoken vs sung clearly labelled, no omitted/added words, volume targets provisional and device QA pending. Prohibit TTS=song, perfect Hindi promise, exporting unlicensed voice/audio or treating transcript alignment as native pronunciation certification.
```

### P14 — Structured content/JSON generation

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Serialize supplied LOCKED content without creative rewriting using [SCHEMA] (if absent use Part 4 proposed authoring fields and label proposed, never current API). Include full ordered text/logic, correct IDs/explanations, hints/feedback/access/parent/progress/source/review/asset statuses.
Output valid UTF-8 JSON, asset manifest, script-to-JSON parity table and schema/compatibility blockers; missing binaries not-generated with null hash, no placeholder fake files.
Acceptance: keys/reference/locale/version complete; schema success doesn't prove pedagogy; human statuses pending unless actual records supplied. Prohibit fake reviewer signatures, approval inferred from AI, hardcoding five steps, silently resetting progress or claiming drop-in current API.
```

### P15 — Educational accuracy review

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Audit supplied draft against objective, source packet and known learner/access needs. Independently reason through EVERY answer/foil, model, number/shape illustration declaration; facts requiring external verification marked. Separate evidence findings from design preference.
Output issue table severity/exact unit/claim or key/source verification/specific fix; objective drift/load/prereq/misconception analysis, unsupported claims list and proposed revision without approval.
Acceptance: all keys reviewed, uncertainty explicit, no invented sources/effect sizes or research consensus. Prohibit own review as educator certification, curriculum alignment as efficacy, guessed correct image counts without seeing asset, or adult retrieval research as toddler proof.
```

### P16 — Child safety and accessibility review

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Audit all supplied screens/branches/audio/illustration plans for fear/shame/guilt/pressure/movement risk/privacy, non-reading and motor/sensory access. Use age matrix; 2–3 caregiver shared. Check Help/Repeat/Stop, no-colour-only, untimed alternatives, sound/motion, text/alt and native-focus QA needs.
Output every-unit issue table severity/trigger/impact/exact repair/human-specialist need; accessible equivalent vs changed objective; unmet device/review gates.
Acceptance: critical risks resolved before child pilot/publication; specialist and actual device reviews remain pending. Prohibit diagnoses, attention/psychological inference, consent fiction, claim WCAG native certification, mandatory movement or AI safety approval.
```

### P17 — Cross-content consistency review

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Compare [BATCH_FILES] (absent means only supplied units, no invented library) against curriculum/glossary/style/feedback/schema and provenance. Check duplicates, key positions, prerequisites, age/locale editions, characters, scope and version dependencies.
Output dependency/issue table affected units/shared root cause/critical vs cosmetic/fix/re-review scope; reference-status report; actual versus assumed coverage.
Acceptance: all critical keys/safety/rights each checked, sampling only declared noncritical template cosmetics; don't automatically merge meaningful repetition. Prohibit global clean-bill statement from samples, language parity implies same phonics, or silently correcting released content history.
```

### P18 — Revision after parent/educator feedback

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Revise only based on supplied anonymized authorized feedback. Separate reporter's observation, interpretation and preference; don't invent consensus or child outcomes. Prioritise accuracy/access/safety over longer engagement; retain objective unless reviewer recommends reviewed change.
Output feedback→issue→revision→reason→affected script/assets/keys/version; full revised content and unchanged-scope note, pending re-reviews and measurement limits.
Acceptance: traceable minimal fixes, private child details removed, educational conflicts sent to qualified reviewer, no false efficacy claim. Prohibit treating parent enjoyment as mastery, adding rewards to keep child longer, fake approval or covert additional analytics.
```

### P19 — Revision after child usability observations

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Use only supplied de-identified observations and approved protocol; if none, produce observation plan/questions, not pretend results. Distinguish inability to access instructions, accidental taps, adult support, refusal, frustration and conceptual task error without diagnosing.
Output observed-issue table evidence/unit/support/context/alternative explanation/proposed fix; fully revised affected script/logic, new version and re-pilot plan. Include ongoing assent/stop/minimal-data/secure-notes requirements; current demo dummy-only.
Acceptance: no attention inferred from taps/gaze, no emotional diagnosis, no effectiveness inferred from small usability sample; consent/ethics before study. Prohibit inventing child quotes/test outcomes, uploading voices/photos/PII, pushing past refusal or marking unobserved improvements passed.
```

### P20 — Final packaging and release-readiness review

```text
You are an AI drafting/review assistant, not a credentialed educator, psychologist, lawyer or rights certifier.
Project: Kidsuu, ages 2–9 (2–3, 4–5, 6–7, 8–9), existing React Native + Expo, tablet portrait/landscape, categories Learning/Games/Rhymes/Stories. Preserve existing approved 2D boy/puppy and clay identity; no Flutter, 3D, character redesign or animation pipeline.
Inputs (fill each; “not selected”, “unavailable” or “pending” is valid): age band [AGE_BAND]; language/locale [LANGUAGE]; primary observable objective [OBJECTIVE]; prerequisites/use mode [PREREQUISITES_AND_CAREGIVER_ROLE]; brief/current draft [BRIEF_OR_DRAFT]; verified evidence summaries+URLs+limits [EVIDENCE_PACKET]; actual player/contracts access facts [APP_CAPABILITIES]; vocabulary/cultural notes [GLOSSARY]; actual approved style/character files+rights/upload permission [APPROVED_REFERENCES]; actual review/observation evidence [REVIEW_RECORDS]; scope/version [UNIT_ID_AND_VERSION].
Conservative defaults: ages 2–3 caregiver-shared; non-reading response access for young children; untimed, optional participation/help/stop; one main objective; model→supported try→fresh example where appropriate; no forced five steps. Completion is exploration, not mastery. Text-to-speech is spoken, not singing. No shame, intelligence labels, guilt/sad-mascot exit, streaks, gambling rewards, compulsory movement, “learning styles”, IQ/brain/therapy claims or child surveillance.
Use Hinglish explanation, simple English child copy and natural Devanagari Hindi. Use fictional inputs only; no real child identifiers/voices/photos or credentials. If essential inputs missing, list precise blockers and continue only independent draft work, marking assumptions; do not invent character traits, facts, sources, assets, approvals or child-testing outcomes. AI checks never approve publication. No repository edits, uploads, purchases or release without separate authorized workflow.

Task: Assemble evidence-based readiness decision from actual files/reviews/integration/device results. Validate schema/keys/unit IDs/source IDs/assets/paths/hashes/locale/script parity/version/change log; list actual tool checks versus recommendations. Check public release separately from package readiness.
Output manifest, file inventory, pass/fail/pending gate table, integration mapping C/U/N/D/S, preservation of old age/language/version progress, offline/media limits, correction/withdrawal plan and exact next owner action.
Acceptance: all critical approvals genuine, assets licensed/generated, app integrated and target device tested before release; authentication/privacy/consent gates satisfied separately. If anything missing status DRAFT/BLOCKED FOR RELEASE; still deliver usable drafts. Prohibit pretending API import/device/child tests, zero-retention/copyright/compliance certainty, deploying/editing research repo, fake downloads or “all done” when gates pending.
```

---

## 28. Category-specific creation instructions

**Learning (P03→P07→P08→P15).** Write one objective + simple prerequisite invitation. Demonstrate relevant relation without scoring. Guided practice one or two examples H, then a fresh independent opportunity; show hint ladder repeat→feature cue→worked model. After model do not mark independent. Transfer object/layout differs while difficulty comparable. End parent note accurately “practised X”; optional offline relation. Choose screen count by cycle, not five. Quantity/shape assets every item verified. Memory of answer or repetitive tap never mastery.

**Games (P06→P07/P08→P15).** State skill for each mechanic; rules example visible; progression changes one relevant dimension; equivalent non-motor untimed interaction; no lives/penalty after errors, undo/retry/show example. Finite goal yields natural scene completion; no random drops/currency/streak. Current text quiz engine supports text choices only; object placing/shape manipulation/map path need player work; adult paper-card prototype valid interim, not integrated game claim.

**Stories (P04→P11→P13).** Age-appropriate goal/obstacle/response/resolution; page-by-page text and image/alt/narration same event. Keep conflict mild for young ages; older motives possible not certain. Optional prediction/comprehension conversation at meaningful moment/end, no every-page quiz or mandatory moral. Uninterrupted read for enjoyment often best first pass; vocabulary/prereqs adult support after/as child interested. End off-screen retell/discussion optional.

**Rhymes (P05→P09/P10→P13).** Original short meaningful lines, language-native rhythm/repetition; actual native spoken meter check, syllable counters only flags. One sound/vocabulary/rhythm aim. Safe optional seated/quiet/no-motor participation; directions separate from lyrics. Spoken and sung production/rights/player tasks separate; TTS spoken fallback honestly labelled. No familiar copyrighted tune just because lyrics new; AI similarity check not clearance.

## 29. Visual and audio generation specification

### Reusable style/reference brief (owner fills actual references)

```text
Project: Kidsuu. Existing React Native + Expo tablet app, portrait/landscape.
Character references: [APPROVED_BOY_FILES] and [APPROVED_PUPPY_FILES], with [RIGHTS_AND_UPLOAD_PERMISSION]. If absent, do not invent character details.
Style: match approved existing 2D characters and clay-style interface from [APPROVED_STYLE_SCREENSHOT]. No 3D conversion or identity redesign.
Locked traits: [owner-confirmed face/hair/fur/clothes/proportions/palette reference sheet]. Do not guess missing traits.
Scene: [UNIT_ID + educational purpose + exact objects/counts + action + spatial relation].
Composition: central educational referent, minimal background, fully visible required objects, reserved UI text space; character in margin unless part of objective.
Expression: calm, natural; no pleading, guilt, scary distress, oversize reward reaction.
Accuracy: [COUNT/SHAPE/COLOUR/ORIENTATION CHECKLIST]. Exclude extra countable decorations. Use deterministic duplicated props/shape drawings if accuracy fails.
Text: no instructional text/numerals embedded; reviewed text added in native UI. Alt description planned separately.
Output: candidate transparent PNG for isolated props/characters; opaque PNG scene if scene background is required. Save source/provenance; export sizes provisional until engineer verifies.
Quality: compare side-by-side to references, check geometry/counts at actual tablet size, flag every mismatch; cannot self-certify rights/identity/safety.
```

Reference workflow: owner selects only approved exported sheets/poses, not random generated mascots/rejected assets. Save version/hash and each image's role (boy identity, puppy identity, style, scene layout). Generate one scene; human checks reference comparison (face/clothes/fur proportions), purpose, count/geometry and clarity. Target repair names exact mismatch: “restore puppy ear shape from reference; preserve paper count”; use same approved references every repair. **D stop after two failed repair attempts**, then reuse licensed cutouts/manual composition/illustrator; no escalating character redesign. Masks/edit APIs cannot guarantee unchanged pixels/identity. Never replace production mascots with candidate reference images automatically.

Provisional exports D: editable .kra/PSD-compatible master when available; isolated props transparent sRGB PNG; scene candidate 1536×1024 landscape with central safe composition and portrait crop checked, not hardcoded app contract; prop master 512/1024px chosen by actual displayed size. Android dp != image pixels. Engineer confirms required aspect/density/memory and crop. Current reader only common category icon, so these aren't supported asset slots yet. No new animation pipeline required.

### Audio SOP detail

1. Freeze final reviewed script and hash. Create narrator-only text per segment: unit ID, locale, exact sentence, intended pause; directions in separate column. Read punctuation/numerals as intended, not abbreviations. Lyrics file separate.
2. Select permitted adult voice, warm normal articulation, stable accent suitable to families, comfortable volume, no caricature/celebrity imitation. Hindi/English can use different appropriate voices; don't promise same voice bilingual quality. Existing TTS option depend on engine, not author's recording.
3. Create pronunciation list: word, locale, intended native pronunciation/example, reviewer decision. Hindi matras/schwa/names and English local/common words checked by humans; aliases/model-supported phonemes only where proven supported. Don't change spelling shown to child solely to trick TTS; separate speech text if approved.
4. Generate/record one page at a time. Names `[unitId].[locale].[contentVersion].take01.wav`; accepted delivery file loses take label, source retained. Speech alone first; music later if used. Do not speak bracket stage directions.
5. Listen **100%** alongside final script, word by word: added/omitted/mispronounced words, number negation, pacing/emphasis, unintended emotional effects. Automated transcript/alignment only flags, not Hindi pronunciation approval.
6. Retake whole sentence/short segment with same settings; log correction, don't patch syllables into unnatural prosody. Update script/hash if language changed, regenerate all dependent assets. Bounded retries then authorized adult narrator fallback.
7. Edit to consistent perceptual loudness, remove accidental clicks/silence, no extreme compression/speed stretch. **Provisional D engineering candidates:** 48kHz 16-bit mono WAV master; MP3 96–128kbps or codec accepted by future player; speech approximately −18 LUFS integrated and peaks below −1 dBTP pending audio-engine/device review. Audacity tool may report sample peaks differently from true peak; don't claim a meter measurement not made. These numbers are not hearing-safety guarantees; listen on target speaker/headphones at normal parent-set volume.
8. Background music/SFX optional, off independently where possible, well below speech; no startling error sound; mute during new instructions. Song lyrics must remain intelligible and exactly approved. First batch recommended no music.
9. Preserve text equivalent and descriptions for meaningful sound events; no essential instruction sound-only. Sound off/reduced motion do not remove Help or text. Avoid competing TTS/screen-reader voices, preserve current stopping behaviour.
10. Store voice/music license/consent and vendor plan/generation date; no real child voice/recordings, no cloning without adult voice-owner agreement. Cloud deletion/retention/settings verified before upload. Device tests Stop/Next/Back/background/sound off/Bluetooth/TalkBack/voice unavailable/airplane mode separately; current OS TTS Stop/restart doesn't guarantee pause/resume or full offline.

All assets in Part 3 currently not-generated. Production-ready instructions are provided; human rights/audio/art reviews and actual app integration still required.

---

## 30. Four fully worked AI-production examples — pilot linkage

Section 15 ke P-L, P-G, P-R, P-S hi is requirement ke complete worked examples hain; second redundant set nahi banaya. Har pack mein brief/objective/rationale, exact prompt, complete illustrative initial draft, desk accuracy/safety findings, explicit revision, final bilingual full child/narration script, sequence, illustration/audio instructions, interactions/hints/feedback, parent/access notes, proposed structured data, not-generated manifest aur acceptance/remaining human-device gates included hain. Distribution Learning 4–5, Games 6–7, Rhymes 2–3, Stories 8–9 illustrative hai, category restriction nahi. Assets NOT GENERATED; reviews pending; app integration/device QA/child effectiveness not performed. Initial v0 drafts are deliberately constructed examples, not claims of actual historical AI runs.

## 31. Proposed content-package structure and technical handoff

```text
content-units/
  one-each-bowl/
    objective.md
    brief.md
    evidence.md
    provenance.json
    change-history.md
    reviews/                       # real reviewer records, no child PII
    editions/
      4-5/en-IN/0.1.0/
        content.json               # full ordered scripts + interaction data
        manifest.json              # asset status/rights/hash, not pretend existence
        script.md
        feedback.md
        parent.md
        alt.md
        pronunciation.tsv
        assets/images/
        assets/audio/
        validation-report.json
        compatibility.md
      4-5/hi-IN/0.1.0/              # separately reviewed edition
    source-assets/                 # restricted approved editable originals
```

ASCII file slug stable (`one-each-bowl`), locale explicit, age folder uses `4-5` while app band string is `4–5`; adapter must map deliberately, no Unicode-dash guesswork. Names `L05.en-IN.0.1.0.png/wav`; shared reusable prop IDs centrally versioned or pinned in manifest. Same unit can have separate difficulty/language edition. Never use date alone as stable ID. JSON UTF-8, script newlines actual escaped JSON newlines, no BOM assumptions in importer.

Manifest fields per asset: assetId, relativePath, kind, locale or neutral, version, state (`not-generated/candidate/reviewed/approved`), sha256 (null if absent), source/reference hashes, generatedAt/tool/model/plan (null if not generated), rights/status/licenseEvidencePath, alt/script reference, knownLimitations. All manifest paths relative inside edition directory or reviewed shared mapping; no absolute machine-specific user paths, `..` traversal or remote tracking URLs. Validate references and actual files; null hash cannot pass release. Change log states facts and affected keys/learning/progress, not marketing claims.

**Reviewed package:** content, keys, language/access, assets/rights reviewed; version signed off; may still lack supported app player. **Integrated/tested package:** engineer adapter/player loads it; saved histories/editions preserved; branch-specific tests and real tablet results pinned. Offline family SQLite cannot imply offline media. New bundled/local assets require loading manifest/static require mapping/cache, size/integrity and availability testing; Metro development cold launch is not reliable offline proof. No app adapter or production package imported by this research.

## 32. Batch production and quality controls

Start four units/eight language editions; first complete one through review before copying template. Shared artifacts: reviewed objective map/prereq graph, vocabulary by locale/band, pronunciation glossary, approved references/style pack, feedback lexicon, schema, asset rights catalog, known-engine-capabilities sheet. Scale in small clusters with educator approval of new objectives before bulk drafting.

| Check                                                           | Every unit/edition?                                                                            | Human role / permissible sampling                                                                                                                         |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keys/facts/geometry/object counts and all critical safety       | **Every item, no sampling**                                                                    | Educator/editor verifies every key and instructional asset; automated count declaration not image truth                                                   |
| Language/narration/rights/character identity                    | **Every edition/asset, no sampling**                                                           | Native listener 100% audio; rights evidence owner; art approver identity                                                                                  |
| Schema, locale, IDs, prereqs, references, missing assets/hashes | **Every package**, deterministic                                                               | Engineer reviews validator/design, not each generated byte after validation                                                                               |
| Answer-position distribution and duplicates                     | **Every bank/batch**                                                                           | Lint repeated runs/normalized duplicate hashes; editor reviews whether near-duplicates useful variation or accidental repetition                          |
| Cross-content progression/source/glossary parity                | **Every newly introduced objective and edition**, cluster check                                | Educator tracks prerequisite links; localization adaptation can intentionally differ                                                                      |
| Hindi rendering/audio on device                                 | Every unique layout/font/voice setting and each edition's text/audio; regression after changes | Native tester all critical text/audio; representative devices as defined plan, not claim all devices passed                                               |
| Cosmetic layout/performance of identical validated template     | Sampling allowed **only after** all critical checks                                            | H: first three, then at least one per template/device/locale/batch plus every changed/new layout; expand if failure. No substitute for safety/keys/rights |
| Child usability                                                 | Purposive small samples per age/access/language need, not every child/unit guaranteed          | Identify issues only; novel mechanics/new barriers need more observation. Efficacy requires distinct justified design                                     |

Duplicate control: exact normalized-text hash; same prompt/options under different ID flag; fuzzy similarity reviewed, don't auto-reject intentional rhyme repetition. Correct key referenced by option ID; after shuffle preserve key binding and retry order. Similarity tools don't certify originality/copyright. Prompt/model update or glossary error can affect all units: dependency index finds siblings, quarantine/withdraw impacted batch, verify every affected item, re-review and re-version. Don't fix one example and publish rest unchecked.

States draft→reviewed→approved→integrated; public-release indicator separate; `withdrawn` can occur from any published/integrated version. “Reviewed” means review occurred and findings recorded, not automatically approved. All pilot units now draft, not-generated assets, pending educator/language/safety/rights/device approval.

### Realistic effort/cost planning H

Four original units, eight language editions, about 18–24 simple scenes/diagrams, spoken-only (or adult/TTS), two revision cycles: **40–80 person-hours** content drafting/editor/educator/language/access review, **12–30 hours** manual/AI-assisted asset/audio work depending reference reuse; budget overlaps must be clarified with reviewers. Substantial new-player/edition engineering **24–80+ hours** separate; usability planning/recruitment/observations **12–24+ hours** separate after ethics/access gates; formal efficacy study excluded. Elapsed calendar time depends reviewer access, often weeks; AI drafting minutes ≠ validated library production time.

Illustrative budgeting, **not market rate research**: content/review time 40–80h × owner-chosen ₹1,000/h = ₹40,000–80,000 value/budget; replace with actual qualified reviewer quote. Volunteer owner time isn't proof qualified review exists. Tools can add ₹0 incremental with available assistant/local editors/approved assets/spoken adult prototype; optional generation spending cap H ₹3,000–8,000 for pilot exploration, excluding subscriptions, tax/FX/review/engineering. This is an owner budget cap example, not vendor tariff or promise adequate credits. Obtain current vendor prices before buying; spent caps prevent uncontrolled retakes. Manual fallback may cost more labour, less vendor spend. No entire validated curriculum instantly/without human review claim.

Part 6 supplies all twenty complete prompts and the exact owner/AI production handoff and approval roadmap.

---

## 33. Executable production roadmap

### A. Owner setup checklist

Before generation of a unit, owner provide/decide:

- [ ] Selected band, home-use/educator-use setting, language edition and one target objective. If undecided, run P01/P02 first as drafts.
- [ ] Actual approved boy/puppy reference files, style screenshot and permission for chosen vendor upload. Missing pack blocks character generation only; script/prop plans continue.
- [ ] Brief source packet with E-cards/URLs/limits; reviewed vocabulary and language exposure assumptions. Hindi literacy tasks need Hindi literacy specialist.
- [ ] Named educator, language editors, safety/accessibility reviewer and owner final approver; actual review availability/budget. No reviewer = draft/prototype status, not public approval.
- [ ] Spoken-only first batch decision (recommended); permitted voice/rights if recording, optional purchase cap and actual vendor terms/data settings. No paid tool automatically assumed.
- [ ] Engineer's actual capability sheet for feature/family-app, proposed ID/edition/variable-player migration plan; no source edits under this research.
- [ ] Target Android tablet model/OS, test build/commit, large-text/TalkBack/rotation/offline/audio test plan. Never share serial/IMEI/credentials.
- [ ] Ethical pilot route: informed parent permission, ongoing child assent, secure separate minimal notes/retention, no real child info in demo or AI service. Child-data/auth production gates remain separate.

Can start drafting before reference pack/paid tools/device available. Cannot claim asset production/integration/device/effectiveness stages complete without those inputs and evidence.

### B. AI handoff brief — copy/paste

```text
Continue Kidsuu educational-content production from this six-part report and its four draft pilot packs, not a framework/character project. Existing target React Native + Expo; actual owner path C:\Users\Umesh\Kidsuu, branch feature/family-app; read-only research so no code edits without a new authorized integration task. Ages 2–3/4–5/6–7/8–9; categories Learning/Games/Rhymes/Stories; India initial context, home languages vary. Preserve approved 2D boy/puppy and clay identity. No Flutter, mascot redesign, 3D or animation-production pipeline.
Source files were inspected on 5 October 2026 in a dirty local working copy, HEAD ec57148149f5738b52f924e6d4d3722a0b145d14; don't assume remote/current code unchanged. Recheck specific loading/contracts/screens when integration starts. Current practice text choices only, generic retry, five checkpoints; readers five-string tuples, category icons, optional device spoken TTS language en; no singing. Progress records activity-ID step exploration, not comprehension/mastery/language edition. Backend totals fixed after start, known eight IDs and storage/list limits. Demo SQLite dummy-only, not approved encrypted real-child storage; real auth/parent consent/cloud integration and device QA not completed.
Use one observable objective per unit, accessible non-reading responses, calm informational feedback/help/stop, caregiver shared mode for ages 2–3, optional participation, natural ending and safe offline extension. No timer/streak/shame/guilt/loot/rank/brain-IQ-therapy claim. Separate research/guidance/framework/law/design/hypothesis; never invent citations, human approvals, assets or child outcomes.
First batch: up-down-rest (2–3 shared spoken rhyme), one-each-bowl (4–5 one-to-one quantity), triangle-workshop (6–7 closed three-straight-side shapes), dry-bench-story (8–9 optional clue-based inference), each en-IN/hi-IN. Existing Part 3 full drafts, prompts, keys/hints/parent/scene/audio/data/manifest plans are starting drafts. Reference character assets/audio NOT GENERATED. Educational/language/safety/rights reviews pending; no integrated/device-tested or validated intervention claim.
Run Part 6 prompts sequentially with actual inputs and keep missing requirements explicit. Save per-unit brief/script/feedback/parent/alt/pronunciation/content/manifest/reviews/history/provenance. Hindi localization independently authored for sound/script tasks; TTS pronunciation/offline never guaranteed. AI flags risks; adult/qualified reviewers approve. Complete scripts and objective review before asset spend, then accurate reference-based scenes, exact spoken audio or honest fallback, schema/key/path checks, engineer integration, actual Android tablet QA, ethically planned usability observation. Preserve old age/language/version history; do not reset or reinterpret completions. Release only after real approvals and production/privacy gates; otherwise deliver draft package and pending gate list. No real child recordings/photos/IDs/credentials uploaded.
Owner-supplied current decisions: [LANGUAGE_STRATEGY], [REVIEWER_NAMES], [REFERENCE_FILES_AND_RIGHTS], [DEVICE_AND_BUILD], [TOOL_BUDGET], [ETHICS_AND_DATA_PLAN]. Unknown fields remain pending. Start with first pending step, not broad bulk generation.
```

### C. First pilot-batch plan and review order

| Order | Unit / objective                                          | Dependencies                                                                          | Review order / why                                                                                      |
| ----- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1     | up-down-rest, 2–3 Rhymes, shared direction words          | Caregiver-only mode, native spoken editor, safe cloth cue; four-unit plan             | Youngest access/safety first; simplest spoken fallback tests content workflow, not toddler independence |
| 2     | one-each-bowl, 4–5 Learning, one-to-one three             | Reviewed exact-count props, demonstration/hints, visual placing or adult prototype    | Numeracy/key review before image production; catch count/interaction/support mistakes                   |
| 3     | triangle-workshop, 6–7 Games, invariant triangle features | Reviewed deterministic geometry, finite rounds/answer IDs, untimed access             | Every shape/key reviewed by numeracy educator; no AI geometry trust or colour cues                      |
| 4     | dry-bench-story, 8–9 Stories, optional evidence inference | Native narrative edit, consistent wet/dry clues, optional discussion, six-page player | Narrative/child safety→language→clue-art→audio; enjoyable ending before assessment                      |

Per-unit English source and Hindi adaptation both drafted; target main home-language reviewer can lead rather than force English as authoritative source. Eight language editions, four objectives, not a full 12-week curriculum. For actual toddler usability, adults desk-test first, ethics/consent/assent controls then shared child experience only. Software prototypes can use existing reader with separate adult script presentation **without claiming the four/six-unit design integrated**; don't pad to fit engine.

### D. Exact production sequence

1. **P01** with Part 1 curriculum/E-cards and owner decisions → save curriculum-plan.md. Owner/educator select first unit, no bulk library.
2. **P02** → objective.md (one observable skill, prereqs, fresh observation); educator approve objective. Stop dependent work if target unsafe/unreviewed.
3. **P03** → brief.md with all fields and player gaps. For pilots start with B03/Part 3 R, then B05/L, B10/G, B16/S. Educator accepts scope.
4. **P05** rhyme / **P06** game / **P04** story. Learning use **P03** to define sequence, then **P07** for response examples and full scripts from locked brief. Save script.v0.1.md and interaction-spec draft. **P08** supplies condition-specific hints/feedback.md. Scripts must be complete, not just titles.
5. **P15** accuracy + **P16** safety/access checks → reviews/issue logs. Human educator/safety reviewer resolves findings; maintain changes. Do not mark approved from AI review.
6. **P09** Hindi and **P10** English localization as applicable → locked script per locale, glossary/pronunciation notes, parent/feedback copies. Human native/literacy review both; sound tasks independently authored.
7. **P11** → scenes.md, alt.md, per-scene count/geometry/continuity map. Human checks purpose/accuracy; engineer checks proposed display/interaction feasibility.
8. **P12** one scene at a time with actual approved refs/permission → candidate art + provenance; human count/identity review each. Missing refs/generation = not-generated state plus manual reuse/illustrator path, no fake output.
9. **P13** → narration-only scripts/lexicon; generate permitted audio if available or keep adult/device spoken fallback honestly labelled. Native listener checks all words; revise/retake then hash final assets. Song optional separate rights/music review, not a gate for spoken pilot.
10. **P14** → full content.json + manifest.json from locked script/assets; do not rewrite. Local validation parses JSON/schema/keys/ref/path/state/hash. **P17** cross-unit consistency; actual editor/educator/language/rights sign-off recorded.
11. **P20** → package-readiness report and compatibility.md. Engineer later authorized integration on correct branch; reviewed contract/player/history changes; tests pinned to build. Physical Android tablet checks performed, results actual, not inferred from compilation.
12. Ethical child usability plan approved; **P19** can prepare plan if no notes, then interpret actual secure de-identified observations after consent/assent. **P18** incorporates parent/educator feedback; full revised text/state/assets version saved. Relevant human re-review and adjacent device checks.
13. **P20** final gates → immutable release-manifest/change history if all pass, otherwise explicit prototype/pending status. Owner/release engineer approve actual publishing separately. Monitor correction channel; **P17** impact analysis and **P20** withdrawal/replacement readiness for errors.

### E. Stop/approval gates

| Gate                   | Stop condition                                                                        | What can still continue                                                      |
| ---------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Objective/educational  | No qualified approval; factual/key ambiguity; prereqs unsuitable                      | Clearly labelled independent draft planning                                  |
| Language/safety/access | Unsafe/shaming actions, inaccessible target without alternative, unreviewed phonology | Correct script with specialist/editor; don't pilot/release                   |
| Reference/rights       | Missing actual approved refs/upload rights; copied song; commercial license unclear   | Scene/props plan, spoken/manual lawful fallback, no upload of protected refs |
| Packaging              | Missing assets/keys/paths/schema failure, false approved status                       | Correct source and revalidate; retain not-generated manifest                 |
| Integration/history    | Unsupported player/ID/edition; old progress silently reinterpreted                    | Engineering proposal; not ship/import blindly                                |
| Child usability        | No consent/assent/ethics/data safeguards; refusal/distress                            | Adult desk review only; stop session immediately if child declines           |
| Public release         | Authentication/privacy/production or device/content gates fail                        | Internal dummy-data reviewed prototype; no public readiness claim            |
| Efficacy marketing     | No justified retention/transfer/comparison study                                      | Say intended practice/observed usability, never proven gains                 |

### F. Genuine unresolved questions

Owner: launch home-language groups, shared-use setting, names/references/rights, reviewer availability/budget, spoken-first decision, tablet/build and future privacy/consent workflow. Educator: final one-to-one scope, Hindi literacy progression, natural story/rhyme language, safe learning measures. Engineer: edition keys/version compatibility, variable-player limits/hints/optional skip, new-ID storage/API/cardinality, narration locale/media/offline loading. Researcher/legal: ethical study/retention, phased Indian legal application/platform review and any effectiveness claims. None justify changing framework/identity.

### G. Definition of done — separate stages

| Stage                              | Completion criteria                                                                                                                                                                           | This delivery status                                                                        |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Research deliverable               | Scope/access honest; verified scoped evidence; all required strategy/16 blueprints/four worked bilingual pilots/schema/workflow/toolchain/SOP/20 prompts/roadmap present; self-coverage audit | Delivered as evidence-informed synthesis; systematic review/qualified appraisal not claimed |
| Content drafting                   | Complete scripts/keys/hints/parent/access/localization/scene/audio/structured examples and provenance status, no missing workflow                                                             | Four complete draft packs delivered; not human approved                                     |
| Educational/editorial approval     | Actual named educator/native language/safety/access reviews resolved per unit/edition, signed/date/scope/version recorded                                                                     | Pending                                                                                     |
| Asset production                   | Actual accepted images/audio or explicitly approved fallback, exact counts/identity/pronunciation/text equivalence, rights, hashes                                                            | NOT GENERATED; instructions/manifest plans supplied                                         |
| App integration                    | Actual authorized adapter/player/data changes, histories preserved, branch build/tests result pinned, package loaded                                                                          | Not performed; required gaps mapped from read-only source                                   |
| Physical-device QA                 | Target Android tablet observations for touch/text/fonts/hi rendering/voice/focus/rotation/lifecycle/errors/offline, real results pinned                                                       | Not run                                                                                     |
| Evidence of learning effectiveness | Qualified ethically approved study of specified outcomes, baseline/comparison as justified, new-item/delayed/transfer and support reporting; transparent limitations                          | Not established; no validated intervention claim                                            |

Research can be used to create a complete reviewed pilot package by following sequence above; it does not automatically confer human approval, integration, device success or learning effectiveness.
