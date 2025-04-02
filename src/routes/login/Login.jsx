import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { networkAdapter } from 'services/NetworkAdapter';
import { AuthContext } from 'contexts/AuthContext';
import validations from 'utils/validations';
import Toast from 'components/ux/toast/Toast';
import { LOGIN_MESSAGES } from 'utils/constants';


const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (validations.validate('email', loginData.email)) {
      const response = await networkAdapter.post('api/login', loginData);
      if (response && response.status === 'success') {
        // Call the context's login function to update state and localStorage immediately
        login(response.data);
        navigate('/user-profile');
      } else {
        setErrorMessage(response.message);
      }
    } else {
      setErrorMessage(LOGIN_MESSAGES.FAILED);
    }
  };

  /**
   * Clears the current error message displayed to the user.
   */
  const dismissError = () => {
    setErrorMessage('');
  };

  return (
    <div className="login__form">
      <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
        <form onSubmit={handleLoginSubmit} className="w-full max-w-lg p-4 md:p-10 shadow-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-brand">Welcome Back</h2>
            <p className="text-gray-500">Log in to continue to your account</p>
          </div>
          <div className="mb-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleInputChange}
              autoComplete="username"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleInputChange}
              autoComplete="current-password"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            />
          </div>
          {errorMessage && (
            <Toast type="error" message={errorMessage} dismissError={dismissError} />
          )}
          <div className="items-center">
            <div>
              <button
                type="submit"
                className="bg-brand hover:bg-brand-hover text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Log In
              </button>
            </div>
            <div className="flex flex-wrap justify-center my-3 w-full">
              <Link to="/forgot-password" className="inline-block align-baseline text-md text-gray-500 hover:text-gray-800 text-right">
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute left-0 right-0 flex justify-center items-center">
                <div className="border-t w-full absolute"></div>
                <span className="bg-white px-3 text-gray-500 z-10">
                  New to MyHotelBooking.com?
                </span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center my-3 w-full mt-12">
              <Link to="/register" className="inline-block align-baseline font-medium text-md text-brand hover:text-brand-hover text-right">
                Create an account
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;