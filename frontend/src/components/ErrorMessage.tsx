import type { ReactNode } from 'react';
import styles from './ErrorMessage.module.css';

export function ErrorMessage({ children }: { children: ReactNode }) {
  return (
    <div className={styles.error} role="alert">
      {children}
    </div>
  );
}
