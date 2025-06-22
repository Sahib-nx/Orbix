import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import assets from '../assets/assets'

const Sidebar = ({ onBackToWelcome }) => {

    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const { getUsers, users, selectedUser, setSelectedUser,
        unseenMessages, setUnseenMessages } = useContext(ChatContext);

    const { logout, onlineUsers } = useContext(AuthContext);

    const [input, setInput] = useState(false);

    const filteredUsers = input ? users.filter((user) => user.username.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(() => {
        getUsers();
    }, [onlineUsers])

    const navigate = useNavigate();

    // Check if it's mobile
    const isMobile = window.innerWidth < 768;

    // Handle menu toggle - unified for both desktop and mobile
    const toggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    // Handle menu item clicks
    const handleEditProfile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMenuOpen(false);
        navigate && navigate('/profile');
    };

    const handleLogout = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMenuOpen(false);
        logout && logout();
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isMenuOpen]);

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isMenuOpen]);

    return (
        <div className={`relative h-full p-5 rounded-r-xl overflow-y-scroll text-white transition-all duration-300 ${selectedUser ? 'max-md:hidden' : ''
            }`}
            style={{
                background: 'linear-gradient(135deg, rgba(129, 133, 178, 0.15) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(147, 51, 234, 0.15) 100%)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(168, 85, 247, 0.3)',
                boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}>
            <div className='pb-5'>
                <div className='flex justify-between items-center'>
                    <div className="relative flex items-center gap-3">
                        {/* Back button for mobile */}
                        {isMobile && onBackToWelcome && (
                            <button
                                onClick={onBackToWelcome}
                                className="p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.3) 100%)',
                                    border: '1px solid rgba(168, 85, 247, 0.3)',
                                }}
                            >
                                <span className="text-white text-lg">←</span>
                            </button>
                        )}
                        
                        <img
                            src={assets?.LogoOrbix}
                            alt="logo"
                            className='max-w-30 transition-all duration-300 hover:scale-105 hover:drop-shadow-lg animate-pulse'
                            style={{
                                filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))',
                            }}
                        />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping"></div>
                    </div>
                    
                    {/* Unified menu (click-based for both desktop and mobile) */}
                    <div className='relative py-2' ref={menuRef}>
                        <button
                            onClick={toggleMenu}
                            className={`relative p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${isMenuOpen ? 'bg-purple-500/20' : ''}`}
                            style={{
                                filter: 'drop-shadow(0 0 5px rgba(168, 85, 247, 0.5))',
                            }}
                        >
                            <img
                                src={assets?.menu_icon}
                                alt="Menu"
                                className={`max-h-5 transition-all duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
                            />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-violet-600 opacity-0 hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                        </button>
                        
                        {/* Menu dropdown - unified for both desktop and mobile */}
                        {isMenuOpen && (
                            <div 
                                className={`absolute top-full right-0 z-50 p-4 rounded-lg transition-all duration-200 transform origin-top-right ${
                                    isMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                                } ${isMobile ? 'w-48' : 'w-44'}`}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(40, 33, 66, 0.96) 0%, rgba(168, 85, 247, 0.25) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(168, 85, 247, 0.4)',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 20px rgba(168, 85, 247, 0.5)',
                                    marginTop: '8px',
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={handleEditProfile}
                                    className={`w-full cursor-pointer text-sm hover:text-purple-300 transition-all duration-200 hover:scale-105 transform rounded-lg flex items-center gap-3 text-left ${
                                        isMobile ? 'py-3 px-3' : 'py-2 px-2'
                                    } hover:bg-purple-500/15 active:bg-purple-500/25`}
                                >
                                    <span className="text-lg">👤</span>
                                    <span>Edit Profile</span>
                                </button>
                                
                                <hr className='my-3 border-t border-purple-400/30' />
                                
                                <button
                                    onClick={handleLogout}
                                    className={`w-full cursor-pointer text-sm hover:text-red-300 transition-all duration-200 hover:scale-105 transform rounded-lg flex items-center gap-3 text-left ${
                                        isMobile ? 'py-3 px-3' : 'py-2 px-2'
                                    } hover:bg-red-500/15 active:bg-red-500/25`}
                                >
                                    <span className="text-lg">🚪</span>
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`mt-5 rounded-full flex items-center gap-2 py-3 px-4 transition-all duration-300 ${isSearchFocused ? 'scale-105 shadow-lg' : ''
                    }`}
                    style={{
                        background: 'linear-gradient(135deg, rgba(40, 33, 66, 0.8) 0%, rgba(168, 85, 247, 0.2) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: isSearchFocused ? '2px solid rgba(168, 85, 247, 0.5)' : '1px solid rgba(168, 85, 247, 0.3)',
                        boxShadow: isSearchFocused ? '0 0 20px rgba(168, 85, 247, 0.3)' : 'none',
                    }}>
                    <img
                        src={assets?.search_icon}
                        alt="Search"
                        className={`w-3 transition-all duration-300 ${isSearchFocused ? 'scale-110' : ''}`}
                        style={{
                            filter: isSearchFocused ? 'drop-shadow(0 0 5px rgba(168, 85, 247, 0.8))' : 'none',
                        }}
                    />
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        type="text"
                        className='bg-transparent border-none outline-none text-white text-xs placeholder-gray-300 flex-1 transition-all duration-300'
                        placeholder='Search User...'
                    />
                    {input && (
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    )}
                </div>
            </div>

            <div className='flex flex-col space-y-1'>
                {filteredUsers && filteredUsers.map((user, index) => (
                    <div
                        onClick={() => {
                            setSelectedUser && setSelectedUser(user);
                            setUnseenMessages && setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
                        }}
                        key={index}
                        className={`relative flex items-center gap-3 p-3 pl-4 rounded-xl cursor-pointer max-sm:text-sm transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group ${selectedUser?._id === user._id ? 'scale-[1.02]' : 'hover:translate-x-1'
                            }`}
                        style={{
                            background: selectedUser?._id === user._id
                                ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(147, 51, 234, 0.2) 100%)'
                                : 'transparent',
                            backdropFilter: selectedUser?._id === user._id ? 'blur(10px)' : 'none',
                            border: selectedUser?._id === user._id
                                ? '1px solid rgba(168, 85, 247, 0.4)'
                                : '1px solid transparent',
                            boxShadow: selectedUser?._id === user._id
                                ? '0 0 20px rgba(168, 85, 247, 0.2)'
                                : 'none',
                        }}
                        onMouseEnter={(e) => {
                            if (selectedUser?._id !== user._id) {
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)';
                                e.currentTarget.style.backdropFilter = 'blur(5px)';
                                e.currentTarget.style.border = '1px solid rgba(168, 85, 247, 0.2)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (selectedUser?._id !== user._id) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.backdropFilter = 'none';
                                e.currentTarget.style.border = '1px solid transparent';
                            }
                        }}>

                        <div className="relative">
                            <img
                                src={user?.profilePic || assets?.avatar_icon}
                                alt=""
                                className='w-[35px] h-[35px] rounded-full object-cover transition-all duration-300 group-hover:scale-110'
                                style={{
                                    border: onlineUsers && onlineUsers.includes(user._id)
                                        ? '2px solid rgba(34, 197, 94, 0.6)'
                                        : '2px solid rgba(168, 85, 247, 0.3)',
                                    boxShadow: onlineUsers && onlineUsers.includes(user._id)
                                        ? '0 0 15px rgba(34, 197, 94, 0.3)'
                                        : '0 0 10px rgba(168, 85, 247, 0.2)',
                                }}
                            />
                            {onlineUsers && onlineUsers.includes(user._id) && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                            )}
                        </div>

                        <div className='flex flex-col leading-5 flex-1'>
                            <p className="font-medium text-white group-hover:text-purple-200 transition-colors duration-200">
                                {user.username}
                            </p>
                            <span className={`text-xs transition-all duration-200 ${onlineUsers && onlineUsers.includes(user._id)
                                    ? 'text-green-400 animate-pulse'
                                    : 'text-gray-400'
                                }`}>
                                {onlineUsers && onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                            </span>
                        </div>

                        {unseenMessages && unseenMessages[user._id] > 0 && (
                            <div className='absolute top-3 right-3 text-xs h-5 w-5 flex justify-center items-center rounded-full text-white font-bold animate-bounce'
                                style={{
                                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(147, 51, 234, 0.9) 100%)',
                                    boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
                                }}>
                                {unseenMessages[user._id]}
                            </div>
                        )}

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/0 to-violet-600/0 group-hover:from-purple-400/5 group-hover:to-violet-600/5 transition-all duration-300 pointer-events-none"></div>
                    </div>
                ))}
            </div>

            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-5 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-20"></div>
                <div className="absolute bottom-20 right-8 w-1 h-1 bg-violet-400 rounded-full animate-pulse opacity-30"></div>
                <div className="absolute top-1/2 left-2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce opacity-25"></div>
            </div>

            {/* Custom scrollbar styles */}
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

export default Sidebar