import styles from "./Modal.module.scss";

interface ModalProps {
  message: string;
  onConfirm?: () => void;
  onClose: () => void;
}

export default function Modal({ message, onConfirm, onClose }: ModalProps) {
  return (
    <div className={styles.popup_wrap}>
      <div className={styles.dimm}></div>
      <div className={styles.modal_content}>
        <p>{message}</p>
        <div className={styles.button_wrap}>
          {onConfirm && <button onClick={onConfirm}>확인</button>}
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}
