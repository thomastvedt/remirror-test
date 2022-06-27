import { RemirrorThemeType } from 'remirror';

const theme: RemirrorThemeType = {
  color: {
    border: '#d9d9d9',
    primary: '#5691AF',
    foreground: '#333333',
    muted: '#949494',
    hover: {
      primary: 'unset',
      border: '#729db0',
      primaryText: '#729db0',
    },
    active: {
      primary: 'unset',
    },
    outline: '#5691AF',
    primaryText: '#333333',
    // shadow1: 'unset',
    // shadow2: 'unset',
    // shadow3: 'unset'
    text: '#333333',
    secondaryText: '#949494',
  },
  radius: {
    border: '0px',
    circle: '4px',
    extra: '4px',
  },
  space: {
    '1': '4px',
    '2': '8px',
    '3': '16px',
    '4': '24px',
  },
  // Doesnt work?
  // boxShadow: {
  //   '1': 'pink 0px 0px 0px 0.2em',
  //   '2': 'orange 0px 0px 0px 0.2em',
  //   '3': 'rebeccapurple 0px 0px 0px 0.2em',
  // }
};

export function useEditorTheme() {
  return {
    theme,
  };
}
