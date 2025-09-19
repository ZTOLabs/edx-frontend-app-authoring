import { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

declare const XCloseIcon: ({ size, ...props }: IconProps) => JSX.Element;
export default XCloseIcon;
