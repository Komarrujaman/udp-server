import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Server from "@/data/conf";

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redAlert, setRedAlert] = useState(false);
  const [greenAlert, setGreenAlert] = useState(false);
  const baseUrl = Server.baseURL;
  const basePort = Server.basePort;
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://${baseUrl}:${basePort}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        // Save token in localStorage or sessionStorage
        localStorage.setItem('token', result.token);
        setRedAlert(false);
        // Optionally redirect the user after login
        navigate('/dashboard/home');
      } else {
        setErrorMessage(result.message || 'Login failed');
        setRedAlert(true);
      }
    } catch (error) {
      setErrorMessage('Error during login');
    }
  };
  return (
    <section className="m-8 flex gap-4">
      
      <div className="w-full lg:w-3/5 mt-16">
        <img src="/img/sign/logo.png" alt="logo" className="justify-center text-center w-48 md:w-60 mx-auto mb-6"/>  
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleLogin}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              name="email"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="my-6 bg-orange-800 hover:shadow-deep-orange-700" fullWidth>
            Sign In
          </Button>

          <Alert open={redAlert} color="red" onClose={() => setRedAlert(false)}>
            {errorMessage}
          </Alert>

          <Typography variant="paragraph" className="text-center hidden text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography>
        </form>

      </div>
      <div className="w-1/2 h-screen hidden lg:block align-middle">
        <img
          src="/img/sign/banner.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
     
    </section>
  );
}

export default SignIn;
