// deno-lint-ignore-file

function wrapLetters(e) {
  // match all non-whitespace characters (\S) globaly (g)
  // replace with matched character wrapped in span
  e.innerHTML = e.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
}

function initTextEffects(parent = document) {
  const elements = parent.getElementsByClassName("text-effect");
  for (const e of elements) {
    wrapLetters(e);
  }
}
