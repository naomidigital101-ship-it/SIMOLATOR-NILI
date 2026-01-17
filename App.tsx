
import React, { useState, useEffect, useRef } from 'react';
import { Character, CharacterType, DifficultyLevel, ArenaType } from './constants';
import { generateSimulationTurn, generateFinalSummary, generateDynamicCharacter, DetailedScore, playAudio } from './services/gemini';

// --- Premium Icons Section ---

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);

const MicIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={active ? "#f87171" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={active ? "animate-pulse" : ""}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

const ArenaIcon = ({ type }: { type: ArenaType }) => {
  switch (type) {
    case ArenaType.HRM:
      return (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#818cf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="#818cf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2522 22.1614 16.5523C21.6184 15.8524 20.8581 15.3516 20 15.13" stroke="#818cf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11768 19.0078 7.005C19.0078 7.89232 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#818cf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case ArenaType.SALES:
      return (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">
          <path d="M12 1V23" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case ArenaType.COACHING:
      return (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 16L16 12L12 8" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12H16" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
  }
};

const CircularProgress = ({ size = 60, strokeWidth = 6, percentage = 0, color = "#fbbf24", label = "" }: { size?: number, strokeWidth?: number, percentage: number, color?: string, label: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle className="text-white/5" stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
          <circle className="transition-all duration-1000 ease-out" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white">{Math.round(percentage)}%</div>
      </div>
      <span className="text-[7px] font-black uppercase text-slate-500 tracking-widest">{label}</span>
    </div>
  );
};

// --- App Component ---

interface UserSession {
  id: string;
  date: string;
  track: string;
  level: string;
  scores: DetailedScore;
}

const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string, age: number, domain: string, mode: 'voice' | 'text', customContext: string } | null>(null);
  const [history, setHistory] = useState<UserSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [loginAge, setLoginAge] = useState<number | ''>('');
  const [interactionMode, setInteractionMode] = useState<'voice' | 'text'>('text');
  const [customContext, setCustomContext] = useState('');
  
  const [selectedArena, setSelectedArena] = useState<ArenaType | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<CharacterType | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | null>(null);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [isBriefing, setIsBriefing] = useState(false);
  const [isLoadingChar, setIsLoadingChar] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mood, setMood] = useState(3); 
  const [isFinished, setIsFinished] = useState(false);
  const [scores, setScores] = useState<DetailedScore | null>(null);
  const [showCompliment, setShowCompliment] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');
  
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('bizpro_user');
    const savedHistory = localStorage.getItem('bizpro_history');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setLoginName(parsed.name);
      setLoginAge(parsed.age);
      setInteractionMode(parsed.mode || 'text');
      setCustomContext(parsed.customContext || '');
    }
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const updateProfileInSync = () => {
    if (!loginName.trim() || loginAge === '') return null;
    const newUser = { name: loginName.trim(), age: Number(loginAge), domain: selectedArena || 'HRM', mode: interactionMode, customContext };
    setUser(newUser);
    localStorage.setItem('bizpro_user', JSON.stringify(newUser));
    return newUser;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bizpro_user');
    setLoginName('');
    setLoginAge('');
    setSelectedArena(null);
    setSelectedTrack(null);
  };

  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { alert("נא לאשר גישה למיקרופון לצורך האימון."); }
  };

  const stopAndSendRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        handleSendMessage(null, base64Audio, 'audio/webm');
      };
      setIsRecording(false);
    };
    mediaRecorderRef.current.stop();
  };

  const handleSendMessage = async (e: React.FormEvent | null, audioBase64?: string, mimeType?: string) => {
    if (e) e.preventDefault();
    if (!audioBase64 && !inputText.trim()) return;
    if (!selectedChar || isTyping || isFinished) return;
    const userMsg = { id: Date.now().toString(), role: 'user', text: audioBase64 ? "🎤 הקלטה קולית..." : inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    try {
      const historyMsg = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));
      const result = await generateSimulationTurn(selectedChar, historyMsg, { text: audioBase64 ? undefined : inputText, audioBase64, mimeType });
      if (result.transcription) { setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, text: result.transcription } : m)); }
      setMood(prev => Math.min(5, Math.max(1, prev + result.moodDelta)));
      if (result.moodDelta > 0) {
        setShowCompliment(["מרשים!", "מקצועי!", "תשובה מעולה!", "בדיוק ככה!"][Math.floor(Math.random() * 4)]);
        setTimeout(() => setShowCompliment(null), 2500);
      }
      if (result.audioData) playAudio(result.audioData);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: result.text, tip: result.professionalismTip, timestamp: new Date() }]);
    } catch (err) { setMessages(prev => [...prev, { id: 'err', role: 'bot', text: 'חלה שגיאה בעיבוד הנתונים.' }]); } finally { setIsTyping(false); }
  };

  const handleFinish = async () => {
    setIsFinished(true);
    setIsTyping(true);
    const historyMsg = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));
    const scoreData = await generateFinalSummary(selectedChar!, historyMsg);
    setScores(scoreData);
    setIsTyping(false);
  };

  const handleSelectLevel = async (level: DifficultyLevel) => {
    if (!selectedTrack || !selectedArena || !user) return;
    setSelectedLevel(level);

    setIsLoadingChar(true);
    setLoadingStep(`מגייס דמות מומחית לזירת ${selectedArena === ArenaType.HRM ? 'משאבי אנוש' : selectedArena === ArenaType.SALES ? 'מכירות' : 'אימון עסקי'}...`);
    try {
      const char = await generateDynamicCharacter(selectedTrack, level, user.age, selectedArena, user.customContext);
      setSelectedChar(char);
      setIsBriefing(true);
    } catch (error) { 
      console.error(error);
      alert("שגיאה בחיבור למערכת. נסה שנית."); 
    } finally { setIsLoadingChar(false); }
  };

  const reset = () => { setSelectedArena(null); setSelectedTrack(null); setSelectedLevel(null); setSelectedChar(null); setIsBriefing(false); setMessages([]); setMood(3); setIsFinished(false); setScores(null); };

  const completionPercent = Math.min(100, (messages.length / 15) * 100);
  const moodPercent = (mood / 5) * 100;

  const isProfileComplete = loginName.trim() !== '' && loginAge !== '';

  const getArenaLabel = (type: ArenaType) => {
    switch (type) {
      case ArenaType.HRM: return "ניהול משאבי אנוש";
      case ArenaType.SALES: return "מכירות ושיווק";
      case ArenaType.COACHING: return "אימון וניהול עסקי";
    }
  };

  const getTrackLabels = (arena: ArenaType, type: CharacterType) => {
    const labels: Record<ArenaType, Record<CharacterType, { label: string, desc: string }>> = {
      [ArenaType.HRM]: {
        [CharacterType.INTERVIEWER]: { label: "ראיון גיוס", desc: "ראיון מקצועי לתפקידי HR או גיוס צוות." },
        [CharacterType.CUSTOMER]: { label: "ייעוץ פנים", desc: "סיוע למנהל מחלקה בקונפליקט בין עובדים." },
        [CharacterType.BOSS]: { label: "שיחת משוב", desc: "הצגת דוח הערכה או שיפור ביצועים להנהלה." }
      },
      [ArenaType.SALES]: {
        [CharacterType.INTERVIEWER]: { label: "ראיון מכירות", desc: "ראיון קבלה למשרת איש מכירות בכיר." },
        [CharacterType.CUSTOMER]: { label: "סגירת עסקה", desc: "מו\"מ מול לקוח אסטרטגי שמעלה התנגדויות." },
        [CharacterType.BOSS]: { label: "ישיבת יעדים", desc: "הצגת נתוני מכירות ותחזית שנתית למנהל." }
      },
      [ArenaType.COACHING]: {
        [CharacterType.INTERVIEWER]: { label: "שותפות עסקית", desc: "שיחת בירור מול שותף פוטנציאלי למיזם." },
        [CharacterType.CUSTOMER]: { label: "ייעוץ אסטרטגי", desc: "שיחת הכוונה מול לקוח שזקוק לשינוי ארגוני." },
        [CharacterType.BOSS]: { label: "בורד הנהלה", desc: "הצגת אסטרטגיה עסקית מול חברי הדירקטוריון." }
      }
    };
    return labels[arena][type];
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-5%] left-[-5%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-5%] right-[-5%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {selectedChar?.sceneUrl && !isFinished && (
        <div className="fixed inset-0 z-0 opacity-20 brightness-[0.4] transition-all duration-1000 scale-105 pointer-events-none" style={{ backgroundImage: `url(${selectedChar.sceneUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      )}

      {showCompliment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none animate-celebrate px-4">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-black px-8 md:px-16 py-4 md:py-8 rounded-full shadow-[0_0_80px_rgba(251,191,36,0.4)] text-2xl md:text-5xl font-black border-4 border-white/20">{showCompliment} ✨</div>
        </div>
      )}

      <header className="relative z-20 w-full bg-[#020617]/80 backdrop-blur-3xl border-b border-white/10 py-3 md:py-5 px-4 md:px-10 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
            <span className="font-black text-lg md:text-2xl text-black">B</span>
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-black tracking-tighter text-white uppercase leading-none">Biz-Pro <span className="text-amber-500">Gold</span></h1>
            <p className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">מצוינות בניהול ובמשאבי אנוש</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {user && (
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] md:text-sm bg-amber-500/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-amber-500/20 max-w-[100px] md:max-w-none truncate">
                <UserIcon /> <span className="truncate">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="text-[10px] text-slate-500 hover:text-white underline">התנתק</button>
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-7xl mx-auto w-full">
        {isLoadingChar ? (
          <div className="text-center animate-fadeIn">
            <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-8">
              <div className="absolute inset-0 border-[4px] md:border-[6px] border-amber-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-[4px] md:border-[6px] border-t-amber-500 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl md:text-4xl font-black mb-3 text-white tracking-tight animate-pulse px-4">{loadingStep}</h2>
          </div>
        ) : !user ? (
          <div className="w-full text-center animate-fadeIn space-y-12 py-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white via-white to-slate-600 bg-clip-text text-transparent leading-none">ברוך הבא למרכז האימון</h2>
              <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed px-4 italic">הכן את עצמך לעולם העבודה האמיתי</p>
            </div>

            <div className="max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-2xl p-6 md:p-12 rounded-[40px] border border-white/10 shadow-2xl space-y-10 text-right">
              <div className="flex items-center justify-between">
                <span className="bg-amber-500 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">שלב 1</span>
                <h3 className="text-2xl font-black text-white">פרופיל אישי והעדפות</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-400 text-xs font-black uppercase mb-2 mr-2">שם מלא</label>
                    <input type="text" value={loginName} onChange={e => setLoginName(e.target.value)} placeholder="הכנס שם..." className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-full text-white font-bold outline-none focus:border-amber-500 transition-all text-lg" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-black uppercase mb-2 mr-2">גיל</label>
                    <div className="relative">
                      <select value={loginAge} onChange={e => setLoginAge(e.target.value)} className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-full text-white font-bold outline-none focus:border-amber-500 appearance-none text-lg cursor-pointer transition-all">
                        <option value="" disabled className="bg-slate-900">בחר גיל...</option>
                        {Array.from({length: 48}, (_, i) => i + 13).map(age => (
                          <option key={age} value={age} className="bg-slate-900">גיל {age}</option>
                        ))}
                      </select>
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-400 text-xs font-black uppercase mb-2 mr-2">אופן השיחה המועדף</label>
                    <div className="flex gap-4">
                      <button onClick={() => setInteractionMode('voice')} className={`flex-1 py-4 rounded-full font-black transition-all border ${interactionMode === 'voice' ? 'bg-rose-500 text-white border-rose-500 shadow-lg' : 'bg-white/5 text-white border-white/10'}`}>הקלטה קולית</button>
                      <button onClick={() => setInteractionMode('text')} className={`flex-1 py-4 rounded-full font-black transition-all border ${interactionMode === 'text' ? 'bg-white/20 text-white border-white/20 shadow-lg' : 'bg-white/5 text-white border-white/10'}`}>כתיבת טקסט</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-black uppercase mb-2 mr-2">הקשר ספציפי (אופציונלי)</label>
                    <input type="text" value={customContext} onChange={e => setCustomContext(e.target.value)} placeholder="למשל: ראיון להייטק, קונפליקט בבנק..." className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-full text-white font-bold outline-none focus:border-amber-500 transition-all text-sm" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button onClick={updateProfileInSync} disabled={!isProfileComplete} className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black py-4 md:py-6 rounded-full font-black text-xl md:text-2xl shadow-xl disabled:opacity-40 transition-all hover:scale-[1.01]">המשך לבחירת זירה</button>
              </div>
            </div>
          </div>
        ) : !selectedArena ? (
          <div className="w-full text-center animate-fadeIn space-y-12 py-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase">בחר את זירת האימון</h2>
              <p className="text-slate-400 text-lg md:text-2xl font-medium">המערכת תתאים את הדמויות והתרחישים למומחיות שתבחר.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto px-4">
              {[ArenaType.HRM, ArenaType.SALES, ArenaType.COACHING].map(arena => (
                <button 
                  key={arena} 
                  onClick={() => setSelectedArena(arena)}
                  className="group relative bg-[#0f172a]/60 border border-white/5 p-10 rounded-[40px] hover:bg-[#1e293b]/80 hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-2xl flex flex-col items-center text-center border-t border-white/10"
                >
                  <div className="mb-8 group-hover:scale-110 transition-transform duration-500"><ArenaIcon type={arena} /></div>
                  <h3 className="text-3xl font-black text-white group-hover:text-amber-500 transition-colors mb-4">{getArenaLabel(arena)}</h3>
                  <p className="text-slate-400 text-xs font-bold leading-relaxed px-4 opacity-70 group-hover:opacity-100 transition-opacity">
                    {arena === ArenaType.HRM ? "ניהול עובדים, גיוס וקונפליקטים ארגוניים." : arena === ArenaType.SALES ? "מו\"מ עם לקוחות, סגירת עסקאות ושיווק." : "פיתוח מנהיגות, אסטרטגיה ומנטורשיפ עסקי."}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : !selectedTrack ? (
          <div className="w-full text-center animate-fadeIn space-y-12 py-8">
            <div className="space-y-4">
               <button onClick={() => setSelectedArena(null)} className="text-amber-500 text-xs font-black uppercase tracking-widest hover:underline">← חזרה לזירות</button>
               <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white">{getArenaLabel(selectedArena)}</h2>
               <p className="text-slate-400 text-lg md:text-2xl font-medium">בחר את סוג הסימולציה שתרצה לתרגל:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto px-4">
              {[CharacterType.INTERVIEWER, CharacterType.CUSTOMER, CharacterType.BOSS].map(track => {
                const info = getTrackLabels(selectedArena, track);
                return (
                  <button 
                    key={track} 
                    onClick={() => setSelectedTrack(track)}
                    className="group bg-[#0f172a]/60 border border-white/5 p-10 rounded-[40px] hover:bg-[#1e293b]/80 hover:-translate-y-2 transition-all duration-500 shadow-2xl flex flex-col items-center text-center"
                  >
                    <div className="mb-8 w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-3xl">{track === CharacterType.INTERVIEWER ? "🤝" : track === CharacterType.CUSTOMER ? "💬" : "🏢"}</div>
                    <h3 className="text-2xl font-black text-white group-hover:text-amber-500 transition-colors mb-4">{info.label}</h3>
                    <p className="text-slate-400 text-xs font-bold leading-relaxed">{info.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : !selectedLevel ? (
          <div className="w-full text-center animate-fadeIn space-y-12 max-w-5xl px-4">
            <div className="space-y-4">
               <button onClick={() => setSelectedTrack(null)} className="text-amber-500 text-xs font-black uppercase tracking-widest hover:underline">← חזרה למסלולים</button>
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">רמת מיומנות</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { level: DifficultyLevel.BEGINNER, label: "מתחיל", desc: "מיקוד ביסודות ובתקשורת ברורה.", color: "#34d399" },
                 { level: DifficultyLevel.ADVANCED, label: 'מתקדם', desc: 'סיטואציות מורכבות ודרישה למקצועיות.', color: '#818cf8' },
                 { level: DifficultyLevel.EXPERT, label: 'מומחה', desc: 'לחץ גבוה, ניהול משברים וקבלת החלטות.', color: '#fbbf24' }
               ].map(l => (
                 <button key={l.level} onClick={() => handleSelectLevel(l.level)} className="group relative bg-[#0f172a]/50 border border-white/10 p-10 rounded-[50px] hover:bg-[#1e293b]/70 transition-all duration-300 shadow-2xl flex flex-col items-center">
                   <div className="w-16 h-16 rounded-3xl mb-6 flex items-center justify-center border-2" style={{ borderColor: l.color, color: l.color }}><span className="font-black text-xl">{l.label[0]}</span></div>
                   <h3 className="text-2xl font-black text-white mb-4" style={{ color: l.color }}>{l.label}</h3>
                   <p className="text-slate-500 text-sm font-bold leading-relaxed">{l.desc}</p>
                 </button>
               ))}
            </div>
          </div>
        ) : isBriefing && selectedChar ? (
          <div className="w-full max-w-6xl bg-slate-900/60 backdrop-blur-3xl p-6 md:p-12 rounded-[60px] border border-white/10 shadow-2xl animate-slideUp flex flex-col md:flex-row gap-14 overflow-hidden">
             <div className="flex-1 space-y-8 text-right flex flex-col justify-between order-2 md:order-1 relative z-10">
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 uppercase">תיק מקרה: {selectedChar.name}</h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-amber-500 font-black uppercase tracking-[0.2em] bg-amber-500/5 px-4 py-1.5 rounded-full border border-amber-500/20 text-[10px]">{selectedChar.role}</span>
                      <span className="text-indigo-400 font-black uppercase tracking-[0.1em] bg-indigo-500/5 px-4 py-1.5 rounded-full border border-indigo-500/20 text-[10px]">זירה: {getArenaLabel(selectedArena!)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-800/40 p-7 rounded-[30px] border border-white/10 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500/30"></div>
                      <h4 className="font-black text-indigo-400 mb-2 text-[10px] uppercase tracking-widest border-b border-white/5 pb-2">נתוני המקרה (Case Study):</h4>
                      <p className="font-bold text-lg leading-relaxed whitespace-pre-line">{selectedChar.detailedBackground}</p>
                    </div>

                    <div className="bg-amber-500/5 p-7 rounded-[30px] border border-amber-500/10 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-2 h-full bg-amber-500/30"></div>
                      <h4 className="font-black text-amber-500 mb-2 text-[10px] uppercase tracking-widest border-b border-white/5 pb-2">האתגר המרכזי:</h4>
                      <p className="font-bold text-lg leading-relaxed italic">"{selectedChar.specificIssue}"</p>
                    </div>

                    <div className="bg-white/5 p-7 rounded-[30px] border border-white/5">
                      <h4 className="font-black text-slate-400 mb-1 text-[10px] uppercase tracking-widest">מטרת השיחה:</h4>
                      <p className="font-bold text-lg text-white">{selectedChar.goal}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button onClick={() => setIsBriefing(false)} className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black py-6 rounded-[30px] font-black text-2xl shadow-xl hover:scale-[1.02] transition-all">התחל סימולציה</button>
                </div>
             </div>

             <div className="md:w-5/12 order-1 md:order-2">
                <div className="relative h-full aspect-[4/5] rounded-[40px] overflow-hidden border-4 border-white/10 shadow-2xl">
                  <img src={selectedChar.avatar} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-8 text-right">
                    <h4 className="text-3xl font-black text-white">{selectedChar.name}</h4>
                    <p className="text-amber-500 font-bold text-sm uppercase">{selectedChar.role}</p>
                  </div>
                </div>
             </div>
          </div>
        ) : isFinished ? (
          <div className="w-full bg-[#0a0f1e]/95 backdrop-blur-3xl p-6 md:p-14 rounded-[70px] border border-white/10 shadow-2xl animate-slideUp flex flex-col h-[85vh]">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-8 bg-gradient-to-r from-white to-amber-500 bg-clip-text text-transparent uppercase">דו"ח הערכה מסכם</h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-8">
              {scores ? (
                <>
                  <div className="grid grid-cols-3 gap-6">
                    {[{ label: 'אינטליגנציה רגשית', val: scores.empathy }, { label: 'היגיון ארגוני', val: scores.businessLogic }, { label: 'מקצועיות', val: scores.professionalism }].map(s => (
                      <div key={s.label} className="bg-white/5 p-6 rounded-[40px] border border-white/10 text-center">
                        <div className="text-4xl font-black text-white mb-1">{s.val}%</div>
                        <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-amber-500/10 p-8 rounded-[50px] border border-amber-500/20 text-right">
                    <h3 className="text-2xl font-black text-amber-500 tracking-tight mb-4">משוב מסכם</h3>
                    <p className="text-white text-lg font-bold leading-relaxed italic">{scores.encouragement}</p>
                  </div>
                  <div className="bg-white/5 p-8 rounded-[50px] border border-white/5 text-right text-slate-200">
                    <h4 className="text-slate-400 font-black text-[xs] uppercase tracking-widest mb-6 border-b border-white/5 pb-2">ניתוח ביצועים מפורט</h4>
                    <div className="prose prose-invert prose-lg max-w-none leading-relaxed whitespace-pre-line">{scores.feedback}</div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-10">
                  <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-6"></div>
                  <div className="text-2xl text-white font-black">מחשב ציונים...</div>
                </div>
              )}
            </div>
            <button onClick={reset} className="w-full mt-6 bg-white text-black py-6 rounded-[40px] font-black text-2xl shadow-xl hover:bg-slate-200 transition-all">אימון חדש</button>
          </div>
        ) : selectedChar ? (
          <div className="w-full h-[85vh] flex flex-col bg-slate-900/60 backdrop-blur-3xl rounded-[70px] border border-white/10 shadow-2xl overflow-hidden relative">
             <div className="p-8 flex items-center justify-between border-b border-white/5 bg-slate-950/40">
                <div className="flex items-center gap-6">
                  <img src={selectedChar.avatar} className="w-16 h-16 rounded-[28px] object-cover border-4 border-white/10 shadow-2xl" alt="" />
                  <div>
                    <h3 className="text-2xl font-black text-white">{selectedChar.name}</h3>
                    <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">{selectedChar.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex gap-6 items-center">
                    <CircularProgress percentage={completionPercent} label="מיצוי שיחה" color="#3b82f6" size={35} strokeWidth={3} />
                    <CircularProgress percentage={moodPercent} label="מצב הדמות" color="#fbbf24" size={35} strokeWidth={3} />
                  </div>
                  <button onClick={handleFinish} className="bg-red-500/10 hover:bg-red-500/20 px-6 py-2.5 rounded-full text-xs font-black border border-red-500/30 text-red-400">סיים</button>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar flex flex-col">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
                    <div className={`max-w-[80%] flex flex-col ${m.role === 'user' ? 'items-start' : 'items-end'}`}>
                      <div className={`p-6 rounded-[40px] text-[18px] font-bold border ${m.role === 'user' ? 'bg-indigo-700 text-white rounded-bl-none border-indigo-500 shadow-xl' : 'bg-white/10 backdrop-blur-2xl text-white border-white/10 rounded-br-none shadow-2xl'}`}>{m.text}</div>
                      {m.tip && (
                        <div className="mt-4 bg-red-500/10 p-5 rounded-[25px] border border-red-500/20 text-xs text-red-400 font-black tracking-wide max-w-[300px] shadow-lg flex gap-3 items-center">
                          <span className="text-base">💡</span>
                          <span>טיפ מקצועי: {m.tip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && <div className="text-xs text-slate-500 font-black uppercase tracking-widest bg-white/5 px-8 py-4 rounded-full border border-white/5 w-fit animate-pulse">הדמות מגיבה...</div>}
                <div ref={messagesEndRef} />
             </div>

             <div className="p-8 bg-slate-950/80 border-t border-white/5 backdrop-blur-3xl">
                <div className="flex gap-4 max-w-5xl mx-auto items-center">
                   {user?.mode === 'voice' ? (
                     <div className="flex w-full gap-4 items-center justify-center">
                        <button onClick={startRecording} disabled={isRecording || isTyping} className={`flex-1 max-w-[200px] h-20 rounded-full flex items-center justify-center gap-3 font-black text-lg transition-all border ${isRecording ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}>
                          <MicIcon active={isRecording} />
                          {isRecording ? "מקליט..." : "התחל הקלטה"}
                        </button>
                        <button onClick={stopAndSendRecording} disabled={!isRecording || isTyping} className={`flex-1 max-w-[200px] h-20 rounded-full flex items-center justify-center gap-3 font-black text-lg transition-all border ${isRecording ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black border-amber-400 shadow-xl' : 'bg-white/5 border-white/10 text-slate-600 cursor-not-allowed'}`}>
                          <SendIcon />
                          שלח הקלטה
                        </button>
                     </div>
                   ) : (
                     <form onSubmit={(e) => handleSendMessage(e)} className="flex w-full gap-4 items-center">
                       <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="השב במקצועיות או בקש הבהרה..." className="flex-1 bg-white/5 border border-white/10 rounded-full px-10 py-7 focus:outline-none text-white font-bold text-lg focus:border-indigo-500 transition-colors" disabled={isTyping} />
                       <button type="submit" disabled={!inputText.trim() || isTyping} className="bg-gradient-to-r from-amber-400 to-amber-600 w-20 h-20 shrink-0 rounded-[40px] flex items-center justify-center shadow-xl disabled:opacity-40 transition-all"><SendIcon /></button>
                     </form>
                   )}
                </div>
             </div>
          </div>
        ) : null}
      </main>

      <footer className="relative z-10 w-full py-8 text-center border-t border-white/5 bg-[#020617]/60 backdrop-blur-xl px-4">
        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest leading-loose">
          Biz-Pro Gold Simulator • HRM, Sales & Coaching • פותח עבור מגמות ניהול עסקי • <span className="text-white font-black">נילי שרעבי</span> &copy; {new Date().getFullYear()}
        </p>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes celebrate { 0% { opacity: 0; transform: scale(0.6) translateY(30px); } 50% { opacity: 1; transform: scale(1.05) translateY(0); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .animate-celebrate { animation: celebrate 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.15); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
