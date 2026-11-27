import type { ReactNode } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, hint, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && (
        <p className={styles.hint} id={`${htmlFor}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className={styles.error} id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
