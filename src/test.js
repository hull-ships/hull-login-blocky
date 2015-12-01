import React from 'react';
import ReactDOM from 'react-dom';
import { Core } from 'hull-login';
import Main from './main';
import en from '../locales/en.json';

function onReady(hull, user, platform, organization) {
  const deployment = platform.deployments[0];

  deployment.organization = organization;

  deployment.settings = {};

  deployment.ship.translations = { en };

  deployment.ship.settings = {
    primary_color: '#0f0',
    link_color: '#100',
    background_color: '#fff',
    text_color: '#999',
    overlay_border_radius: 10
  };

  deployment.ship.resources = {};

  const element = document.querySelector('#ship');

  const engine = Core.start(deployment, hull);
  ReactDOM.render(<Main engine={engine} actions={engine.getActions()} />, element);
}

Hull.ready(onReady);
