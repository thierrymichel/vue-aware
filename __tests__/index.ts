import bootstrap from '../__mocks__/bootstrap';

const vue = bootstrap();

function isInstalled(root: any) {
  return root.Vue._installedPlugins.some(p => p.name === 'vue-aware');
}

it('(auto) install on window', () => {
  expect(isInstalled(window)).toBeTruthy();
});
