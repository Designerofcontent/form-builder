class FormesterStandardForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['id', 'url', 'set-auto-height', 'height'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const id = this.getAttribute('id');
    const url = this.getAttribute('url');
    const setAutoHeight = this.getAttribute('set-auto-height') === 'true';
    const height = this.getAttribute('height') || '500px';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        iframe {
          width: 100%;
          height: ${height};
          border: none;
          background: transparent;
        }
      </style>
      <iframe
        src="${url}"
        id="formester-form-${id}"
        title="Formester Form"
        allow="camera; microphone; payment"
      ></iframe>
    `;

    if (setAutoHeight) {
      const iframe = this.shadowRoot.querySelector('iframe');
      window.addEventListener('message', (event) => {
        if (event.data.type === 'formester-form-height' && event.data.formId === id) {
          iframe.style.height = event.data.height + 'px';
        }
      });
    }
  }
}

customElements.define('formester-standard-form', FormesterStandardForm);
