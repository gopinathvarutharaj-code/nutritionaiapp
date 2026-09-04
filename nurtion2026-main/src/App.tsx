import React, { useState, useEffect, useRef } from "react";
import { UserProfile, FoodLog, WorkoutPlan, FoodItem } from "./types";
import { AuthPanel } from "./components/AuthPanel";
import { SplashPanel } from "./components/SplashPanel";
import { DashboardView } from "./components/DashboardView";
import { FoodDiaryView } from "./components/FoodDiaryView";
import { MealPlannerView } from "./components/MealPlannerView";
import { WorkoutView } from "./components/WorkoutView";
import { AIAssistantView } from "./components/AIAssistantView";
import { WeeklyProgressReport } from "./components/WeeklyProgressReport";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { 
  getUserProfile, 
  saveUserProfile, 
  getFoodLogs, 
  logFoodMeal, 
  deleteFoodMeal,
  updateFoodMeal,
  getWaterLogs,
  logWater,
  getActivityLogs,
  logActivity,
  getWorkoutPlans,
  saveWorkoutPlan,
  isOnline
} from "./dbService";
import { 
  Sparkles, 
  Flame, 
  Droplet, 
  Footprints, 
  Moon, 
  Clock, 
  TrendingUp, 
  User, 
  LogOut, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Cloud, 
  CloudOff, 
  Coffee,
  X,
  Save,
  Activity,
  Camera,
  Upload,
  Trash2,
  LayoutDashboard,
  RefreshCw,
  Check,
  AlertCircle,
  SwitchCamera
} from "lucide-react";

export default function App() {
  // Session User
  const [user, setUser] = useState<{ uid: string; email: string; displayName?: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
  const [isFirstTimeNewAccount, setIsFirstTimeNewAccount] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [foodInitialSubView, setFoodInitialSubView] = useState<"diary" | "camera">("diary");
  const [syncing, setSyncing] = useState<boolean>(false);
  const [onlineStatus, setOnlineStatus] = useState<boolean>(isOnline());

  // Profile Image and Live Camera references
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("user");
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Helper to create a comprehensive healthy default profile for existing accounts
  const createDefaultUserProfile = (email: string, displayName?: string): UserProfile => {
    const fallbackName = displayName || (email ? email.split('@')[0] : "User");
    return {
      name: fallbackName,
      email: email,
      age: 26,
      gender: 'Male',
      height: 175,
      weight: 70,
      targetWeight: 68,
      goal: 'Weight Loss',
      activityLevel: 'Moderately Active',
      dietPreference: 'Vegetarian',
      cuisinePreference: 'Tamil',
      dailyCalorieTarget: 2000,
      macroTargets: {
        protein: 110,
        carbs: 210,
        fat: 55,
        fiber: 30
      },
      streakDays: 1,
      onboardingCompleted: true
    };
  };

  // Listen to Firebase Auth state changes to restore sessions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const authenticatedUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || undefined
          };
          setUser(authenticatedUser);
          
          // Pre-load the user profile immediately on state restoration
          let existingProfile = await getUserProfile(firebaseUser.uid);
          
          if (!existingProfile) {
            // Check if profile is stored in localStorage with fallback
            const cached = localStorage.getItem(`profile_${firebaseUser.uid}`);
            if (cached) {
              try {
                existingProfile = JSON.parse(cached);
              } catch (e) {
                // ignore
              }
            }
          }

          const hasCompletedFlag = 
            localStorage.getItem(`onboarded_${firebaseUser.uid}`) === "true" ||
            localStorage.getItem(`onboarded_${firebaseUser.email}`) === "true" ||
            localStorage.getItem(`has_seen_welcome_${firebaseUser.email}`) === "true";

          if (existingProfile) {
            setProfile(existingProfile);
            setIsFirstTimeNewAccount(false);
          } else if (hasCompletedFlag) {
            // Returning user who logged in previously -> create and persist default profile
            const defaultProf = createDefaultUserProfile(authenticatedUser.email, authenticatedUser.displayName);
            await saveUserProfile(firebaseUser.uid, defaultProf);
            setProfile(defaultProf);
            setIsFirstTimeNewAccount(false);
          } else {
            // Check creation time: if created more than 2 minutes ago, it's an existing account
            const creationTime = firebaseUser.metadata?.creationTime ? new Date(firebaseUser.metadata.creationTime).getTime() : 0;
            const isBrandNew = (Date.now() - creationTime) < 2 * 60 * 1000;
            if (!isBrandNew) {
              // Existing account on new browser/device -> Auto populate & open Dashboard
              const defaultProf = createDefaultUserProfile(authenticatedUser.email, authenticatedUser.displayName);
              await saveUserProfile(firebaseUser.uid, defaultProf);
              localStorage.setItem(`onboarded_${firebaseUser.uid}`, "true");
              if (authenticatedUser.email) {
                localStorage.setItem(`onboarded_${authenticatedUser.email}`, "true");
                localStorage.setItem(`has_seen_welcome_${authenticatedUser.email}`, "true");
              }
              setProfile(defaultProf);
              setIsFirstTimeNewAccount(false);
            } else {
              setIsFirstTimeNewAccount(true);
            }
          }
        } else {
          setUser(null);
          setProfile(null);
          setIsFirstTimeNewAccount(false);
        }
      } catch (err) {
        console.error("Auth session restoration error:", err);
      } finally {
        setLoadingAuth(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Global Daily Logs
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [waterAmount, setWaterAmount] = useState<number>(0); // in Liters
  const [stepsCount, setStepsCount] = useState<number>(0);
  const [workoutDuration, setWorkoutDuration] = useState<number>(0);
  const [sleepDuration, setSleepDuration] = useState<string>("7h 30m");
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [dailyInsight, setDailyInsight] = useState<string>("");

  // Fasting Intermittent Timer states
  const [isFasting, setIsFasting] = useState<boolean>(false);
  const [fastingStart, setFastingStart] = useState<number | null>(null);
  const [fastingStructure, setFastingStructure] = useState<string>("16:8");
  const [fastingHoursLeft, setFastingHoursLeft] = useState<string>("16:00:00");

  // In-app Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // Quick Action Sheet Overlays
  const [quickAction, setQuickAction] = useState<"scan" | "water" | "steps" | "sleep" | "fasting" | null>(null);

  // Hydration temporary entry state
  const [waterInput, setWaterInput] = useState<number>(250);
  // Step tracker temporary entry state
  const [stepsInput, setStepsInput] = useState<number>(1000);
  // Sleep tracker temporary states
  const [sleepBedtime, setSleepBedtime] = useState<string>("22:30");
  const [sleepWakeTime, setSleepWakeTime] = useState<string>("06:00");
  const [sleepQuality, setSleepQuality] = useState<string>("Good");

  // Check network status at runtime
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    // Set date of today as default
    const todayStr = new Date().toISOString().split("T")[0];
    setSelectedDate(todayStr);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // When selectedDate or User updates, sync or load logs
  useEffect(() => {
    if (user && selectedDate) {
      loadDailyRecords(user.uid, selectedDate);
    }
  }, [user, selectedDate]);

  // Fasting live timer loop
  useEffect(() => {
    let interval: any = null;
    if (isFasting && fastingStart) {
      interval = setInterval(() => {
        const totalDurationSecs = fastingStructure === "16:8" ? 16 * 3600 : fastingStructure === "18:6" ? 18 * 3600 : 20 * 3600;
        const elapsedSecs = Math.floor((Date.now() - fastingStart) / 1000);
        const remainingSecs = Math.max(0, totalDurationSecs - elapsedSecs);

        if (remainingSecs === 0) {
          setIsFasting(false);
          setFastingStart(null);
          setFastingHoursLeft("00:00:00");
          showToast("🎉 Congratulations! Your fasting window has been successfully completed.");
        } else {
          const h = Math.floor(remainingSecs / 3600).toString().padStart(2, "0");
          const m = Math.floor((remainingSecs % 3600) / 60).toString().padStart(2, "0");
          const s = Math.floor(remainingSecs % 60).toString().padStart(2, "0");
          setFastingHoursLeft(`${h}:${m}:${s}`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFasting, fastingStart, fastingStructure]);

  // Load historical data
  const loadDailyRecords = async (uid: string, date: string) => {
    setSyncing(true);
    try {
      // 1. User profile
      const userProfile = await getUserProfile(uid);
      if (userProfile) {
        setProfile(userProfile);
        // Formulate customized coaching insight contextually
        generateContextualInsight(userProfile, date);
      }

      // 2. Food logs
      const fLogs = await getFoodLogs(uid, date);
      setFoodLogs(fLogs);

      // 3. Water logs
      const wLogs = await getWaterLogs(uid, date);
      const totalWaterLit = wLogs.reduce((acc, log) => acc + (log.amountMl / 1000), 0);
      setWaterAmount(totalWaterLit);

      // 4. Activity logs
      const actLog = await getActivityLogs(uid, date);
      if (actLog) {
        setStepsCount(actLog.steps);
      } else {
        setStepsCount(0);
      }

      // 5. Workout plan
      const wPlans = await getWorkoutPlans(uid, date);
      setWorkoutPlans(wPlans);
      const activePlanToday = wPlans.find(p => p.date === date);
      if (activePlanToday && activePlanToday.completed) {
        setWorkoutDuration(activePlanToday.durationMinutes);
      } else {
        setWorkoutDuration(0);
      }

    } catch (e) {
      console.error("Failed to load offline records:", e);
    } finally {
      setSyncing(false);
    }
  };

  const generateContextualInsight = (p: UserProfile, date: string) => {
    const insights = [
      `For your ${p.cuisinePreference} cuisine taste, substitute normal butter with high-protein spiced curd dressing!`,
      `Since your target is ${p.goal}, ensure you eat at least ${p.macroTargets.protein}g protein today.`,
      `Staying hydrated maintains energy levels. You need 3.0 Liters daily.`,
      `Adding fiber items like raw cucumber salad to your Lunch controls insulin spikes.`,
      `Awesome work! Your active TDEE shows a metabolic burn of ${Math.round(p.dailyCalorieTarget * 1.2)} kcal.`
    ];
    // pick pseudo random based on date/email length
    const idx = (date.charCodeAt(date.length - 1) + p.email.length) % insights.length;
    setDailyInsight(insights[idx]);
  };

  // Auth transition
  const handleAuthSuccess = async (
    authenticatedUser: { uid: string; email: string; displayName?: string },
    isNewAccount: boolean = false
  ) => {
    setLoadingProfile(true);
    setUser(authenticatedUser);

    try {
      let existingProfile = await getUserProfile(authenticatedUser.uid);
      if (!existingProfile) {
        const cached = localStorage.getItem(`profile_${authenticatedUser.uid}`);
        if (cached) {
          try {
            existingProfile = JSON.parse(cached);
          } catch (e) {
            // ignore
          }
        }
      }

      const hasCompletedFlag = 
        localStorage.getItem(`onboarded_${authenticatedUser.uid}`) === "true" ||
        localStorage.getItem(`onboarded_${authenticatedUser.email}`) === "true" ||
        localStorage.getItem(`has_seen_welcome_${authenticatedUser.email}`) === "true";

      if (existingProfile) {
        setProfile(existingProfile);
        setIsFirstTimeNewAccount(false);
      } else if (!isNewAccount || hasCompletedFlag) {
        // RETURNING / ALREADY EXISTING ACCOUNT: Avoid repeating welcome & details page completely!
        const defaultProf = createDefaultUserProfile(authenticatedUser.email, authenticatedUser.displayName);
        await saveUserProfile(authenticatedUser.uid, defaultProf);
        localStorage.setItem(`onboarded_${authenticatedUser.uid}`, "true");
        if (authenticatedUser.email) {
          localStorage.setItem(`onboarded_${authenticatedUser.email}`, "true");
          localStorage.setItem(`has_seen_welcome_${authenticatedUser.email}`, "true");
        }
        setProfile(defaultProf);
        setIsFirstTimeNewAccount(false);
      } else {
        // FIRST TIME NEW REGISTRATION: Show onboarding details setup
        setIsFirstTimeNewAccount(true);
      }
    } catch (e) {
      console.error("Auth success error:", e);
      if (!isNewAccount) {
        const defaultProf = createDefaultUserProfile(authenticatedUser.email, authenticatedUser.displayName);
        setProfile(defaultProf);
        setIsFirstTimeNewAccount(false);
      } else {
        setIsFirstTimeNewAccount(true);
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  // Onboarding complete
  const handleCompleteOnboarding = async (newProfile: UserProfile) => {
    if (!user) return;
    const finalProfile: UserProfile = { ...newProfile, onboardingCompleted: true };
    setProfile(finalProfile);
    setIsFirstTimeNewAccount(false);
    localStorage.setItem(`onboarded_${user.uid}`, "true");
    if (user.email) {
      localStorage.setItem(`onboarded_${user.email}`, "true");
      localStorage.setItem(`has_seen_welcome_${user.email}`, "true");
    }
    await saveUserProfile(user.uid, finalProfile);
    setActiveTab("dashboard");
  };

  // Log food items
  const handleLogMeal = async (mealType: FoodLog['mealType'], items: FoodItem[], loggedTime?: string) => {
    if (!user || !profile) return;
    
    // Check if there is already a log for this mealType on this selectedDate
    const existingLog = foodLogs.find(l => l.mealType === mealType && l.date === selectedDate);
    const defaultTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const finalLoggedTime = loggedTime || defaultTime;
    
    if (existingLog) {
      const updatedItems = [...existingLog.items, ...items];
      const calories = updatedItems.reduce((s, i) => s + i.calories, 0);
      const protein = updatedItems.reduce((s, i) => s + i.protein, 0);
      const carbs = updatedItems.reduce((s, i) => s + i.carbs, 0);
      const fat = updatedItems.reduce((s, i) => s + i.fat, 0);
      const fiber = updatedItems.reduce((s, i) => s + i.fiber, 0);
      
      const updatedPayload: FoodLog = {
        ...existingLog,
        items: updatedItems,
        totalCalories: calories,
        totalProtein: Number(protein.toFixed(1)),
        totalCarbs: Number(carbs.toFixed(1)),
        totalFat: Number(fat.toFixed(1)),
        totalFiber: Number(fiber.toFixed(1)),
        timestamp: Date.now(),
        loggedTime: loggedTime || existingLog.loggedTime || defaultTime
      };
      
      await updateFoodMeal(user.uid, existingLog.id!, updatedPayload);
    } else {
      const calories = items.reduce((s, i) => s + i.calories, 0);
      const protein = items.reduce((s, i) => s + i.protein, 0);
      const carbs = items.reduce((s, i) => s + i.carbs, 0);
      const fat = items.reduce((s, i) => s + i.fat, 0);
      const fiber = items.reduce((s, i) => s + i.fiber, 0);

      const logPayload: Omit<FoodLog, "id"> = {
        userId: user.uid,
        date: selectedDate,
        mealType,
        items,
        totalCalories: calories,
        totalProtein: Number(protein.toFixed(1)),
        totalCarbs: Number(carbs.toFixed(1)),
        totalFat: Number(fat.toFixed(1)),
        totalFiber: Number(fiber.toFixed(1)),
        timestamp: Date.now(),
        loggedTime: finalLoggedTime
      };

      await logFoodMeal(user.uid, logPayload);
    }
    
    // Refresh records
    await loadDailyRecords(user.uid, selectedDate);
  };

  // Delete an entire meal category log
  const handleDeleteMeal = async (logId: string) => {
    if (!user) return;
    await deleteFoodMeal(user.uid, logId);
    await loadDailyRecords(user.uid, selectedDate);
  };

  // Delete a specific individual item within a meal log
  const handleDeleteFoodItem = async (logId: string, itemIndex: number) => {
    if (!user) return;
    const log = foodLogs.find(l => l.id === logId);
    if (!log) return;
    
    const updatedItems = log.items.filter((_, idx) => idx !== itemIndex);
    if (updatedItems.length === 0) {
      await deleteFoodMeal(user.uid, logId);
    } else {
      const calories = updatedItems.reduce((s, i) => s + i.calories, 0);
      const protein = updatedItems.reduce((s, i) => s + i.protein, 0);
      const carbs = updatedItems.reduce((s, i) => s + i.carbs, 0);
      const fat = updatedItems.reduce((s, i) => s + i.fat, 0);
      const fiber = updatedItems.reduce((s, i) => s + i.fiber, 0);
      
      const updatedPayload: FoodLog = {
        ...log,
        items: updatedItems,
        totalCalories: calories,
        totalProtein: Number(protein.toFixed(1)),
        totalCarbs: Number(carbs.toFixed(1)),
        totalFat: Number(fat.toFixed(1)),
        totalFiber: Number(fiber.toFixed(1)),
        timestamp: Date.now()
      };
      
      await updateFoodMeal(user.uid, logId, updatedPayload);
    }
    await loadDailyRecords(user.uid, selectedDate);
  };

  // Save/Complete Workout plan
  const handleSaveWorkout = async (plan: WorkoutPlan) => {
    if (!user) return;
    await saveWorkoutPlan(user.uid, plan);
    await loadDailyRecords(user.uid, selectedDate);
  };

  // Quick log water
  const handleLogWaterAmount = async (ml: number) => {
    if (!user) return;
    await logWater(user.uid, {
      userId: user.uid,
      date: selectedDate,
      amountMl: ml,
      timestamp: Date.now()
    });
    setQuickAction(null);
    await loadDailyRecords(user.uid, selectedDate);
  };

  // Quick log steps
  const handleLogStepsCount = async (steps: number) => {
    if (!user) return;
    await logActivity(user.uid, {
      userId: user.uid,
      date: selectedDate,
      steps: steps,
      distanceKm: Number((steps * 0.0008).toFixed(2)),
      activeMinutes: Math.round(steps / 100),
      caloriesBurned: Math.round(steps * 0.04),
      timestamp: Date.now()
    });
    setQuickAction(null);
    await loadDailyRecords(user.uid, selectedDate);
  };

  // Log Sleep duration
  const handleLogSleepTime = () => {
    if (!user) return;
    const [bedH, bedM] = sleepBedtime.split(":").map(Number);
    const [wakeH, wakeM] = sleepWakeTime.split(":").map(Number);
    
    let diffMs = (new Date(2026, 8, 17, wakeH, wakeM).getTime()) - (new Date(2026, 8, 16, bedH, bedM).getTime());
    if (diffMs < 0) {
      diffMs += 24 * 3600 * 1000;
    }
    const hours = Number((diffMs / (3600 * 1000)).toFixed(1));
    setSleepDuration(`${hours}h (${sleepQuality})`);
    setQuickAction(null);
    showToast(`Logged ${hours} hours of sleep (${sleepQuality} quality)!`);
  };

  // Shift selected date (Yesterday, Today, Tomorrow)
  const shiftDate = (offset: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offset);
    setSelectedDate(current.toISOString().split("T")[0]);
  };

  // Camera stream attachment and lifecycle
  useEffect(() => {
    if (isCameraActive && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [isCameraActive, cameraStream]);

  useEffect(() => {
    if (activeTab !== "profile" && cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
      setIsCameraActive(false);
    }
  }, [activeTab, cameraStream]);

  const compressAndSaveProfilePhoto = (dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 360;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const optimizedUrl = canvas.toDataURL("image/jpeg", 0.85);
        if (profile && user) {
          const updated = { ...profile, photoUrl: optimizedUrl };
          setProfile(updated);
          saveUserProfile(user.uid, updated);
          showToast("Profile photo updated successfully!");
        }
      }
    };
    img.src = dataUrl;
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === "string") {
        compressAndSaveProfilePhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleStartCamera = async (mode: "user" | "environment" = cameraFacingMode) => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError("Camera permission was denied or camera is unavailable.");
    }
  };

  const handleStopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  const handleSwitchCamera = () => {
    const nextMode = cameraFacingMode === "user" ? "environment" : "user";
    setCameraFacingMode(nextMode);
    handleStartCamera(nextMode);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const startX = ((video.videoWidth || size) - size) / 2;
      const startY = ((video.videoHeight || size) - size) / 2;
      ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
      const photoData = canvas.toDataURL("image/jpeg", 0.85);
      compressAndSaveProfilePhoto(photoData);
      handleStopCamera();
    }
  };

  const handleRemoveProfilePhoto = () => {
    if (profile && user) {
      const updated = { ...profile, photoUrl: undefined };
      setProfile(updated);
      saveUserProfile(user.uid, updated);
      showToast("Profile photo removed.");
    }
  };

  const handleSignOut = async () => {
    try {
      handleStopCamera();
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("Signout error:", err);
    }
  };

  // Profile Modification save
  const handleSaveProfileEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    await saveUserProfile(user.uid, profile);
    showToast("Profile configurations updated and synchronized successfully!");
  };

  // --- RENDERING ROUTER ---

  if (loadingAuth || loadingProfile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Session...</div>
      </div>
    );
  }

  // 1. AUTH PANEL
  if (!user) {
    return <AuthPanel onAuthSuccess={handleAuthSuccess} />;
  }

  // 2. ONBOARDING SPLASH - ONLY for first time new account registration
  if (user && !profile) {
    if (isFirstTimeNewAccount) {
      return (
        <SplashPanel 
          onCompleteOnboarding={handleCompleteOnboarding} 
          initialEmail={user.email} 
          initialName={user.displayName}
          isNewUser={true}
        />
      );
    } else {
      const defaultProf = createDefaultUserProfile(user.email, user.displayName);
      setProfile(defaultProf);
    }
  }

  // 3. MAIN FULL-STACK WORKSPACE
  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col justify-between max-w-md mx-auto relative shadow-2xl border-x border-slate-900 overflow-hidden">
      
      {/* Main Dynamic View Content */}
      <main className="flex-1 px-4.5 py-4 overflow-y-auto pt-6">
        {activeTab === "dashboard" && (
          <DashboardView 
            userId={user.uid}
            profile={profile}
            foodLogs={foodLogs}
            waterAmount={waterAmount}
            stepsCount={stepsCount}
            workoutDuration={workoutDuration}
            sleepDuration={sleepDuration}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              if (tab === "food") {
                setFoodInitialSubView("diary");
              }
            }}
            onOpenQuickAction={(act) => {
              if (act === "scan") {
                setActiveTab("food");
                setFoodInitialSubView("camera");
              } else {
                setQuickAction(act);
              }
            }}
            dailyInsight={dailyInsight}
          />
        )}

        {activeTab === "food" && (
          <FoodDiaryView 
            profile={profile}
            foodLogs={foodLogs}
            onLogMeal={handleLogMeal}
            onDeleteMeal={handleDeleteMeal}
            onDeleteFoodItem={handleDeleteFoodItem}
            selectedDate={selectedDate}
            initialSubView={foodInitialSubView}
          />
        )}

        {activeTab === "meals" && (
          <MealPlannerView 
            profile={profile}
            onLogMeal={handleLogMeal}
            selectedDate={selectedDate}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              if (tab === "food") {
                setFoodInitialSubView("diary");
              }
            }}
          />
        )}

        {activeTab === "workout" && (
          <WorkoutView 
            profile={profile}
            onSaveWorkout={handleSaveWorkout}
            workoutPlans={workoutPlans}
            selectedDate={selectedDate}
          />
        )}

        {/* AI ASSISTANT (GEMINI AI DOUBT CLARIFIER) */}
        {activeTab === "assistant" && (
          <AIAssistantView 
            profile={profile}
            foodLogs={foodLogs}
            waterAmount={waterAmount}
            stepsCount={stepsCount}
          />
        )}

        {/* ANALYTICAL REPORTS VIEW */}
        {activeTab === "reports" && (
          <div className="space-y-6 pb-24 animate-fade-in text-white px-1">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Metrics Analytics</span>
              <h1 className="text-2xl font-black text-slate-100 mt-0.5 flex items-center gap-1.5">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                Fitness Progress
              </h1>
            </div>

            {/* Recharts Calorie progress visualizer component */}
            <WeeklyProgressReport profile={profile} userId={user.uid} />

            {/* SVG Chart 2: Weight tracking trend */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2.5xl p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Weight Trend Line</h3>
                <span className="text-[10px] text-slate-400 font-bold">Goal Target: {profile.targetWeight} kg</span>
              </div>
              
              <div className="w-full h-44 bg-slate-950/60 rounded-xl p-3 flex flex-col justify-between border border-slate-900/60 relative overflow-hidden">
                <svg className="w-full h-32" viewBox="0 0 300 100">
                  <line x1="10" y1="20" x2="290" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="10" y1="50" x2="290" y2="50" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="10" y1="80" x2="290" y2="80" stroke="#1e293b" strokeDasharray="3,3" />
                  
                  {/* Goal baseline weight */}
                  <line x1="10" y1="75" x2="290" y2="75" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />
                  
                  <path 
                    d="M 30,28 L 70,30 L 110,35 L 150,42 L 190,48 L 230,55 L 270,58" 
                    fill="none" 
                    stroke="#a78bfa" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />
                  
                  <circle cx="30" cy="28" r="3.5" fill="#a78bfa" />
                  <circle cx="70" cy="30" r="3.5" fill="#a78bfa" />
                  <circle cx="110" cy="35" r="3.5" fill="#a78bfa" />
                  <circle cx="150" cy="42" r="3.5" fill="#a78bfa" />
                  <circle cx="190" cy="48" r="3.5" fill="#a78bfa" />
                  <circle cx="230" cy="55" r="3.5" fill="#a78bfa" />
                  <circle cx="270" cy="58" r="3.5" fill="#a78bfa" />
                </svg>

                <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold px-2">
                  <span>Wk 1</span>
                  <span>Wk 2</span>
                  <span>Wk 3</span>
                  <span>Wk 4</span>
                  <span>Wk 5</span>
                  <span>Wk 6</span>
                  <span>Latest ({profile.weight} kg)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM PROFILE VIEW */}
        {activeTab === "profile" && (
          <div className="space-y-5 pb-24 animate-fade-in text-white px-1">
            {/* Hidden file input for profile image upload */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageFileUpload}
              className="hidden"
            />
            {/* Hidden canvas for snapshot image processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Profile View Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account configurations</span>
                <h1 className="text-xl font-black text-slate-100 flex items-center gap-1.5">
                  <User className="w-5 h-5 text-emerald-400" />
                  My Profile
                </h1>
              </div>
            </div>

            {/* User Profile Image Card (Upload or Live Capture) */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2.5xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative group shrink-0">
                  <div className="w-20 h-20 rounded-full border-2 border-emerald-500/50 bg-slate-950 flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-500/10">
                    {profile.photoUrl ? (
                      <img 
                        src={profile.photoUrl} 
                        alt={profile.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-500/15 flex items-center justify-center text-2xl font-black text-emerald-400 uppercase">
                        {profile.name.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  {profile.photoUrl && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-slate-900 shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-black text-slate-100 truncate">{profile.name}</h2>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{profile.email || user.email}</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Upload</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartCamera()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Capture</span>
                    </button>

                    {profile.photoUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveProfilePhoto}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl active:scale-95 transition-all cursor-pointer"
                        title="Remove profile photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Camera Viewfinder Modal / Card */}
              {isCameraActive && (
                <div className="mt-4 p-4 bg-slate-950 border border-emerald-500/30 rounded-2xl space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 animate-pulse" />
                      Live Camera Viewfinder
                    </span>
                    <button
                      type="button"
                      onClick={handleSwitchCamera}
                      className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-200 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 cursor-pointer"
                    >
                      <SwitchCamera className="w-3 h-3" />
                      <span>Flip Camera</span>
                    </button>
                  </div>

                  {cameraError ? (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{cameraError}</span>
                    </div>
                  ) : (
                    <div className="relative aspect-square max-w-[260px] mx-auto overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-black shadow-inner">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-4 border border-white/20 rounded-full pointer-events-none"></div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleCapturePhoto}
                      disabled={!!cameraError}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-950" />
                      <span>Take Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleStopCamera}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Demographics & Health Profile Form */}
            <form onSubmit={handleSaveProfileEdit} className="bg-slate-900/60 border border-slate-800 rounded-2.5xl p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Demographics & Targets</h3>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Current Weight (kg)</label>
                    <input
                      type="number"
                      required
                      value={profile.weight}
                      onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Target Weight (kg)</label>
                    <input
                      type="number"
                      required
                      value={profile.targetWeight}
                      onChange={(e) => setProfile({ ...profile, targetWeight: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Height (cm)</label>
                    <input
                      type="number"
                      required
                      value={profile.height}
                      onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Age (Years)</label>
                    <input
                      type="number"
                      required
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Primary Diet Type</label>
                  <select
                    value={profile.dietPreference}
                    onChange={(e: any) => setProfile({ ...profile, dietPreference: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none"
                  >
                    {["Vegetarian", "Non-Vegetarian", "Vegan", "Eggitarian", "Jain"].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-1 cursor-pointer hover:scale-[1.02] transition-all"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>Save Configuration Changes</span>
                </button>
              </div>
            </form>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-emerald-400 font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Overlays / Sheets (Quick Actions) */}
      {quickAction === "water" && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-end z-50 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 space-y-5 animate-fade-in mx-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Droplet className="w-5 h-5 text-blue-400 fill-current" />
                Quick hydration logger
              </h3>
              <button onClick={() => setQuickAction(null)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick volumes selections */}
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { label: "1 Glass (200ml)", vol: 200 },
                { label: "1 Cup (250ml)", vol: 250 },
                { label: "1 Bottle (500ml)", vol: 500 },
                { label: "1 Shaker (750ml)", vol: 750 }
              ].map((glass) => (
                <button
                  key={glass.vol}
                  onClick={() => handleLogWaterAmount(glass.vol)}
                  className="p-3 bg-slate-950 border border-slate-850 hover:border-blue-400 rounded-xl text-center cursor-pointer transition-all active:scale-95"
                >
                  <span className="text-[10px] text-slate-400 block font-semibold">{glass.label.split(" ")[0]}</span>
                  <span className="text-xs font-black text-blue-400 block mt-1">{glass.vol}ml</span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Custom Volume (ml)</label>
              <div className="flex space-x-2.5">
                <input
                  type="number"
                  value={waterInput}
                  onChange={(e) => setWaterInput(Number(e.target.value))}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                />
                <button
                  onClick={() => handleLogWaterAmount(waterInput)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-slate-950 text-xs font-black rounded-xl active:scale-95 transition-all"
                >
                  Log Volume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {quickAction === "steps" && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-end z-50 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 space-y-5 animate-fade-in mx-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Footprints className="w-5 h-5 text-emerald-400" />
                Register steps walked
              </h3>
              <button onClick={() => setQuickAction(null)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[3000, 5000, 10000].map((quickSteps) => (
                  <button
                    key={quickSteps}
                    onClick={() => handleLogStepsCount(quickSteps)}
                    className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-500 rounded-xl font-bold text-xs"
                  >
                    +{quickSteps.toLocaleString()} Steps
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Set absolute step count</label>
                <div className="flex space-x-2.5">
                  <input
                    type="number"
                    value={stepsInput}
                    onChange={(e) => setStepsInput(Number(e.target.value))}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                  />
                  <button
                    onClick={() => handleLogStepsCount(stepsInput)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black rounded-xl active:scale-95 transition-all"
                  >
                    Update Steps
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {quickAction === "sleep" && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-end z-50 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 space-y-5 animate-fade-in mx-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Moon className="w-5 h-5 text-cyan-400" />
                Sleep Duration Tracker
              </h3>
              <button onClick={() => setQuickAction(null)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Bed Time</label>
                  <input
                    type="time"
                    value={sleepBedtime}
                    onChange={(e) => setSleepBedtime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Wake Time</label>
                  <input
                    type="time"
                    value={sleepWakeTime}
                    onChange={(e) => setSleepWakeTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Sleep Quality Rating</label>
                <select
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                >
                  {["Poor", "Fair", "Good", "Excellent"].map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleLogSleepTime}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
              >
                Log Sleep Record
              </button>
            </div>
          </div>
        </div>
      )}

      {quickAction === "fasting" && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-end z-50 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 space-y-5 animate-fade-in mx-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Coffee className="w-5 h-5 text-emerald-400 animate-pulse" />
                Intermittent Fasting Timer
              </h3>
              <button onClick={() => setQuickAction(null)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isFasting ? (
              <div className="bg-slate-950/80 border border-emerald-500/10 p-5 rounded-2xl text-center space-y-3">
                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest block">Active Fast ({fastingStructure})</span>
                <span className="text-3xl font-black text-slate-100 block tracking-widest animate-pulse font-mono">{fastingHoursLeft}</span>
                <button
                  onClick={() => {
                    setIsFasting(false);
                    setFastingStart(null);
                  }}
                  className="py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl active:scale-95 transition-all"
                >
                  Stop Fasting Period
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Select Fasting Ratio</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["16:8", "18:6", "20:4"].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setFastingStructure(ratio)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          fastingStructure === ratio 
                            ? "bg-emerald-500 text-slate-950 border-emerald-500" 
                            : "bg-slate-950 border-slate-850 text-slate-400"
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsFasting(true);
                    setFastingStart(Date.now());
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
                >
                  Start Fasting Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="absolute top-4 left-4 right-4 z-50 animate-fade-in pointer-events-none">
          <div className="bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center justify-between border border-emerald-400/30 backdrop-blur-md">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* App Fixed Tab Navigation Bar */}
      <footer className="sticky bottom-0 bg-slate-950/95 border-t border-slate-900/80 px-1.5 py-2 backdrop-blur-md z-40 select-none">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {[
            { id: "dashboard", label: "Dashboard", emoji: "🏠" },
            { id: "food", label: "Diary", emoji: "🍲" },
            { id: "meals", label: "Meal Plan", emoji: "🥗" },
            { id: "workout", label: "Workout", emoji: "🏋️" },
            { id: "assistant", label: "AI Assistant", emoji: "✨" },
            { id: "reports", label: "Reports", emoji: "📊" }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "food") {
                    setFoodInitialSubView("diary");
                  }
                }}
                className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer ${
                  isSelected 
                    ? "text-emerald-400 font-black scale-105" 
                    : "text-slate-500 hover:text-slate-300 font-medium"
                }`}
              >
                <span className="text-base sm:text-lg block">{tab.emoji}</span>
                <span className="text-[8.5px] sm:text-[9px] font-bold block mt-0.5 tracking-wide whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
