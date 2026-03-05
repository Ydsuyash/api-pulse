import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginModal = () => {
    const navigate = useNavigate();
    const { showLoginModal, setShowLoginModal } = useAuth();

    if (!showLoginModal) return null;

    const handleRedirect = () => {
        setShowLoginModal(false);
        navigate('/login');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl overflow-hidden group">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-colors duration-700" />

                <button
                    onClick={() => setShowLoginModal(false)}
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-300 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 rotate-3 group-hover:rotate-6 transition-transform duration-500">
                        <Lock className="text-white w-8 h-8" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-100 mb-3">
                        Unlock Full Potential
                    </h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        You've been exploring for a while! Sign in to start monitoring your own infrastructure and get real-time alerts.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={handleRedirect}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span>Sign In Now</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <p className="text-sm text-gray-500 pt-2">
                            New to API Pulse? <button onClick={() => { setShowLoginModal(false); navigate('/register'); }} className="text-indigo-400 hover:underline">Create an account</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
