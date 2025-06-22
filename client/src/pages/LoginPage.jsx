import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';

function LoginPage() {
  const [currState, setCurrState] = useState("Welcome to Orbix");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext)

  const onSubmitHandler = (e) => {
     e.preventDefault();

     if(currState === "Welcome to Orbix" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return
     }

     login(currState === "Welcome to Orbix" ? 'signup' : 'login', { username, email, password, bio})
  }

  return (
    <div className='min-h-screen relative overflow-hidden flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col p-4'>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Logo Section */}
      <div className="relative z-10 flex flex-col items-center space-y-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-violet-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <img 
            src={assets.logoOrbix_big} 
            alt="Orbix Logo" 
            className='relative w-[min(30vw,250px)] max-w-[200px] sm:max-w-[250px] hover:scale-105 transition-transform duration-300' 
            style={{
              animation: 'bounce-slow 3s ease-in-out infinite'
            }}
          />
        </div>
        <div className="text-center space-y-2 max-sm:hidden">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            Welcome to Orbix
          </h1>
          <p className="text-white/70 text-sm">Connect, Chat, Create Memories</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="relative z-10 w-full max-w-md">
        <div className='relative backdrop-blur-xl bg-white/10 border border-white/20 p-6 sm:p-8 flex flex-col gap-6 rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-purple-500/20 hover:bg-white/15'>
          {/* Glassmorphism Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
          
          <div className='relative z-10'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='font-bold text-xl sm:text-2xl text-white'>
                {currState}
              </h2>
              {isDataSubmitted && (
                <button
                  type="button"
                  onClick={() => setIsDataSubmitted(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 group"
                >
                  <img 
                    src={assets.arrow_icon} 
                    alt="Back" 
                    className='w-5 h-5 group-hover:scale-110 transition-transform duration-200' 
                  />
                </button>
              )}
            </div>

            {/* Progress Indicator for Signup */}
            {currState === "Welcome to Orbix" && (
              <div className="flex items-center justify-center mb-6">
                <div className="flex space-x-2">
                  <div className={`w-8 h-1 rounded-full transition-colors duration-300 ${!isDataSubmitted ? 'bg-purple-400' : 'bg-white/30'}`}></div>
                  <div className={`w-8 h-1 rounded-full transition-colors duration-300 ${isDataSubmitted ? 'bg-purple-400' : 'bg-white/30'}`}></div>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              {currState === "Welcome to Orbix" && !isDataSubmitted && (
                <div className="relative group">
                  <input 
                    onChange={(e) => setUsername(e.target.value)} 
                    value={username}
                    type="text" 
                    className='w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 hover:bg-white/15' 
                    placeholder='Choose a username' 
                    required 
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-violet-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              )}

              {!isDataSubmitted && (
                <>
                  <div className="relative group">
                    <input 
                      onChange={(e) => setEmail(e.target.value)} 
                      value={email}
                      type="email" 
                      placeholder='Email Address' 
                      required 
                      className='w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 hover:bg-white/15'
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-violet-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  <div className="relative group">
                    <input 
                      onChange={(e) => setPassword(e.target.value)} 
                      value={password}
                      type="password" 
                      placeholder='Password' 
                      required 
                      className='w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 hover:bg-white/15'
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-violet-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </>
              )}

              {currState === "Welcome to Orbix" && isDataSubmitted && (
                <div className="relative group">
                  <textarea 
                    onChange={(e) => setBio(e.target.value)} 
                    value={bio}
                    rows={4} 
                    className='w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 hover:bg-white/15 resize-none' 
                    placeholder='Tell us a bit about yourself...' 
                    required 
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-violet-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type='submit' 
              onClick={onSubmitHandler}
              className='w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]'
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{currState === "Welcome to Orbix" ? "Create Account" : "Login"}</span>
                {currState !== "Welcome to Orbix" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </span>
            </button>

            {/* Terms and Conditions */}
            <div className='flex items-center gap-3 mt-4 text-sm text-white/70'>
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-white/30 bg-white/10 focus:ring-purple-400 focus:ring-2"
              />
              <p>I agree to the <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Terms of Service</span> & <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Privacy Policy</span></p>
            </div>

            {/* Toggle Login/Signup */}
            <div className='mt-6 text-center'>
              {currState === "Welcome to Orbix" ? (
                <p className='text-sm text-white/70'>
                  Already have an account? 
                  <button
                    type="button"
                    onClick={() => { setCurrState("Welcome Back!!"); setIsDataSubmitted(false) }}
                    className='ml-2 font-semibold text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline'
                  >
                    Login here
                  </button>
                </p>
              ) : (
                <p className='text-sm text-white/70'>
                  New to Orbix? 
                  <button
                    type="button"
                    onClick={() => { setCurrState("Welcome to Orbix") }}
                    className='ml-2 font-semibold text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline'
                  >
                    Create an account
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}

export default LoginPage