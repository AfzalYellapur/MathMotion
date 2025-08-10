import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import LEDMatrix from "../LedMatrix/index";
import GlassyButton from "../ui/GlassyButton";

function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignin = () => {
        // Add your signup logic here
       

        console.log("Signin account:", formData);
        // After successful signup, you might want to navigate somewhere
        // navigate('/dashboard') or navigate('/login')
    };


    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen w-screen absolute top-0 left-0">
                <LEDMatrix />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.9)_5%,rgba(0,0,0,0.85)_15%,rgba(0,0,0,0.8)_20%,rgba(0,0,0,0.4)_60%,rgba(0,0,0,0)_75%)] -z-9" />

                <div className="relative z-10 bg-zinc-900/10 backdrop-blur-md border border-white/10 bg-gradient-to-b from-white/10 to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.1)] text-white/80 rounded-2xl p-8 w-full max-w-md mx-4">
                    <h1 className="font-pixelify font-bold text-4xl text-cyan-50 mb-2 text-center">
                        Welcome Back!
                    </h1>
                    <div className="space-y-4">

                        <div>
                            <label className="block text-sm text-cyan-50 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg 
                                         text-cyan-50 placeholder-neutral-400/70 
                                         focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30
                                         transition-all duration-200"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-cyan-50 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg 
                                         text-cyan-50 placeholder-neutral-400/70 
                                         focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30
                                         transition-all duration-200"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div className="mt-2 flex justify-center">
                            <GlassyButton
                                onClick={handleSignin}
                            >
                                Signin
                            </GlassyButton>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-neutral-300/90">
                           Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 underline"
                            >
                                Signup here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;