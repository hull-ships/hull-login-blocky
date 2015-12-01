import React from 'react';
import { Core } from 'hull-login';
import Main from './main';

Hull.onEmbed(document, function boostrap(element, deployment) {
  const engine = Core.start(deployment);
  React.render(<Main engine={engine} actions={engine.getActions()} />, element);
});

