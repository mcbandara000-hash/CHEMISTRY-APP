import React, { useState, useEffect } from "react";
import {
  Compass,
  Flame,
  Award,
  Atom,
  Coins,
  LogOut,
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Clock,
  Settings,
  HelpCircle,
  Trophy,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Cpu,
  Zap,
  User,
  ShoppingBag,
  ChevronRight,
  PlusCircle,
  Dna,
  RefreshCw,
  X
} from "lucide-react";
import { Question, UserProfile, LeaderboardEntry, Topic, Badge } from "./types";
import { PRESET_QUESTIONS, TOPICS, BADGES_LIST } from "./questionsData";

const COMPANION_DECK = [
  {
    category: "FLAME TESTS",
    category_si: "දැල් වර්ණ පරීක්ෂාව",
    title_si: "s-ගොනුව සහ සාරවත් දැල් වර්ණ",
    items: [
      { key: "Li⁺ (Lithium)", val: "Crimson Red (තද ලෝහ රතු)" },
      { key: "Na⁺ (Sodium)", val: "Golden Yellow (රන්වන් කහ)" },
      { key: "K⁺ (Potassium)", val: "Lilac (ලා දම්)" },
      { key: "Ca²⁺ (Calcium)", val: "Brick Red (ගඩොල් රතු)" },
      { key: "Ba²⁺ (Barium)", val: "Apple Green (ඇපල් කොළ)" },
      { key: "Cu²⁺ (Copper)", val: "Bluish Green (නිල්-කොළ)" },
      { key: "Sr²⁺ (Strontium)", val: "Crimson Red (දම් රතු)" }
    ]
  },
  {
    category: "ION COLORS",
    category_si: "ජලීය කැටායන වර්ණ",
    title_si: "ජලීය සංක්‍රාන්ති ලෝහ කැටායන වර්ණ ප්‍රවණතා",
    items: [
      { key: "[Cu(H₂O)₆]²⁺", val: "Pale Blue (ලා නිල්) 🟦" },
      { key: "[Fe(H₂O)₆]²⁺", val: "Pale Green (ලා කොළ) 🟩" },
      { key: "[Fe(H₂O)₆]³⁺", val: "Yellow-Brown (කහ-දුඹුරු) 🟨" },
      { key: "[Cr(H₂O)₆]³⁺", val: "Green / Violet (ලා කොළ හෝ දම්) 🟪" },
      { key: "[Mn(H₂O)₆]²⁺", val: "Pale Pink (ලා රෝස) 🌸" },
      { key: "[Co(H₂O)₆]²⁺", val: "Pink (රෝස) 💗" },
      { key: "[Ni(H₂O)₆]²⁺", val: "Green (කොළ) 🟢" }
    ]
  },
  {
    category: "SOLUBILITY RULES",
    category_si: "ද්‍රාව්‍යතා නීති",
    title_si: "අකාබනික ලවණ ජලීය ද්‍රාව්‍යතා ප්‍රවණතා",
    items: [
      { key: "Nitrates (NO₃⁻)", val: "සියල්ලම ජල ද්‍රාව්‍ය වේ" },
      { key: "Halides (Cl⁻/Br⁻/I⁻)", val: "ජල ද්‍රාව්‍ය වේ (Ag⁺, Pb²⁺, Hg₂²⁺ හැර)" },
      { key: "Sulfates (SO₄²⁻)", val: "ජල ද්‍රාව්‍ය වේ (Ba²⁺, Pb²⁺, Ca²⁺, Sr²⁺ හැර)" },
      { key: "Hydroxides (OH⁻)", val: "අද්‍රාව්‍ය වේ (group 1/NH₄⁺ හැර, Ca²⁺/Ba²⁺ මඳක් ද්‍රාව්‍යයි)" },
      { key: "Carbonates (CO₃²⁻)", val: "අද්‍රාව්‍ය වේ (Group 1 හා NH₄⁺ හැර)" }
    ]
  },
  {
    category: "GAS CHEMISTRY",
    category_si: "වායූන් හඳුනාගැනීම",
    title_si: "ප්‍රධාන වායූන් සඳහා වන විශේෂ සහතික පරීක්ෂා",
    items: [
      { key: "NO₂ වායුව", val: "දුඹුරු පැහැති වායුවකි, තෙත් නිල් ලිට්මස් රතු කරයි" },
      { key: "NH₃ වායුව", val: "තීව්‍ර ගන්ධැති සේරි වායුව, HCl සමඟ ඝන සුදු දුම් සාදයි" },
      { key: "H₂S වායුව", val: "කුණු බිත්තර ගඳැති වායුව, Pb(CH₃COO)₂ කඩදාසි කළු කරයි" },
      { key: "SO₂ වායුව", val: "සල්ෆර් දැවෙන ගන්ධය, ආම්ලික KMnO₄ ද්‍රාවණය අවර්ණ කරයි" },
      { key: "Cl₂ වායුව", val: "කොළ පැහැයට හුරු කහ වායුව, පිෂ්ඨ-KI කඩදාසි නිල් පැහැ ගන්වයි" }
    ]
  },
  {
    category: "PRECIPITATE COLORS",
    category_si: "අවක්ෂේපවල වර්ණ",
    title_si: "ලක්ෂණික ලෝහ හයිඩ්‍රොක්සයිඩ් අවක්ෂේප සහ ප්‍රතික්‍රියා",
    items: [
      { key: "Fe(OH)₂", val: "සුදු-කොළ අපිරිසිදු අවක්ෂේපය (Dirty Green) 🤢" },
      { key: "Fe(OH)₃", val: "රතු-දුඹුරු අවක්ෂේපය (Reddish Brown) 🟤" },
      { key: "Cu(OH)₂", val: "ලා නිල් අවක්ෂේපය (NH₃ වැඩිපුර දැමූවිට [Cu(NH₃)₄]²⁺ තද නිල් වේ)" },
      { key: "Al(OH)₃ / Zn(OH)₂", val: "ජෙලටිනීකරණ සුදු අවක්ෂේපය (NaOH වැඩිපුර දැමූවිට දියවේ)" },
      { key: "Mn(OH)₂", val: "ලා රෝස පැහැ අවක්ෂේපය (තබා ඇතිවිට ඔක්සිකරණයෙන් දුඹුරු වේ)" }
    ]
  },
  {
    category: "INDICATOR COLORS",
    category_si: "දර්ශක වර්ණ",
    title_si: "අම්ල-භෂ්ම දර්ශකවල වර්ණ පරාස",
    items: [
      { key: "phenolphthalein", val: "අම්ල: අවර්ණ | භෂ්ම: තද රෝස පැහැය (Pink) 🌸" },
      { key: "Methyl Orange", val: "අම්ල: රතු පැහැය | භෂ්ම: කහ පැහැය (Yellow) 🟨" },
      { key: "Litmus Paper", val: "අම්ල: නිල් සිට රතු | භෂ්ම: රතු සිට නිල් 🔄" },
      { key: "Thymol Blue", val: "අම්ල: රතු (pH 1.2-2.8) | භෂ්ම: නිල් (pH 8.0-9.6) 🔵" }
    ]
  },
  {
    category: "GROUP 2 TRENDS",
    category_si: "කාණ්ඩ 2 ප්‍රවණතා",
    title_si: "කාණ්ඩ 2 කැටායනවල තාප ස්ථායීතාව සහ ද්‍රාව්‍යතාවය",
    items: [
      { key: "ප්‍රකාශ කෝණී ස්ථායීතාවය", val: "BeCO₃ < MgCO₃ < CaCO₃ < SrCO₃ < BaCO₃ (පහළට වැඩිවේ)" },
      { key: "සල්ෆේට් ද්‍රාව්‍යතාවය", val: "BeSO₄ > MgSO₄ > CaSO₄ > SrSO₄ > BaSO₄ (පහළට අඩුවේ)" },
      { key: "හයිඩ්‍රොක්සයිඩ් ද්‍රාව්‍යතාවය", val: "Be(OH)₂ < Mg(OH)₂ < Ca(OH)₂ < Sr(OH)₂ < Ba(OH)₂ (පහළට වැඩිවේ)" },
      { key: "හයිඩ්‍රොක්සයිඩ් භෂ්මීකරණ ශක්තිය", val: "පහළට යාමේදී භෂ්මීකරණ ප්‍රබලතාව ක්‍රමයෙන් වැඩිවේ" }
    ]
  }
];

export default function App() {
  // Logo intro animation state
  const [isAnimatingIntro, setIsAnimatingIntro] = useState(true);

  // Authentication screens state: "landing" | "signin" | "signup"
  const [authScreen, setAuthScreen] = useState<"landing" | "signin" | "signup">("landing");

  // Email & Password values for secure lookup
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authUsername, setAuthUsername] = useState(""); // Used in signup Form

  // Authentication / Identity state after registration/login
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("chem_al_username") || "";
  });
  const [tempUsername, setTempUsername] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [topics, setTopics] = useState<Topic[]>(TOPICS);
  const [activeTab, setActiveTab] = useState<"overview" | "topics" | "ai-gen" | "leaderboard" | "shop">("overview");
  const [refTab, setRefTab] = useState<"flame" | "solub" | "colors">("flame");
  const [companionCardIndex, setCompanionCardIndex] = useState(0);
  const [companionTimer, setCompanionTimer] = useState(60);

  // Quiz execution state
  const [activeQuiz, setActiveQuiz] = useState<{
    questions: Question[];
    currentIndex: number;
    chosenIndex: number | null;
    timer: number;
    maxTime: number;
    isLocked: boolean;
    disabledOptions: number[]; // For 50:50 power-up
    stats: {
      correctCount: number;
      wrongCount: number;
      xpGained: number;
      coinsGained: number;
      skippedIndices: number[];
    };
  } | null>(null);

  // AI Generation configuration state (supports Gemini & DeepSeek engines)
  const [aiGenConfig, setAiGenConfig] = useState({
    topic: "periodic",
    subtopic: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
    engine: "gemini" as "gemini" | "deepseek"
  });
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<string | null>(null);

  // General Notification messages
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Custom confirmation dialog state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    isDanger: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "ඔව්",
    cancelText: "නැත",
    isDanger: false,
    onConfirm: () => {}
  });

  // Timer reference
  const quizTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Toast helper
  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch / Sync User Profile from Express server
  const fetchProfile = async (uName: string) => {
    try {
      const res = await fetch(`/api/user/profile?username=${encodeURIComponent(uName)}`);
      if (res.ok) {
        const data: UserProfile = await res.json();
        setProfile(data);
      } else {
        showToast("පැතිකඩ දත්ත ලබා ගැනීමට නොහැකි විය.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("සේවාදායකය සමඟ සම්බන්ධ විය නොහැක.", "error");
    }
  };

  // Fetch updated topics withdynamic lengths
  const fetchTopics = async () => {
    try {
      const res = await fetch("/api/topics");
      if (res.ok) {
        const data = await res.json();
        setTopics(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch leaderboards
  const fetchLeaderboard = async (uName: string) => {
    try {
      const res = await fetch(`/api/leaderboard?username=${encodeURIComponent(uName)}`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Intro animation ticking effect (nuclear charge loading)
  const [introProgress, setIntroProgress] = useState(0);
  useEffect(() => {
    if (isAnimatingIntro) {
      const interval = setInterval(() => {
        setIntroProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5; // increment smoothly
        });
      }, 95);

      const timer = setTimeout(() => {
        setIsAnimatingIntro(false);
      }, 2500); // 2.5 seconds total intro length

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isAnimatingIntro]);

  // Sync initialization on username block
  useEffect(() => {
    if (username) {
      fetchProfile(username);
      fetchLeaderboard(username);
      fetchTopics();
    }
  }, [username]);

  // Dynamic Companion rotation timer ticking every second
  useEffect(() => {
    if (!username) return;
    const interval = setInterval(() => {
      setCompanionTimer(prev => {
        if (prev <= 1) {
          // Select next random card with different category than current index to enable organic learning
          setCompanionCardIndex(curr => {
            const nextIdx = Math.floor(Math.random() * COMPANION_DECK.length);
            if (nextIdx === curr) {
              return (curr + 1) % COMPANION_DECK.length;
            }
            return nextIdx;
          });
          return 60; // reset 60 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [username]);

  const handleRollCompanion = () => {
    setCompanionCardIndex(curr => {
      const nextIdx = Math.floor(Math.random() * COMPANION_DECK.length);
      if (nextIdx === curr) {
        return (curr + 1) % COMPANION_DECK.length;
      }
      return nextIdx;
    });
    setCompanionTimer(60); // Reset timer
  };

  // Sync leaderboard when opening its tab
  useEffect(() => {
    if (username && activeTab === "leaderboard") {
      fetchLeaderboard(username);
    }
  }, [activeTab]);

  // New secure email & password Signup handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[DEBUG] handleSignUpSubmit called with:", {
      authEmail: authEmail.trim(),
      authUsername: authUsername.trim(),
      hasPassword: !!authPassword.trim()
    });
    const email = authEmail.trim();
    const uname = authUsername.trim();
    const pass = authPassword.trim();

    if (!email || !uname || !pass) {
      showToast("සියලුම ක්ෂේත්‍ර (Email, නම, මුරපදය) පිරවීම අනිවාර්ය වේ!", "error");
      return;
    }

    try {
      showToast("ගිණුම නිර්මාණය කරමින් පවතී...", "info");
      const res = await fetch("/api/portal/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username: uname, password: pass })
      });

      console.log("[DEBUG] signup response status:", res.status);
      const data = await res.json();
      console.log("[DEBUG] signup response data:", data);

      if (res.ok) {
        localStorage.setItem("chem_al_username", data.username);
        setUsername(data.username);
        setProfile(data.profile);
        showToast(`ගිණුම සාර්ථකව සැකසිණි! සාදරයෙන් පිළිගනිමු ${data.username}!`, "success");
        // Clear auth entries
        setAuthEmail("");
        setAuthPassword("");
        setAuthUsername("");
      } else {
        showToast(data.error || "ගිණුම නිර්මාණය කිරීමට නොහැකි විය.", "error");
      }
    } catch (err) {
      console.error("[DEBUG] signup error occurred:", err);
      showToast("ලියාපදිංචි වීමේ සන්නිවේදන දෝෂයකි.", "error");
    }
  };

  // New secure email & password Signin handler
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[DEBUG] handleSignInSubmit called with:", {
      authEmail: authEmail.trim(),
      hasPassword: !!authPassword.trim()
    });
    const email = authEmail.trim();
    const pass = authPassword.trim();

    if (!email || !pass) {
      showToast("විද්‍යුත් තැපෑල සහ මුරපදය ඇතුළත් කිරීම අනිවාර්ය වේ!", "error");
      return;
    }

    try {
      showToast("විස්තර තහවුරු කරමින් පවතී...", "info");
      const res = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass })
      });

      console.log("[DEBUG] signin response status:", res.status);
      const data = await res.json();
      console.log("[DEBUG] signin response data:", data);

      if (res.ok) {
        localStorage.setItem("chem_al_username", data.username);
        setUsername(data.username);
        setProfile(data.profile);
        showToast(`සාර්ථකව ප්‍රවිෂ්ට විය! සාදරයෙන් පිළිගනිමු, ${data.username}!`, "success");
        // Clear auth entries
        setAuthEmail("");
        setAuthPassword("");
        setAuthUsername("");
      } else {
        showToast(data.error || "විද්‍යුත් තැපෑල හෝ මුරපදය වැරදියි.", "error");
      }
    } catch (err) {
      console.error("[DEBUG] signin error occurred:", err);
      showToast("පිවිසීමේ සන්නිවේදන දෝෂයකි.", "error");
    }
  };

  // Handle Login submission (Legacy Fallback)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tempUsername.trim();
    if (!clean) {
      showToast("කරුණාකර වලංගු නමක් ඇතුලත් කරන්න.", "error");
      return;
    }
    localStorage.setItem("chem_al_username", clean);
    setUsername(clean);
    showToast(`ආයුබෝවන්, ${clean}! ක්‍රීඩාවට සූදානම් වෙන්න.`, "success");
  };

  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: "පද්ධතියෙන් නික්ම යාම (Sign Out)",
      message: "ඔබට මෙම ගිණුමෙන් ක්‍රීඩාවෙන් නික්ම යාමට අවශ්‍යද?",
      confirmText: "ඔව්, නික්මෙන්න (Sign Out)",
      cancelText: "ප්‍රතික්ෂේප කරන්න (Cancel)",
      isDanger: true,
      onConfirm: () => {
        localStorage.removeItem("chem_al_username");
        setUsername("");
        setProfile(null);
        setActiveQuiz(null);
        setAuthScreen("landing"); // Return back to first portal choice
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast("සාර්ථකව නික්ම යන ලදී!", "success");
      }
    });
  };

  // Reset progress endpoint
  const handleResetProgress = () => {
    setConfirmModal({
      isOpen: true,
      title: "ක්‍රීඩා ප්‍රගතිය මකා දැමීම (Reset Progress)",
      message: "ඔබගේ වත්මන් ප්‍රගතිය, උපයාගත් කාසි සහ XP සියල්ලම මකා දැමීමට අවශ්‍යද? මෙම ක්‍රියාව ආපසු හැරවිය නොහැක!",
      confirmText: "ඔව්, ප්‍රගතිය මකන්න (Reset)",
      cancelText: "ප්‍රතික්ෂේප කරන්න (Cancel)",
      isDanger: true,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch("/api/user/reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
          });
          if (res.ok) {
            const resetProfile = await res.json();
            setProfile(resetProfile);
            showToast("ඔබේ ප්‍රගතිය සාර්ථකව යළි පිහිටුවන ලදී!", "success");
          }
        } catch (e) {
          showToast("යළි පිහිටුවීම අසාර්ථක විය.", "error");
        }
      }
    });
  };

  // Run countdown inside quiz state
  useEffect(() => {
    if (activeQuiz && !activeQuiz.isLocked) {
      quizTimerRef.current = setTimeout(() => {
        if (activeQuiz.timer <= 1) {
          // Time expired! Automatic incorrect submission
          handleAnswerOptionClick(-1, false);
        } else {
          setActiveQuiz(prev => {
            if (!prev) return null;
            return {
              ...prev,
              timer: prev.timer - 1
            };
          });
        }
      }, 1000);
    }

    return () => {
      if (quizTimerRef.current) {
        clearTimeout(quizTimerRef.current);
      }
    };
  }, [activeQuiz]);

  // Start focused quiz session
  const startQuiz = async (topicId: string | "mixed") => {
    try {
      showToast("ප්‍රශ්න සූදානම් කරමින් පවතී...", "info");
      const res = await fetch(`/api/questions?topic=${topicId}&limit=10`);
      if (res.ok) {
        const questions: Question[] = await res.json();
        if (questions.length === 0) {
          showToast("මෙම මාතෘකාව යටතේ ප්‍රශ්න නොමැත! වෙනත් එකක් තෝරන්න.", "error");
          return;
        }

        setActiveQuiz({
          questions,
          currentIndex: 0,
          chosenIndex: null,
          timer: 45, // Default 45s per question
          maxTime: 45,
          isLocked: false,
          disabledOptions: [],
          stats: {
            correctCount: 0,
            wrongCount: 0,
            xpGained: 0,
            coinsGained: 0,
            skippedIndices: []
          }
        });
      }
    } catch (e) {
      showToast("ප්‍රශ්න පූරණය කිරීමේ දෝෂයක්.", "error");
    }
  };

  // Submit selected answer or handle time expiry
  const handleAnswerOptionClick = async (optionIdx: number, forceTimeOut: boolean = false) => {
    if (!activeQuiz || activeQuiz.isLocked) return;

    // Clear active timeouts immediately
    if (quizTimerRef.current) clearTimeout(quizTimerRef.current);

    const question = activeQuiz.questions[activeQuiz.currentIndex];
    const isCorrect = optionIdx === question.correctIndex;

    // XP rules: base +10XP: medium multiplier at 3, high at 5, epic at 10.
    const levelModifier = question.difficulty === "hard" ? 15 : question.difficulty === "medium" ? 10 : 5;
    const isStreakActive = profile ? profile.streak : 0;
    
    // Update local quiz object
    setActiveQuiz(prev => {
      if (!prev) return null;
      const stepStats = { ...prev.stats };
      if (isCorrect) {
        stepStats.correctCount += 1;
        stepStats.xpGained += levelModifier;
        stepStats.coinsGained += 5; // 5 base coins per correct answer
      } else {
        stepStats.wrongCount += 1;
      }

      return {
        ...prev,
        chosenIndex: optionIdx,
        isLocked: true,
        stats: stepStats
      };
    });

    // Send payload to backend to register in DB state
    try {
      const res = await fetch("/api/questions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          questionId: question.id,
          chosenIndex: optionIdx,
          isCorrect,
          xpPlus: levelModifier,
          coinsPlus: 5
        })
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
      }
    } catch (e) {
      console.error("Back-end synchronization failed:", e);
    }
  };

  // Go to next question or complete quiz
  const handleNextQuestion = () => {
    if (!activeQuiz) return;

    if (activeQuiz.currentIndex + 1 >= activeQuiz.questions.length) {
      // Completed! Save state and return
      showToast("ප්‍රශ්නාවලිය සාර්ථකව අවසන් කරන ලදී!", "success");
      fetchTopics(); // refresh counts & dynamic parameters
    }

    setActiveQuiz(prev => {
      if (!prev) return null;
      const isEnd = prev.currentIndex + 1 >= prev.questions.length;
      if (isEnd) {
        // We will keep active session loaded but with counter finished so we display Summary Screen
        return {
          ...prev,
          currentIndex: prev.currentIndex + 1 // trigger summary
        };
      } else {
        return {
          ...prev,
          currentIndex: prev.currentIndex + 1,
          chosenIndex: null,
          timer: 45,
          maxTime: 45,
          isLocked: false,
          disabledOptions: []
        };
      }
    });
  };

  // Lifeline Use Trigger
  const useLifeline = async (type: "fiftyFifty" | "doubleTime" | "skip") => {
    if (!activeQuiz || activeQuiz.isLocked) return;
    if (!profile) return;

    if (profile.inventory[type] <= 0) {
      showToast("මෙම උපකාරකය ඔබ සතුව නැත! දකුණු පස ඇති ගබඩාවෙන් මිලදී ගන්න.", "error");
      return;
    }

    if (type === "fiftyFifty") {
      if (activeQuiz.disabledOptions.length > 0) {
        showToast("මෙම ප්‍රශ්නයට දැනටමත් 50:50 භාවිතා කර ඇත.", "info");
        return;
      }
      const currentQ = activeQuiz.questions[activeQuiz.currentIndex];
      const correctIdx = currentQ.correctIndex;
      // Get all wrong options
      const wrongIndices = [0, 1, 2, 3, 4].filter(idx => idx !== correctIdx);
      // Randomly select 2 wrong options to disable
      const toDisable = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);

      setActiveQuiz(prev => {
        if (!prev) return null;
        return {
          ...prev,
          disabledOptions: toDisable
        };
      });

      // Update backend profile stats
      deductLifelineItem(type);
      showToast("වැරදි පිළිතුරු 2ක් ඉවත් කරන ලදී!", "success");

    } else if (type === "doubleTime") {
      setActiveQuiz(prev => {
        if (!prev) return null;
        return {
          ...prev,
          timer: prev.timer + 30,
          maxTime: prev.maxTime + 30
        };
      });
      deductLifelineItem(type);
      showToast("තත්පර 30 ක අමතර කාලයක් එකතු කරන ලදී!", "success");

    } else if (type === "skip") {
      // Mark as skipped in statistics and go to next
      setActiveQuiz(prev => {
        if (!prev) return null;
        const stateStats = { ...prev.stats };
        stateStats.skippedIndices.push(prev.currentIndex);
        
        const isEnd = prev.currentIndex + 1 >= prev.questions.length;
        return {
          ...prev,
          currentIndex: prev.currentIndex + 1,
          chosenIndex: null,
          timer: 45,
          maxTime: 45,
          isLocked: false,
          disabledOptions: [],
          stats: stateStats
        };
      });
      deductLifelineItem(type);
      showToast("ප්‍රශ්නය මඟ හරින ලදී!", "success");
    }
  };

  const deductLifelineItem = async (type: string) => {
    if (!profile) return;
    // Call server to persist profile status locally but with fake coin update representing inventory count decrease
    // For fast offline gameplay responsiveness, let's update state directly
    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          [type]: Math.max(0, prev.inventory[type as keyof typeof prev.inventory] - 1)
        }
      };
    });
  };

  // Buy power-up from server
  const purchasePowerUp = async (type: "fiftyFifty" | "doubleTime" | "skip") => {
    if (!username || !profile) return;
    
    const PRICES = { fiftyFifty: 30, doubleTime: 20, skip: 40 };
    const labelSi = type === "fiftyFifty" ? "50:50 උපකාරය" : type === "doubleTime" ? "අමතර කාලය" : "ප්‍රශ්නය මඟ හැරීම";
    
    if (profile.coins < PRICES[type]) {
      showToast(`ප්‍රමාණවත් කාසි නොමැත! ${labelSi} සඳහා කාසි ${PRICES[type]} ක් අවශ්‍යයි.`, "error");
      return;
    }

    try {
      const res = await fetch("/api/user/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, powerUpType: type })
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        showToast(`${labelSi} සාර්ථකව මිලදී ගන්නා ලදී!`, "success");
      } else {
        const errData = await res.json();
        showToast(errData.error || "මිලදී ගැනීම අසාර්ථක විය.", "error");
      }
    } catch (e) {
      showToast("සේවාදායකය සමඟ සම්බන්ධතා දෝෂයකි.", "error");
    }
  };

  // Premium Gemini AI Question Producer
  const handleGenerateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiGenerating(true);
    setAiError(null);
    showToast("Gemini 3.5 අධි-තාක්ෂණික ආකෘතිය මඟින් ප්‍රශ්නය සකසමින් පවතී...", "info");

    try {
      const res = await fetch("/api/questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiGenConfig)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.question) {
          showToast("අති සාර්ථකයි! AI ප්‍රශ්නය සූදානම්.", "success");
          
          // Clear active panel and boot quiz directly with just this single customized question!
          setActiveQuiz({
            questions: [data.question],
            currentIndex: 0,
            chosenIndex: null,
            timer: 60, // Give 60 seconds of space to read tricky AI generated MCQs
            maxTime: 60,
            isLocked: false,
            disabledOptions: [],
            stats: {
              correctCount: 0,
              wrongCount: 0,
              xpGained: 0,
              coinsGained: 0,
              skippedIndices: []
            }
          });
        }
      } else {
        const errorMsg = await res.json();
        setAiError(errorMsg.error || "Gemini ආකෘතිය සම්බන්ධ කරගැනීමට නොහැකි විය.");
        showToast("Gemini ප්‍රශ්න නිෂ්පාදනය අසාර්ථක විය.", "error");
      }
    } catch (e: any) {
      setAiError(e.message || "සන්නිවේදන දෝෂයක් සිදුවිය.");
      showToast("වෙඩිතැබීමේදී දෝෂයක් හටගති.", "error");
    } finally {
      setAiGenerating(false);
    }
  };

  // Get localized icon component helper
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Compass": return <Compass className="w-8 h-8 text-blue-400" />;
      case "Flame": return <Flame className="w-8 h-8 text-orange-500 animate-pulse" />;
      case "Award": return <Award className="w-8 h-8 text-emerald-400" />;
      case "Atom": return <Atom className="w-8 h-8 text-indigo-400" />;
      case "Coins": return <Coins className="w-8 h-8 text-yellow-400" />;
      default: return <Award className="w-8 h-8 text-yellow-500" />;
    }
  };

  // Render Onboarding Intro animation if active
  if (isAnimatingIntro) {
    return (
      <div id="intro-animation-pane" className="min-h-screen bg-[#020612] text-slate-100 flex flex-col justify-center items-center font-sans overflow-hidden p-6 relative select-none">
        {/* Ambient orbital trails */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-dashed border-sky-500/10 animate-spin" style={{ animationDuration: "12s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-dashed border-emerald-500/10 animate-spin" style={{ animationDuration: "20s", animationDirection: "reverse" }}></div>
        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none"></div>

        {/* Top absolute skip button */}
        <button
          id="skip-intro-trigger"
          onClick={() => setIsAnimatingIntro(false)}
          className="absolute top-6 right-6 border border-white/10 hover:border-emerald-500/30 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-emerald-400 transition-all cursor-pointer flex items-center gap-1.5 z-50 uppercase tracking-widest"
        >
          මඟහරින්න (Skip Intro)
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Chemistry active Atom visual */}
        <div className="relative mb-8 flex justify-center items-center">
          <div className="absolute w-32 h-32 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 border-b-cyan-500 animate-spin" style={{ animationDuration: "3s" }}></div>
          <div className="relative w-22 h-22 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.25)]">
            <Atom className="w-10 h-10 text-emerald-400 animate-pulse" />
          </div>
          <div className="absolute top-0 left-1 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] animate-ping" style={{ animationDuration: "1.4s" }}></div>
          <div className="absolute bottom-2 right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15] animate-ping" style={{ animationDuration: "1.7s", animationDelay: "0.4s" }}></div>
        </div>

        {/* Text Title block */}
        <div className="text-center z-10 max-w-md px-4">
          <span className="text-[10px] uppercase font-black tracking-[0.25em] text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-md border border-cyan-500/20">
            සූදානම - ONLINE PORTAL
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 text-white tracking-tighter drop-shadow-lg flex items-center justify-center gap-1.5">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">CHEM</span>
            <span className="text-white font-black">A/L PRO</span>
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-black mt-1.5">
            අකාබනික රසායන ක්‍රීඩා පීඨය
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            Sri Lankan G.C.E. Advanced Level Inorganic Suite
          </p>

          {/* Loading status bar */}
          <div className="mt-8 mx-auto max-w-xs">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-2">
              <span className="animate-pulse font-bold">න්‍යෂ්ටික ආරෝපණය සැකසෙමින් පවතී...</span>
              <span className="text-emerald-400 font-extrabold">{introProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full transition-all duration-100"
                style={{ width: `${introProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Authentication portals if not logged-in
  if (!username) {
    if (authScreen === "landing") {
      return (
        <div id="landing-stage" className="min-h-screen bg-[#050b1a] text-slate-100 flex flex-col justify-center items-center font-sans overflow-x-hidden p-6 relative">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="max-w-md w-full bg-slate-900/60 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.6)] z-10 text-center">
            {/* science badge */}
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-[0_4px_22px_rgba(16,185,129,0.15)] animate-pulse">
              <Atom className="w-8 h-8 text-emerald-400" />
            </div>

            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-black bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/20 inline-block mb-3 text-xs">
              ශ්‍රී ලංකා උසස් පෙළ රසායන විද්‍යාව
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1.5">
              CHEM<span className="text-emerald-400">A/L</span> PRO
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.15em] font-black mb-8">
              අකාබනික රසායන විද්වත් මධ්‍යස්ථානය
            </p>

            {/* Selection buttons */}
            <div className="space-y-4">
              <button
                id="btn-go-to-signin"
                onClick={() => setAuthScreen("signin")}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs py-4 rounded-xl cursor-pointer shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all flex items-center justify-center gap-2 uppercase tracking-wider h-12"
              >
                ඇතුල් වන්න (Sign In) ➔
              </button>

              <button
                id="btn-go-to-signup"
                onClick={() => setAuthScreen("signup")}
                className="w-full bg-slate-950 hover:bg-slate-900 border border-white/10 hover:border-emerald-500/30 text-emerald-400 font-bold text-xs py-4 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 uppercase tracking-wider h-12"
              >
                ලියාපදිංචි වන්න (Sign Up)
              </button>
            </div>

            {/* footer stats */}
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between text-center items-center text-[9px] text-slate-500 font-semibold tracking-wider uppercase">
              <span>2000+ MCQs</span>
              <span>●</span>
              <span>NIE සම්පත් පොත</span>
              <span>●</span>
              <span>DeepSeek Engine Ready</span>
            </div>
          </div>
        </div>
      );
    }

    if (authScreen === "signin") {
      return (
        <div id="signin-stage" className="min-h-screen bg-[#050b1a] text-slate-100 flex flex-col justify-center items-center font-sans p-6 relative">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="max-w-md w-full bg-slate-900/60 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.6)] z-10 transition-all">
            <button
              id="signin-back-to-landing"
              onClick={() => setAuthScreen("landing")}
              className="text-xs text-slate-400 hover:text-white transition-all flex items-center gap-1.5 mb-6 hover:underline cursor-pointer font-bold uppercase tracking-wider"
            >
              ← ආපසු යන්න (Back)
            </button>

            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-white">ඇතුල් වන්න (Sign In)</h2>
              <p className="text-xs text-slate-400 mt-2 uppercase tracking-wider font-semibold">
                ගිණුමට ප්‍රවිෂ්ට වීමට විස්තර ඇතුලත් කරන්න
              </p>
            </div>

            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-bold select-none">
                  විද්‍යුත් තැපෑල හෝ පරිශීලක නාමය (Email Address or Username)
                </label>
                <input
                  id="signin-email-field"
                  type="text"
                  required
                  placeholder="student@example.com හෝ Ruwan_Bio"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-bold select-none">
                  මුරපදය (Password)
                </label>
                <input
                  id="signin-password-field"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-xs font-mono"
                />
              </div>

              <button
                id="btn-auth-signin-submit"
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs py-4 rounded-xl cursor-pointer shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-wider h-12 mt-2"
              >
                පිවිසෙන්න
              </button>
            </form>

            <p className="text-xs text-slate-400 text-center mt-6">
              ගිණුමක් නොමැතිද?{" "}
              <button
                id="signin-link-to-signup"
                onClick={() => setAuthScreen("signup")}
                className="text-emerald-400 hover:underline font-bold"
              >
                මෙහි ලියාපදිංචි වන්න (Sign Up)
              </button>
            </p>
          </div>

          {/* Toast Notification for Sign In Screen */}
          {toast && (
            <div 
              id="global-toast-msg"
              className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-md shadow-2xl animate-bounce max-w-sm ${
                toast.type === "success" 
                  ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300" 
                  : toast.type === "error" 
                  ? "bg-rose-950/80 border-rose-500/40 text-rose-300" 
                  : "bg-slate-900/95 border-blue-500/40 text-blue-300"
              }`}
            >
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
              {toast.type === "error" && <XCircle className="w-5 h-5 flex-shrink-0" />}
              {toast.type === "info" && <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0" />}
              <span className="text-xs font-semibold">{toast.message}</span>
            </div>
          )}
        </div>
      );
    }

    if (authScreen === "signup") {
      return (
        <div id="signup-stage" className="min-h-screen bg-[#050b1a] text-slate-100 flex flex-col justify-center items-center font-sans p-6 relative">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="max-w-md w-full bg-slate-900/60 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.6)] z-10 transition-all">
            <button
              id="signup-back-to-landing"
              onClick={() => setAuthScreen("landing")}
              className="text-xs text-slate-400 hover:text-white transition-all flex items-center gap-1.5 mb-6 hover:underline cursor-pointer font-bold uppercase tracking-wider"
            >
              ← ආපසු යන්න (Back)
            </button>

            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-white">ලියාපදිංචි වන්න (Sign Up)</h2>
              <p className="text-xs text-slate-400 mt-2 uppercase tracking-wider font-semibold">
                අදම ලියාපදිංචි වී ඔබේ විද්‍යාත්මක ගමන ආරම්භ කරන්න
              </p>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-bold select-none">
                  විද්‍යුත් තැපෑල (Email Address)
                </label>
                <input
                  id="signup-email-field"
                  type="text"
                  required
                  placeholder="student@example.com"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-bold select-none">
                  පරිශීලක නාමය (Username)
                </label>
                <input
                  id="signup-username-field"
                  type="text"
                  required
                  placeholder="උදා: Ruwan_Bio, Chamila_AL"
                  value={authUsername}
                  onChange={e => setAuthUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-bold select-none">
                  මුරපදය (Password)
                </label>
                <input
                  id="signup-password-field"
                  type="password"
                  required
                  placeholder="අවම වශයෙන් අකුරු 4ක්"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-xs font-mono"
                />
              </div>

              <button
                id="btn-auth-signup-submit"
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs py-4 rounded-xl cursor-pointer shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-wider h-12 mt-2"
              >
                නව ගිණුම සාදන්න
              </button>
            </form>

            <p className="text-xs text-slate-400 text-center mt-6">
              දැනටමත් ගිණුමක් තිබේද?{" "}
              <button
                id="signup-link-to-signin"
                onClick={() => setAuthScreen("signin")}
                className="text-emerald-400 hover:underline font-bold"
              >
                මෙහි ඇතුල් වන්න (Sign In)
              </button>
            </p>
          </div>

          {/* Toast Notification for Sign Up Screen */}
          {toast && (
            <div 
              id="global-toast-msg"
              className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-md shadow-2xl animate-bounce max-w-sm ${
                toast.type === "success" 
                  ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300" 
                  : toast.type === "error" 
                  ? "bg-rose-950/80 border-rose-500/40 text-rose-300" 
                  : "bg-slate-900/95 border-blue-500/40 text-blue-300"
              }`}
            >
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
              {toast.type === "error" && <XCircle className="w-5 h-5 flex-shrink-0" />}
              {toast.type === "info" && <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0" />}
              <span className="text-xs font-semibold">{toast.message}</span>
            </div>
          )}
        </div>
      );
    }
  }

  // Active User Logged In Screen
  return (
    <div className="min-h-screen bg-[#050b1a] text-slate-100 flex flex-col font-sans overflow-x-hidden relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Toast Notification */}
      {toast && (
        <div 
          id="global-toast-msg"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-md shadow-2xl animate-bounce max-w-sm ${
            toast.type === "success" 
              ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300" 
              : toast.type === "error" 
              ? "bg-rose-950/80 border-rose-500/40 text-rose-300" 
              : "bg-slate-900/95 border-blue-500/40 text-blue-300"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
          {toast.type === "error" && <XCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === "info" && <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0" />}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div id="custom-confirm-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-pulse relative">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span className="p-1.5 bg-rose-500/10 rounded-lg text-rose-400">
                <AlertCircle className="w-4 h-4" />
              </span>
              {confirmModal.title}
            </h3>
            <p className="text-[11px] text-slate-300 mt-4 leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex gap-2.5 mt-6 justify-end">
              <button
                id="confirm-modal-cancel"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-bold transition-all cursor-pointer border border-white/5"
              >
                {confirmModal.cancelText || "ප්‍රතික්ෂේප කරන්න (Cancel)"}
              </button>
              <button
                id="confirm-modal-ok"
                onClick={confirmModal.onConfirm}
                className={`px-3.5 py-2 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer shadow-md ${
                  confirmModal.isDanger
                    ? "bg-rose-600 hover:bg-rose-500 text-white"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                }`}
              >
                {confirmModal.confirmText || "තහවුරු කරන්න (Confirm)"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top HUD Bar */}
      <nav id="top-hud-navbar" className="w-full flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-6 md:px-8 bg-slate-900/40 backdrop-blur-md border-b border-white/10 relative z-10">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                මට්ටම {profile ? profile.level : 1}
              </span>
              <span className="text-xs font-mono text-blue-400 font-medium">
                {profile ? profile.xp : 0} XP
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (((profile ? profile.xp : 0) % 500) / 500) * 100)}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-500">
                {500 - ((profile ? profile.xp : 0) % 500)} XP to Next
              </span>
            </div>
          </div>
          <button 
            id="user-logout-btn"
            onClick={handleLogout}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white"
            title="නික්ම යන්න"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-1.5">
            <span className="inline-block px-1.5 py-0.5 bg-gradient-to-br from-emerald-500 to-teal-500 text-slate-950 rounded-md text-sm">CHEM</span>
            <span>A/L PRO</span>
          </div>
          <div className="text-[9px] text-slate-400 tracking-[0.25em] uppercase font-bold text-center">
            අකාබනික රසායන විහ්න පීඨය
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t border-white/5 pt-3 md:pt-0 md:border-none">
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-950/30 to-rose-950/30 px-3 py-1.5 rounded-xl border border-orange-500/20">
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-orange-400 uppercase tracking-widest font-black">STREAK</span>
              <span className="text-lg font-black text-white leading-tight">
                {profile ? String(profile.streak).padStart(2, "0") : "00"}
              </span>
            </div>
            <Flame className={`w-5 h-5 text-orange-500 ${profile && profile.streak > 0 ? "animate-pulse" : ""}`} />
          </div>

          <div className="h-6 w-[1px] bg-white/10 hidden md:block"></div>

          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-950/30 to-amber-950/30 px-3 py-1.5 rounded-xl border border-yellow-500/20">
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-yellow-400 uppercase tracking-widest font-black">POINTS</span>
              <span className="text-lg font-black text-white leading-tight">
                {profile ? profile.coins : 100}
              </span>
            </div>
            <Coins className="w-5 h-5 text-yellow-400" />
          </div>

          <button 
            id="desktop-logout-btn"
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:bg-rose-900/20 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>නික්මෙන්න</span>
          </button>
        </div>
      </nav>

      {/* Main Gameplay Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-6 p-4 md:p-8 relative z-10 max-w-7xl w-full mx-auto">
        
        {/* Left column sidebar for Mobile/Desktop: Menu navigation & details */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          
          {/* User Details card */}
          <div id="user-info-card" className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3.5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-1 text-[8px] tracking-widest uppercase font-bold text-emerald-400 bg-emerald-950/50 rounded-bl-lg border-l border-b border-white/10">
              ශිෂ්‍යයා
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 border border-white/10">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">භාවිත නාමය</p>
              <p className="text-sm font-black text-white truncate font-mono">{username}</p>
            </div>
          </div>

          {/* Side Menu Tab Selectors */}
          <div className="p-2 bg-slate-900/50 border border-white/10 rounded-2xl space-y-1">
            <button
              id="sidebar-tab-overview"
              onClick={() => { setActiveTab("overview"); setActiveQuiz(null); }}
              className={`w-full p-3 rounded-xl flex items-center gap-3 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "overview" && !activeQuiz
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>ප්‍රධාන විවරණය</span>
            </button>

            <button
              id="sidebar-tab-topics"
              onClick={() => { setActiveTab("topics"); setActiveQuiz(null); }}
              className={`w-full p-3 rounded-xl flex items-center gap-3 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "topics" && !activeQuiz
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>මාතෘකා සහ ප්‍රගතිය</span>
            </button>

            <button
              id="sidebar-tab-ai-gen"
              onClick={() => { setActiveTab("ai-gen"); setActiveQuiz(null); }}
              className={`w-full p-3 rounded-xl flex items-center gap-3 text-xs font-bold transition-all cursor-pointer relative overflow-hidden ${
                activeTab === "ai-gen" && !activeQuiz
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="absolute top-0 right-1 px-1 py-0.2 bg-gradient-to-r from-pink-500 to-purple-500 text-[8px] text-white rounded font-bold uppercase tracking-widest scale-75">
                AI
              </div>
              <Cpu className="w-4 h-4" />
              <span>Gemini නිපැයුම්කරු</span>
            </button>

            <button
              id="sidebar-tab-leaderboard"
              onClick={() => { setActiveTab("leaderboard"); setActiveQuiz(null); }}
              className={`w-full p-3 rounded-xl flex items-center gap-3 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "leaderboard" && !activeQuiz
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>LEADERBOARD</span>
            </button>

            <button
              id="sidebar-tab-shop"
              onClick={() => { setActiveTab("shop"); setActiveQuiz(null); }}
              className={`w-full p-3 rounded-xl flex items-center gap-3 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "shop" && !activeQuiz
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>lifelines සාප්පුව</span>
            </button>
          </div>

          {/* Syllabus compliance reference box */}
          <div className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl mt-auto hidden lg:block">
            <span className="text-[9px] font-black text-blue-400 tracking-widest uppercase">නිල අනුකූලතාවය</span>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
              සියලුම බහුවරණ ප්‍රශ්න ජාතික අධ්‍යාපන ආයතනය (NIE) මඟින් නිකුත් කෙරුණු නවතම විෂය නිර්දේශයේ “අකාබනික රසායන විද්‍යාව සම්පත් පොත” තුළ සාකච්ඡා වන කරුණුවලට අනුරූප වේ.
            </p>
          </div>
        </section>

        {/* Center column: Dynamic display according to chosen State */}
        <section className="lg:col-span-6 flex flex-col min-w-0">
          
          {/* Active Quiz Card Module */}
          {activeQuiz ? (
            <div id="active-quiz-panel" className="bg-slate-900/60 border border-white/10 rounded-3xl p-5 md:p-8 backdrop-blur-sm flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all">
              
              {/* If we have completed all questions in the set, show active quiz Summary report */}
              {activeQuiz.currentIndex >= activeQuiz.questions.length ? (
                <div id="quiz-results-summary" className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-white">ප්‍රශ්නාවලිය සම්පූර්ණයි!</h2>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
                    Inorganic chemistry quiz completion card
                  </p>

                  {/* Summary score stats block */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
                      <span className="text-xs text-slate-400 block mb-1">සාර්ථක ලකුණු</span>
                      <span className="text-2xl font-black text-emerald-400">
                        {activeQuiz.stats.correctCount} / {activeQuiz.questions.length}
                      </span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
                      <span className="text-xs text-slate-400 block mb-1">නිරවද්‍යතාවය</span>
                      <span className="text-2xl font-black text-blue-400">
                        {Math.round((activeQuiz.stats.correctCount / activeQuiz.questions.length) * 100)}%
                      </span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
                      <span className="text-xs text-slate-400 block mb-1">XP ත්‍යාගයන්</span>
                      <span className="text-2xl font-black text-orange-400">
                        +{activeQuiz.stats.xpGained} XP
                      </span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
                      <span className="text-xs text-slate-400 block mb-1">ලැබුණු කාසි</span>
                      <span className="text-2xl font-black text-yellow-400">
                        +{activeQuiz.stats.coinsGained}
                      </span>
                    </div>
                  </div>

                  {/* Encouraging Sinhala feedback and details */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 text-left mb-8">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
                      විද්‍යාත්මක ඇගයීම (Academic Evaluation Status)
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeQuiz.stats.correctCount >= activeQuiz.questions.length * 0.8
                        ? "විශිෂ්ටයි! ඔබ සතුව අකාබනික රසායන විෂය කොටසෙහි අතිශය සාර්ථක සංකල්පීය අවබෝධයක් පවතී. සම්පත් පොතේ සඳහන් exceptions වලද ඔබ ප්‍රවීණයෙකි."
                        : activeQuiz.stats.correctCount >= activeQuiz.questions.length * 0.5
                        ? "යහපත් මට්ටමකි. කෙසේවෙතත්, ඇතැම් Tricky ප්‍රශ්න සහ s/p block වල ද්‍රාව්‍යතා රටාවන් තවදුරටත් මතක් කර ගැනීම ඵලදායී වේ."
                        : "තවදුරටත් උත්සාහ කරන්න. අකාබනික සම්පත් පොතේ ඒ ඒ පරිච්ඡේදවල සඳහන් ප්‍රත්‍යක්ෂ වගු සහ අනුපිළිවෙලවල් නිරන්තරයෙන් පරිශීලනය කරන්න."}
                    </p>
                  </div>

                  {/* Play again or close quiz buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      id="results-back-btn"
                      onClick={() => { setActiveQuiz(null); fetchProfile(username); }}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all cursor-pointer text-sm uppercase tracking-wide"
                    >
                      ප්‍රධාන පිටුවට යන්න
                    </button>
                    <button
                      id="results-play-again-btn"
                      onClick={() => {
                        const currentTopic = activeQuiz.questions[0].topic;
                        startQuiz(currentTopic);
                      }}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-6 py-3 rounded-xl transition-all cursor-pointer text-sm uppercase tracking-wide"
                    >
                      නැවත එම ක්‍රීඩාව අරඹන්න
                    </button>
                  </div>
                </div>
              ) : (
                // Active Quiz Gameplay Screen
                <div>
                  
                  {/* Question Meta Row */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        ප්‍රශ්නය {activeQuiz.currentIndex + 1} / {activeQuiz.questions.length}
                      </span>
                      <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md ${
                        activeQuiz.questions[activeQuiz.currentIndex].difficulty === "hard"
                          ? "bg-rose-950/40 text-rose-400 border border-rose-500/20"
                          : activeQuiz.questions[activeQuiz.currentIndex].difficulty === "medium"
                          ? "bg-amber-950/40 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {activeQuiz.questions[activeQuiz.currentIndex].difficulty === "hard" ? "අපහසු" : activeQuiz.questions[activeQuiz.currentIndex].difficulty === "medium" ? "මධ්‍යම" : "පහසු"}
                      </span>
                    </div>

                    {/* Timer Circle visualization */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black">ඉතිරි කාලය</span>
                        <span className="text-xs font-mono font-bold text-slate-300">sec</span>
                      </div>
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center relative transition-all ${
                        activeQuiz.timer <= 10 
                          ? "border-rose-500 bg-rose-950/20 text-rose-400 animate-pulse" 
                          : "border-emerald-500 bg-emerald-950/20 text-emerald-400"
                      }`}>
                        <span className="text-base font-black font-mono">{activeQuiz.timer}</span>
                        <div className={`absolute inset-0 rounded-full border border-current opacity-30 active-glow-ring`}></div>
                      </div>
                    </div>
                  </div>

                  {/* Topic and Subtopic tags */}
                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block">
                      {TOPICS.find(t => t.id === activeQuiz.questions[activeQuiz.currentIndex].topic)?.name_si || "විෂය මාතෘකාව"}
                    </span>
                    <h3 className="text-sm font-semibold text-white mt-0.5 opacity-90">
                      🎯 {activeQuiz.questions[activeQuiz.currentIndex].subtopic}
                    </h3>
                  </div>

                  {/* The actual question display */}
                  <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl mb-6">
                    <h2 id="quiz-question-si" className="text-lg md:text-xl font-bold leading-relaxed text-slate-100">
                      {activeQuiz.questions[activeQuiz.currentIndex].question_si}
                    </h2>
                  </div>

                  {/* MCQs Option click array */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {activeQuiz.questions[activeQuiz.currentIndex].options_si.map((option, idx) => {
                      const prefixLetters = ["අ", "ආ", "ඉ", "ඊ", "උ"];
                      const isChosen = activeQuiz.chosenIndex === idx;
                      const isCorrectAnswer = idx === activeQuiz.questions[activeQuiz.currentIndex].correctIndex;
                      const isWrongChoice = isChosen && !isCorrectAnswer;
                      const isDisabled = activeQuiz.disabledOptions.includes(idx);

                      // Style resolution based on locking
                      let btnStyle = "bg-white/5 border-white/10 hover:bg-white/10 text-slate-200";
                      let prefixStyle = "bg-slate-800 text-slate-300 border-white/5";

                      if (activeQuiz.isLocked) {
                        if (isCorrectAnswer) {
                          btnStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                          prefixStyle = "bg-emerald-500 text-slate-950 border-emerald-400";
                        } else if (isWrongChoice) {
                          btnStyle = "bg-rose-950/70 border-rose-500 text-rose-200";
                          prefixStyle = "bg-rose-500 text-white border-rose-400";
                        } else {
                          btnStyle = "bg-white/2 border-white/5 text-slate-600 opacity-40 cursor-not-allowed";
                          prefixStyle = "bg-slate-900 text-slate-600 border-white/5";
                        }
                      } else if (isDisabled) {
                        btnStyle = "bg-white/1 border-white/5 text-slate-600 opacity-20 cursor-not-allowed pointer-events-none";
                        prefixStyle = "bg-slate-950 text-slate-700 border-white/5";
                      }

                      return (
                        <button
                          key={idx}
                          id={`option-btn-${idx}`}
                          disabled={activeQuiz.isLocked || isDisabled}
                          onClick={() => handleAnswerOptionClick(idx)}
                          className={`w-full p-3.5 rounded-xl border flex items-center gap-4 transition-all text-left relative overflow-hidden cursor-pointer ${btnStyle}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border transition-all ${prefixStyle}`}>
                            {prefixLetters[idx]}
                          </div>
                          <span className="text-sm font-bold flex-1">{option}</span>

                          {/* Correct indicator checkmark */}
                          {activeQuiz.isLocked && isCorrectAnswer && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 absolute right-4" />
                          )}
                          {activeQuiz.isLocked && isWrongChoice && (
                            <XCircle className="w-5 h-5 text-rose-400 absolute right-4" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanatory notes box visible after lock status */}
                  {activeQuiz.isLocked && (
                    <div id="quiz-explanation-box" className="mt-6 p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)] animate-fadeIn">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
                          නිල විවරණය සහ සිද්ධාන්ත (Academic Explanation)
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal mb-3">
                        {activeQuiz.questions[activeQuiz.currentIndex].explanation_si}
                      </p>
                      
                      <div className="pt-2 border-t border-white/5 flex flex-wrap justify-between items-center text-[10px] text-slate-500 gap-2">
                        <span>📖 මූලාශ්‍රය: {activeQuiz.questions[activeQuiz.currentIndex].resource_ref}</span>
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-sm">NIE Verified</span>
                      </div>

                      <button
                        id="quiz-next-question-btn"
                        onClick={handleNextQuestion}
                        className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(16,185,129,0.2)]"
                      >
                        මීළඟ ප්‍රශ්නයට යන්න
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Active In-game Live Lifeline buttons */}
                  {!activeQuiz.isLocked && (
                    <div className="mt-6 pt-4 border-t border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold text-center">
                        ක්‍රීඩා සහායකයන් (Active Lifelines Bundle)
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          id="btn-use-fiftyfifty"
                          onClick={() => useLifeline("fiftyFifty")}
                          disabled={profile ? profile.inventory.fiftyFifty <= 0 : true}
                          className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-white/5 rounded-xl flex flex-col items-center cursor-pointer text-center group"
                        >
                          <span className="text-[9px] text-slate-400 font-bold uppercase">50 : 50</span>
                          <span className="text-[9px] text-emerald-400 mt-1 font-semibold">{profile ? profile.inventory.fiftyFifty : 0} left</span>
                        </button>
                        
                        <button
                          id="btn-use-doubletime"
                          onClick={() => useLifeline("doubleTime")}
                          disabled={profile ? profile.inventory.doubleTime <= 0 : true}
                          className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-white/5 rounded-xl flex flex-col items-center cursor-pointer text-center group"
                        >
                          <span className="text-[9px] text-slate-400 font-bold uppercase">+30 sec</span>
                          <span className="text-[9px] text-emerald-400 mt-1 font-semibold">{profile ? profile.inventory.doubleTime : 0} left</span>
                        </button>

                        <button
                          id="btn-use-skip"
                          onClick={() => useLifeline("skip")}
                          disabled={profile ? profile.inventory.skip <= 0 : true}
                          className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-white/5 rounded-xl flex flex-col items-center cursor-pointer text-center group"
                        >
                          <span className="text-[9px] text-slate-400 font-bold uppercase">මඟහරින්න</span>
                          <span className="text-[9px] text-emerald-400 mt-1 font-semibold">{profile ? profile.inventory.skip : 0} left</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          ) : (
            // Non-quiz views (Core tabs selection)
            <div>
              {activeTab === "overview" && (
                <div id="overview-tab-panel" className="space-y-6">
                  
                  {/* Dashboard Header Banner */}
                  <div className="bg-gradient-to-r from-blue-900/40 to-teal-900/40 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-[-30%] right-[-10%] w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[60px]"></div>
                    <div className="relative z-10">
                      <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.25em] bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-500/20 inline-block mb-3">
                        AL විජයග්‍රහණය (Syllabus Victory Hub)
                      </span>
                      <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                        ඔබේ අකාබනික රසායන දැනුම සුපිරික්සමු!
                      </h2>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        ශ්‍රී ලංකා උසස් පෙළ විභාග ප්‍රශ්න පත්‍රවල p/s/d-block, සංකීර්ණ අයන නාමකරණයන් සහ පාරිසරික exceptions පිළිබඳ ඔබව දැනුවත් කරන අනුශාසනීය ක්‍රීඩාව.
                      </p>

                      <div className="flex flex-wrap gap-2.5 mt-5">
                        <button
                          id="btn-start-mixed"
                          onClick={() => startQuiz("mixed")}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition-all shadow-[0_4px_15px_rgba(16,185,129,0.3)] uppercase tracking-wider cursor-pointer"
                        >
                          මිශ්‍ර ප්‍රශ්නාවලියක් අරඹන්න ➔
                        </button>
                        <button
                          id="btn-choose-topics"
                          onClick={() => setActiveTab("topics")}
                          className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all uppercase tracking-wider border border-white/10 cursor-pointer"
                        >
                          මාතෘකාවක් තෝරන්න
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Profile and Stats breakdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">මුළු පිළිතුරු</span>
                      <span className="text-3xl font-black text-white">
                        {profile ? profile.stats.total_questions_answered : 0}
                      </span>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">නිවැරදි පිළිතුරු</span>
                      <span className="text-3xl font-black text-emerald-400">
                        {profile ? profile.stats.correct : 0}
                      </span>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">සාමාන්‍ය නිරවද්‍යතාව</span>
                      <span className="text-3xl font-black text-blue-400">
                        {profile ? Math.round(profile.stats.accuracy * 100) : 0}%
                      </span>
                    </div>
                  </div>

                  {/* Topic Mastery Tracker Visual representation */}
                  <div className="p-5 bg-slate-900/60 border border-white/10 rounded-3xl">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      මාතෘකා ප්‍රවීණීකරණ වාර්තාව (Topic Mastery Report)
                    </h3>
                    <div className="space-y-3.5">
                      {topics.map(t => {
                        const userStat = profile?.stats.topic_stats[t.id];
                        const answered = userStat ? userStat.answered : 0;
                        const correct = userStat ? userStat.correct : 0;
                        const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

                        return (
                          <div key={t.id} className="relative z-10 bg-slate-950/40 p-3 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center mb-1 text-xs">
                              <span className="font-bold text-slate-200">{t.name_si}</span>
                              <div className="text-right text-[10px]">
                                <span className="text-slate-400 mr-2">{correct} / {answered} නිවැරදිය</span>
                                <span className="font-black text-emerald-400">{accuracy}% Mastery</span>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${accuracy}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Badge collection cabinet */}
                  <div className="p-5 bg-slate-900/60 border border-white/10 rounded-3xl">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Award className="w-4 h-4 text-yellow-400" />
                       Earning Badges Lockbox
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {BADGES_LIST.map((badge: Badge) => {
                        const hasBadge = profile?.badges.includes(badge.id);
                        return (
                          <div 
                            key={badge.id}
                            className={`p-3 rounded-xl border transition-all text-center relative ${
                              hasBadge 
                                ? "bg-gradient-to-b from-slate-900 to-slate-950 border-yellow-500/40 text-slate-100 shadow-[0_4px_12px_rgba(234,179,8,0.05)]" 
                                : "bg-slate-950/20 border-white/5 text-slate-500 opacity-60"
                            }`}
                            title={badge.requirementTxt_en}
                          >
                            <div className="mb-2 flex justify-center">{getBadgeIcon(badge.iconName)}</div>
                            <h4 className="text-xs font-bold truncate leading-tight">{badge.name_en}</h4>
                            <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider">{badge.description_en}</p>
                            
                            {hasBadge ? (
                              <span className="absolute top-1 right-1 text-[8px] tracking-wide text-yellow-400 bg-yellow-950/60 px-1 py-0.2 rounded font-black">UNLOCKED</span>
                            ) : (
                              <span className="absolute top-1 right-1 text-[8px] tracking-wide text-slate-400 bg-slate-900 px-1 py-0.2 rounded">LOCKED</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* Topics Grid Tab selection */}
              {activeTab === "topics" && (
                <div id="topics-tab-panel" className="space-y-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <h2 className="text-lg font-black text-white">මාතෘව කාණ්ඩයක් තෝරාගන්න</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      එක් එක් මාතෘකාවට අදාළව ප්‍රශ්න 10 බැගින් අඩංගු ප්‍රශ්නාවලියක් ආරම්භ වේ.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topics.map(t => {
                      const userStat = profile?.stats.topic_stats[t.id];
                      const accuracy = userStat && userStat.answered > 0 ? Math.round((userStat.correct / userStat.answered) * 100) : 0;

                      return (
                        <div 
                          key={t.id}
                          className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-2xl flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{t.name_en}</span>
                              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/10 font-bold whitespace-nowrap">
                                {t.questionCount} Questions Available
                              </span>
                            </div>
                            <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors">
                              {t.name_si}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1 lines-clamp-3 leading-relaxed">
                              {t.description_si}
                            </p>
                          </div>

                          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                            <div className="flex-grow">
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-slate-400">mastery</span>
                                <span className="text-white font-bold">{accuracy}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${accuracy}%` }}></div>
                              </div>
                            </div>
                            <button
                              id={`start-topic-btn-${t.id}`}
                              onClick={() => startQuiz(t.id)}
                              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-lg transition-all cursor-pointer uppercase whitespace-nowrap"
                            >
                              START
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dynamic AI Generator Tab */}
              {activeTab === "ai-gen" && (
                <div id="ai-generator-panel" className="space-y-6">
                  
                  {/* Banner descriptor */}
                  <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-[-30%] right-[-10%] w-[250px] h-[250px] bg-pink-500/10 rounded-full blur-[70px]"></div>
                    <span className="text-[10px] uppercase tracking-widest text-pink-400 font-bold bg-pink-950/50 px-3 py-1 rounded-full border border-pink-500/20 inline-block mb-3">
                      Gemini 3.5 Flash Integration
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                      අධිතාක්ෂණික AI ප්‍රශ්න ජනක යන්ත්‍රය
                    </h2>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      අසීරු, සුක්ෂම සහ ගැඹුරු සංකල්පිය අකාබනික ප්‍රශ්න සාමාන්‍ය ක්‍රමවේදවලින් සෑදිය නොහැක. ඔබ කැමති උපමාතෘකාවක් සහ අපහසුතා මට්ටමක් ලබා දී සැබෑ විභාග ශෛලියේ MCQ එකක් සජීවීව නිෂ්පාදනය කරන්න.
                    </p>
                  </div>

                  {/* Generator interactive form */}
                  <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">
                      ප්‍රශ්න පරාමිතීන් සකසන්න
                    </h3>

                    <form onSubmit={handleGenerateQuestion} className="space-y-4">
                      
                      {/* Topic Selector */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-bold">
                          ප්‍රධාන විෂය පථය තෝරන්න
                        </label>
                        <select
                          id="ai-topic-select"
                          value={aiGenConfig.topic}
                          onChange={e => setAiGenConfig(prev => ({ ...prev, topic: e.target.value }))}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                          {TOPICS.map(t => (
                            <option key={t.id} value={t.id} className="bg-slate-950">
                              {t.name_si} ({t.name_en})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subtopic string input */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-bold">
                          නිශ්චිත උපමාතෘකාව හෝ බන්ධන රටාව (විකල්ප)
                        </label>
                        <span className="text-[9px] text-slate-500 block mb-2">
                          කිසිවක් ඇතුළත් නොකළහොත්, එම පරිච්ඡේදයෙන් අහඹු Tricky ප්‍රශ්නයක් සැකසේ.
                        </span>
                        <input
                          id="ai-subtopic-input"
                          type="text"
                          placeholder="උදා: Xenon Fluorides ජ්‍යාමිතිය, Cl₂O₇ ලක්ෂණ"
                          value={aiGenConfig.subtopic}
                          onChange={e => setAiGenConfig(prev => ({ ...prev, subtopic: e.target.value }))}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        />
                      </div>

                      {/* AI Engine Selection */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-bold">
                          ලෝක මට්ටමේ AI මොඩල තේරීම (AI Engine Option)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(["gemini", "deepseek"] as const).map(eng => (
                            <button
                              key={eng}
                              id={`ai-engine-btn-${eng}`}
                              type="button"
                              onClick={() => setAiGenConfig(prev => ({ ...prev, engine: eng }))}
                              className={`py-3 px-2 rounded-xl border text-[11px] font-bold uppercase transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                aiGenConfig.engine === eng
                                  ? "bg-pink-500/20 text-pink-400 border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.15)] animate-pulse"
                                  : "bg-slate-950 border-white/5 text-slate-400 hover:text-white"
                              }`}
                            >
                              <span className="font-extrabold">{eng === "gemini" ? "Google Gemini™" : "DeepSeek™ V3"}</span>
                              <span className="text-[8px] text-slate-500 lowercase">
                                {eng === "gemini" ? "balanced speed & accuracy" : "syllabus concept expert"}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Difficulty buttons */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-bold">
                          අපහසුතා මට්ටම
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["easy", "medium", "hard"] as const).map(diff => (
                            <button
                              key={diff}
                              id={`ai-diff-btn-${diff}`}
                              type="button"
                              onClick={() => setAiGenConfig(prev => ({ ...prev, difficulty: diff }))}
                              className={`py-3 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                                aiGenConfig.difficulty === diff
                                  ? "bg-pink-500/20 text-pink-400 border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.1)]"
                                  : "bg-slate-950 border-white/5 text-slate-400 hover:text-white"
                              }`}
                            >
                              {diff === "easy" ? "පහසු" : diff === "medium" ? "මධ්‍යම" : "අපහසු"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* AI Generating Beaker state display */}
                      {aiGenerating ? (
                        <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 flex flex-col items-center justify-center py-8">
                          <RefreshCw className="w-8 h-8 text-pink-400 animate-spin mb-3" />
                          <p className="text-xs font-bold text-slate-300">
                            {aiGenConfig.engine === "gemini" ? "Gemini 1.5 MCQ" : "DeepSeek V3 Expert MCQ"} උත්පාදනය වෙමින් පවතී...
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1 text-center max-w-xs leading-relaxed">
                            මෙයට තත්පර 3-8ක් ගතවිය හැක. නිල සිංහල පාරිභාෂිතය සහ NIE Resource Book සිද්ධාන්තයන් තහවුරු කෙරේ.
                          </p>
                        </div>
                      ) : (
                        <button
                          id="btn-ai-generate-submit"
                          type="submit"
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-[0_4px_20px_rgba(236,72,153,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide text-xs h-12"
                        >
                          <Dna className="w-4 h-4 animate-pulse" />
                          ප්‍රශ්නය උපද්දවන්න ({aiGenConfig.engine === "gemini" ? "Generate with Gemini" : "Generate with DeepSeek"}) ➔
                        </button>
                      )}

                      {/* Display AI generation errors if any */}
                      {aiError && (
                        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex gap-2">
                          <X className="w-4 h-4 flex-shrink-0" />
                          <div>
                            <span className="font-bold block">දෝෂයක් හටගති:</span>
                            <span>{aiError}</span>
                          </div>
                        </div>
                      )}

                    </form>
                  </div>
                </div>
              )}

              {/* Leaderboards listing Tab */}
              {activeTab === "leaderboard" && (
                <div id="leaderboard-panel" className="space-y-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-black text-white">LEADERBOARD</h2>
                    </div>
                    <button
                      id="btn-reload-leaderboard"
                      onClick={() => fetchLeaderboard(username)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white"
                      title="යාවත්කාලීන කරන්න"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-slate-900/60 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
                    <div className="p-3 bg-slate-950/60 border-b border-white/5 grid grid-cols-12 text-[10px] uppercase tracking-widest text-slate-400 font-bold text-center">
                      <span className="col-span-2">Rank</span>
                      <span className="col-span-6 text-left">පරිශීලකයා</span>
                      <span className="col-span-2">Level</span>
                      <span className="col-span-2">XP Score</span>
                    </div>

                    <div className="divide-y divide-white/5">
                      {leaderboard.map((entry, idx) => {
                        const isSelf = entry.isCurrentUser;
                        let rankBadge = entry.rank;
                        let medalColor = "";

                        if (entry.rank === 1) medalColor = "🥇 text-yellow-400 font-black";
                        else if (entry.rank === 2) medalColor = "🥈 text-slate-300 font-black";
                        else if (entry.rank === 3) medalColor = "🥉 text-amber-600 font-black";

                        return (
                          <div 
                            key={idx}
                            id={`leaderboard-row-${idx}`}
                            className={`p-4 grid grid-cols-12 items-center text-center transition-all ${
                              isSelf 
                                ? "bg-emerald-500/10 border-l-4 border-l-emerald-500 font-bold" 
                                : "hover:bg-white/2"
                            }`}
                          >
                            <div className="col-span-2 flex justify-center text-sm font-mono">
                              {entry.rank <= 3 ? (
                                <span className={medalColor}>{medalColor.split(" ")[0]}</span>
                              ) : (
                                <span className="text-slate-400"># {entry.rank}</span>
                              )}
                            </div>
                            <div className="col-span-6 text-left font-mono truncate text-sm flex items-center gap-2">
                              <span className={isSelf ? "text-emerald-400 font-black" : "text-white"}>
                                {entry.username}
                              </span>
                              {isSelf && (
                                <span className="text-[8px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-bold tracking-widest">YOU</span>
                              )}
                            </div>
                            <div className="col-span-2 text-xs font-bold text-slate-300">
                              Lvl {entry.level}
                            </div>
                            <div className="col-span-2 font-mono text-sm text-blue-400 font-semibold">
                              {entry.xp}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Power Up Shop view */}
              {activeTab === "shop" && (
                <div id="shop-tab-panel" className="space-y-6">
                  
                  {/* Shop banner */}
                  <div className="bg-gradient-to-r from-yellow-905 to-amber-950/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-yellow-400 block mb-1">වෙළඳ කුටිය (Lifelines Store)</span>
                      <h2 className="text-xl font-black text-white">උපකාරක මිලදීගැනීම්</h2>
                      <p className="text-xs text-slate-400 mt-1">
                        අසීරු ප්‍රශ්නාවලියක් පරීක්ෂා කිරීමේදී භාවිත වන උපකාරක කාඩ්පත් කාසි මඟින් මිලදී ගන්න.
                      </p>
                    </div>
                    <Coins className="w-12 h-12 text-yellow-400 opacity-20" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* fiftyFifty Shop item */}
                    <div className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-2xl flex flex-col justify-between">
                      <div className="text-center">
                        <span className="text-xs text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">50 : 50 බණ්ඩලය</span>
                        <h3 className="text-base font-black text-white mt-3">විකල්ප දෙකක් මකන්න</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          මෙය භාවිතා කිරීමෙන් වැරදි පිළිතුරු 2ක් ඉවත් කර ඉතිරි 3න් තේරීමට පහසුකම සැලසේ.
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/5 text-center">
                        <span className="text-xs text-yellow-400 font-bold font-mono">කාසි 30</span>
                        <button
                          id="buy-btn-fifty"
                          onClick={() => purchasePowerUp("fiftyFifty")}
                          className="w-full mt-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-2.5 rounded-xl transition-all cursor-pointer uppercase text-xs"
                        >
                          කාසි 30 කට ගන්න
                        </button>
                      </div>
                    </div>

                    {/* doubleTime item */}
                    <div className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-2xl flex flex-col justify-between">
                      <div className="text-center">
                        <span className="text-xs text-blue-400 font-bold bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/20">අමතර කාලය</span>
                        <h3 className="text-base font-black text-white mt-3">තත්පර +30 ක්</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          මෙම උපකාරකය මඟින් සිතීමට අපහසු දීර්ඝ විවරණයකට පෙර තත්පර 30ක ඉඩක් එකතු කරයි.
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/5 text-center">
                        <span className="text-xs text-yellow-400 font-bold font-mono">කාසි 20</span>
                        <button
                          id="buy-btn-double"
                          onClick={() => purchasePowerUp("doubleTime")}
                          className="w-full mt-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-2.5 rounded-xl transition-all cursor-pointer uppercase text-xs"
                        >
                          කාසි 20 කට ගන්න
                        </button>
                      </div>
                    </div>

                    {/* Skip Item */}
                    <div className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-2xl flex flex-col justify-between">
                      <div className="text-center">
                        <span className="text-xs text-purple-400 font-bold bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">skip විකල්පය</span>
                        <h3 className="text-base font-black text-white mt-3">ප්‍රශ්නය මඟහරින්න</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          කිසිදු ලකුණු අඩු වීමකින් තොරව ඊළඟ ප්‍රශ්නාවලියට පිවිසීමට සහය වේ.
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/5 text-center">
                        <span className="text-xs text-yellow-400 font-bold font-mono">කාසි 40</span>
                        <button
                          id="buy-btn-skip"
                          onClick={() => purchasePowerUp("skip")}
                          className="w-full mt-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-2.5 rounded-xl transition-all cursor-pointer uppercase text-xs"
                        >
                          කාසි 40 කට ගන්න
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

        </section>

        {/* Right column sidebar: Powerup status indicator & Daily challenges card */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          
          <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] text-indigo-400 uppercase font-black tracking-widest flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> DYNAMIC LAB COMPANION
              </h3>
              <div className="flex items-center gap-1.5 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[8px] text-indigo-300 font-bold uppercase tracking-wider">LIVE FEED</span>
              </div>
            </div>

            {/* Main active rotating companion card */}
            {(() => {
              const card = COMPANION_DECK[companionCardIndex];
              return (
                <div className="bg-slate-950/60 border border-white/5 p-3.5 rounded-xl min-h-[190px] flex flex-col justify-between transition-all duration-300">
                  <div>
                    {/* Header: category and timer */}
                    <div className="flex justify-between items-center gap-2 mb-2 pb-2 border-b border-white/5">
                      <span className="text-[9px] bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded-md font-black border border-indigo-500/20 uppercase tracking-wider">
                        {card.category_si}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-indigo-400 animate-spin-slow" />
                        Next in {companionTimer}s
                      </span>
                    </div>

                    <h4 className="text-[11px] font-bold text-white mb-2.5 tracking-tight">
                      {card.title_si}
                    </h4>

                    {/* Render card items */}
                    <div className="space-y-1.5">
                      {card.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start text-[10px] hover:bg-white/2 py-0.5 px-1.5 rounded transition-colors duration-150">
                          <span className="font-semibold text-indigo-200 font-mono mr-1.5">{item.key}</span>
                          <span className="text-white text-right font-medium">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions & progress indicator at bottom of card */}
                  <div className="mt-3.5 pt-2.5 border-t border-white/5 flex flex-col gap-2">
                    {/* Tiny visual progress bar */}
                    <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-1000"
                        style={{ width: `${(companionTimer / 60) * 100}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      <button 
                        onClick={handleRollCompanion}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/5 bg-slate-900/60 px-2.5 py-1 rounded-lg text-[9px] font-bold hover:bg-slate-900"
                      >
                        <RefreshCw className="w-2.5 h-2.5 text-indigo-400" />
                        🎲 ROLL FACT CARD
                      </button>
                      <span className="text-slate-500 italic text-[7.5px]">
                        * Auto-cycles every minute.
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Daily Challenge Card matching Immersive UI pattern nicely */}
          <div className="p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl mt-auto">
            <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest block mb-1">දෛනික විශේෂ අභියෝගය</span>
            <div className="text-[11px] leading-relaxed text-white mb-3">
              s/p-block හෝ අයන රසායන ප්‍රශ්නාවලියක් 100% ක නිරවද්‍යතාවයකින් යුතුව සම්පූර්ණ කරන්න.
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-xs font-bold text-yellow-400">+500 XP Rewards</span>
              <span className="text-[8px] bg-blue-500 text-slate-950 px-2 py-0.5 rounded font-black">ACTIVE</span>
            </div>
          </div>

          {/* User danger zone controls */}
          <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
            <button
              id="btn-reset-mastery"
              onClick={handleResetProgress}
              className="w-full text-center text-[9px] font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 cursor-pointer"
            >
              ප්‍රගතිය මකන්න (Reset Mastery) ⚠
            </button>
          </div>

        </section>

      </main>

      {/* Footer Bar */}
      <footer className="w-full bg-slate-950/80 py-4 px-6 md:px-8 flex flex-col md:flex-row gap-2 items-center justify-between border-t border-white/5 text-[10px] text-slate-500 mt-auto">
        <div className="flex gap-4 items-center">
          <span>© 2026 CHEM A/L PRO. සර්ව හිමිකම් ඇවිරිණි.</span>
          <span className="hidden md:inline">|</span>
          <span>මූලාශ්‍රය: අකාබනික රසායන විද්‍යාව අධ්‍යාපනික සම්පත් පොත (NIE)</span>
        </div>
        <div className="flex gap-4 uppercase tracking-widest">
          <span className="hover:text-slate-300 cursor-pointer text-[9px]" onClick={() => showToast("සම්පත් පොතේ 13-138 පිටු ආවරණය වේ.", "info")}>Syllabus Notes</span>
          <span className="hover:text-slate-300 cursor-pointer text-[9px]" onClick={() => showToast("විමසීම්: mcbandara000@gmail.com", "info")}>සහාය (Support)</span>
        </div>
      </footer>

    </div>
  );
}
