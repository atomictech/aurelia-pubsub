import { Aurelia } from 'aurelia-framework';
import { configure } from '../../src/aurelia-pubsub';

class ConfigStub {
  globalResources(...resources) {
    this.resources = resources;
  }
}

describe('the Aurelia configuration', () => {
  let mockedConfiguration;

  beforeEach(() => {
    mockedConfiguration = new ConfigStub();
    configure(Aurelia, () => mockedConfiguration);
  });

  it('should register a global resource', () => {
    expect(mockedConfiguration.resources).toContain('./config');
  });
});
