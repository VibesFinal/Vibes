// utils/playSound.js

// إنشاء صوت باستخدام Web Audio API كبديل
const createBeepSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
    
    return true;
  } catch (error) {
    console.warn('Web Audio API not supported:', error);
    return false;
  }
};

export const playSound = () => {
  // محاولة تشغيل الملف الصوتي أولاً
  const audio = new Audio('/sound/reaction.mp3');
  audio.volume = 0.6;
  
  audio.play().catch((error) => {
    console.warn('Could not play audio file, using fallback sound:', error);
    // في حالة فشل تحميل الملف، استخدم الصوت البديل
    createBeepSound();
  });
};

// دالة بديلة لإنشاء ملف صوتي بسيط
export const createSoundFile = () => {
  // يمكن استخدام هذه الدالة لإنشاء ملف صوتي بسيط
  // أو يمكن للمطور إضافة ملف reaction.mp3 في مجلد public/sound/
  console.log('To fix the 404 error, add a reaction.mp3 file to public/sound/ directory');
};

// دالة للتحقق من وجود الملف الصوتي
export const checkSoundFile = async () => {
  try {
    const response = await fetch('/sound/reaction.mp3', { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};
