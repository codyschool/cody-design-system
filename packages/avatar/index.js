import { LitElement, html, css } from 'lit-element';

class CodySchoolAvatar extends LitElement {
  static get properties() {
    return {
      src: { type: String },
      size: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: 100%;
        background-color: #7f8de1;
        font-size: .875rem;
        color: #fff;
      }

      .avatar > img {
        width: 100%;
        height: auto;
        object-fit: cover;
      }

      .small {
        width: 16px;
        height: 16px;
      }

      .medium {
        width: 24px;
        height: 24px;
      }

      .large {
        width: 32px;
        height: 32px;
      }

      .x-large {
        width: 48px;
        height: 48px;
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    if (!this.size) {
      this.size = 'small';
    }

    if (this.src) {
      return html`
        <div class="avatar ${this.size}">
          <img src=${this.src} alt />
        </div>
      `;
    }

    return html` <div class="avatar ${this.size}">DT</div>`;
  }
}

customElements.define('codyschool-avatar', CodySchoolAvatar);
