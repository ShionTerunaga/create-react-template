class RemoveNodeSchemePlugin {
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap('RemoveNodeSchemePlugin', (factory) => {
      factory.hooks.beforeResolve.tap('RemoveNodeSchemePlugin', (data) => {
        if (data && data.request && data.request.startsWith('node:')) {
          data.request = data.request.replace(/^node:/, '');
        }
      });
    });
  }
}

module.exports = RemoveNodeSchemePlugin;