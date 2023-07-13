import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import katex from 'katex';
import styles from './katex.min.css?inline';

@customElement('cody-katex-block')
export class CodyKatexBlock extends LitElement {
  @property({ type: String })
  expression = '';

  renderToString(exp: string) {
    try {
      const span = document.createElement('div');
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
    'cody-katex-block': CodyKatexBlock;
  }
}
