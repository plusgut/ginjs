import plusnew, { component } from 'index';

const htmlNamespace = 'http://www.w3.org/1999/xhtml';
const svgNamespace = 'http://www.w3.org/2000/svg';

describe('rendering svg components', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });
  
  it('check if div element has correct namespace', () => {
    const Component = component(
      () => ({}),
      (props: {}) => <div />,
    );

    plusnew.render(<Component />, container);  

    expect(container.childNodes[0].namespaceURI).toBe(htmlNamespace);
  });

  
  it('check if nested div element has correct namespace', () => {
    const Component = component(
      () => ({}),
      (props: {}) => <span><div /></span>,
    );

    plusnew.render(<Component />, container);  

    expect(container.childNodes[0].namespaceURI).toBe(htmlNamespace);
    expect(container.childNodes[0].childNodes[0].namespaceURI).toBe(htmlNamespace);

  });

  
  it('check if svg element has correct namespace', () => {
    const Component = component(
      () => ({}),
      (props: {}) => <svg />,
    );

    plusnew.render(<Component />, container);  
  
    expect(container.childNodes[0].namespaceURI).toBe(svgNamespace);
  });

  it('check if nested svg element has correct namespace', () => {
    const Component = component(
      () => ({}),
      (props: {}) => <span><svg /></span>,
    );

    plusnew.render(<Component />, container);  

    expect(container.childNodes[0].namespaceURI).toBe(htmlNamespace);
    expect(container.childNodes[0].childNodes[0].namespaceURI).toBe(svgNamespace);
  });

  it('check if nested element in svg element has correct namespace', () => {
    const Component = component(
      () => ({}),
      (props: {}) => <svg><g /></svg>,
    );

    plusnew.render(<Component />, container);  

    expect(container.childNodes[0].namespaceURI).toBe(svgNamespace);
    expect(container.childNodes[0].childNodes[0].namespaceURI).toBe(svgNamespace);
  });
});
