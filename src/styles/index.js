import color from 'color';
import { getSettings } from './settings';

function getStyles() {
  const settings = getSettings();

  const base = {
    fontFamily: settings.defaultFontFamily,
    fontSize: settings.defaultFontSize,
    fontSizeAjust: 'none',
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 'normal',
    lineHeight: settings.defaultLineHeight,
    color: settings.textColor
  };

  const link = {
    cursor: 'pointer',
    color: settings.linkColor,
    background: 'transparent',
    textDecoration: 'underline',
    outlineWidth: 5
  };

  const linkHover = {
    color: color(settings.linkColor).darken(0.2).hexString()
  };

  const linkFocus = {
    color: color(settings.linkColor).darken(0.2).hexString()
  };

  const placeholder = {
    color: '#bbbbbb !important'
  };

  const overlayLeft = {
    color: settings.whiteColor
  };

  return {
    base,
    link,
    linkHover,
    linkFocus,
    placeholder,
    overlayLeft
  };
}

export default {
  getStyles
};
