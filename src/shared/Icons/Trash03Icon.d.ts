import { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

declare const Trash03Icon: ({ size, ...props }: IconProps) => JSX.Element;
export default Trash03Icon;
