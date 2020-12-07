import { LitElement, html, css } from 'lit-element';

class CodySchoolPagination extends LitElement {
  static get properties() {
    return {
      current: { type: Number },
      numberItems: { type: Number },
      perPage: { type: Number },
    };
  }

  static get styles() {
    return css`
      :host { display: block; }
      .bg-gray-200 { background-color: #efefef; }
      .flex { display: flex; }
      .justify-center { justify-content: center; } 
      .items-center { align-items: center; }
      .w-20 { width: 20px; }
      .p-5 { padding: 5px; }
    `
  }

  constructor() {
    super();
    this.numberPages = 0;
    this.arrPages = [];
  }

  buildArr(c, n) {
    if (n < 7) {
      return [...Array(n)].map((_, i) => i + 1);
    } else {
      if (c < 3 || c > n - 2) {
        return [1, 2, 3, '...', n - 2, n - 1, n];
      } else {
        return [1, '...', c - 1, c, c + 1, '...', n];
      }
    }
  }

  setArrPages() {
    this.arrPages = this.buildArr(this.current, this.numberPages);
  }

  setCurrent(i) {
    if (isNaN(i)) return;
    this.current = i;
  }

  render() {
    this.numberPages = Math.floor(this.numberItems / this.perPage);
    this.arrPages = [];

    if (this.current) {
      this.setArrPages();
    }

    if (this.perPage) {
      this.setArrPages();
      this.current = 1;
    }

    if (this.numberItems) {
      this.numberPages = Math.round(this.numberItems / this.perPage);
      this.current = this.current || 1;
    }

    console.log(this.arrPages);

    return html`<div class="flex">
      ${this.arrPages.map((page) => html`<div class="flex justify-center items-center w-20 p-5 bg-gray-200">${page}</div>`)}
    </div>`;
  }
}

customElements.define('codyschool-pagination', CodySchoolPagination);
