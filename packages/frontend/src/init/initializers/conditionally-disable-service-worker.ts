import Ember from 'ember';
import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

const componentsToDisable = ['emberclear/src/ui/routes/application/-components/update-checker'];

export function initialize(application: any) {
  if (Ember.testing) {
    componentsToDisable.forEach(component => {
      application.register(`component:${component}`, Component.extend({}));
      application.register(`template:components/${component}`, hbs``);
    });
  }
}

export default { initialize };
