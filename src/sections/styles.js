'use strict';

import { getSettings } from '../styles/settings';

const sectionHeader = {
  marginBottom: 30,
  color: 'red !important'
};

const sectionOrganizationImage = {
  marginBottom: 20
};

const sectionUserImage = {
  marginBottom: 10
};

const sectionText = {
  textAlign: 'center'
};

const sectionFooter = {
  marginTop: 30
};

const stickySectionFooter = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: 30
};

function getStyles() {
  const settings = getSettings();

  const sectionTitle = {
    color: settings.primaryColor,
    fontSize: 24,
    fontWeight: 300,
    textAlign: 'center'
  };

  return {
    sectionHeader,
    sectionOrganizationImage,
    sectionUserImage,
    sectionTitle,
    sectionText,
    sectionFooter,
    stickySectionFooter
  };
}

export default {
  getStyles,
  getSettings
};
