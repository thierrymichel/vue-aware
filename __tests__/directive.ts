import bootstrap from '../__mocks__/bootstrap';

const Vue = bootstrap();

it('should pass', () => {
  // console.info(Vue._installedPlugins);
  const vm = new Vue({
    render(h) {
      return h('div', [
        h('div', {
          directives: [{ name: 'aware' }],
        }),
      ]);
    },
  }).$mount();

  expect(true).toBeTruthy();
});
