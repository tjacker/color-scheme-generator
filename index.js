(function () {
  const colorSelector = document.getElementById('colorSelector');
  const colorModes = document.getElementById('colorModes');
  const form = document.querySelector('form');
  const resultsContainer = document.getElementById('resultsContainer');

  form.addEventListener('submit', async (e) => {
    const baseUrl = 'https://www.thecolorapi.com/scheme';
    const colorSelectorValue = colorSelector.value.replace('#', '');
    const colorModeValue = colorModes.value;
    const searchParams = new URLSearchParams({
      hex: colorSelectorValue,
      mode: colorModeValue,
    });

    e.preventDefault();
    console.log(colorModeValue, colorSelectorValue);

    const results = await fetch(`${baseUrl}?${searchParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json());

    const resultsHTML = results.colors
      .map((color) => {
        const { hex, name } = color;
        return `
        <div class="result-container">
          <div class="result-color" style="background-color: ${hex.value}"></div>
          <div class="result-values">
            <div class="result-name">${name.value}</div>
            <div>${hex.value}</div>
          </div>
        </div>
      `;
      })
      .join('');

    resultsContainer.innerHTML = resultsHTML;
  });
})();
