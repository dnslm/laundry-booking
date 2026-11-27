import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { ApiError, getErrorMessage } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { getRedirectTarget } from '../../auth/redirect';
import {
  normalizeRegisterInput,
  validateRegister,
  type RegisterErrors,
  type RegisterField,
  type RegisterFormValues,
} from '../../auth/validation';
import { AuthShell } from '../../components/AuthShell';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/ErrorMessage';
import { FormField } from '../../components/FormField';
import type { ContactType } from '../../types';
import styles from './RegisterPage.module.css';

const CONTACT_OPTIONS: ReadonlyArray<{ value: ContactType; label: string }> = [
  { value: 'phone', label: 'Телефон' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'vk', label: 'VK' },
];

const CONTACT_HINTS: Record<ContactType, string> = {
  phone: '10–11 цифр, можно с +7.',
  telegram: 'Имя пользователя, можно с @.',
  vk: 'Ссылка на профиль или короткое имя.',
};

const CONTACT_PLACEHOLDERS: Record<ContactType, string> = {
  phone: '+7 900 000-00-00',
  telegram: '@username',
  vk: 'vk.com/username',
};

export function RegisterPage() {
  const { user, status, register } = useAuth();
  const location = useLocation();
  const [values, setValues] = useState<RegisterFormValues>({
    firstName: '',
    lastName: '',
    room: '',
    login: '',
    contactType: 'phone',
    contactValue: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (status === 'loading') {
    return <p className="page-stub">Загрузка…</p>;
  }

  if (user) {
    return <Navigate to={getRedirectTarget(location.state)} replace />;
  }

  function updateField<K extends RegisterField>(field: K, value: RegisterFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setServerError('');
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];

      if (field === 'password') {
        delete next.confirmPassword;
      }

      if (field === 'contactType') {
        delete next.contactValue;
      }

      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateRegister(values);
    setErrors(nextErrors);
    setServerError('');

    const firstInvalid = (Object.keys(nextErrors) as RegisterField[])[0];

    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);

    try {
      await register(normalizeRegisterInput(values));
    } catch (error) {
      const loginError = error instanceof ApiError ? error.fields?.login : undefined;

      if (loginError) {
        setErrors((prev) => ({ ...prev, login: loginError }));
      } else {
        setServerError(getErrorMessage(error));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Регистрация"
      lead="Заполните профиль и данные для входа."
      aside={
        <div className={styles.asideNote}>
          <p>Имя, фамилия и комната нужны студсовету. В одной комнате могут жить тёзки.</p>
          <p>Контакт — на случай, если с машинкой что-то случится.</p>
        </div>
      }
      footer={
        <p className={styles.switch}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {serverError && <ErrorMessage>{serverError}</ErrorMessage>}

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Профиль</legend>

          <div className={styles.stack}>
            <div className={styles.names}>
              <FormField label="Имя" htmlFor="firstName" error={errors.firstName}>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  maxLength={50}
                  required
                  value={values.firstName}
                  onChange={(event) => updateField('firstName', event.target.value)}
                  aria-invalid={errors.firstName ? true : undefined}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
              </FormField>

              <FormField label="Фамилия" htmlFor="lastName" error={errors.lastName}>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  maxLength={50}
                  required
                  value={values.lastName}
                  onChange={(event) => updateField('lastName', event.target.value)}
                  aria-invalid={errors.lastName ? true : undefined}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                />
              </FormField>
            </div>

            <FormField label="Комната" htmlFor="room" error={errors.room}>
              <input
                id="room"
                name="room"
                type="text"
                autoComplete="off"
                maxLength={10}
                required
                value={values.room}
                onChange={(event) => updateField('room', event.target.value)}
                aria-invalid={errors.room ? true : undefined}
                aria-describedby={errors.room ? 'room-error' : undefined}
              />
            </FormField>

            <div className={styles.contact}>
              <FormField label="Тип связи" htmlFor="contactType">
                <select
                  id="contactType"
                  name="contactType"
                  value={values.contactType}
                  onChange={(event) =>
                    updateField('contactType', event.target.value as ContactType)
                  }
                >
                  {CONTACT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Контакт"
                htmlFor="contactValue"
                error={errors.contactValue}
                hint={CONTACT_HINTS[values.contactType]}
              >
                <input
                  id="contactValue"
                  name="contactValue"
                  type={values.contactType === 'phone' ? 'tel' : 'text'}
                  inputMode={values.contactType === 'phone' ? 'tel' : 'text'}
                  autoComplete={
                    values.contactType === 'phone'
                      ? 'tel'
                      : values.contactType === 'vk'
                        ? 'url'
                        : 'off'
                  }
                  maxLength={100}
                  required
                  placeholder={CONTACT_PLACEHOLDERS[values.contactType]}
                  value={values.contactValue}
                  onChange={(event) => updateField('contactValue', event.target.value)}
                  aria-invalid={errors.contactValue ? true : undefined}
                  aria-describedby={
                    errors.contactValue
                      ? 'contactValue-hint contactValue-error'
                      : 'contactValue-hint'
                  }
                />
              </FormField>
            </div>
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Данные для входа</legend>

          <div className={styles.stack}>
            <FormField
              label="Логин"
              htmlFor="login"
              error={errors.login}
              hint="3–20 символов: латиница, цифры и подчёркивание."
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
                autoComplete="new-password"
                maxLength={72}
                required
                value={values.password}
                onChange={(event) => updateField('password', event.target.value)}
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
            </FormField>

            <FormField
              label="Повтор пароля"
              htmlFor="confirmPassword"
              error={errors.confirmPassword}
            >
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                maxLength={72}
                required
                value={values.confirmPassword}
                onChange={(event) => updateField('confirmPassword', event.target.value)}
                aria-invalid={errors.confirmPassword ? true : undefined}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
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
          </div>
        </fieldset>

        <Button
          type="submit"
          className={styles.submit}
          loading={submitting}
          loadingText="Регистрация…"
        >
          Зарегистрироваться
        </Button>
      </form>
    </AuthShell>
  );
}
