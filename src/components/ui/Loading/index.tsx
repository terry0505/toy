import styles from "./Loading.module.scss";

type Props = {
  dimm?: boolean;
};

export default function Loading({ dimm = false }: Props) {
  return (
    <>
      {dimm && <div className={styles.dimm}></div>}
      <span className={styles.loader}></span>
    </>
  );
}
