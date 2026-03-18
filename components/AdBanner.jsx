import { useState } from 'react';

export default function AdBanner() {
    const [visible, setVisible] = useState(true);
    
    if (!visible) return null;
    
    return (
        <div className="fixed bottom-4 right-4 z-[9999] w-80 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-6 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20 animate-float hover:scale-105 transition-all duration-300 group">
            <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    🛒
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-black text-xl leading-tight mb-1 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                        Bo'oivini Chat
                    </h3>
                    <p className="text-sm opacity-90 font-medium leading-relaxed">
                        Prix choc • Livraison 24h • +5000 produits
                    </p>
                </div>
            </div>
            <button 
                onClick={() => window.open('https://boovini.chat', '_blank')}
                className="mt-4 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-xs font-bold py-2.5 px-4 rounded-2xl border border-white/30 transition-all group-hover:bg-white/40 flex items-center justify-center space-x-2"
            >
                <span>🚀 Commander maintenant</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </button>
            <button 
                onClick={() => setVisible(false)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold backdrop-blur-sm"
            >
                ×
            </button>
        </div>
    );
}
