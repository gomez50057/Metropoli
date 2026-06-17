"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSession } from './SessionProvider';
import styles from './Auth.module.css';

const schema = Yup.object({
  username: Yup.string().required('Captura el usuario.'),
  password: Yup.string().required('Captura la contrasena.'),
});

export default function LoginForm() {
  const router = useRouter();
  const { login, status } = useSession();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(values, { setSubmitting }) {
    setError('');

    try {
      await login(values);
      router.replace('/acuerdos-metropolitanos/dashboard');
    } catch {
      setError('Usuario o contrasena incorrectos.');
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/acuerdos-metropolitanos/dashboard');
    }
  }, [router, status]);

  return (
    <section className={styles.loginPage}>
      <div className={styles.loginPanel}>
        <p className={styles.eyebrow}>Modulo institucional</p>
        <h1>Acuerdos metropolitanos</h1>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="username">Usuario</label>
                <Field id="username" name="username" autoComplete="username" />
                <ErrorMessage name="username" component="div" className={styles.error} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Contrasena</label>
                <div className={styles.passwordRow}>
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.textButton}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className={styles.error} />
              </div>
              {error && <div className={styles.error} role="alert">{error}</div>}
              <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}
