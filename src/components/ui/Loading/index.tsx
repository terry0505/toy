import cx from "classnames";
import styles from "./Loading.module.scss";

type Props = {
  dimm?: boolean;
  fixed?: boolean;
};

export default function Loading({ dimm = false, fixed = true }: Props) {
  return (
    <>
      {dimm && <div className={styles.dimm}></div>}
      {fixed ? (
        <span className={styles.loader}></span>
      ) : (
        <span className={cx(styles.loader, styles.noFixed)}></span>
      )}
    </>
  );
}
