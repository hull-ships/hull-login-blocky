import React from 'react';
import { Core } from 'hull-login';
import { setSettings } from './styles/settings';
import Main from './main';


function onReady(hull, user, platform, organization) {
  let deployment = platform.deployments[0];
  deployment.organization = organization;

  let element = document.querySelector('#ship');


  let engine = new Core.Engine(deployment);

  Core.I18n.setTranslations(deployment.ship.translations);

  const shipSettings = deployment.ship.settings;
  setSettings({
    primaryColor: shipSettings.primary_color,
    textColor: shipSettings.text_color,
    linkColor: shipSettings.link_color,
    defaultBorderRadius: shipSettings.button_border_radius,
    mediumBorderRadius: shipSettings.overlay_border_radius
  });

  React.render(<Main engine={engine} actions={engine.getActions()} />, element);
}

Hull.ready(onReady);
