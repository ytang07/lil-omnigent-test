export const WRITING_STYLES = Object.freeze({
  funny: Object.freeze({
    label: 'Funny',
    prompt: 'Use observational humor and playful analogies while keeping the advice useful and specific.',
    outline: Object.freeze({
      thesis: (title, audience) => `${title} does not need to become another heroic productivity ritual for ${audience}; a little honest humor can make the useful change easier to see.`,
      sections: Object.freeze([
        ['Start with the familiar mess', 'Open with the recognizable absurdity of the current approach and give readers a reason to laugh before you offer a better way.'],
        ['Find the useful joke', 'Use a playful analogy to reveal the principle hiding beneath the everyday frustration.'],
        ['Try the less dramatic fix', 'Offer a few practical changes readers can make without turning their calendar into a military operation.'],
        ['Keep the punchline working', 'Close with a memorable, light-hearted invitation to repeat what works.'],
      ]),
    }),
    draft: Object.freeze({
      opening: (topic, audience) => `${topic} has a talent for showing up like an extra meeting that could have been an email. For ${audience}, that is funny right up until it starts deciding how the week goes.`,
      tension: 'The default approach usually looks sensible from a distance, much like assembling furniture without reading the instructions. Up close, it creates more wobble than progress.',
      approach: 'A better approach does not require a cape, a color-coded dashboard, or a new acronym. It asks which small change would make the useful choice easier to repeat.',
      practical: (tone) => `Keep the experiment ${tone}: protect one moment, simplify one decision, and notice what gets less chaotic. The goal is progress, not a standing ovation from your task list.`,
      close: (topic) => `Try one small experiment around ${topic.toLowerCase()}. If it works, repeat it; if it does not, at least you have a better story than “we kept doing the same thing.”`,
    }),
  }),
  serious: Object.freeze({
    label: 'Serious',
    prompt: 'Use a measured, analytical voice. Prioritize precision, evidence-minded reasoning, and durable practical guidance.',
    outline: Object.freeze({
      thesis: (title, audience) => `${title} is a consequential decision for ${audience}, because consistent practice determines the quality of work, judgment, and long-term results.`,
      sections: Object.freeze([
        ['Define the stakes', 'Establish the cost of treating the topic as an afterthought and clarify why it deserves deliberate attention.'],
        ['Examine the principle', 'Explain the underlying mechanism in direct, evidence-minded terms.'],
        ['Apply a disciplined practice', 'Offer a small, repeatable framework readers can use to make informed changes.'],
        ['Sustain the standard', 'Close by showing how regular review turns an intention into a durable operating habit.'],
      ]),
    }),
    draft: Object.freeze({
      opening: (topic, audience) => `${topic} is a practical concern for ${audience}. The way it is handled shapes the quality of decisions, the use of limited resources, and the consistency of results.`,
      tension: 'The default approach often persists because it is familiar, not because it is effective. Examining that gap is necessary before deciding what should change.',
      approach: 'Treat the issue as a design question: identify the conditions that make the better choice clear, feasible, and repeatable. This replaces vague intent with an operating standard.',
      practical: (tone) => `Use a ${tone} approach: protect one moment for focused action, simplify one recurring decision, and review the evidence after a defined period.`,
      close: (topic) => `Begin with one deliberate experiment around ${topic.toLowerCase()}, measure its effect, and retain the practice only when it improves the work over time.`,
    }),
  }),
  persuasive: Object.freeze({
    label: 'Persuasive',
    prompt: 'Make a clear, compelling case. Lead with conviction, emphasize benefits and consequences, and end with a direct call to action.',
    outline: Object.freeze({
      thesis: (title, audience) => `${title} is an opportunity ${audience} should act on now: the cost of delay compounds, while focused action creates an immediate advantage.`,
      sections: Object.freeze([
        ['Make the case for change', 'Open with the consequences of the status quo and the tangible upside of acting now.'],
        ['Show what is possible', 'Frame the topic as a concrete opportunity, not an abstract aspiration.'],
        ['Give readers a first win', 'Offer decisive, manageable actions that prove momentum can begin immediately.'],
        ['Ask for commitment', 'Close with a clear call to choose the better practice and follow through.'],
      ]),
    }),
    draft: Object.freeze({
      opening: (topic, audience) => `${topic} is an opportunity ${audience} cannot afford to treat as optional. The teams and people who act deliberately gain clarity while everyone else keeps paying for the same avoidable friction.`,
      tension: 'The status quo is not neutral. Each time the familiar approach wins by default, it consumes attention, delays better decisions, and makes future change harder.',
      approach: 'The better choice is within reach. Define the outcome, remove the obstacle that keeps the old behavior in place, and make the new practice the obvious next move.',
      practical: (tone) => `Start with a ${tone} commitment: protect one important moment, simplify one decision, and use the result to build momentum this week.`,
      close: (topic) => `Choose one action around ${topic.toLowerCase()} today. The advantage comes from beginning before the cost of waiting grows any larger.`,
    }),
  }),
});

export function getWritingStyle(style) {
  return WRITING_STYLES[style] ?? WRITING_STYLES.serious;
}

function titleCase(value) {
  return value.trim().replace(/\.$/, '').replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

export function buildGenerationPrompt(brief) {
  const style = getWritingStyle(brief.style);
  return `Write a ${brief.length}-word blog post about "${brief.topic}" for ${brief.audience}. Use a ${brief.tone} voice. Writing style: ${style.label}. ${style.prompt}`;
}

export function createOutline(brief) {
  const title = titleCase(brief.topic);
  const style = getWritingStyle(brief.style);
  const audience = brief.audience.toLowerCase();

  return {
    title,
    thesis: style.outline.thesis(title, audience),
    sections: style.outline.sections,
  };
}

export function createDraft(brief, outline) {
  const style = getWritingStyle(brief.style).draft;
  const [first, second, third, fourth] = outline.sections;
  const topic = brief.topic.trim().replace(/\.$/, '');
  const audience = brief.audience.toLowerCase();

  return `
    <p>${style.opening(topic, audience)}</p>
    <h3>${first[0]}</h3>
    <p>${style.tension}</p>
    <h3>${second[0]}</h3>
    <p>${style.approach}</p>
    <h3>${third[0]}</h3>
    <p>${style.practical(brief.tone.toLowerCase())}</p>
    <h3>${fourth[0]}</h3>
    <p>${style.close(topic)}</p>`;
}
