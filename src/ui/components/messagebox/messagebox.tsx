import clsx from "clsx";
import styles from "./style.module.css";

interface Props {
  className?: string;
  text: string | string[];
  onClick?: () => void;
}

const Message = ({ text }: { text: string }) => <p>{text}</p>;

export const Messagebox = ({ className, text, onClick }: Props) => {
  const messages = typeof text === "string" ? <Message text={text}/> : text.map(((text) => <Message key={text} text={text}/>));
  return (
    <div className={clsx(styles.messageboxPictureFrame, className)} onClick={onClick}>
      <div className={styles.cornerTr}></div>
      <div className={styles.cornerBl}></div>
      <div className={styles.cornerBr}></div>
      {messages}
    </div>
  );
};
