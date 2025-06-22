import React, { useContext, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

// Three.js Animation Component
const ThreeJSAnimation = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(400, 400);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create floating particles
    const particleCount = 50;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      colors[i * 3] = Math.random() * 0.5 + 0.5;
      colors[i * 3 + 1] = Math.random() * 0.3 + 0.7;
      colors[i * 3 + 2] = 1;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Create connecting lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.3
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Rotate particles
      particleSystem.rotation.x += 0.001;
      particleSystem.rotation.y += 0.002;

      // Update line connections
      const positions = particleSystem.geometry.attributes.position.array;
      const linePositions = lines.geometry.attributes.position.array;
      let lineIndex = 0;

      for (let i = 0; i < particleCount && lineIndex < linePositions.length; i += 3) {
        for (let j = i + 3; j < particleCount && lineIndex < linePositions.length; j += 3) {
          const dx = positions[i] - positions[j];
          const dy = positions[i + 1] - positions[j + 1];
          const dz = positions[i + 2] - positions[j + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 2) {
            linePositions[lineIndex] = positions[i];
            linePositions[lineIndex + 1] = positions[i + 1];
            linePositions[lineIndex + 2] = positions[i + 2];
            linePositions[lineIndex + 3] = positions[j];
            linePositions[lineIndex + 4] = positions[j + 1];
            linePositions[lineIndex + 5] = positions[j + 2];
            lineIndex += 6;
          }
        }
      }

      lines.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full flex items-center justify-center" />;
};

const ChatContainer = ({ isMobile, onShowRightSidebar, onBackToSidebar }) => {
  // Your existing context data
  const { messages, getMessages, selectedUser, setSelectedUser, sendMessage } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const messagesContainerRef = useRef();
  const [input, setInput] = useState('');

  // Your existing functions
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return null;
    await sendMessage({ text: input.trim() });
    setInput('');
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async (e) => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    }
    reader.readAsDataURL(file);
  }

  // Handle back button for mobile - go to sidebar instead of welcome
  const handleBackClick = () => {
    if (isMobile && onBackToSidebar) {
      // Use the callback to properly navigate back to sidebar
      onBackToSidebar();
    } else {
      // Fallback to clearing selectedUser
      setSelectedUser(null);
    }
  }

  // Updated handle profile click for mobile - now checks for selectedUser
  const handleProfileClick = () => {
    if (isMobile && onShowRightSidebar && selectedUser) {
      onShowRightSidebar();
    }
  }

  // Your existing useEffects
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages])

  return selectedUser ? (
    <div className='h-full flex flex-col backdrop-blur-lg border-r border-l border-purple-500/20'>
      {/* Enhanced Header - Fixed at top */}
      <div className='flex-shrink-0 flex items-center gap-3 py-4 mx-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-violet-900/20 rounded-lg px-4 backdrop-blur-sm'>
        {/* Updated profile section with proper selectedUser checks */}
        <div 
          className={`relative ${isMobile && selectedUser ? 'cursor-pointer' : ''}`}
          onClick={handleProfileClick}
        >
          <img 
            src={selectedUser.profilePic || assets.avatar_icon} 
            alt="" 
            className={`w-10 h-10 rounded-full border-2 border-purple-400/50 transition-all duration-300 ${
              isMobile && selectedUser
                ? 'hover:border-purple-400 hover:scale-105 active:scale-95' 
                : 'hover:border-purple-400'
            }`} 
          />
          {onlineUsers.includes(selectedUser._id) && (
            <span className='absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white animate-pulse'></span>
          )}
          {/* Mobile indicator for clickable profile - only show when selectedUser exists */}
          {isMobile && selectedUser && (
            <div className='absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-500 border border-white animate-pulse'>
              <div className='w-full h-full bg-purple-400 rounded-full animate-ping'></div>
            </div>
          )}
        </div>
        
        {/* Updated username section with proper selectedUser checks */}
        <div 
          className={`flex-1 ${isMobile && selectedUser ? 'cursor-pointer' : ''}`}
          onClick={isMobile && selectedUser ? handleProfileClick : undefined}
        >
          <p className='text-lg text-white flex items-center gap-2 font-medium'>
            {selectedUser.username}
            {isMobile && selectedUser && (
              <span className='text-xs text-purple-300 ml-2'>
                👤 Tap for info
              </span>
            )}
          </p>
          {onlineUsers.includes(selectedUser._id) && (
            <span className='text-xs text-green-400'>Online</span>
          )}
        </div>

        <img 
          onClick={handleBackClick} 
          src={assets.arrow_icon} 
          alt="" 
          className='md:hidden max-w-7 cursor-pointer hover:scale-110 transition-transform duration-200' 
        />
        <img 
          src={assets.help_icon} 
          alt="" 
          className='max-md:hidden max-w-5 cursor-pointer hover:scale-110 transition-transform duration-200 opacity-70 hover:opacity-100' 
        />
      </div>

      {/* FIXED: Messages Container - Properly constrained scrollable area */}
      <div className='flex-1 flex flex-col min-h-0 overflow-hidden'>
        <div 
          ref={messagesContainerRef}
          className='flex-1 overflow-y-auto p-4 pb-2 space-y-4 scroll-smooth'
          style={{
            /* Custom scrollbar styles */
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(139, 92, 246, 0.5) rgba(100, 116, 139, 0.1)'
          }}
          onScroll={(e) => {
            // Prevent scroll propagation to parent
            e.stopPropagation();
          }}
        >
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-3 animate-fade-in ${msg.senderId !== authUser._id ? 'justify-start' : 'justify-end'}`}>
              {msg.senderId !== authUser._id && (
                <div className='flex-shrink-0'>
                  <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-8 h-8 rounded-full border border-purple-300/30' />
                </div>
              )}
              
              <div className='flex flex-col max-w-xs'>
                {msg.image ? (
                  <img src={msg.image} alt="" className='max-w-[230px] border border-purple-400/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300' />
                ) : (
                  <p className={`py-3 px-4 rounded-2xl text-sm font-light break-words shadow-lg transition-all duration-300 hover:shadow-xl ${
                    msg.senderId === authUser._id 
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-br-md' 
                      : 'bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-bl-md'
                  }`}>
                    {msg.text}
                  </p>
                )}
                <p className='text-xs text-gray-400 mt-1 px-2'>
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>

              {msg.senderId === authUser._id && (
                <div className='flex-shrink-0'>
                  <img src={authUser?.profilePic || assets.avatar_icon} alt="" className='w-8 h-8 rounded-full border border-purple-300/30' />
                </div>
              )}
            </div>
          ))}
          <div ref={scrollEnd}></div>
        </div>
      </div>

      {/* FIXED: Input Area - Absolutely positioned at bottom */}
      <div className='flex-shrink-0 p-4 bg-gradient-to-t from-slate-900/80 to-transparent backdrop-blur-sm border-t border-purple-500/20'>
        <div className='flex items-center gap-3'>
          <div className='flex-1 flex items-center bg-slate-800/50 backdrop-blur-sm px-4 rounded-full border border-purple-500/30 hover:border-purple-500/50 transition-colors duration-300'>
            <input 
              onChange={(e) => setInput(e.target.value)} 
              value={input} 
              onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null} 
              type="text" 
              placeholder='Type a message...'
              className='flex-1 text-sm py-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent' 
            />
            <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
            <label htmlFor="image">
              <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-200' />
            </label>
          </div>
          <button onClick={handleSendMessage} className='p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full hover:from-purple-700 hover:to-violet-700 transition-all duration-300 hover:scale-105 shadow-lg'>
            <img src={assets.send_button} alt="" className='w-5 h-5' />
          </button>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        /* Custom scrollbar for webkit browsers */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(100, 116, 139, 0.1);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  ) : (
    // Enhanced Empty State with Three.js Animation
    <div className='flex flex-col items-center justify-center gap-6 text-gray-300 bg-gradient-to-br from-slate-900/50 to-purple-900/20 max-md:hidden relative overflow-hidden'>
      <div className='absolute inset-0 opacity-30'>
        <ThreeJSAnimation />
      </div>
      <div className='relative z-10 text-center space-y-4'>
        <div className='animate-bounce'>
          <img src={assets.LogoOrbix_icon} alt="" className='w-24 h-24 mx-auto opacity-80' />
        </div>
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold text-white'>Welcome to Orbix</h2>
          <p className='text-lg font-medium text-gray-300 animate-pulse'>Chat anytime, anywhere</p>
          <p className='text-sm text-gray-400'>Select a conversation to start messaging</p>
        </div>
        <div className='flex space-x-2 justify-center'>
          <div className='w-2 h-2 bg-purple-500 rounded-full animate-bounce'></div>
          <div className='w-2 h-2 bg-violet-500 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
          <div className='w-2 h-2 bg-purple-500 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;