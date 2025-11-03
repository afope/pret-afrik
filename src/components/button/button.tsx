import styles from "./button.module.css";
import classNames from "classnames/bind";

const css = classNames.bind(styles);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "medium",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={css("button", variant, size, className)} {...props}>
      {children}
    </button>
  );
}
