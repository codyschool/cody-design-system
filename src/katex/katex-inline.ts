import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import katex from 'katex';
import './katex.font.css';
import styles from './katex.min.css?inline';

@customElement('cody-katex-inline')
export class CodyKatexInline extends LitElement {
  @property({ type: String })
  expression = '';

  renderToString(exp: string) {
    try {
      const span = document.createElement('span');
      span.innerHTML = katex.renderToString(exp, { throwOnError: false });
      return span;
    } catch (e) {
      return e;
    }
  }

  render() {
    return html`${this.renderToString(this.expression)}`;
  }

  static styles = unsafeCSS(styles);
}

declare global {
  interface HTMLElementTagNameMap {
    'cody-katex-inline': CodyKatexInline;
  }
}
