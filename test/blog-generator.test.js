import assert from 'node:assert/strict';
import test from 'node:test';

import { WRITING_STYLES, createDraft, createGenerationRequest, createOutline } from '../blog-generator.js';

const baseBrief = {
  topic: 'protecting uninterrupted time',
  audience: 'Product teams',
  tone: 'Clear and thoughtful',
  length: '700',
};

test('offers exactly the three supported writing styles', () => {
  assert.deepEqual(Object.keys(WRITING_STYLES), ['funny', 'serious', 'persuasive']);
});

test('carries the selected funny style into the generation prompt and content', () => {
  const brief = { ...baseBrief, style: 'funny' };
  const outline = createOutline(brief);
  const draft = createDraft(brief, outline);

  const request = createGenerationRequest(brief);

  assert.equal(request.style, 'funny');
  assert.match(request.prompt, /Writing style: Funny/);
  assert.match(outline.thesis, /honest humor/);
  assert.match(draft, /extra meeting that could have been an email/);
  assert.match(draft, /Start with the familiar mess/);
});

test('produces distinct serious and persuasive drafts for the same brief', () => {
  const seriousBrief = { ...baseBrief, style: 'serious' };
  const persuasiveBrief = { ...baseBrief, style: 'persuasive' };
  const seriousDraft = createDraft(seriousBrief, createOutline(seriousBrief));
  const persuasiveDraft = createDraft(persuasiveBrief, createOutline(persuasiveBrief));

  assert.match(seriousDraft, /practical concern/);
  assert.match(persuasiveDraft, /cannot afford to treat as optional/);
  assert.notEqual(seriousDraft, persuasiveDraft);
});
