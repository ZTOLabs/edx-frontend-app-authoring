import { jsx as _jsx } from 'react/jsx-runtime';

const XCloseIcon = ({ size = 20, ...props }) =>
  _jsx('svg', {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    ...props,
    children: _jsx('path', {
      d: 'M18 6L6 18M6 6L18 18',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
  });
export default XCloseIcon;
