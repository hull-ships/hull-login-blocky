import React from 'react';
import ReactDOM from 'react-dom';
import { Core } from 'hull-login';
import Main from './main';

Hull.onEmbed(document, function boostrap(element, deployment, hull) {
  const engine = Core.start(deployment, hull);
  ReactDOM.render(<Main engine={engine} actions={engine.getActions()} />, element);
});

