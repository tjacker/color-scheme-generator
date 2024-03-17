// Browser modules imports requires file extension
import { debounce } from './utils.js';

(function () {
  const colorSelector = document.getElementById('colorSelector');
  const colorModes = document.getElementById('colorModes');
  const form = document.querySelector('form');
  const resultsContainer = document.getElementById('resultsContainer');
  const definitionModal = document.getElementById('definitionModal');
  const definitionBtn = document.getElementById('definitionBtn');

  const debounceFetchColors = debounce(fetchColors, 350);

  async function fetchColors() {
    const baseUrl = 'https://www.thecolorapi.com/scheme';
    const colorSelectorValue = colorSelector.value.replace('#', '');
    const colorModeValue = colorModes.value;
    const searchParams = new URLSearchParams({
      hex: colorSelectorValue,
      mode: colorModeValue,
    });
    const response = await fetch(`${baseUrl}?${searchParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const results = await response.json();

    resultsContainer.innerHTML = results.colors
      .map((color) => {
        const { hex, name } = color;
        return `
          <div class="result-container">
            <div class="result-color" style="background-color: ${hex.value}"></div>
            <div class="result-values">
              <div class="result-name">${name.value}</div>
              <button class="result-button result-tooltip" type="button" data-tooltip="Copy" data-hex="${hex.value}" aria-label="Copy hex code ${hex.value}">
                ${hex.value}
              </button>
            </div>
          </div>
        `;
      })
      .join('');
  }

  form.addEventListener('submit', (e) => {
    // Make sure not to debounce prevent default
    e.preventDefault();
    debounceFetchColors();
  });

  resultsContainer.addEventListener('click', async (e) => {
    const hexValue = e.target.dataset.hex;

    if (hexValue) {
      try {
        await navigator.clipboard.writeText(hexValue);
        e.target.dataset.tooltip = 'Copied!';
      } catch (error) {
        console.error('Error trying to use navigator.clipboard.writeText()', error);
      }
    }
  });

  resultsContainer.addEventListener('mouseout', (e) => {
    const tooltip = e.target.dataset.tooltip;

    if (tooltip) {
      // Set delay equal to hover transition
      setTimeout(() => {
        e.target.dataset.tooltip = 'Copy';
      }, 300);
    }
  });

  definitionBtn.addEventListener('click', () => {
    definitionModal.style.display = 'none';
  });
})();
