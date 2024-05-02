import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, ref, string } from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PasswordInput } from '../../components/PasswordInput/PasswordInput';
import { useAuthContext } from './AuthContext';
import Container from '../../components/Container/Container';

const commonSchema = {
  email: string()
    .email('The email address is not valid')
    .required('Please provide an email address'),
  password: string()
    .required('Please type a password')
    .min(4, 'The password needs to be at least 4 characters long'),
};

const loginSchema = object(commonSchema);

const registerSchema = object({
  ...commonSchema,
  retypePassword: string()
    .required('Please type your password again.')
    .oneOf([ref('password')], 'The two passwords do not match'),
  firstName: string().required('Please tell us your first name'),
  lastName: string().required('Please tell us your last name'),
});

export function Auth() {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  let isRegister = false;
  if (pathname === '/register') {
    isRegister = true;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isRegister ? registerSchema : loginSchema),
  });

  const { login } = useAuthContext();

  async function onSubmit(values) {
    // const dataForServer = {...values};
    // delete dataForServer.retypePassword;
    const { retypePassword, ...dataForServer } = values;

    const data = await fetch(
      `http://localhost:3000/${isRegister ? 'register' : 'login'}`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(dataForServer),
      }
    ).then(async (res) => {
      const data = res.json();
      if (res.status >= 400 && res.status < 500) {
        const message = await data;
        toast.error(message);
      }
      return data;
    });

    if (!data.accessToken) {
      toast.error(data);
      return;
    }

    toast.success('You have logged in successfully.');
    login(data);

    const path = state?.from ?? '/';
    navigate(path);
  }

  return (
    <Container>
      <h1>{isRegister ? 'Register' : 'Login'}</h1>
      <form className="brandForm" noValidate onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" {...register('email')} />
        {errors.email && (
          <p className="secondColumn fieldError">{errors.email.message}</p>
        )}

        <label htmlFor="password">Password</label>
        <PasswordInput name="password" {...register('password')} />
        {errors.password && (
          <p className="secondColumn fieldError">{errors.password.message}</p>
        )}

        {isRegister && (
          <>
            <label htmlFor="retypePassword">Retype Password</label>
            <PasswordInput
              name="retypePassword"
              {...register('retypePassword')}
            />
            {errors.retypePassword && (
              <p className="secondColumn fieldError">
                {errors.retypePassword.message}
              </p>
            )}

            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" {...register('firstName')} />
            {errors.firstName && (
              <p className="secondColumn fieldError">
                {errors.firstName.message}
              </p>
            )}

            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" {...register('lastName')} />
            {errors.lastName && (
              <p className="secondColumn fieldError">
                {errors.lastName.message}
              </p>
            )}
          </>
        )}

        <button type="submit" className="secondColumn defBtn">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
    </Container>
  );
}