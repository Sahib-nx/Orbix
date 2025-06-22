
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext)
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null)
  const [name, setName] = useState(authUser.username);
  const [bio, setBio] = useState(authUser.bio)
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true)
    
    try {
      if(!selectedImage) {
        await updateProfile({username : name, bio })
        navigate("/");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        const base64Image = reader.result;
        await updateProfile({profilePic : base64Image, username : name, bio});
        navigate("/");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  return (
    <div className='min-h-screen relative overflow-hidden flex items-center justify-center p-4'>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full blur-sm"></div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className='relative z-10 w-full max-w-4xl'>
        <div className='backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden'>
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 p-6 border-b border-white/10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
              Profile Settings
            </h1>
            <p className="text-white/70 text-center mt-2">Customize your Orbix experience</p>
          </div>

          {/* Content Container */}
          <div className='flex items-center justify-between max-lg:flex-col-reverse p-6 sm:p-8 gap-8'>
            
            {/* Form Section */}
            <form onSubmit={handleSubmit} className='flex-1 w-full max-w-md'>
              <div className='space-y-6'>
                <h3 className='text-xl font-semibold text-white mb-6'>Profile Details</h3>
                
                {/* Profile Image Upload */}
                <div className="space-y-4">
                  <label className="block text-white/80 text-sm font-medium">Profile Picture</label>
                  <label 
                    htmlFor="avatar" 
                    className='flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl cursor-pointer transition-all duration-300 group'
                  >
                    <input 
                      type="file" 
                      id='avatar' 
                      accept='.png, .jpg, .jpeg' 
                      onChange={handleImageChange}
                      className="hidden" 
                    />
                    <div className="relative">
                      <img 
                        src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon} 
                        alt="Profile" 
                        className={`w-16 h-16 object-cover border-2 border-white/30 group-hover:border-purple-400 transition-colors duration-300 ${selectedImage ? "rounded-full" : "rounded-xl"}`} 
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-medium">Upload Profile Image</p>
                      <p className="text-white/60 text-sm">PNG, JPG or JPEG (Max 5MB)</p>
                    </div>
                  </label>
                </div>

                {/* Name Input */}
                <div className="space-y-2">
                  <label className="block text-white/80 text-sm font-medium">Display Name</label>
                  <div className="relative group">
                    <input 
                      onChange={(e) => setName(e.target.value)} 
                      value={name}
                      type="text" 
                      required 
                      placeholder='Your display name' 
                      className='w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 hover:bg-white/15' 
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-violet-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Bio Textarea */}
                <div className="space-y-2">
                  <label className="block text-white/80 text-sm font-medium">Bio</label>
                  <div className="relative group">
                    <textarea 
                      placeholder='Write your profile bio...' 
                      onChange={(e) => setBio(e.target.value)} 
                      value={bio} 
                      required 
                      className='w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 hover:bg-white/15 resize-none' 
                      rows={4}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-violet-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  <p className="text-white/50 text-xs">{bio.length}/150 characters</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button 
                    type='submit' 
                    disabled={isUploading}
                    className='flex-1 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 disabled:from-gray-500 disabled:to-gray-600 text-white p-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none'
                  >
                    {isUploading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Save Changes</span>
                      </span>
                    )}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => navigate("/")}
                    className='px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>

            {/* Profile Preview Section */}
            <div className='flex-shrink-0 w-full max-w-xs'>
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center space-y-4">
                <h4 className="text-lg font-semibold text-white mb-4">Preview</h4>
                
                {/* Profile Image Preview */}
                <div className="relative mx-auto w-32 h-32 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-violet-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                  <img 
                    src={selectedImage ? URL.createObjectURL(selectedImage) : (authUser?.profilePic || assets.LogoOrbix_icon)} 
                    alt="Profile Preview" 
                    className='relative w-full h-full object-cover rounded-full border-4 border-white/20 shadow-2xl' 
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white/20 rounded-full"></div>
                </div>

                {/* Name Preview */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white truncate">
                    {name || authUser?.username || 'Your Name'}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {bio || authUser?.bio || 'Your bio will appear here...'}
                  </p>
                </div>

                {/* Online Status */}
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white/60 text-sm">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        input[type="file"]::-webkit-file-upload-button {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default ProfilePage