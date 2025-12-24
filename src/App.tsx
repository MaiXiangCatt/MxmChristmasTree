import { useState } from 'react';
import { Scene } from './components/Scene';
import type { SceneMode } from './types';

function App() {
  const [sceneMode, setSceneMode] = useState<SceneMode>('SCATTERED');
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const toggleMode = () => {
    setSceneMode(prev => prev === 'SCATTERED' ? 'FORMED' : 'SCATTERED');
  };

  return (
    <div className="w-full h-screen relative bg-black">
      <Scene 
        mode={sceneMode} 
        focusedId={focusedId} 
        onFocus={setFocusedId}
        onCloseFocus={() => setFocusedId(null)}
        onToggleMode={toggleMode}
      />

      {/* UI Overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none">
        <p className="text-white/30 text-xs tracking-widest uppercase animate-pulse">
           {!focusedId && 'Tap anywhere to transform'}
        </p>
      </div>

      {/* Title */}
      <div className="absolute top-10 left-10 z-10 pointer-events-none select-none">
        <h1 className="text-white text-4xl font-thin tracking-tighter">Merry Christmas</h1>
      </div>

      {/* Focus Overlay - Click outside to close is handled by Scene, but a button is nice too */}
      {focusedId && (
        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
             <button 
               onClick={() => setFocusedId(null)} 
               className="text-white/50 hover:text-white text-sm uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm cursor-pointer"
             >
               Close View
             </button>
        </div>
      )}
    </div>
  );
}

export default App;
