import { ReactNode } from "react";
import styles from "./Modal.module.scss";

type Props = {
  title: string;
  children: ReactNode;
};

export default function Modal({ title, children }: Props) {
  return (
    <div className={styles.modal}>
      <div className={styles.modal__content}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}
