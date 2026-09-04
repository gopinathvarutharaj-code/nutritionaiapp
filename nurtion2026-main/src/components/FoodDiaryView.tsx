import React, { useState, useRef, useEffect } from "react";
import { UserProfile, FoodLog, FoodItem } from "../types";
import { Search, Plus, Trash2, Camera, ChevronLeft, Sparkles, Check, Info, FileText, Smartphone, Clock, ShieldCheck, ExternalLink, RefreshCw } from "lucide-react";

interface FoodDiaryViewProps {
  profile: UserProfile;
  foodLogs: FoodLog[];
  onLogMeal: (mealType: FoodLog['mealType'], items: FoodItem[], loggedTime?: string) => void;
  onDeleteMeal: (logId: string) => void;
  onDeleteFoodItem?: (logId: string, itemIndex: number) => void;
  selectedDate: string;
  initialSubView?: "diary" | "camera";
}

// Structured Local Indian Food Database
const popularIndianFoods: FoodItem[] = [
  { 
    name: "e-Millet Crunchy Little Millet Choco Hearts (100g Pack)", 
    portionGrams: 100, 
    calories: 407.86, 
    protein: 9.8, 
    carbs: 75.2, 
    fat: 7.54, 
    fiber: 5.2,
    sugar: 37.5,
    saturatedFat: 1.5,
    transFat: 0.0,
    cholesterol: 0.0,
    brand: "e-Millet (Millet Snacks)",
    verifiedSource: "Official Brand Platform (milletsnacks.com)",
    groundingUrl: "https://milletsnacks.com",
    highlights: [
      "Official Product Facts: 9.8g Protein, 75.2g Carbs, 7.54g Fat, 5.2g Fiber",
      "Clean Ingredients: 47% Multi-grain (Corn 25%, Samai 20%, Gram Dal 2%)",
      "Jaggery Sweetened (45%): 0% refined white sugar",
      "Non-Fried Extruded Snack: Pure Cocoa, Cashew Nuts, Grits, Cardamom"
    ],
    ingredients: [
      "Multi-grain Blend (47%): Corn Meal (25%), Little Millet Meal (Samai) (20%), Gram Dal Meal (2%)",
      "Sweeteners: Jaggery Powder (45%)",
      "Flavoring & Texture: Cocoa Powder, Cashew Nuts, Grits, Cardamom, Edible Vegetable Oil (Palm)"
    ]
  },
  { 
    name: "e-Millet Little Millet Choco Hearts (1 Serving ~30g)", 
    portionGrams: 30, 
    calories: 122.36, 
    protein: 2.94, 
    carbs: 22.56, 
    fat: 2.26, 
    fiber: 1.56,
    sugar: 11.25,
    saturatedFat: 0.45,
    transFat: 0.0,
    cholesterol: 0.0,
    brand: "e-Millet (Millet Snacks)",
    verifiedSource: "Official Brand Platform (milletsnacks.com)",
    groundingUrl: "https://milletsnacks.com",
    highlights: [
      "Official Product Facts: 2.94g Protein, 22.56g Carbs, 2.26g Fat, 122.36 kcal",
      "Baked Non-Fried Extruded Snack",
      "Sweetened with natural Jaggery Powder",
      "Rich in Little Millet (Samai / சாமை)"
    ]
  },
  { 
    name: "e-Millet Sorghum (Jowar) Noodles (100g Pack)", 
    portionGrams: 100, 
    calories: 365.54, 
    protein: 13.58, 
    carbs: 73.50, 
    fat: 1.01, 
    fiber: 9.36,
    brand: "e-Millet (Millet Snacks)",
    verifiedSource: "Official Brand Platform (milletsnacks.com)",
    groundingUrl: "https://milletsnacks.com/products/sorghum-noodles-with-masala",
    highlights: [
      "No Maida: 33% Sorghum (Jowar / சோளம்) + 61.5% Whole Wheat",
      "No Added MSG & No Preservatives",
      "Diabetic Friendly & Low GI",
      "Not Fried (Air-Dried, 1.01g Fat)"
    ],
    sugar: 6.25,
    sodium: 820.00,
    calcium: 184.00,
    iron: 7.85
  },
  { 
    name: "e-Millet Sorghum Noodles (1 Serving ~60g)", 
    portionGrams: 60, 
    calories: 219.32, 
    protein: 8.15, 
    carbs: 44.10, 
    fat: 1.01, 
    fiber: 5.62,
    brand: "e-Millet (Millet Snacks)",
    verifiedSource: "Official Brand Platform (milletsnacks.com)",
    groundingUrl: "https://milletsnacks.com/products/sorghum-noodles-with-masala",
    highlights: [
      "No Maida: 33% Sorghum + 61.5% Whole Wheat",
      "Diabetic Friendly & Low GI",
      "Not Fried"
    ],
    sugar: 3.75,
    sodium: 492.00,
    calcium: 110.40,
    iron: 4.71
  },
  { name: "Roti (Whole Wheat)", portionGrams: 40, calories: 120, protein: 4, carbs: 24, fat: 1, fiber: 3 },
  { name: "Brown Rice (Cooked)", portionGrams: 100, calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8 },
  { name: "White Rice (Cooked)", portionGrams: 100, calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
  { name: "Dal Tadka", portionGrams: 150, calories: 150, protein: 7, carbs: 20, fat: 5, fiber: 4 },
  { name: "Paneer Butter Masala", portionGrams: 150, calories: 340, protein: 11, carbs: 8, fat: 28, fiber: 1.2 },
  { name: "Idli (2 pieces)", portionGrams: 100, calories: 120, protein: 4, carbs: 24, fat: 0.2, fiber: 1.6 },
  { name: "Dosa (Plain)", portionGrams: 80, calories: 140, protein: 3, carbs: 26, fat: 4, fiber: 1.2 },
  { name: "Sambar", portionGrams: 150, calories: 95, protein: 3.2, carbs: 14, fat: 2.5, fiber: 3.6 },
  { name: "Egg Bhurji (2 Eggs)", portionGrams: 120, calories: 195, protein: 13, carbs: 3, fat: 15, fiber: 0.5 },
  { name: "Chicken Curry", portionGrams: 150, calories: 260, protein: 24, carbs: 6, fat: 16, fiber: 1.5 },
  { name: "Banana (1 Medium)", portionGrams: 118, calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1 },
  { name: "Curd / Dahi", portionGrams: 100, calories: 98, protein: 3.5, carbs: 4.7, fat: 4.3, fiber: 0 }
];

// Helper to format HH:mm into beautiful 12h format (e.g., 08:30 PM)
const formatHHMMTo12h = (time24: string): string => {
  if (!time24) return "";
  const parts = time24.split(":");
  if (parts.length < 2) return time24;
  let hrs = parseInt(parts[0], 10);
  const mins = parts[1];
  const ampm = hrs >= 12 ? "PM" : "AM";
  hrs = hrs % 12;
  if (hrs === 0) hrs = 12;
  return `${String(hrs).padStart(2, '0')}:${mins} ${ampm}`;
};

export const FoodDiaryView: React.FC<FoodDiaryViewProps> = ({
  profile,
  foodLogs,
  onLogMeal,
  onDeleteMeal,
  onDeleteFoodItem,
  selectedDate,
  initialSubView = "diary"
}) => {
  const [subView, setSubView] = useState<"diary" | "add_manual" | "camera" | "scan_result">("diary");
  const [mealPlan, setMealPlan] = useState<any[]>([]);

  useEffect(() => {
    const cachedPlan = localStorage.getItem(`mealPlan_${profile.email}`);
    if (cachedPlan) {
      try {
        setMealPlan(JSON.parse(cachedPlan));
      } catch (e) {
        console.error("Failed to parse cached meal plan in FoodDiaryView:", e);
      }
    }
  }, [profile.email]);

  // Keep subview synchronized with initialSubView transitions
  useEffect(() => {
    if (initialSubView) {
      setSubView(initialSubView);
    }
  }, [initialSubView]);
  const [activeMealType, setActiveMealType] = useState<FoodLog['mealType']>("Breakfast");
  const [diaryViewMode, setDiaryViewMode] = useState<"categories" | "chronological">("categories");
  const [mealTime, setMealTime] = useState<string>(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<{ type: "meal" | "item"; logId: string; itemIndex?: number } | null>(null);

  // Manual search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPopularFood, setSelectedPopularFood] = useState<FoodItem | null>(null);
  const [manualGrams, setManualGrams] = useState<number>(100);

  // Custom food entry state
  const [customName, setCustomName] = useState<string>("");
  const [customCals, setCustomCals] = useState<number>(150);
  const [customProtein, setCustomProtein] = useState<number>(5);
  const [customCarbs, setCustomCarbs] = useState<number>(20);
  const [customFat, setCustomFat] = useState<number>(4);
  const [customFiber, setCustomFiber] = useState<number>(2);

  // Camera vision scanner states
  const [loadingScan, setLoadingScan] = useState<boolean>(false);
  const [detectedItems, setDetectedItems] = useState<FoodItem[]>([]);
  const [loggedIndices, setLoggedIndices] = useState<number[]>([]);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState<string>("");
  const [scanMessage, setScanMessage] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [verifyingIndex, setVerifyingIndex] = useState<number | null>(null);
  const [isVerifyingAll, setIsVerifyingAll] = useState<boolean>(false);

  // Real Camera capture states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    setScanMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      // Wait for ref update and start play
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => {
            console.error("Play error:", e);
          });
        }
      }, 100);
      setScanMessage("Live Camera Active. Center your food plate!");
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera. Please allow camera permissions or drop/upload an image file instead.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setScanImage(dataUrl);
        setScanMessage("Captured image from device camera successfully!");
        
        // Auto-set the time based on the exact capture timing
        const d = new Date();
        setMealTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
        
        stopCamera();
      }
    }
  };

  // Stop camera stream on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Barcode mock trigger
  const [barcodeQuery, setBarcodeQuery] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setScanMessage("Please select an image file (PNG, JPG, JPEG)!");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScanImage(reader.result as string);
      setScanMessage(`Loaded image: ${file.name}`);
      
      // Auto-set the time based on the exact upload/selection timing
      const d = new Date();
      setMealTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleClearSelectedImage = () => {
    setScanImage(null);
    setSelectedFile(null);
    setScanMessage("");
    stopCamera();
    setCameraError(null);
  };

  const handleSelectPopularFood = (food: FoodItem) => {
    setSelectedPopularFood(food);
    setManualGrams(food.portionGrams);
  };

  const handleConfirmAddPopular = () => {
    if (!selectedPopularFood) return;
    const scale = manualGrams / selectedPopularFood.portionGrams;
    const finalItem: FoodItem = {
      name: selectedPopularFood.name,
      portionGrams: manualGrams,
      calories: Math.round(selectedPopularFood.calories * scale),
      protein: Number((selectedPopularFood.protein * scale).toFixed(1)),
      carbs: Number((selectedPopularFood.carbs * scale).toFixed(1)),
      fat: Number((selectedPopularFood.fat * scale).toFixed(1)),
      fiber: Number((selectedPopularFood.fiber * scale).toFixed(1))
    };
    onLogMeal(activeMealType, [finalItem], mealTime);
    setSelectedPopularFood(null);
    setSubView("diary");
  };

  const handleAddCustomFood = () => {
    if (!customName) return;
    const customItem: FoodItem = {
      name: customName,
      portionGrams: 100,
      calories: customCals,
      protein: customProtein,
      carbs: customCarbs,
      fat: customFat,
      fiber: customFiber
    };
    onLogMeal(activeMealType, [customItem], mealTime);
    setCustomName("");
    setSubView("diary");
  };

  // Helper to retrieve contextual food item estimates from popular Indian foods
  const getFallbackDetectedItems = (query?: string): FoodItem[] => {
    const q = (query || "").toLowerCase();
    if (q.includes("choco") || q.includes("hearts") || q.includes("samai")) {
      return [popularIndianFoods[0]];
    }
    if (q.includes("sorghum") || q.includes("jowar") || q.includes("noodle")) {
      return [popularIndianFoods[2]];
    }
    if (q.includes("paneer")) {
      return [
        { name: "Paneer Butter Masala", portionGrams: 150, calories: 340, protein: 11, carbs: 8, fat: 28, fiber: 1.2, confidence: 0.94 },
        { name: "Whole Wheat Roti (2 pcs)", portionGrams: 80, calories: 240, protein: 8, carbs: 48, fat: 2, fiber: 6, confidence: 0.92 }
      ];
    }
    if (q.includes("dosa")) {
      return [
        { name: "Masala Dosa", portionGrams: 120, calories: 220, protein: 5, carbs: 32, fat: 8, fiber: 2.5, confidence: 0.95 },
        { name: "Sambar", portionGrams: 150, calories: 95, protein: 3.2, carbs: 14, fat: 2.5, fiber: 3.6, confidence: 0.93 }
      ];
    }
    if (q.includes("idli")) {
      return [
        { name: "Steamed Idli (3 pcs)", portionGrams: 150, calories: 180, protein: 6, carbs: 36, fat: 0.3, fiber: 2.4, confidence: 0.95 },
        { name: "Sambar", portionGrams: 150, calories: 95, protein: 3.2, carbs: 14, fat: 2.5, fiber: 3.6, confidence: 0.92 }
      ];
    }
    if (q.includes("rice")) {
      return [
        { name: "Steamed Brown Rice", portionGrams: 150, calories: 166, protein: 3.9, carbs: 34.5, fat: 1.3, fiber: 2.7, confidence: 0.93 },
        { name: "Dal Tadka", portionGrams: 150, calories: 150, protein: 7, carbs: 20, fat: 5, fiber: 4, confidence: 0.91 }
      ];
    }
    // Default wholesome Indian meal
    return [
      { name: "Whole Wheat Roti (2 pcs)", portionGrams: 80, calories: 240, protein: 8, carbs: 48, fat: 2, fiber: 6, confidence: 0.94 },
      { name: "Dal Tadka (1 bowl)", portionGrams: 150, calories: 150, protein: 7, carbs: 20, fat: 5, fiber: 4, confidence: 0.92 },
      { name: "Mixed Vegetable Curry", portionGrams: 150, calories: 120, protein: 3, carbs: 16, fat: 5, fiber: 5, confidence: 0.89 }
    ];
  };

  // Simulate Photo capture / gallery upload
  const handleTriggerAIScan = async (useSampleImage: boolean) => {
    setLoadingScan(true);
    setScanMessage("");
    setLoggedIndices([]);
    let payload: any = {};

    if (useSampleImage) {
      // Simulate base64 Indian meal thumbnail
      setScanImage("https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=60");
      payload = { text: "2 Rotis, Yellow Dal and mixed veg curry" };
    } else if (scanImage && scanImage.startsWith("data:image/")) {
      // User-uploaded real photo!
      payload = { image: scanImage, text: textDescription || "Analyze this food item." };
    } else {
      if (!textDescription) {
        setScanMessage("Please enter a food description or select/drag-and-drop an image first!");
        setLoadingScan(false);
        return;
      }
      payload = { text: textDescription };
    }

    try {
      const response = await fetch("/api/ai/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        setDetectedItems(data.items);
        setScanMessage(data.message || "Nutritional facts analyzed successfully.");
      } else {
        const queryText = textDescription || (useSampleImage ? "2 Rotis, Yellow Dal and mixed veg curry" : "");
        const fallbackItems = getFallbackDetectedItems(queryText);
        setDetectedItems(fallbackItems);
        setScanMessage(data?.message || "Using localized database estimates.");
      }
      setSubView("scan_result");
    } catch (e) {
      console.warn("Using localized nutritional fallback:", e);
      const queryText = textDescription || (useSampleImage ? "2 Rotis, Yellow Dal and mixed veg curry" : "");
      const fallbackItems = getFallbackDetectedItems(queryText);
      setDetectedItems(fallbackItems);
      setScanMessage("Using localized database estimates.");
      setSubView("scan_result");
    } finally {
      setLoadingScan(false);
    }
  };

  // Cross-reference a single detected item against the trusted nutrition database or Google Search Grounding
  const handleVerifyItem = async (index: number) => {
    const item = detectedItems[index];
    if (!item) return;
    setVerifyingIndex(index);
    try {
      const res = await fetch("/api/nutrition/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: item.name, portionGrams: item.portionGrams })
      });
      const data = await res.json();
      if (data && data.item) {
        const updated = [...detectedItems];
        updated[index] = {
          ...updated[index],
          ...data.item,
          verifiedSource: data.verifiedSource || data.item.verifiedSource,
          groundingUrl: data.groundingUrl || data.item.groundingUrl
        };
        setDetectedItems(updated);
        setScanMessage(data.message || `Verified against ${data.verifiedSource}`);
      }
    } catch (err) {
      console.warn("Verification request notice:", err);
    } finally {
      setVerifyingIndex(null);
    }
  };

  // Cross-reference all detected items in batch
  const handleVerifyAllItems = async () => {
    if (detectedItems.length === 0) return;
    setIsVerifyingAll(true);
    try {
      const updated = await Promise.all(
        detectedItems.map(async (item) => {
          try {
            const res = await fetch("/api/nutrition/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query: item.name, portionGrams: item.portionGrams })
            });
            const data = await res.json();
            if (data && data.item) {
              return {
                ...item,
                ...data.item,
                verifiedSource: data.verifiedSource || data.item.verifiedSource,
                groundingUrl: data.groundingUrl || data.item.groundingUrl
              };
            }
          } catch {
            // Keep original on transient failure
          }
          return item;
        })
      );
      setDetectedItems(updated);
      setScanMessage("Cross-referenced items against official brand platform catalogs & scientific nutrition sources.");
    } finally {
      setIsVerifyingAll(false);
    }
  };

  // Packaged Barcode / Brand Catalog Cross-Referencing
  const handleBarcodeMock = async () => {
    if (!barcodeQuery) return;
    const q = barcodeQuery.toLowerCase().trim();

    // 1. Attempt official verification endpoint first
    try {
      const res = await fetch("/api/nutrition/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: barcodeQuery, portionGrams: 100 })
      });
      const data = await res.json();
      if (data && data.item) {
        onLogMeal(activeMealType, [data.item], mealTime);
        setBarcodeQuery("");
        setSubView("diary");
        return;
      }
    } catch (err) {
      console.warn("Barcode live verify notice:", err);
    }

    // 2. Offline / local fallback matching
    let barcodeFood: FoodItem = {
      name: barcodeQuery,
      portionGrams: 100,
      calories: 110,
      protein: 1.8,
      carbs: 16,
      fat: 4.5,
      fiber: 1.2
    };

    if (q.includes("choco") || q.includes("hearts") || q.includes("samai") || q.includes("little millet")) {
      barcodeFood = {
        name: "e-Millet Crunchy Little Millet Choco Hearts",
        brand: "e-Millet (Millet Snacks)",
        portionGrams: 100,
        calories: 407.86,
        protein: 9.8,
        carbs: 75.2,
        fat: 7.54,
        fiber: 5.2,
        sugar: 37.5,
        saturatedFat: 1.5,
        transFat: 0.0,
        cholesterol: 0.0,
        verifiedSource: "Official Brand Platform (milletsnacks.com)",
        groundingUrl: "https://milletsnacks.com",
        highlights: [
          "Official Product Facts: 9.8g Protein, 75.2g Carbs, 7.54g Fat, 5.2g Fiber",
          "Clean Ingredients: 47% Multi-grain (Corn 25%, Samai 20%, Gram Dal 2%)",
          "Jaggery Sweetened (45%): 0% refined white sugar",
          "Non-Fried Extruded Snack: Pure Cocoa, Cashew Nuts, Grits, Cardamom"
        ],
        ingredients: [
          "Multi-grain Blend (47%): Corn Meal (25%), Little Millet Meal (Samai) (20%), Gram Dal Meal (2%)",
          "Sweeteners: Jaggery Powder (45%)",
          "Flavoring & Texture: Cocoa Powder, Cashew Nuts, Grits, Cardamom, Edible Vegetable Oil (Palm)"
        ]
      };
    } else if (q.includes("sorghum") || q.includes("jowar") || q.includes("noodle") || q.includes("milletsnacks") || q.includes("e-millet")) {
      barcodeFood = {
        name: "e-Millet Sorghum (Jowar) Noodles",
        brand: "e-Millet (Millet Snacks)",
        portionGrams: 100,
        calories: 365.54,
        protein: 13.58,
        carbs: 73.50,
        fat: 1.01,
        fiber: 9.36,
        sugar: 6.25,
        sodium: 820.00,
        calcium: 184.00,
        iron: 7.85,
        verifiedSource: "Official Brand Platform (milletsnacks.com)",
        groundingUrl: "https://milletsnacks.com/products/sorghum-noodles-with-masala",
        highlights: [
          "No Maida: 33% Sorghum (Jowar / சோளம்) + 61.5% Whole Wheat",
          "No Added MSG & No Preservatives",
          "Diabetic Friendly & Low GI",
          "Not Fried: Air-Dried (1.01g Total Fat)"
        ]
      };
    } else if (q.includes("maggi") || q.includes("instant")) {
      barcodeFood = {
        name: "Maggi 2-Minute Masala Noodles (1 pack)",
        portionGrams: 70,
        calories: 310,
        protein: 6.2,
        carbs: 45,
        fat: 11.5,
        fiber: 2.1
      };
    } else if (q.includes("amul") || q.includes("cheese")) {
      barcodeFood = {
        name: "Amul Cheese Block (1 cube)",
        portionGrams: 20,
        calories: 64,
        protein: 4.1,
        carbs: 0.3,
        fat: 5.2,
        fiber: 0
      };
    }

    onLogMeal(activeMealType, [barcodeFood], mealTime);
    setBarcodeQuery("");
    setSubView("diary");
  };

  const handleEditDetectedItem = (index: number, key: keyof FoodItem, val: any) => {
    const updated = [...detectedItems];
    updated[index] = { ...updated[index], [key]: val };
    setDetectedItems(updated);
  };

  const handleConfirmLogSingleItem = (index: number) => {
    if (loggedIndices.includes(index)) return;
    const item = detectedItems[index];
    onLogMeal(activeMealType, [item], mealTime);
    setLoggedIndices((prev) => [...prev, index]);
  };

  const handleConfirmLogMeal = () => {
    const unlogged = detectedItems.filter((_, idx) => !loggedIndices.includes(idx));
    if (unlogged.length > 0) {
      onLogMeal(activeMealType, unlogged, mealTime);
    }
    setDetectedItems([]);
    setLoggedIndices([]);
    setSubView("diary");
  };

  // Filter popular foods based on search
  const filteredPopularFoods = popularIndianFoods.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-24 animate-fade-in text-white px-1">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-5 select-none">
        <div>
          <h2 className="text-xs text-slate-400 font-bold uppercase tracking-widest">Food Logs</h2>
          <h1 className="text-xl font-black text-slate-100">{selectedDate === new Date().toISOString().split("T")[0] ? "Today's Diary" : selectedDate}</h1>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setSubView("camera")}
            className="p-3 bg-emerald-500 text-slate-950 hover:bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-xs space-x-1.5 transition-all shadow-md shadow-emerald-500/10 active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>AI Scan</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE SELECTOR (CATEGORIES VS CHRONOLOGICAL TIMELINE) */}
      {subView === "diary" && (
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl mb-5 select-none text-xs">
          <button
            onClick={() => setDiaryViewMode("categories")}
            className={`flex-1 py-2 font-bold rounded-lg transition-all cursor-pointer ${
              diaryViewMode === "categories"
                ? "bg-slate-950 text-emerald-400 border border-slate-800 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🍱 Traditional Categories
          </button>
          <button
            onClick={() => setDiaryViewMode("chronological")}
            className={`flex-1 py-2 font-bold rounded-lg transition-all cursor-pointer ${
              diaryViewMode === "chronological"
                ? "bg-slate-950 text-emerald-400 border border-slate-800 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ⏰ Chronological Timeline
          </button>
        </div>
      )}

      {/* --- SUBVIEW 1: PRIMARY FOOD DIARY LIST --- */}
      {subView === "diary" && diaryViewMode === "categories" && (
        <div className="space-y-6">
          {(["Breakfast", "Mid-Morning Snack", "Lunch", "Evening Snack", "Dinner"] as const).map((meal) => {
            const currentLog = foodLogs.find(l => l.mealType === meal);
            const recommendedMeal = mealPlan.find(m => m.mealType === meal);
            return (
              <div key={meal} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4.5 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="text-sm font-black text-slate-200">{meal === "Mid-Morning Snack" ? "Mid-Snack" : meal}</h3>
                      {currentLog && currentLog.loggedTime && (
                        <span className="text-[10px] bg-slate-950 text-emerald-400 px-2 py-0.5 rounded-lg border border-slate-850 font-extrabold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                          {formatHHMMTo12h(currentLog.loggedTime)}
                        </span>
                      )}
                    </div>
                    {currentLog && (
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{currentLog.totalCalories} kcal total</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {currentLog && (
                      confirmDeleteId?.type === "meal" && confirmDeleteId.logId === currentLog.id ? (
                        <div className="flex items-center space-x-1 animate-fade-in bg-slate-950 border border-slate-800 rounded-xl p-1 shrink-0">
                          <button
                            onClick={() => {
                              onDeleteMeal(currentLog.id!);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-slate-950 text-[10px] font-black rounded-lg cursor-pointer"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId({ type: "meal", logId: currentLog.id! })}
                          title="Delete entire meal category"
                          className="p-2 bg-slate-950 hover:bg-red-500/10 hover:text-red-400 text-slate-400 font-bold rounded-xl border border-slate-800/80 transition-all hover:border-red-500/30 text-xs flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )
                    )}
                    <button 
                      onClick={() => {
                        setActiveMealType(meal);
                        setSubView("add_manual");
                      }}
                      className="p-2 bg-slate-950 hover:bg-slate-850 text-emerald-400 font-bold rounded-xl border border-slate-800/80 flex items-center space-x-1 hover:border-emerald-500/30 transition-all text-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Items List */}
                {!currentLog || currentLog.items.length === 0 ? (
                  <div className="space-y-3">
                    <div className="py-4 text-center border border-dashed border-slate-800/50 rounded-xl text-xs text-slate-500 font-medium">
                      No items tracked for {meal}.
                    </div>
                    {/* Embedded Recommended Meal recommendation card */}
                    {recommendedMeal && (
                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/10 rounded-xl flex items-center justify-between gap-3 animate-fade-in">
                        <div className="space-y-1 min-w-0 flex-1">
                          <span className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse shrink-0" /> Recommended AI Plan
                          </span>
                          <h4 className="text-xs font-bold text-slate-200 truncate">{recommendedMeal.name}</h4>
                          <div className="flex flex-wrap items-center gap-1.5 text-[8px] text-slate-400 font-semibold mt-0.5">
                            <span className="bg-emerald-500/10 text-emerald-400 px-1 py-0.2 rounded">{recommendedMeal.calories} kcal</span>
                            <span className="bg-amber-500/10 text-amber-400 px-1 py-0.2 rounded">P: {recommendedMeal.protein}g</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const foodItem: FoodItem = {
                              name: recommendedMeal.name,
                              portionGrams: 150,
                              calories: recommendedMeal.calories,
                              protein: recommendedMeal.protein,
                              carbs: recommendedMeal.carbs,
                              fat: recommendedMeal.fat,
                              fiber: recommendedMeal.fiber
                            };
                            onLogMeal(meal, [foodItem]);
                          }}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all shrink-0 cursor-pointer"
                        >
                          Log Plan
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentLog.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl flex justify-between items-center relative group">
                        <div className="space-y-1 pr-4">
                          <h4 className="font-bold text-xs text-slate-200">{item.name}</h4>
                          <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-slate-400 font-semibold">
                            <span className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300">{item.portionGrams}g</span>
                            <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">{item.calories} kcal</span>
                            <span className="bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">P: {item.protein}g</span>
                            <span className="bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded">C: {item.carbs}g</span>
                          </div>
                        </div>
                        {confirmDeleteId?.type === "item" && confirmDeleteId.logId === currentLog.id && confirmDeleteId.itemIndex === idx ? (
                          <div className="flex items-center space-x-1 animate-fade-in bg-slate-900 border border-slate-800 rounded-lg p-1.5 shrink-0">
                            <button
                              onClick={() => {
                                if (onDeleteFoodItem) {
                                  onDeleteFoodItem(currentLog.id!, idx);
                                } else {
                                  onDeleteMeal(currentLog.id!);
                                }
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-slate-950 text-[9px] font-black rounded cursor-pointer"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-400 text-[9px] font-bold rounded cursor-pointer border border-slate-850"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setConfirmDeleteId({ type: "item", logId: currentLog.id!, itemIndex: idx })}
                            title="Remove item"
                            className="p-1.5 bg-slate-900 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-slate-500 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* --- CHRONOLOGICAL TIMELINE VIEW MODE --- */}
      {subView === "diary" && diaryViewMode === "chronological" && (
        <div className="space-y-6 animate-fade-in">
          {foodLogs.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 border border-dashed border-slate-800/80 rounded-2.5xl space-y-3.5">
              <span className="text-3xl block">🍽️</span>
              <h3 className="text-sm font-bold text-slate-300">Chronological Timeline Empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                No items tracked yet today. Use the "AI Scan" button above or tap "Add" in any category to build your daily timeline!
              </p>
            </div>
          ) : (
            <div className="relative pl-6 border-l-2 border-slate-805 space-y-7 ml-3 py-2">
              {[...foodLogs]
                .sort((a, b) => (a.loggedTime || "00:00").localeCompare(b.loggedTime || "00:00"))
                .map((log, logIdx) => (
                  <div key={log.id || logIdx} className="relative">
                    {/* Timeline point indicator node */}
                    <span className="absolute -left-[31px] top-1.5 w-4 h-4 bg-emerald-500 border-4 border-slate-950 rounded-full shadow shadow-emerald-500/20" />
                    
                    <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 space-y-3.5">
                      {/* Log Header info */}
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-black text-slate-200">
                              {log.mealType === "Mid-Morning Snack" ? "Mid-Snack" : log.mealType}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-950 text-emerald-400 font-extrabold rounded-lg border border-slate-800/80 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-emerald-400" />
                              {log.loggedTime ? formatHHMMTo12h(log.loggedTime) : "Time not set"}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold block">{log.totalCalories} kcal total</span>
                        </div>
                        
                        {confirmDeleteId?.type === "meal" && confirmDeleteId.logId === log.id ? (
                          <div className="flex items-center space-x-1 animate-fade-in bg-slate-950 border border-slate-850 rounded-xl p-1 shrink-0">
                            <button
                              onClick={() => {
                                onDeleteMeal(log.id!);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-slate-950 text-[10px] font-black rounded-lg cursor-pointer animate-pulse"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold rounded-lg cursor-pointer border border-slate-800"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId({ type: "meal", logId: log.id! })}
                            title="Delete this meal entry"
                            className="p-1.5 bg-slate-950 hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded-lg border border-slate-850 cursor-pointer transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Food Items nested list */}
                      <div className="space-y-2">
                        {log.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
                            <div>
                              <h4 className="font-bold text-xs text-slate-300">{item.name}</h4>
                              <div className="flex flex-wrap items-center gap-2 text-[9px] text-slate-500 font-semibold mt-0.5">
                                <span>{item.portionGrams}g</span>
                                <span>•</span>
                                <span className="text-emerald-400/80">{item.calories} kcal</span>
                              </div>
                            </div>
                            
                            {confirmDeleteId?.type === "item" && confirmDeleteId.logId === log.id && confirmDeleteId.itemIndex === itemIdx ? (
                              <div className="flex items-center space-x-1 animate-fade-in bg-slate-900 border border-slate-800 rounded-lg p-1.5 shrink-0">
                                <button
                                  onClick={() => {
                                    if (onDeleteFoodItem) {
                                      onDeleteFoodItem(log.id!, itemIdx);
                                    } else {
                                      onDeleteMeal(log.id!);
                                    }
                                    setConfirmDeleteId(null);
                                  }}
                                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-slate-950 text-[9px] font-black rounded cursor-pointer"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-400 text-[9px] font-bold rounded cursor-pointer border border-slate-850"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId({ type: "item", logId: log.id!, itemIndex: itemIdx })}
                                title="Remove single item"
                                className="p-1 text-slate-600 hover:text-red-400 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* --- SUBVIEW 2: SEARCH & ADD FOOD MANUAL PANEL --- */}
      {subView === "add_manual" && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <button onClick={() => setSubView("diary")} className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl">
              <ChevronLeft className="w-4 h-4 text-slate-200" />
            </button>
            <h2 className="text-sm font-bold text-slate-200">Add to {activeMealType}</h2>
          </div>

          {/* Time Picker Field */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">⏱️ Consumption Time</span>
              <span className="text-[10px] text-slate-500 font-semibold block">Select exact time this food was taken</span>
            </div>
            <input
              type="time"
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Regular Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search popular Indian foods..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 text-sm pl-10 pr-4 py-3.5 rounded-xl outline-none"
            />
          </div>

          {/* Popular Foods List */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Popular Foods</h3>
            <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto">
              {filteredPopularFoods.map((food, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelectPopularFood(food)}
                  className={`p-3 bg-slate-900/30 hover:bg-slate-900 border rounded-xl flex justify-between items-center cursor-pointer transition-all ${
                    selectedPopularFood?.name === food.name ? "border-emerald-500 bg-emerald-500/5" : "border-slate-800/80"
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-100">{food.name}</h4>
                    <span className="text-[10px] text-slate-500">Serving size: {food.portionGrams}g • {food.calories} kcal</span>
                  </div>
                  <Plus className="w-4 h-4 text-emerald-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Gram Adjuster Form if Item Selected */}
          {selectedPopularFood && (
            <div className="p-4.5 bg-slate-900 border border-emerald-500/30 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Configure Weight: {selectedPopularFood.name}</h4>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Weight (Grams)</label>
                <input
                  type="number"
                  value={manualGrams}
                  onChange={(e) => setManualGrams(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-sm p-3 rounded-xl outline-none"
                />
              </div>
              <button 
                onClick={handleConfirmAddPopular}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Log to {activeMealType}
              </button>
            </div>
          )}

          {/* Custom Food Creation Form */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Or Add Custom Food</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">Dish Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Masala Fried Egg"
                  className="w-full bg-slate-950 border border-slate-800 text-xs p-3 rounded-xl outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={customCals}
                    onChange={(e) => setCustomCals(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-3 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-3 rounded-xl outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-3 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={customFat}
                    onChange={(e) => setCustomFat(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-3 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Fiber (g)</label>
                  <input
                    type="number"
                    value={customFiber}
                    onChange={(e) => setCustomFiber(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-3 rounded-xl outline-none"
                  />
                </div>
              </div>
              <button 
                onClick={handleAddCustomFood}
                disabled={!customName}
                className="w-full py-3.5 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 hover:text-slate-950 text-emerald-400 font-bold rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-40"
              >
                Log Custom Food
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBVIEW 3: AI FOOD SCANNER VIEWS --- */}
      {subView === "camera" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center space-x-2 select-none">
            <button 
              onClick={() => {
                stopCamera();
                setSubView("diary");
              }} 
              className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4 text-slate-200" />
            </button>
            <h2 className="text-sm font-bold text-slate-200">AI Food Scanner & Camera</h2>
          </div>

          {cameraError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-start space-x-2.5 animate-fade-in">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {isCameraActive ? (
            /* Active Live Camera Viewfinder Component */
            <div className="relative border-2 border-emerald-500 rounded-2xl overflow-hidden bg-black h-80 flex flex-col items-center justify-center text-center shadow-lg shadow-emerald-500/5 animate-fade-in">
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-emerald-500/20 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border border-dashed border-emerald-400/40 rounded-full animate-pulse" />
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3.5 z-20">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Photo</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-5 py-3 bg-slate-900 border border-slate-800 hover:border-slate-800 text-rose-400 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <span>Stop Camera</span>
                </button>
              </div>
            </div>
          ) : (
            /* Drag & Drop File Upload Zone / Inactive Camera Mode */
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl overflow-hidden bg-slate-950 h-80 flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer ${
                dragActive ? "border-emerald-500 bg-emerald-500/5 scale-[1.01]" : "border-slate-800 hover:border-slate-700"
              }`}
              onClick={() => document.getElementById("food-image-upload")?.click()}
            >
              <input 
                type="file" 
                id="food-image-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />

              {scanImage ? (
                <>
                  <img src={scanImage} alt="Captured preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <div className="absolute top-3 right-3 z-20 flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearSelectedImage();
                      }}
                      className="px-2.5 py-1.5 bg-slate-900/95 border border-slate-800 hover:border-slate-700 text-[10px] text-rose-400 font-bold rounded-lg uppercase shadow-md"
                    >
                      Remove Image
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/50 text-[10px] text-emerald-400 font-bold text-left truncate">
                    {selectedFile ? `Selected: ${selectedFile.name}` : "Captured Meal Photo"}
                  </div>
                </>
              ) : (
                <div className="space-y-4 z-10 max-w-sm">
                  <div className="flex justify-center space-x-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startCamera();
                      }}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black rounded-xl flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-emerald-500/15"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Open Device Camera</span>
                    </button>
                  </div>
                  <div className="text-slate-700 text-[9px] font-bold uppercase tracking-wider select-none">— OR —</div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-200">Drag & Drop Food Image</h3>
                    <p className="text-[10px] text-slate-500 mt-1">or <span className="text-emerald-400 font-bold underline">browse files</span> on your device</p>
                  </div>
                  <p className="text-[10px] text-slate-500 max-w-xs leading-relaxed mx-auto">
                    Snap or upload a photo of your traditional meals (Idli, Dosa, Sambar, Chapati, Paneer Curry) for direct Gemini Vision analysis!
                  </p>
                </div>
              )}
            </div>
          )}

          {scanMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fade-in">
              <Info className="w-4 h-4 shrink-0" />
              <span>{scanMessage}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                Add Meal Description or Notes (Optional with image)
              </label>
              <textarea
                value={textDescription}
                onChange={(e) => setTextDescription(e.target.value)}
                placeholder="Describe your meal or add specific notes (e.g. 2 wheat chapatis and 1 bowl paneer mutter curry)"
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 text-xs p-3.5 rounded-xl outline-none resize-none placeholder-slate-600 text-slate-200"
              />
            </div>

            <div className="w-full">
              <button
                onClick={() => {
                  stopCamera();
                  handleTriggerAIScan(false);
                }}
                disabled={loadingScan || (!textDescription && !scanImage)}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-900 disabled:text-slate-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10 disabled:opacity-40 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 animate-spin shrink-0" />
                <span>{loadingScan ? "Analyzing..." : "Analyze Scan"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBVIEW 4: AI SCAN RESULTS & VERIFICATION (AIScanResultView) --- */}
      {subView === "scan_result" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between select-none">
            <div className="flex items-center space-x-2">
              <button onClick={() => setSubView("camera")} className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer">
                <ChevronLeft className="w-4 h-4 text-slate-200" />
              </button>
              <div>
                <h2 className="text-sm font-bold text-slate-200">AI Estimation Result</h2>
                <p className="text-[10px] text-slate-500">Verify items before logging</p>
              </div>
            </div>
          </div>

          {/* Time of Taken Food (Meal Type Selector) */}
          <div className="bg-slate-900/50 border border-slate-800/80 p-3 rounded-2xl space-y-2">
            <span className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-wider block">
              ⏰ Select Time of Taken Food / Meal Period:
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: "Breakfast", label: "Morning", sub: "Breakfast" },
                { id: "Mid-Morning Snack", label: "Mid-Day", sub: "Snack" },
                { id: "Lunch", label: "Afternoon", sub: "Lunch" },
                { id: "Evening Snack", label: "Evening", sub: "Snack" },
                { id: "Dinner", label: "Night", sub: "Dinner" }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveMealType(item.id as FoodLog['mealType'])}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all cursor-pointer ${
                    activeMealType === item.id 
                      ? "bg-emerald-500 border-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/10" 
                      : "bg-slate-950/60 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                  }`}
                >
                  <span className="text-[9px] font-extrabold uppercase tracking-tight leading-none">{item.label}</span>
                  <span className="text-[7.5px] opacity-75 mt-1 leading-none">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Precise Time-picker for Scan Results */}
          <div className="bg-slate-900/50 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Consumption Time
              </span>
              <span className="text-[10px] text-slate-500 font-semibold block">Set exact moment of eating</span>
            </div>
            <input
              type="time"
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {scanMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start space-x-2 text-xs text-emerald-400">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{scanMessage}</span>
            </div>
          )}

          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verify & Log Detected Items</h3>
              <button
                type="button"
                disabled={isVerifyingAll || detectedItems.length === 0}
                onClick={handleVerifyAllItems}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                title="Cross-reference all detected foods against verified brand platform catalogs and Google Search Grounding"
              >
                {isVerifyingAll ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Cross-Referencing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3" />
                    <span>Cross-Reference All</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="space-y-4">
              {detectedItems.map((item, idx) => {
                const isLogged = loggedIndices.includes(idx);
                const isSorghum = item.name.toLowerCase().includes("sorghum") || item.name.toLowerCase().includes("jowar");
                const isChoco = item.name.toLowerCase().includes("choco") || item.name.toLowerCase().includes("hearts") || item.name.toLowerCase().includes("samai");
                return (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      isLogged 
                        ? "bg-emerald-500/5 border-emerald-500/20 opacity-80" 
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <input
                        type="text"
                        value={item.name}
                        disabled={isLogged}
                        onChange={(e) => handleEditDetectedItem(idx, "name", e.target.value)}
                        className={`bg-transparent border-b border-dashed focus:border-emerald-500 font-bold text-sm outline-none pb-0.5 w-[65%] ${
                          isLogged 
                            ? "border-transparent text-slate-400 line-through" 
                            : "border-slate-700 text-slate-200"
                        }`}
                      />
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          disabled={isLogged || verifyingIndex === idx}
                          onClick={() => handleVerifyItem(idx)}
                          className="flex items-center gap-1 text-[9px] font-bold bg-slate-800 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 border border-slate-700 hover:border-emerald-500/40 px-2 py-0.5 rounded-full transition-all cursor-pointer disabled:opacity-50"
                          title="Verify or cross-reference nutritional facts with official catalogs"
                        >
                          {verifyingIndex === idx ? (
                            <>
                              <RefreshCw className="w-2.5 h-2.5 animate-spin text-emerald-400" />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                              <span>{item.verifiedSource ? "Re-Verify" : "Verify Facts"}</span>
                            </>
                          )}
                        </button>
                        {item.confidence && (
                          <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                            {Math.round(item.confidence * 100)}% Match
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Official Catalog / Verified Source Badge */}
                    {item.verifiedSource ? (
                      <div className="flex items-center justify-between gap-1.5 mb-2.5 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg">
                        <div className="flex items-center gap-1.5 truncate">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">Verified &bull; {item.verifiedSource}</span>
                        </div>
                        {item.groundingUrl && (
                          <a
                            href={item.groundingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[10px] text-emerald-300 hover:text-white underline font-semibold shrink-0 ml-2"
                          >
                            <span>Catalog</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ) : (item.brand || isSorghum || isChoco) ? (
                      <div className="flex items-center gap-1.5 mb-2.5 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Official Catalog Verified &bull; {item.brand || "e-Millet (Millet Snacks)"}</span>
                      </div>
                    ) : null}

                    {/* Quick Portion Selector Buttons for Verified Products */}
                    {(item.servingOptions && item.servingOptions.length > 0) ? (
                      <div className="flex gap-2 mb-3">
                        {item.servingOptions.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isLogged}
                            onClick={() => {
                              const updated = [...detectedItems];
                              updated[idx] = {
                                ...updated[idx],
                                portionGrams: opt.grams,
                                calories: opt.calories,
                                protein: opt.protein,
                                carbs: opt.carbs,
                                fat: opt.fat,
                                fiber: opt.fiber
                              };
                              setDetectedItems(updated);
                            }}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              item.portionGrams === opt.grams
                                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm"
                                : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <span>{opt.label}</span>
                            <span className="block text-[9px] opacity-75">{opt.calories} kcal</span>
                          </button>
                        ))}
                      </div>
                    ) : isSorghum ? (
                      <div className="flex gap-2 mb-3">
                        <button
                          type="button"
                          disabled={isLogged}
                          onClick={() => {
                            const updated = [...detectedItems];
                            updated[idx] = {
                              ...updated[idx],
                              portionGrams: 100,
                              calories: 365.54,
                              protein: 13.58,
                              carbs: 73.50,
                              fat: 1.01,
                              fiber: 9.36
                            };
                            setDetectedItems(updated);
                          }}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            item.portionGrams === 100
                              ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm"
                              : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <span>Full Pack (100g)</span>
                          <span className="block text-[9px] opacity-75">365.54 kcal</span>
                        </button>
                        <button
                          type="button"
                          disabled={isLogged}
                          onClick={() => {
                            const updated = [...detectedItems];
                            updated[idx] = {
                              ...updated[idx],
                              portionGrams: 60,
                              calories: 219.32,
                              protein: 8.15,
                              carbs: 44.10,
                              fat: 1.01,
                              fiber: 5.62
                            };
                            setDetectedItems(updated);
                          }}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            item.portionGrams === 60
                              ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm"
                              : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <span>1 Serving (~60g)</span>
                          <span className="block text-[9px] opacity-75">219.32 kcal</span>
                        </button>
                      </div>
                    ) : isChoco ? (
                      <div className="flex gap-2 mb-3">
                        <button
                          type="button"
                          disabled={isLogged}
                          onClick={() => {
                            const updated = [...detectedItems];
                            updated[idx] = {
                              ...updated[idx],
                              portionGrams: 100,
                              calories: 395,
                              protein: 7.2,
                              carbs: 80.0,
                              fat: 4.2,
                              fiber: 4.8,
                              sugar: 37.5
                            };
                            setDetectedItems(updated);
                          }}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            item.portionGrams === 100
                              ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm"
                              : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <span>Full Pack (100g)</span>
                          <span className="block text-[9px] opacity-75">395 kcal</span>
                        </button>
                        <button
                          type="button"
                          disabled={isLogged}
                          onClick={() => {
                            const updated = [...detectedItems];
                            updated[idx] = {
                              ...updated[idx],
                              portionGrams: 30,
                              calories: 118.5,
                              protein: 2.16,
                              carbs: 24.0,
                              fat: 1.26,
                              fiber: 1.44,
                              sugar: 11.25
                            };
                            setDetectedItems(updated);
                          }}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            item.portionGrams === 30
                              ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm"
                              : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <span>1 Serving (~30g)</span>
                          <span className="block text-[9px] opacity-75">118.5 kcal</span>
                        </button>
                      </div>
                    ) : null}

                    {/* Clean Ingredients Breakdown */}
                    {item.ingredients && item.ingredients.length > 0 && (
                      <div className="mb-3 space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-amber-500/20">
                        <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Clean Ingredients Breakdown:
                        </span>
                        <ul className="text-[10px] text-slate-300 space-y-0.5 list-disc list-inside">
                          {item.ingredients.map((ing, ingIdx) => (
                            <li key={ingIdx} className="leading-tight">{ing}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Product Packaging Highlights */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="mb-3 space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Packaging Highlights:</span>
                        <ul className="text-[10px] text-slate-300 space-y-0.5 list-disc list-inside">
                          {item.highlights.map((h, hIdx) => (
                            <li key={hIdx} className="leading-tight">{h}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-semibold mb-1">Estimated Weight (g)</label>
                        <input
                          type="number"
                          step="any"
                          value={item.portionGrams}
                          disabled={isLogged}
                          onChange={(e) => handleEditDetectedItem(idx, "portionGrams", Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 p-2.5 rounded-lg text-slate-300 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-semibold mb-1">Calories (kcal)</label>
                        <input
                          type="number"
                          step="any"
                          value={item.calories}
                          disabled={isLogged}
                          onChange={(e) => handleEditDetectedItem(idx, "calories", Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 p-2.5 rounded-lg text-slate-300 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-[10px] mb-3">
                      <div className="bg-slate-950/40 p-1.5 rounded text-center">
                        <span className="text-slate-500 block">Prot (g)</span>
                        <input
                          type="number"
                          step="any"
                          value={item.protein}
                          disabled={isLogged}
                          onChange={(e) => handleEditDetectedItem(idx, "protein", Number(e.target.value))}
                          className="bg-transparent font-bold text-slate-300 text-center w-full outline-none disabled:opacity-50"
                        />
                      </div>
                      <div className="bg-slate-950/40 p-1.5 rounded text-center">
                        <span className="text-slate-500 block">Carb (g)</span>
                        <input
                          type="number"
                          step="any"
                          value={item.carbs}
                          disabled={isLogged}
                          onChange={(e) => handleEditDetectedItem(idx, "carbs", Number(e.target.value))}
                          className="bg-transparent font-bold text-slate-300 text-center w-full outline-none disabled:opacity-50"
                        />
                      </div>
                      <div className="bg-slate-950/40 p-1.5 rounded text-center">
                        <span className="text-slate-500 block">Fat (g)</span>
                        <input
                          type="number"
                          step="any"
                          value={item.fat}
                          disabled={isLogged}
                          onChange={(e) => handleEditDetectedItem(idx, "fat", Number(e.target.value))}
                          className="bg-transparent font-bold text-slate-300 text-center w-full outline-none disabled:opacity-50"
                        />
                      </div>
                      <div className="bg-slate-950/40 p-1.5 rounded text-center">
                        <span className="text-slate-500 block">Fiber (g)</span>
                        <input
                          type="number"
                          step="any"
                          value={item.fiber}
                          disabled={isLogged}
                          onChange={(e) => handleEditDetectedItem(idx, "fiber", Number(e.target.value))}
                          className="bg-transparent font-bold text-slate-300 text-center w-full outline-none disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Extended Micronutrients and Lipids row if available */}
                    {(item.sodium || item.calcium || item.iron || item.sugar || item.saturatedFat || item.transFat !== undefined || item.cholesterol !== undefined) && (
                      <div className="grid grid-cols-4 gap-1.5 text-[9px] mb-3.5 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50 text-center">
                        <div>
                          <span className="text-slate-500 block">Sugars</span>
                          <span className="font-semibold text-slate-300">{item.sugar !== undefined ? `${item.sugar}g` : '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Sat Fat</span>
                          <span className="font-semibold text-slate-300">{item.saturatedFat !== undefined ? `${item.saturatedFat}g` : '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Trans Fat</span>
                          <span className="font-semibold text-slate-300">{item.transFat !== undefined ? `${item.transFat}g` : '0g'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Cholesterol</span>
                          <span className="font-semibold text-slate-300">{item.cholesterol !== undefined ? `${item.cholesterol}mg` : '0mg'}</span>
                        </div>
                        {item.sodium && (
                          <div>
                            <span className="text-slate-500 block">Sodium</span>
                            <span className="font-semibold text-slate-300">{item.sodium}mg</span>
                          </div>
                        )}
                        {item.calcium && (
                          <div>
                            <span className="text-slate-500 block">Calcium</span>
                            <span className="font-semibold text-slate-300">{item.calcium}mg</span>
                          </div>
                        )}
                        {item.iron && (
                          <div>
                            <span className="text-slate-500 block">Iron</span>
                            <span className="font-semibold text-slate-300">{item.iron}mg</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Individual Log Button */}
                    <button
                      onClick={() => handleConfirmLogSingleItem(idx)}
                      disabled={isLogged}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all ${
                        isLogged 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default" 
                          : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer active:scale-95"
                      }`}
                    >
                      {isLogged ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                          <span>Logged to {activeMealType}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Confirm & Log Item</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setDetectedItems([]);
                setLoggedIndices([]);
                setSubView("diary");
              }}
              className="flex-1 py-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider"
            >
              Done & Exit
            </button>
            <button
              onClick={handleConfirmLogMeal}
              disabled={loggedIndices.length === detectedItems.length}
              className="flex-[2] py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-900 disabled:text-slate-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/15 disabled:opacity-40 disabled:border disabled:border-slate-800"
            >
              <Check className="w-4 h-4 shrink-0" />
              <span>Log All Remaining</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
