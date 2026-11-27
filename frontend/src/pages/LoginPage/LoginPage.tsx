import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { getErrorMessage } from '../../api/client';
import { DEMO_CREDENTIALS } from '../../api/mocks';
import { useAuth } from '../../auth/AuthContext';
import { getRedirectTarget } from '../../auth/redirect';
import {
  normalizeLoginInput,
  validateLogin,
  type LoginErrors,
  type LoginFormValues,
} from '../../auth/validation';
import { AuthShell } from '../../components/AuthShell';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/ErrorMessage';
import { FormField } from '../../components/FormField';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const { user, status, login } = useAuth();
  const location = useLocation();
  const [values, setValues] = useState<LoginFormValues>({ login: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (status === 'loading') {
    return <p className="page-stub">Загрузка…</p>;
  }

  if (user) {
    return <Navigate to={getRedirectTarget(location.state)} replace />;
  }

  function updateField(field: keyof LoginFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setServerError('');
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    setServerError('');

    const firstInvalid = (Object.keys(nextErrors) as Array<keyof LoginFormValues>)[0];

    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);

    try {
      await login(normalizeLoginInput(values));
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Вход"
      lead="Введите логин и пароль."
      aside={
        <details className={styles.demo}>
          <summary className={styles.demoSummary}>Тестовые аккаунты</summary>
          <p className={styles.demoText}>Для входа без бэкенда:</p>
          <ul className={styles.demoList}>
            {DEMO_CREDENTIALS.map(({ login: demoLogin, password, role }) => (
              <li key={demoLogin}>
                <strong>{demoLogin}</strong> / {password} —{' '}
                {role === 'admin' ? 'студсовет' : 'студент'}
              </li>
            ))}
          </ul>
        </details>
      }
      footer={
        <p className={styles.switch}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {serverError && <ErrorMessage>{serverError}</ErrorMessage>}

        <FormField
          label="Логин"
          htmlFor="login"
          error={errors.login}
          hint="Латиница, цифры и подчёркивание."
        >
          <input
            id="login"
            name="login"
            type="text"
            autoComplete="username"
            spellCheck={false}
            maxLength={20}
            required
            value={values.login}
            onChange={(event) => updateField('login', event.target.value)}
            aria-invalid={errors.login ? true : undefined}
            aria-describedby={errors.login ? 'login-hint login-error' : 'login-hint'}
          />
        </FormField>

        <FormField label="Пароль" htmlFor="password" error={errors.password}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            maxLength={72}
            required
            value={values.password}
            onChange={(event) => updateField('password', event.target.value)}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
        </FormField>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
          />
          Показать пароль
        </label>

        <Button type="submit" className={styles.submit} loading={submitting} loadingText="Вход…">
          Войти
        </Button>
      </form>
    </AuthShell>
  );
}
