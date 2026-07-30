# Build spec: AI Right Now, Episode 01

A presentation web app for a live talk. Single page, runs locally, no network at runtime.

Audience is about 30 people in Niagara-on-the-Lake: senior executives and business owners sitting alongside hands-on AI builders. Never label or split the audience in any copy. Every scene has to work for both.

Presenter: Reggie Tan, co-founder of Haven Workspace.
Event: AI Right Now, Episode 01. Haven Workspace, Thursday July 30 2026, 5:30pm.
Talk runs 55 minutes.

---

## The core idea

Do not build a deck of slides. Build one large 2D canvas with every scene positioned in space on it, and move a camera between them. Prezi-style. Each transition is a CSS transform on a single wrapper element: translate, scale, rotate. Advancing moves the camera. It never swaps a slide.

Position carries meaning:

- The four Macroview statistics sit in a row and the camera pans across them
- The Fable 5 origin timeline runs left to right and the camera tracks along it
- The MCP scene is a hub with connectors radiating outward, and the camera pulls back to reveal the whole shape at once
- Zoom depth is hierarchy. Pull back for context, push in for detail

## The canvas is one composition

This is the most important instruction in this document.

Lay the seven segments out so that when the camera zooms all the way out, the entire canvas reads as a single deliberate Art Deco composition. Symmetrical, strong vertical axis, radiating elements, stepped forms. Not scenes scattered on a plane. One poster that happens to contain a talk.

The final beat of the presentation is a slow zoom to full canvas revealing this. Design that shot first, then fit the scenes into it.

## Rotation rules

Full rotation is in play, but disciplined. Random rotation is what makes bad Prezis nauseating.

- Each of the seven segments gets its own canvas orientation, roughly 20 to 40 degrees apart, chosen to serve the overview composition
- Rotation happens only when crossing a segment boundary. Within a segment, pan and zoom only
- Reserve exactly one dramatic rotation of 90 degrees or more for a single beat: entering New Opportunities from Macroview. Nowhere else
- Never rotate while text is on screen being read. Rotation lands on segment dividers, which carry two words each
- Camera never rests past 45 degrees. Text is always readable without tilting your head

---

## Stack

- Vite plus vanilla TypeScript. No React
- GSAP for timeline choreography, vendored into the repo. No CDN
- Inline SVG for every shape. No image files, no icon fonts
- Fonts self-hosted as woff2 in `/public/fonts`. Never fetch from Google
- Build to a `dist` folder that runs from `file://` with wifi off. Verify by actually disabling networking before calling it done

## Visual system

Haven "Midnight Club". Art Deco, 1920s Manhattan, restrained and expensive. Not gaudy, not neon, nothing cyberpunk.

```
navy    #0a0f1e   background
deep    #060a14   depth layer only
gold    #c9a84c   rules, accents, key figures
cream   #f5f0e8   body text
```

Nothing else beyond opacity variants.

```
Playfair Display            scene titles and statistics, 180 to 320px
Cormorant Garamond italic   statements and pull quotes
Josefin Sans                labels, data, captions
                            letterspaced uppercase at small sizes
```

Extreme scale contrast is the point. A 280px number above an 18px letterspaced source line, with nothing in between.

## Vector language

Build a reusable library of Art Deco SVG primitives so the whole piece reads as one object:

- Stepped ziggurat frames
- Radiating sunburst fans
- Concentric arc sets
- Thin double rules with a diamond at the midpoint
- Chevron stacks

All stroke-based, gold, 1 to 2px, never filled.

Animate them with `stroke-dashoffset` so lines draw themselves on. This is the signature motion of the piece and every scene entry uses it. Spend the boldness here and keep everything around it quiet.

## Depth

Three parallax layers moving at different rates under camera motion. Background ornament at 0.4, scene content at 1.0, foreground rules at 1.15. Subtle. If it reads as an effect it is too strong.

## Motion rules

- Camera moves 900ms, custom ease, slight scale overshoot
- Segment-boundary moves 1400ms since they carry rotation
- Scene content animates only after the camera settles
- Kinetic type on the four statistics and the Takeaways line only. Per character, 30ms stagger, from y+40 and opacity 0
- Animated number counting on all statistics
- Transform and opacity only. Never animate layout properties
- Every timeline is interruptible. An arrow key mid-transition kills the running tween and goes immediately. Never queue
- `prefers-reduced-motion` cuts to positions with no tweening

## Presenter requirements

Build these first. They matter more than any animation.

- Arrow keys and spacebar advance, up and left go back
- Number keys 1 to 7 jump to segments
- `N` toggles a speaker notes panel, hidden by default
- `O` zooms to full canvas overview, click any scene to fly to it. This is the live recovery move
- Persistent segment name top left, scene counter bottom right, both low contrast
- No browser storage APIs anywhere
- 28px minimum body text, readable from 20 feet

## Two interactive moments

Only two. Everything else is presenter-driven.

1. **Model pricing.** A slider for monthly token volume that updates three tier costs live with animated number counting
2. **MCP hub.** Hovering a connector node highlights its path to the center and dims the rest

---

# Content

Copy below is final. Do not rewrite it. Where a scene needs supporting text beyond what is given, put it in speaker notes, not on screen.

## Segment 1: Rewind

**S1 Title**
AI RIGHT NOW
Episode 01
Haven Workspace / July 30 2026

**S2 Divider** — Rewind

**S3 May 7, last time**
Grid of seven, no elaboration:
What Claude is / Models and plans / Prompting / Use cases from a 30-day build sprint / Tools in four buckets / Live Telegram agent demo / Niagara Passport announcement

Below the grid: *That was 12 weeks ago. Most of it has changed.*

**S4 The format**
Seven names, numbered, as a vertical list:
Rewind / Macroview / New Opportunities / Live Demo / Tools / Predictions / Takeaways

Caption: *Same seven every time. The last one is what I get graded on next month.*

## Segment 2: Macroview

**S5 Divider** — Macroview

**S6 Statistic**
40%
of agentic AI projects will be cancelled by 2027
Source: Gartner. Driven by unclear ROI, cost, and weak risk controls.

**S7 Statistic**
40%
of enterprise apps will embed task-specific agents by end of 2026
Source: Gartner. Up from under 5% in 2025.

**S8 Statistic**
Under 10%
of enterprises experimenting with agents have scaled to real value
Source: McKinsey, 2026. About two thirds are experimenting.

**S9 Statistic**
12%
of CEOs report both revenue gain and cost reduction from AI
Source: PwC 2026 CEO Survey, 4,454 executives.

**S10 The turn**
Over 90%
of Claude Cowork usage is not software development
Source: Anthropic. Business operations and content creation are about half of all usage.

**S11 Statement**
*None of those failures are model problems.*

## Segment 3: New Opportunities

**S12 Divider** — New Opportunities
This is the one dramatic rotation. 90 degrees or more.

**S13 Fable 5, where it came from**
Horizontal timeline, camera tracks left to right:
- Mythos, a tier above Opus. First one never went public
- June 9 2026, Mythos 5 and Fable 5 ship. Same model, Fable carries extra safeguards
- June 12, suspended under US Commerce export controls
- July 1, restored after controls lift

Footnote: *Some queries route to Opus 5 instead of answering. Under 5% of sessions.*

**S14 What's different**
1M token context
128K output
Adaptive thinking, always on
Built to run for hours across many tool calls

Caption: *It holds a whole project, not a whole question.*

**S15 Four moves**
Load real context instead of describing it
Define done before you start
Ask for a file, not a reply
Queue the long job

**S16 Pricing** — INTERACTIVE
Sol $5 / $30
Terra $2.50 / $15
Luna $1 / $6
Per million tokens in and out. Slider sets monthly volume.
Footnote: *A plain API call defaults to Sol.*

**S17 Prompt versus brief**
A prompt is a request.
A brief is an assignment.

**S18 The brief**
Three labelled blocks, visually separated:
1. Here's the material
2. Here's how I decide
3. Here's what done looks like

Use the Haven event follow-up as the worked example.

**S19 What a skill is**
*A skill is a brief you got tired of writing twice.*

**S20 Proof**
Screenshot slot for the `/receipt` skill file, plain English.
Caption: *A client pays, this turns the prepayment invoice into a firm-formatted receipt.*
Then a dense grid of skill filenames, no explanation.

**S21 Skill creator**
*You describe the job. It writes the instruction sheet.*

**S22 You've seen this button**
Large rendering of a Connect button.
Caption: *It appeared in every app you use at roughly the same time. Here's why.*

**S23 What MCP is**
*A standard plug shape.*
Before it, every AI-to-app connection was custom built. Now any app plugs into any AI.

**S24 Why it beats model choice**
A model can only work on what it can reach.
Brilliant model, no reach: generic copy about your business.
Cheaper model, your files: real work.

Statement: *Two connectors change your output more than a month of better prompting.*

**S25 MCP hub** — INTERACTIVE
Radial hub. Center node is Claude, connectors radiate out: Canva, Stripe, Gmail, Drive, Notion, Slack, Supabase, Vercel, Ahrefs, HubSpot, n8n, Quo.
Footnote for builders: *Spec revised July 28. Stateless core, standardized extensions, hardened auth.*

**S26 Work that runs without you**
Claude Cowork and ChatGPT Work.
*Cowork stopped living on your laptop.*

**S27 What people actually run**
Grid of five:
Reconcile the month, write the variance note
Contracts folder into a renewals tracker
Research folder into the deck
Meeting notes into CRM updates
Competitor teardown on a schedule

Caption: *Same shape every time. Material, decision rules, definition of done.*

## Segment 4: Live Demo

**S28 Divider** — Live Demo

**S29 Play Niagara**
Title plus one-line description slot. Screenshot slot.

**S30 How it was built**
Three-stage pipeline diagram:
Claude Design → Claude Code → Impeccable
Before and after screenshot slots. Build time in large type, number slot.

**S31 Redeem**
QR placeholder, large.
Not a member: one month of part-time membership. $60 value.
Already a member: a full day in a private office. $99.

## Segment 5: Tools

**S32 Divider** — Tools

**S33 The grid**
Four categories on one screen, photographable:
Design / Landing pages / Video / SEO

**S34 Design**
Canva MCP. Brief in, on-brand graphic out, straight to scheduled.

**S35 Landing pages**
Claude Design, Claude Code, Impeccable. Seven skills, biggest visible quality lift here.

**S36 Video**
Palmier Pro for cuts from a prompt. Descript for talking-head cleanup by deleting words from a transcript.

**S37 SEO**
Ahrefs MCP and DataForSEO. Backlinks, competitors, keyword targeting, and whether AI search mentions you at all.

## Segment 6: Predictions

**S38 Divider** — Predictions

**S39 Three calls**
Numbered, each with a date:
1. Cowork runs entirely cloud-side, no laptop dependency, on every plan by the next event
2. A cheaper tier or a price cut ships from OpenAI or Anthropic within 60 days
3. Someone in this room ships something built by handing over a whole job, and demos it next month

Caption: *Graded live at Episode 02.*

## Segment 7: Takeaways

**S40 Divider** — Takeaways

**S41 The instruction**
Set very large, kinetic type:
*Pick the thing you rewrite every month. Hand over the whole job, not the next task.*
Below, smaller: Turn on two connectors before you try.

**S42 Recap**
QR placeholder and URL for the recap page.

**S43 Final beat**
Slow zoom to full canvas. The whole composition revealed. Title lockup fades in over it.

---

## Build order, with checkpoints

Before writing any code, state your design plan: the canvas composition concept, the seven segment angles, and the one signature element. Show it to me as a short written plan plus an ASCII sketch of the overview layout. Wait for approval.

Then:

1. Camera engine, keyboard nav, overview mode, notes panel. Prove it with three placeholder scenes. **Stop and show me.**
2. Full canvas layout as a composition. All scene positions and segment angles set, scenes still empty. **Stop and show me the overview shot.**
3. Type system and SVG primitive library
4. All scenes with real content, static, no animation. **Stop and show me.**
5. Animation pass
6. Depth and parallax
7. The two interactive moments
8. Offline verification, then a reduced-motion build saved as a safety copy

Do not skip a checkpoint. Steps 1, 2, and 4 each have to end in a state I could present from if I ran out of time.

Screenshot your own work at each checkpoint and critique it before showing me.

## Copy rules

Follow the attached WRITING.md.

- No em dashes. Use a spaced hyphen for asides
- No triadic constructions, no "it's not X, it's Y", no ceremonial closers
- Scene text is short and concrete
- Full sentences belong in speaker notes, never on screen
