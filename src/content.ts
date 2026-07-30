// On-screen copy for all 43 scenes, verbatim from PROMPT.md. Full sentences and
// supporting material live in `notes` (the speaker-notes panel), never on
// screen. `kind` selects the renderer in render.ts.

export interface SceneContent {
  kind: string;
  notes?: string;
  [key: string]: unknown;
}

export const CONTENT: Record<string, SceneContent> = {
  // --- Segment 1: Rewind ----------------------------------------------------
  S1: {
    kind: 'title',
    lines: ['AI RIGHT NOW'],
    episode: 'Episode 01',
    meta: 'Haven Workspace / July 30 2026',
    notes: 'Opening. Reggie Tan, co-founder of Haven Workspace. Second episode of the series.',
  },
  S2: { kind: 'divider', word: 'Rewind', num: 1 },
  S3: {
    kind: 'grid',
    heading: "Recap of Haven's Claude event (May 7, 2026)",
    items: [
      'Opus 4.7',
      'Prompting between Claude vs. ChatGPT',
      'Using Claude to Plan, Build, Do, and Be Great At',
      'Live demo of the Telegram agent',
    ],
    footer: 'That was 12 weeks ago. Most of it has changed.',
    notes: 'Do not elaborate each item. The point is the volume of change since May 7.',
  },
  S4: {
    kind: 'numbered',
    heading: 'The format',
    items: ['Rewind', 'Macroview', 'New Opportunities', 'Live Demo', 'Tools', 'Predictions', 'Takeaways'],
    caption: 'Same seven every time. The last one is what I get graded on next month.',
    notes: 'Predictions get graded live at the next episode. That is the accountability hook.',
  },

  // --- Segment 2: Macroview -------------------------------------------------
  S5: { kind: 'divider', word: 'Macroview', num: 2 },
  S6: {
    kind: 'statistic',
    figure: '40%',
    label: 'of agentic AI projects will be cancelled by 2027',
    source: 'Source: Gartner. Driven by unclear ROI, cost, and weak risk controls.',
  },
  S7: {
    kind: 'statistic',
    figure: '40%',
    label: 'of enterprise apps will embed task-specific agents by end of 2026',
    source: 'Source: Gartner. Up from under 5% in 2025.',
  },
  S8: {
    kind: 'statistic',
    figure: 'Under 10%',
    label: 'of enterprises experimenting with agents have scaled to real value',
    source: 'Source: McKinsey, 2026. About two thirds are experimenting.',
  },
  S9: {
    kind: 'statistic',
    figure: '12%',
    label: 'of CEOs report both revenue gain and cost reduction from AI',
    source: 'Source: PwC 2026 CEO Survey, 4,454 executives.',
  },
  S10: {
    kind: 'statistic',
    figure: 'Over 90%',
    label: 'of Claude Cowork usage is not software development',
    source: 'Source: Anthropic. Business operations and content creation are about half of all usage.',
  },
  S11: { kind: 'statement', text: 'None of those failures are model problems.' },

  // --- Segment 3: New Opportunities -----------------------------------------
  S12: { kind: 'divider', word: 'New Opportunities', num: 3 },
  S13: {
    kind: 'timeline',
    heading: 'Fable 5, where it came from',
    steps: [
      { when: '', what: 'Mythos, a tier above Opus. First one never went public' },
      { when: 'Jun 9 2026', what: 'Mythos 5 and Fable 5 ship. Same model, Fable carries extra safeguards' },
      { when: 'Jun 12', what: 'Suspended under US Commerce export controls' },
      { when: 'Jul 1', what: 'Restored after controls lift' },
    ],
  },
  S14: {
    kind: 'features',
    heading: "What's different",
    items: ['1M token context', '128K output', 'Adaptive thinking, always on', 'Built to run for hours across many tool calls'],
    caption: 'It holds a whole project, not a whole question.',
  },
  S15: {
    kind: 'moves',
    heading: 'What is an agentic workflow?',
    items: ['Load real context instead of describing it', 'Define done before you start', 'Ask for a file, not a reply', 'Queue the long job'],
  },
  S16: {
    kind: 'pricing',
    heading: 'ChatGPT',
    tiers: [
      { name: 'Sol', in: 5, out: 30 },
      { name: 'Terra', in: 2.5, out: 15 },
      { name: 'Luna', in: 1, out: 6 },
    ],
    unit: 'Per million tokens in and out. Slider sets monthly volume.',
    footer: 'A plain API call defaults to Sol.',
    notes: 'ChatGPT tiers (Sol/Terra/Luna). Interactive slider updates all three costs.',
  },
  S17: { kind: 'versus', a: 'A prompt is a request.', b: 'A brief is an assignment.' },
  S18: {
    kind: 'brief',
    blocks: ["Here's the material", "Here's how I decide", "Here's what done looks like"],
    notes: 'Worked example: the Haven event follow-up. Material = attendee list and event notes. Decision rules = who to prioritise. Done = drafted follow-ups ready to send.',
  },
  S19: { kind: 'statement', heading: 'Claude Cowork + ChatGPT Work', text: 'A skill is a brief you got tired of writing twice.' },
  S20: {
    kind: 'proof',
    shot: 'receipt',
    caption: 'A client pays, this turns the prepayment invoice into a firm-formatted receipt.',
    skills: ['/receipt', '/follow-up', '/variance-note', '/renewals', '/deck-from-research', '/crm-sync', '/teardown', '/reconcile', '/brief', '/onboard', '/quote', '/recap'],
    notes: 'The /receipt skill file is plain English. The grid shows breadth without explaining each one.',
  },
  S21: { kind: 'statement', text: 'You describe the job. It writes the instruction sheet.' },
  S22: {
    kind: 'button',
    heading: 'Connectors and MCP Servers',
    caption: 'It appeared in every app you use at roughly the same time. Here’s why.',
  },
  S23: {
    kind: 'statement',
    text: 'A standard plug shape.',
    sub: 'Before it, every AI-to-app connection was custom built. Now any app plugs into any AI.',
  },
  S24: {
    kind: 'compare',
    heading: 'Why it beats model choice',
    lines: [
      'A model can only work on what it can reach.',
      'Brilliant model, no reach: generic copy about your business.',
      'Cheaper model, your files: real work.',
    ],
    statement: 'Two connectors change your output more than a month of better prompting.',
  },
  S25: {
    kind: 'mcphub',
    center: 'Claude',
    nodes: ['Canva', 'Stripe', 'Gmail', 'Drive', 'Notion', 'Slack', 'Supabase', 'Vercel', 'Ahrefs', 'HubSpot', 'n8n', 'Quo'],
    notes: 'Interactive: hovering a connector node highlights its path to the center and dims the rest.',
  },
  S27: {
    kind: 'grid',
    heading: 'What people actually run',
    items: [
      'Reconcile the month, write the variance note',
      'Contracts folder into a renewals tracker',
      'Research folder into the deck',
      'Meeting notes into CRM updates',
      'Competitor teardown on a schedule',
    ],
    footer: 'Same shape every time. Material, decision rules, definition of done.',
  },

  // --- Segment 4: Live Demo -------------------------------------------------
  S28: { kind: 'divider', word: 'Live Demo', num: 4 },
  S29: {
    kind: 'demo',
    title: 'Play Niagara',
    line: 'One place for what to do in Niagara, built and shipped for this talk.',
    image: 'screens/play-niagara.png',
    notes: 'Live demo. Drop the real screenshot at public/screens/play-niagara.png.',
  },
  S30: {
    kind: 'pipeline',
    heading: 'How it was built',
    stages: ['Claude Chat', 'Claude Code', 'Impeccable'],
    buildTime: '3 days',
    notes: 'Before and after screenshots swap in here. Build time in large type.',
  },
  S31: {
    kind: 'redeem',
    url: 'https://play.niagara.gg',
    title: 'Scan to Play',
    body: 'Check-in now to receive your badge of allegiance, redeem a reward, and explore the rest of NOTL',
    label: 'play.niagara.gg',
    notes: 'QR encodes play.niagara.gg.',
  },

  // --- Segment 5: Tools -----------------------------------------------------
  S32: { kind: 'divider', word: 'Tools', num: 5 },
  S33: {
    kind: 'categories',
    heading: 'Three categories',
    items: ['Social', 'Landing pages', 'Video'],
    notes: 'One photographable screen. The next scenes take each category in turn.',
  },
  S34: { kind: 'tool', category: 'Social', body: 'Skill • Canva MCP • Nuelink' },
  S35: { kind: 'tool', category: 'Landing pages', body: 'Claude Design • Claude Code • Impeccable • Github/Vercel' },
  S36: { kind: 'tool', category: 'Video Editing', body: 'Descript • Palmier Pro • Adobe Premiere + PremierCopilot' },

  // --- Segment 6: Predictions -----------------------------------------------
  S38: { kind: 'divider', word: 'Predictions', num: 6 },
  S39: {
    kind: 'calls',
    items: [
      { title: 'Tiers replace version numbers', text: 'Anthropic names capability tiers the way OpenAI just did.' },
      { title: 'Connector counts go on the box', text: 'Vendors start advertising MCP integrations the way they once advertised Zapier.' },
      { title: "Yesterday's flagship gets cheap", text: 'Another 50% cut on last-generation frontier pricing.' },
      { title: 'Another model gets switched off', text: 'A second government intervention on a deployed model, within twelve months.' },
      { title: 'Skills become a market', text: 'Someone sells packaged skill libraries by profession. Legal or accounting first.' },
    ],
    caption: 'Graded live at Episode 02.',
  },

  // --- Segment 7: Outro -----------------------------------------------------
  S42: {
    kind: 'outro',
    heading: 'Questions',
    name: 'Reggie Tan',
    contacts: [
      { label: 'X', value: '@rxggietan' },
      { label: 'Instagram', value: '@rxggietan' },
      { label: 'LinkedIn', value: 'Reggie Tan' },
      { label: 'Email', value: 'reggie@havenworkspace.ca' },
    ],
    notes: 'Outro / Q&A. The reach-out slide.',
  },
  S43: {
    kind: 'finale',
    lines: ['AI RIGHT NOW'],
    episode: 'Episode 01',
    notes: 'Final beat: the camera pulls back to the full sunburst, then this title lockup fades in over the core.',
  },
};
