import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {  loginWithGoogle, signInWithRedirect } = useAuth()
  const navigate = useNavigate()



    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            fName:fName,
            lName: lName,
            email: email,
            password:password
        }
        
    try {
        const response = await fetch('https://hope-connect-backend-1-9syn.onrender.com/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser)
        });

      if (response.ok) {
        const data = await response.json(); 
        localStorage.setItem("user", data)
        navigate("/login"); 
      } else {
          const errorData = await response.json();
          setError(errorData.message || "Registration failed"); 
      }
    } catch (error) {
        setError(error)
        console.error('Error creating account:', error);
    }
}



  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="p-8 md:p-12 bg-white rounded-2xl shadow-xl text-center max-w-md w-full">
        
        <h1 className="font-serif text-3xl md:text-4xl text-blue-600 mb-2">
          Join Hope Connect
        </h1>

        <p className="text-gray-600 mb-8">
          Create your account to start your journey of giving.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 text-left">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="First Name"
              value={fName}
              required
              disabled={loading}
              onChange={(e) => setFName(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
            <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                type="text"
                placeholder="Last Name"
                value={lName}
                required
                disabled={loading}
                onChange={(e) => setLName(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              required
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              required
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-12 py-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
            </button>
          </div>

          {password && (
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${strengthColors[passwordStrength - 1] || 'bg-gray-200'}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {strengthLabels[passwordStrength - 1] || 'Too Weak'}
                </span>
              </div>
            </div>
          )}

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              required
              disabled={loading}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-12 py-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
            </button>
          </div>

          {confirmPassword && password !== confirmPassword && (
            <p className="text-red-500 text-sm text-left">Passwords do not match</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={loginWithGoogle}
          disabled={loading}
          className="flex items-center justify-center gap-3 bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          <FaGoogle className="w-4 h-4" />
          Sign Up with Google
        </button>

        <p className="text-gray-600 text-sm">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-900 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;