import { useState } from 'react';

export default function AdBanner() {
    const [show, setShow] = useState(true);
    if (!show) return null;
    
    return (
        <div className="fixed b-4 r-4 z-9999 w-72 bg-gradient-to-r from-purple-600 to-pink-500 p-5 rounded-2xl shadow-2xl hover:scale-105 transition-all">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex-center text-lg font-bold">
                    🛒
                </div>
                <div>
                    <h3 className="font-bold text-lg bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                        Bo'oivini Chat
                    </h3>
                    <p className="text-xs opacity-90">Prix choc • Livraison rapide</p>
                </div>
                <button onClick={() => setShow(false)} 
                        className="ml-auto w-6 h-6 bg-gray-800 hover:bg-red-500 rounded-full flex-center text-white text-xs">
                    ×
                </button>
            </div>
            <button onClick={() => window.open('https://boovini.chat', '_blank')}
                    className="mt-3 w-full bg-white/20 hover:bg-white/30 py-2 px-3 rounded-xl text-xs font-bold flex-center gap-1">
                Commander →
            </button>
        </div>
    );
}
