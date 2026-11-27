import type { ReactNode } from 'react';
import logoUrl from '../assets/hse-perm-logo.svg';
import styles from './AuthShell.module.css';

interface AuthShellProps {
  title: string;
  lead?: string;
  aside?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthShell({ title, lead, aside, footer, children }: AuthShellProps) {
  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <img className={styles.logo} src={logoUrl} alt="НИУ ВШЭ — Пермь" />

        <div className={styles.introBody}>
          <p className={styles.brandTitle}>Стирка в общежитии</p>
          <p className={styles.introText}>Запись на стирку в общежитии.</p>

          <dl className={styles.facts}>
            <div>
              <dt>Машинки</dt>
              <dd>4, по одной на этаж</dd>
            </div>
            <div>
              <dt>Слоты</dt>
              <dd>09:00–23:00, перерыв 13:00–15:00</dd>
            </div>
          </dl>
        </div>

        {aside && <div className={styles.introFooter}>{aside}</div>}
      </section>

      <main className={styles.formSide}>
        <div className={styles.formInner}>
          <h1 className={styles.title}>{title}</h1>
          {lead && <p className={styles.lead}>{lead}</p>}
          {children}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </main>
    </div>
  );
}
