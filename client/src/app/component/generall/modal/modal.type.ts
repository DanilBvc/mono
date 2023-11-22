import { ReactNode } from 'react';

export type modalPropsType = {
  open: boolean;
  close: () => void;
  children: ReactNode;
};
