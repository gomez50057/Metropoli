"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useSession } from './SessionProvider';
import styles from './Auth.module.css';

const schema = Yup.object({
  username: Yup.string().required('Captura el usuario.'),
  password: Yup.string().required('Captura la contraseña.'),
});

export default function LoginForm() {
  const router = useRouter();
  const { login, status } = useSession();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formValues, { setSubmitting }) {
    setError('');

    try {
      await login(formValues);
      router.replace('/acuerdos-metropolitanos/dashboard');
    } catch (requestError) {
      setError(
        requestError?.response?.status === 429
          ? 'Demasiados intentos. Espera un minuto antes de volver a intentar.'
          : 'Usuario o contraseña incorrectos.'
      );
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
      <div className={styles.loginContent}>
        <div className={styles.loginPanel}>
          <img className={styles.logo} src="/img/headertxt.png" alt="Metrópoli Hidalgo" />
          <h1>Acuerdos metropolitanos</h1>

          <div className={styles.formPanel}>
            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={schema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="username">Usuario</label>
                    <div className={styles.inputRow}>
                      <span className={styles.inputIcon}><PersonOutlineRoundedIcon aria-hidden="true" /></span>
                      <Field id="username" name="username" placeholder="Usuario" autoComplete="username" />
                    </div>
                    <ErrorMessage name="username" component="div" className={styles.error} />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="password">Contraseña</label>
                    <div className={styles.inputRow}>
                      <span className={styles.inputIcon}><LockOutlinedIcon aria-hidden="true" /></span>
                      <Field
                        id="password"
                        name="password"
                        placeholder="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className={styles.visibilityButton}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        onClick={() => setShowPassword((value) => !value)}
                      >
                        <span>ver</span>
                        {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className={styles.error} />
                  </div>

                  {error && <div className={styles.loginError} role="alert">{error}</div>}

                  <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
                    <span>{isSubmitting ? 'Ingresando...' : 'Ingresar'}</span>
                    <ArrowForwardRoundedIcon />
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <img className={styles.skyline} src="/img/acuerdos-skyline.png" alt="" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
