

function renderFacts(facts) {
  elUl.innerHTML = ""
  facts.forEach((fact) => {
    const elLi = document.createElement("li");
    elLi.textContent = fact.text;

    elUl.append(elLi);
  });
}

