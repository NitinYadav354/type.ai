interface SoundConfigProps {
  soundMode: "mute" | "click1" | "click2";
  setSoundMode: (soundMode: "mute" | "click1" | "click2") => void;
  enableErrorSound: boolean;
  setEnableErrorSound: (enableErrorSound: boolean) => void;
  isBlindMode: boolean;
  setIsBlindMode: (isBlindMode: boolean) => void;
}

export const SoundConfig = ({
  soundMode, setSoundMode,
  enableErrorSound, setEnableErrorSound,
  isBlindMode, setIsBlindMode
}: SoundConfigProps) => {


  const soundIcons: Record<'mute' | 'click1' | 'click2', string> = {
    mute: '🔇',
    click1: '🔉',  
    click2: '🔊' 
    };

  const handleSoundToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();

    const modes: ('mute' | 'click1' | 'click2')[] = ['mute', 'click1', 'click2'];
    const currentIndex = modes.indexOf(soundMode);
    
    const nextIndex = (currentIndex + 1) % modes.length; 
    
    setSoundMode(modes[nextIndex]);
  };
  return (
      <div className="sound-config-buttons">
        <button
          className="config-toggle-btn"
          onClick={handleSoundToggle}
          title={`Sound Mode: ${soundMode}`}
          style={{ opacity: soundMode === 'mute' ? 0.5 : 1 }}
        >
          {soundIcons[soundMode as keyof typeof soundIcons]}
        </button>

        <button
          className="config-toggle-btn"
          onClick={(e) => {
            setEnableErrorSound(!enableErrorSound);
            e.currentTarget.blur();
          }}
          disabled={soundMode === 'mute'}
        >
          {enableErrorSound ? '🔔' : '🔕'}
        </button>

        <button
          className="config-toggle-btn"
          onClick={(e) => {
            setIsBlindMode(!isBlindMode);
            e.currentTarget.blur();
          }}
        >
          {isBlindMode ? '🙈' : '👁️'}
        </button>
      </div>
   
  );
};
