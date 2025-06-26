import React, { useContext, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
    const { selectedUser, setSelectedUser } = useContext(ChatContext);
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const animationRef = useRef(null);
    const [showWelcome, setShowWelcome] = useState(true);
    const [showUsersList, setShowUsersList] = useState(false);
    
    // Enhanced mobile navigation state
    const [mobileView, setMobileView] = useState(() => {
        const mobile = window.innerWidth < 768;
        return mobile ? 'welcome' : 'users';
    });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Enhanced resize handler with mobile state management
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                // Reset to appropriate desktop view
                if (selectedUser) {
                    setMobileView('chat');
                } else {
                    setMobileView('users'); // Desktop doesn't need welcome screen
                }
            } else {
                // Mobile: show welcome if no user is selected and we're not already in a specific view
                if (!selectedUser && mobileView === 'users') {
                    setMobileView('welcome');
                    setShowWelcome(true);
                    setShowUsersList(false);
                }
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [selectedUser, mobileView]);

    // Handle "Go to Chat" button click
    const handleGoToChat = () => {
        setShowWelcome(false);
        setShowUsersList(true);
        setMobileView('users');
    };

    // Handle back to welcome from users list
    const handleBackToWelcome = () => {
        setShowUsersList(false);
        setShowWelcome(true);
        setMobileView('welcome');
    };

    // FIXED: Handle back to sidebar from chat - should go to users list, not welcome
    const handleBackToSidebar = () => {
        setSelectedUser(null);
        if (isMobile) {
            // Always go to users list when coming back from chat
            setMobileView('users');
            setShowWelcome(false);
            setShowUsersList(true);
        }
    };

    // Enhanced mobile navigation handlers
    const handleShowRightSidebar = () => {
        if (isMobile) {
            setMobileView('rightSidebar');
        }
    };

    const handleBackFromRightSidebar = () => {
        if (isMobile) {
            setMobileView('chat');
        }
    };

    // UPDATED: Mobile view logic when selectedUser changes
    useEffect(() => {
        if (isMobile) {
            if (selectedUser) {
                setMobileView('chat');
                setShowWelcome(false);
                setShowUsersList(false);
            } else {
                // FIXED: When no user is selected on mobile, check current state
                // If we're coming from chat (mobileView was 'chat'), go to users
                // Only show welcome if we're starting fresh or explicitly requested
                if (mobileView === 'chat' || mobileView === 'rightSidebar') {
                    setMobileView('users');
                    setShowWelcome(false);
                    setShowUsersList(true);
                } else if (mobileView === 'welcome') {
                    // Keep welcome state if already there
                    setShowWelcome(true);
                    setShowUsersList(false);
                }
            }
        }
    }, [selectedUser, isMobile]);

    // Particle animation for empty state
    useEffect(() => {
        if (!selectedUser && mountRef.current && (!isMobile || showWelcome)) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

            const container = mountRef.current;
            const rect = container.getBoundingClientRect();
            renderer.setSize(rect.width, rect.height);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);

            const particleCount = 150;
            const particles = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const colorPalette = [
                new THREE.Color(0xa855f7),
                new THREE.Color(0x8b5cf6),
                new THREE.Color(0x7c3aed),
                new THREE.Color(0x6d28d9),
                new THREE.Color(0xec4899),
            ];

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 10;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
                const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
            }

            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const particleMaterial = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true
            });

            const particleSystem = new THREE.Points(particles, particleMaterial);
            scene.add(particleSystem);

            const lineGeometry = new THREE.BufferGeometry();
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xa855f7,
                transparent: true,
                opacity: 0.3
            });

            camera.position.z = 5;

            const animate = () => {
                animationRef.current = requestAnimationFrame(animate);
                particleSystem.rotation.x += 0.001;
                particleSystem.rotation.y += 0.002;

                const posArray = particleSystem.geometry.attributes.position.array;
                for (let i = 0; i < particleCount; i++) {
                    posArray[i * 3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.001;
                }
                particleSystem.geometry.attributes.position.needsUpdate = true;

                const linePositions = [];
                for (let i = 0; i < particleCount; i++) {
                    for (let j = i + 1; j < particleCount; j++) {
                        const dx = posArray[i * 3] - posArray[j * 3];
                        const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
                        const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
                        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                        if (distance < 1.5) {
                            linePositions.push(
                                posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2],
                                posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2]
                            );
                        }
                    }
                }

                lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
                const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
                scene.remove(scene.getObjectByName('lines'));
                lines.name = 'lines';
                scene.add(lines);

                renderer.render(scene, camera);
            };

            animate();
            sceneRef.current = { scene, renderer, camera };

            return () => {
                if (animationRef.current) cancelAnimationFrame(animationRef.current);
                if (container && renderer.domElement) container.removeChild(renderer.domElement);
                renderer.dispose();
            };
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [selectedUser, showWelcome, isMobile]);

    // Resize handling for particle animation
    useEffect(() => {
        const handleResize = () => {
            if (sceneRef.current && mountRef.current) {
                const { renderer, camera } = sceneRef.current;
                const rect = mountRef.current.getBoundingClientRect();
                renderer.setSize(rect.width, rect.height);
                camera.aspect = rect.width / rect.height;
                camera.updateProjectionMatrix();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // MOBILE RENDERING LOGIC
    if (isMobile) {
        switch (mobileView) {
            case 'welcome':
                return (
                    <div className='w-full h-screen relative overflow-hidden flex items-center justify-center'
                        style={{
                            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(75, 85, 99, 0.3) 50%, rgba(17, 24, 39, 0.8) 100%)',
                        }}
                    >
                        {/* Background blur effects */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-20 right-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                        </div>

                        <div className='backdrop-blur-xl border-2 rounded-2xl overflow-hidden h-[90%] w-[90%] relative transition-all duration-500 flex flex-col items-center justify-center'
                            style={{
                                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.4) 0%, rgba(75, 85, 99, 0.2) 50%, rgba(17, 24, 39, 0.4) 100%)',
                                border: '2px solid rgba(168, 85, 247, 0.3)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
                            }}
                        >
                            <div ref={mountRef} className="absolute inset-0 z-0" style={{ mixBlendMode: 'screen' }} />

                            <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
                                <img
                                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23a855f7' opacity='0.3'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='40' font-family='Arial'%3E💬%3C/text%3E%3C/svg%3E"
                                    alt="Chat"
                                    className="w-24 h-24 animate-bounce"
                                />
                                <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600 bg-clip-text text-transparent animate-pulse'>
                                    Welcome to Orbix Chat
                                </h1>
                                <p className='text-white/80 text-lg'>Chat anytime, anywhere</p>
                                <p className='text-sm text-gray-400 text-center max-w-md leading-relaxed'>
                                    Connect with friends and family instantly. Start conversations, share moments, and stay in touch with the people who matter most.
                                </p>
                                
                                <button
                                    onClick={handleGoToChat}
                                    className='mt-6 px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95'
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(147, 51, 234, 0.9) 100%)',
                                        boxShadow: '0 10px 25px rgba(168, 85, 247, 0.3), 0 0 20px rgba(168, 85, 247, 0.2)',
                                        border: '1px solid rgba(168, 85, 247, 0.4)',
                                    }}
                                >
                                    Go to Chat 🚀
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'users':
                return (
                    <div className='w-full h-screen relative overflow-hidden'
                        style={{
                            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(75, 85, 99, 0.3) 50%, rgba(17, 24, 39, 0.8) 100%)',
                        }}
                    >
                        {/* Background blur effects */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-20 right-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        </div>

                        <div className='backdrop-blur-xl border-2 rounded-2xl overflow-hidden h-[100%] relative transition-all duration-500'
                            style={{
                                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.4) 0%, rgba(75, 85, 99, 0.2) 50%, rgba(17, 24, 39, 0.4) 100%)',
                                border: '2px solid rgba(168, 85, 247, 0.3)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
                            }}
                        >
                            <Sidebar onBackToWelcome={handleBackToWelcome} />
                        </div>
                    </div>
                );

            case 'chat':
                return (
                    <div className='w-full h-screen relative overflow-hidden'
                        style={{
                            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(75, 85, 99, 0.3) 50%, rgba(17, 24, 39, 0.8) 100%)',
                        }}
                    >
                        <div className='backdrop-blur-xl border-2 rounded-2xl overflow-hidden h-[100%] relative transition-all duration-500'
                            style={{
                                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.4) 0%, rgba(75, 85, 99, 0.2) 50%, rgba(17, 24, 39, 0.4) 100%)',
                                border: '2px solid rgba(168, 85, 247, 0.3)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
                            }}
                        >
                            <ChatContainer 
                                isMobile={isMobile} 
                                onShowRightSidebar={handleShowRightSidebar}
                                onBackToSidebar={handleBackToSidebar}
                            />
                        </div>
                    </div>
                );

            case 'rightSidebar':
                return (
                    <div className='w-full h-screen relative overflow-hidden'
                        style={{
                            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(75, 85, 99, 0.3) 50%, rgba(17, 24, 39, 0.8) 100%)',
                        }}
                    >
                        <div className='backdrop-blur-xl border-2 rounded-2xl overflow-hidden h-[100%] relative transition-all duration-500'
                            style={{
                                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.4) 0%, rgba(75, 85, 99, 0.2) 50%, rgba(17, 24, 39, 0.4) 100%)',
                                border: '2px solid rgba(168, 85, 247, 0.3)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
                            }}
                        >
                            <RightSidebar 
                                isMobile={isMobile} 
                                onBackFromRightSidebar={handleBackFromRightSidebar} 
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    }

    // DESKTOP LAYOUT - Enhanced grid layout with conditional rendering and FIXED HEIGHT
    return (
        <div className='w-full h-screen sm:px-[15%] sm:py-[5%] relative overflow-hidden'
            style={{
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(75, 85, 99, 0.3) 50%, rgba(17, 24, 39, 0.8) 100%)',
            }}
        >
            {/* Background blur effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className={`backdrop-blur-xl border-2 rounded-2xl overflow-hidden h-full grid relative transition-all duration-500
                ${selectedUser
                    ? 'md:grid-cols-[1fr_2fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
                    : 'md:grid-cols-2'}`}
                style={{
                    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.4) 0%, rgba(75, 85, 99, 0.2) 50%, rgba(17, 24, 39, 0.4) 100%)',
                    border: '2px solid rgba(168, 85, 247, 0.3)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
                }}
            >
                {/* LeftSidebar - Always visible on desktop with overflow hidden */}
                <div className="h-full overflow-hidden">
                    <Sidebar onBackToWelcome={null} />
                </div>

                {/* ChatContainer - Conditional rendering with proper height constraint */}
                {selectedUser ? (
                    <div className="h-full overflow-hidden">
                        <ChatContainer 
                            isMobile={isMobile}
                            onShowRightSidebar={handleShowRightSidebar}
                            onBackToSidebar={handleBackToSidebar}
                        />
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center h-full text-gray-500 max-md:hidden relative overflow-hidden'
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(255, 255, 255, 0.02) 100%)',
                        }}
                    >
                        <div ref={mountRef} className="absolute inset-0 z-0" style={{ mixBlendMode: 'screen' }} />

                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <img
                                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23a855f7' opacity='0.3'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='40' font-family='Arial'%3E💬%3C/text%3E%3C/svg%3E"
                                alt="Chat"
                                className="w-20 h-20 animate-bounce"
                            />
                            <h2 className='text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600 bg-clip-text text-transparent animate-pulse'>
                                Welcome to Orbix Chat
                            </h2>
                            <p className='text-white/80'>Chat anytime, anywhere</p>
                            <p className='text-sm text-gray-400 text-center max-w-md'>Select a conversation from the sidebar to start chatting.</p>
                        </div>
                    </div>
                )}

                {/* RightSidebar - Conditional rendering for desktop with overflow hidden */}
                {selectedUser && (
                    <div className="h-full overflow-hidden">
                        <RightSidebar 
                            isMobile={isMobile} 
                            onBackFromRightSidebar={handleBackFromRightSidebar} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;