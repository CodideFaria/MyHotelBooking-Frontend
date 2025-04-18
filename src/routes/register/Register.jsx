import { useState } from 'react';
import { Link } from 'react-router-dom';
import { networkAdapter } from 'services/NetworkAdapter';
import { useNavigate } from 'react-router-dom';
import Toast from 'components/ux/toast/Toast';
import { REGISTRATION_MESSAGES } from 'utils/constants';
import { Formik, Form, Field } from 'formik';
import Schemas from 'utils/validation-schemas';

/**
 * Register Component
 * Renders a registration form that allows new users to create an account.
 * It captures user input for personal information and credentials, submitting these to a registration endpoint.
 * Upon successful registration, the user is notified and redirected to the login page.
 */
const Register = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);

  /**
   * Submits the registration form data to the server.
   * It performs an asynchronous operation to post the form data to a registration endpoint.
   * If registration is successful, a success message is displayed, and the user is redirected to the login page after a brief delay.
   * Otherwise, the user is informed of the failure.
   *
   * @param {Object} e - The event object generated by the form submission.
   */
  const handleSubmit = async (values) => {
    const response = await networkAdapter.put('/api/register', values);
    console.log('response', response);
    if (response && response.status === 'success') {
      setToastMessage(REGISTRATION_MESSAGES.SUCCESS);
      setToastType('success');
      setShowToast(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setToastType('error');
      setToastMessage(response.message);
      setShowToast(true);
    }
  };

  return (
    <>
      <div className="register__form">
        <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              phoneNumber: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={Schemas.signupSchema}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="w-full max-w-lg p-4 shadow-md md:p-10">
                  <div className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold text-brand">
                      Join the Adventure!
                    </h2>
                    <p className="text-gray-500">
                      Create your account and start your journey with us
                    </p>
                  </div>
                  <div className="flex flex-wrap mb-6 -mx-3">
                    <div className="w-full px-3 mb-6 md:w-1/2 md:mb-0 relative">
                      <Field
                        name="firstName"
                        placeholder="First Name"
                        autoComplete="given-name"
                        className={`${errors.firstName && touched.firstName ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                      />
                    </div>
                    <div className="w-full px-3 md:w-1/2">
                      <Field
                        name="lastName"
                        placeholder="Last Name"
                        autoComplete="family-name"
                        className={`${errors.lastName && touched.lastName ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <Field
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      className={`${errors.email && touched.email ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                    />
                  </div>
                  <div className="mb-6">
                    <Field
                      name="phoneNumber"
                      placeholder="Phone"
                      autoComplete="tel"
                      className={`${errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                    />
                  </div>
                  <div className="mb-6">
                    <Field
                      name="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      className={`${errors.password && touched.password ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                    />
                  </div>
                  <div className="mb-6">
                    <Field
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      className={`${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                    />
                  </div>
                  {showToast && (
                    <Toast
                      type={toastType}
                      message={toastMessage}
                      dismissError={() => setShowToast(false)}
                    />
                  )}
                  <div className="flex items-center w-full my-3">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 font-bold text-white rounded bg-brand hover:bg-brand-hover focus:outline-none focus:shadow-outline"
                    >
                      Register
                    </button>
                  </div>
                  <Link to="/login" className="inline-block w-full text-lg text-center text-gray-500 align-baseline hover:text-gray-800">
                    Back to login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Register;
