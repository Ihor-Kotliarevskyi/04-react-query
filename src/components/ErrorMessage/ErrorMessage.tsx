import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  error: string | null;
}

function ErrorMessage({ error }: ErrorMessageProps) {
  return <p className={css.text}>{error}</p>;
}

export default ErrorMessage;
