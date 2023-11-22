export enum buttonType {
  button = 'button',
  submit = 'submit',
  reset = 'reset',
}
export type buttonProps = {
  text: string;
  type: buttonType;
  onClick?: () => void;
  additionalStyle?: string;
};
