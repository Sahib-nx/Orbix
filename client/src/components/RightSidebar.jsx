import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = ({ isMobile, onBackFromRightSidebar }) => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);
  const [imageLoading, setImageLoading] = useState({});

  //Get all the images from the messages and set them to state 
  useEffect(() => {
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    )
  }, [messages])

  const handleImageClick = (url, index) => {
    setImageLoading(prev => ({ ...prev, [index]: true }));
    setTimeout(() => {
      window.open(url);
      setImageLoading(prev => ({ ...prev, [index]: false }));
    }, 200);
  }

  return selectedUser && (
    <div className={`relative text-white overflow-y-scroll transition-all duration-300 ${
      isMobile ? 'fixed inset-0 z-50 w-full h-full' : 'w-80 h-full max-md:hidden'
    }`}
      style={{
        background: 'linear-gradient(135deg, rgba(129, 133, 178, 0.12) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(147, 51, 234, 0.12) 100%)',
        backdropFilter: 'blur(20px)',
        borderLeft: isMobile ? 'none' : '1px solid rgba(168, 85, 247, 0.3)',
        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      }}>

      {/* Mobile Back Button - Updated condition */}
      {isMobile && (
        <div className="sticky top-0 z-10 px-4 py-3 backdrop-blur-md" 
             style={{
               background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)',
               borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
             }}>
          <button
            onClick={onBackFromRightSidebar}
            className="flex items-center gap-3 text-white font-medium text-sm py-2 px-4 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group w-full"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(147, 51, 234, 0.9) 100%)',
              boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(168, 85, 247, 1) 0%, rgba(147, 51, 234, 1) 100%)';
              e.target.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(147, 51, 234, 0.9) 100%)';
              e.target.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.3)';
            }}
          >
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="flex-1 text-center">Back to Chat</span>
          </button>
        </div>
      )}

      {/* User Profile Section */}
      <div className={`${isMobile ? 'pt-6' : 'pt-16'} flex flex-col items-center gap-4 text-xs font-light mx-auto px-4`}>
        <div className="relative group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600 animate-pulse opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300"></div>
          <img
            src={selectedUser?.profilePic || assets?.avatar_icon}
            alt=""
            className='relative w-20 h-20 rounded-full object-cover border-4 border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:border-purple-400/50'
            style={{
              boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)',
            }}
          />
          {onlineUsers && onlineUsers.includes(selectedUser._id) && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <h1 className='text-xl font-semibold mx-auto flex items-center justify-center gap-2 text-white'>
            <span className="bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">
              {selectedUser.username}
            </span>
            {onlineUsers && onlineUsers.includes(selectedUser._id) && (
              <div className='w-3 h-3 rounded-full bg-green-500 animate-ping'></div>
            )}
          </h1>
          <p className='text-gray-300 text-sm italic px-4 leading-relaxed'>
            {selectedUser.bio || "Hey there! I'm using this chat app."}
          </p>
          <div className="flex items-center justify-center gap-2 text-xs">
            <span className={`px-3 py-1 rounded-full text-white font-medium ${onlineUsers && onlineUsers.includes(selectedUser._id)
                ? 'bg-green-500/20 border border-green-500/40'
                : 'bg-gray-500/20 border border-gray-500/40'
              }`}>
              {onlineUsers && onlineUsers.includes(selectedUser._id) ? '🟢 Online' : '⚫ Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Animated Divider */}
      <div className="relative my-6 mx-4">
        <hr className='border-purple-400/30' />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Media Section */}
      <div className={`px-5 text-xs space-y-3 ${isMobile ? 'pb-24' : 'pb-4'}`}>
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-violet-600 rounded-full"></div>
          <p className="text-purple-200 font-medium">Media Gallery</p>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-400/30 to-transparent"></div>
        </div>

        <div className='mt-4 max-h-[200px] overflow-y-scroll'>
          {msgImages && msgImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {msgImages.map((url, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(url, index)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden group transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${imageLoading[index] ? 'scale-95' : ''
                    }`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                  }}
                >
                  <img
                    src={url}
                    alt=""
                    className='w-full h-20 object-cover transition-all duration-300 group-hover:scale-110'
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                  {imageLoading[index] && (
                    <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-600/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm">No media shared yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => logout && logout()}
        className={`absolute ${isMobile ? 'bottom-8' : 'bottom-5'} left-1/2 transform -translate-x-1/2 text-white border-none text-sm font-medium py-3 px-8 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 group`}
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(147, 51, 234, 0.9) 100%)',
          boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'linear-gradient(135deg, rgba(168, 85, 247, 1) 0%, rgba(147, 51, 234, 1) 100%)';
          e.target.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(147, 51, 234, 0.9) 100%)';
          e.target.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.4)';
        }}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </span>
      </button>

      {/* Floating Animation Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-8 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-30"></div>
        <div className="absolute bottom-32 left-6 w-1 h-1 bg-violet-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-1/3 right-4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce opacity-25"></div>
        <div className="absolute top-2/3 left-8 w-1 h-1 bg-purple-300 rounded-full animate-pulse opacity-35"></div>
      </div>

      {/* Custom Scrollbar */}
      <style jsx>{`
                div::-webkit-scrollbar {
                    width: 6px;
                }
                div::-webkit-scrollbar-track {
                    background: rgba(168, 85, 247, 0.1);
                    border-radius: 3px;
                }
                div::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, rgba(168, 85, 247, 0.6) 0%, rgba(147, 51, 234, 0.8) 100%);
                    border-radius: 3px;
                }
                div::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(147, 51, 234, 1) 100%);
                }
            `}</style>
    </div>
  )
}

export default RightSidebar