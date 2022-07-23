import { newSpecPage } from '@stencil/core/testing';
import { MyComponent } from './my-component';

describe('my-component', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [MyComponent],
      html: '<my-component></my-component>',
    });
    expect(root).toEqualHtml(`
      <my-component>
        <mock:shadow-root>
          <div>
            My name is
          </div>
        </mock:shadow-root>
      </my-component>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [MyComponent],
      html: `<my-component name="Dang Van Thanh"></my-component>`,
    });
    expect(root).toEqualHtml(`
      <my-component name="Dang Van Thanh">
        <mock:shadow-root>
          <div>
            My name is Dang Van Thanh
          </div>
        </mock:shadow-root>
      </my-component>
    `);
  });
});
