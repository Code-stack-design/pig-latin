const vowels = /^[aeiou]/i;

function splitLeadingPunct(word) {
  const leading = word.match(/^[^A-Za-z0-9']+/) || [''];
  const trailing = word.match(/[^A-Za-z0-9']+$/) || [''];
  const core = word.slice(leading[0].length, word.length - trailing[0].length);
  return [leading[0], core, trailing[0]];
}

function isAllUpper(s) { return s === s.toUpperCase(); }
function isCapitalized(s) { return /^[A-Z]/.test(s); }

function pigLatinWord(core) {
  if (!core) return '';
  const lower = core.toLowerCase();
  if (vowels.test(lower)) return lower + 'way';
  const m = lower.match(/^[^aeiou]+/);
  const cluster = m ? m[0] : '';
  const rest = lower.slice(cluster.length);
  return rest
    ? rest + cluster + 'ay'
    : lower + 'ay';
}

function preserveCase(original, transformed) {
  if (isAllUpper(original)) return transformed.toUpperCase();
  return isCapitalized(original)
    ? transformed.charAt(0).toUpperCase() + transformed.slice(1)
    : transformed;
}

function convertText(text, preservePunctuation = true) {
  return text.split(/\s+/).map(tok => {
    if (!tok) return tok;
    if (!preservePunctuation) {
      const core = tok.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, '');
      return preserveCase(core, pigLatinWord(core));
    }
    const [lead, core, trail] = splitLeadingPunct(tok);
    if (!/[A-Za-z]/.test(core)) return tok;
    return lead + preserveCase(core, pigLatinWord(core)) + trail;
  }).join(' ');
}

document.getElementById('convert').addEventListener('click', () => {
  const txt = document.getElementById('input').value.trim();
  document.getElementById('result').textContent = txt
    ? convertText(txt, document.getElementById('preservePunct').checked)
    : '';
});

document.getElementById('clear').addEventListener('click', () => {
  document.getElementById('input').value = '';
  document.getElementById('result').textContent = '';
});

document.getElementById('copy').addEventListener('click', async () => {
  const btn = document.getElementById('copy');
  try {
    await navigator.clipboard.writeText(document.getElementById('result').textContent);
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy result', 900);
  } catch {
    alert('Copy failed. Please copy manually.');
  }
});

document.getElementById('input').addEventListener('input', () => {
  clearTimeout(window._liveTimer);
  window._liveTimer = setTimeout(() => {
    document.getElementById('convert').click();
  }, 300);
});
