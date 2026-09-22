import { createDraft, createOutline } from './blog-generator.js';

const briefForm = document.querySelector('#briefForm');
const topicInput = document.querySelector('#topic');
const audienceInput = document.querySelector('#audience');
const toneInput = document.querySelector('#tone');
const styleInput = document.querySelector('#style');
const lengthInput = document.querySelector('#length');
const lengthValue = document.querySelector('#lengthValue');
const outlinePanel = document.querySelector('#outlinePanel');
const draftPanel = document.querySelector('#draftPanel');
const outlineTitle = document.querySelector('#outlineTitle');
const draftTitle = document.querySelector('#draftTitle');
const thesis = document.querySelector('#thesis');
const outlineList = document.querySelector('#outlineList');
const draftContent = document.querySelector('#draftContent');
const steps = document.querySelectorAll('.step');

let brief;
let outline;

lengthInput.addEventListener('input', () => {
  lengthValue.textContent = `${lengthInput.value} words`;
});

function setStep(step) {
  steps.forEach((item) => item.classList.toggle('active', Number(item.dataset.step) <= step));
}

function renderOutline() {
  outlineTitle.textContent = outline.title;
  thesis.textContent = outline.thesis;
  outlineList.innerHTML = outline.sections.map(([heading, description], index) => `
    <div class="outline-item">
      <span class="outline-number">0${index + 1}</span>
      <div><h3>${heading}</h3><p>${description}</p></div>
    </div>`).join('');
}

briefForm.addEventListener('submit', (event) => {
  event.preventDefault();
  brief = {
    topic: topicInput.value,
    audience: audienceInput.value,
    tone: toneInput.value,
    style: styleInput.value,
    length: lengthInput.value,
  };
  outline = createOutline(brief);
  renderOutline();
  outlinePanel.classList.remove('is-hidden');
  draftPanel.classList.add('is-hidden');
  setStep(2);
  outlinePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#refreshOutline').addEventListener('click', () => {
  outline = createOutline(brief);
  renderOutline();
});

document.querySelector('#editBrief').addEventListener('click', () => {
  document.querySelector('#briefPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#generateDraft').addEventListener('click', () => {
  draftTitle.textContent = outline.title;
  draftContent.innerHTML = createDraft(brief, outline);
  draftPanel.classList.remove('is-hidden');
  setStep(3);
  draftPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#backToOutline').addEventListener('click', () => {
  outlinePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#copyDraft').addEventListener('click', async () => {
  const markdown = `# ${outline.title}\n\n${draftContent.innerText.trim()}`;
  await navigator.clipboard.writeText(markdown);
  const button = document.querySelector('#copyDraft');
  button.textContent = 'Copied';
  setTimeout(() => { button.textContent = 'Copy as Markdown'; }, 1600);
});

document.querySelector('#startOver').addEventListener('click', () => {
  briefForm.reset();
  lengthInput.value = 700;
  lengthValue.textContent = '700 words';
  outlinePanel.classList.add('is-hidden');
  draftPanel.classList.add('is-hidden');
  setStep(1);
  topicInput.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
