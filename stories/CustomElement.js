export class CustomElement extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const slot = document.createElement('slot');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 700;
        border: 0;
        border-radius: 3em;
        cursor: pointer;
        display: inline-block;
        line-height: 1;
        color: white;
        background-color: tomato;
        font-size: 14px;
        padding: 11px 20px;
      }
      :host(:hover) {
        text-decoration: underline;
      }
      :host(:focus) {
        box-shadow: inset 0 0 0 2px maroon;
        outline: 0;
      }
      :host(:active) {
        background-color: firebrick;
      }
    `;

    shadow.append(style, slot);
  }
}

customElements.define('custom-element', CustomElement);
