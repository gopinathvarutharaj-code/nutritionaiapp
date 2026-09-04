import fs from 'fs';
import path from 'path';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  targetWeight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  goal: 'lose' | 'maintain' | 'gain';
  targetCalories: number;
  targetProtein: number; // g
  targetCarbs: number; // g
  targetFat: number; // g
  targetWater: number; // ml
}

export interface FoodLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  servings: number;
}

export interface WaterLogEntry {
  date: string; // YYYY-MM-DD
  amount: number; // ml
}

export interface WeightLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // kg
}

export interface FoodDatabaseItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  category: 'protein' | 'carbs' | 'fat' | 'fruit_veg' | 'dairy' | 'snack' | 'meal' | 'other';
}

export interface DatabaseSchema {
  profile: UserProfile;
  foodLogs: FoodLogEntry[];
  waterLogs: WaterLogEntry[];
  weightLogs: WeightLogEntry[];
  foodDatabase: FoodDatabaseItem[];
}

const DB_FILE = path.resolve(process.cwd(), 'data-nutrition.json');

const DEFAULT_FOODS: FoodDatabaseItem[] = [
  { id: 'f1', name: 'Greek Yogurt (Plain, Low Fat)', calories: 73, protein: 10, carbs: 4, fat: 2, servingSize: '100g', category: 'dairy' },
  { id: 'f2', name: 'Chicken Breast (Grilled)', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100g', category: 'protein' },
  { id: 'f3', name: 'Egg (Large, Boiled)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, servingSize: '1 egg', category: 'protein' },
  { id: 'f4', name: 'Oatmeal (Cooked)', calories: 71, protein: 2.5, carbs: 12, fat: 1.4, servingSize: '100g', category: 'carbs' },
  { id: 'f5', name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, servingSize: '1 medium (118g)', category: 'fruit_veg' },
  { id: 'f6', name: 'Apple (with skin)', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, servingSize: '1 medium (182g)', category: 'fruit_veg' },
  { id: 'f7', name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, servingSize: '1 oz (28g)', category: 'fat' },
  { id: 'f8', name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, servingSize: '100g', category: 'fat' },
  { id: 'f9', name: 'Brown Rice (Cooked)', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, servingSize: '100g', category: 'carbs' },
  { id: 'f10', name: 'Salmon (Baked)', calories: 206, protein: 22, carbs: 0, fat: 12, servingSize: '100g', category: 'protein' },
  { id: 'f11', name: 'Sweet Potato (Baked)', calories: 90, protein: 2, carbs: 21, fat: 0.2, servingSize: '100g', category: 'carbs' },
  { id: 'f12', name: 'Spinach (Raw)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: '100g', category: 'fruit_veg' },
  { id: 'f13', name: 'Whey Protein Powder', calories: 120, protein: 24, carbs: 3, fat: 1.5, servingSize: '1 scoop (30g)', category: 'protein' },
  { id: 'f14', name: 'Whole Wheat Bread', calories: 69, protein: 3.6, carbs: 12, fat: 0.9, servingSize: '1 slice (28g)', category: 'carbs' },
  { id: 'f15', name: 'Peanut Butter', calories: 94, protein: 3.5, carbs: 3, fat: 8, servingSize: '1 tbsp (16g)', category: 'fat' },
];

// Today's date in local time YYYY-MM-DD
function getLocalDateString(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  age: 28,
  gender: 'male',
  height: 178,
  weight: 82.5,
  targetWeight: 78.0,
  activityLevel: 'moderate',
  goal: 'lose',
  targetCalories: 2100,
  targetProtein: 150,
  targetCarbs: 220,
  targetFat: 70,
  targetWater: 2500,
};

function getInitialDatabase(): DatabaseSchema {
  const today = getLocalDateString();
  const yesterday = getLocalDateString(-1);
  const dayBefore = getLocalDateString(-2);

  return {
    profile: DEFAULT_PROFILE,
    foodLogs: [
      // Day before yesterday
      { id: 'log-1', date: dayBefore, name: 'Oatmeal (Cooked)', mealType: 'breakfast', calories: 142, protein: 5, carbs: 24, fat: 2.8, servingSize: '100g', servings: 2 },
      { id: 'log-2', date: dayBefore, name: 'Banana', mealType: 'breakfast', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, servingSize: '1 medium (118g)', servings: 1 },
      { id: 'log-3', date: dayBefore, name: 'Chicken Breast (Grilled)', mealType: 'lunch', calories: 330, protein: 62, carbs: 0, fat: 7.2, servingSize: '100g', servings: 2 },
      { id: 'log-4', date: dayBefore, name: 'Brown Rice (Cooked)', mealType: 'lunch', calories: 222, protein: 5.2, carbs: 46, fat: 1.8, servingSize: '100g', servings: 2 },
      { id: 'log-5', date: dayBefore, name: 'Almonds', mealType: 'snack', calories: 164, protein: 6, carbs: 6, fat: 14, servingSize: '1 oz (28g)', servings: 1 },
      { id: 'log-6', date: dayBefore, name: 'Salmon (Baked)', mealType: 'dinner', calories: 412, protein: 44, carbs: 0, fat: 24, servingSize: '100g', servings: 2 },
      { id: 'log-7', date: dayBefore, name: 'Sweet Potato (Baked)', mealType: 'dinner', calories: 180, protein: 4, carbs: 42, fat: 0.4, servingSize: '100g', servings: 2 },
      
      // Yesterday
      { id: 'log-8', date: yesterday, name: 'Greek Yogurt (Plain, Low Fat)', mealType: 'breakfast', calories: 146, protein: 20, carbs: 8, fat: 4, servingSize: '100g', servings: 2 },
      { id: 'log-9', date: yesterday, name: 'Apple (with skin)', mealType: 'breakfast', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, servingSize: '1 medium (182g)', servings: 1 },
      { id: 'log-10', date: yesterday, name: 'Chicken Breast (Grilled)', mealType: 'lunch', calories: 247, protein: 46.5, carbs: 0, fat: 5.4, servingSize: '100g', servings: 1.5 },
      { id: 'log-11', date: yesterday, name: 'Whole Wheat Bread', mealType: 'snack', calories: 138, protein: 7.2, carbs: 24, fat: 1.8, servingSize: '1 slice (28g)', servings: 2 },
      { id: 'log-12', date: yesterday, name: 'Peanut Butter', mealType: 'snack', calories: 188, protein: 7, carbs: 6, fat: 16, servingSize: '1 tbsp (16g)', servings: 2 },
      { id: 'log-13', date: yesterday, name: 'Salmon (Baked)', mealType: 'dinner', calories: 309, protein: 33, carbs: 0, fat: 18, servingSize: '100g', servings: 1.5 },
      { id: 'log-14', date: yesterday, name: 'Brown Rice (Cooked)', mealType: 'dinner', calories: 166, protein: 3.9, carbs: 34.5, fat: 1.35, servingSize: '100g', servings: 1.5 },

      // Today (Seeded breakfast/lunch to make it feel active)
      { id: 'log-15', date: today, name: 'Egg (Large, Boiled)', mealType: 'breakfast', calories: 156, protein: 12.6, carbs: 1.2, fat: 10.6, servingSize: '1 egg', servings: 2 },
      { id: 'log-16', date: today, name: 'Whole Wheat Bread', mealType: 'breakfast', calories: 138, protein: 7.2, carbs: 24, fat: 1.8, servingSize: '1 slice (28g)', servings: 2 },
      { id: 'log-17', date: today, name: 'Avocado', mealType: 'breakfast', calories: 80, protein: 1, carbs: 4.25, fat: 7.35, servingSize: '100g', servings: 0.5 },
      { id: 'log-18', date: today, name: 'Chicken Breast (Grilled)', mealType: 'lunch', calories: 330, protein: 62, carbs: 0, fat: 7.2, servingSize: '100g', servings: 2 },
      { id: 'log-19', date: today, name: 'Spinach (Raw)', mealType: 'lunch', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: '100g', servings: 1 },
    ],
    waterLogs: [
      { date: dayBefore, amount: 2750 },
      { date: yesterday, amount: 2250 },
      { date: today, amount: 1250 },
    ],
    weightLogs: [
      { id: 'w-1', date: getLocalDateString(-14), weight: 84.2 },
      { id: 'w-2', date: getLocalDateString(-12), weight: 83.8 },
      { id: 'w-3', date: getLocalDateString(-10), weight: 83.9 },
      { id: 'w-4', date: getLocalDateString(-8), weight: 83.4 },
      { id: 'w-5', date: getLocalDateString(-6), weight: 83.1 },
      { id: 'w-6', date: getLocalDateString(-4), weight: 82.8 },
      { id: 'w-7', date: getLocalDateString(-2), weight: 82.9 },
      { id: 'w-8', date: today, weight: 82.5 },
    ],
    foodDatabase: DEFAULT_FOODS,
  };
}

export class NutritionDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.error('Error loading database file, using fallback initial data', e);
    }
    const initial = getInitialDatabase();
    this.saveData(initial);
    return initial;
  }

  private saveData(newData: DatabaseSchema): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(newData, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database to file', e);
    }
  }

  getProfile(): UserProfile {
    return this.data.profile;
  }

  updateProfile(profile: Partial<UserProfile>): UserProfile {
    this.data.profile = { ...this.data.profile, ...profile } as UserProfile;
    this.saveData(this.data);
    return this.data.profile;
  }

  getFoodLogs(date: string): FoodLogEntry[] {
    return this.data.foodLogs.filter((log) => log.date === date);
  }

  addFoodLog(entry: Omit<FoodLogEntry, 'id'>): FoodLogEntry {
    const newEntry: FoodLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    this.data.foodLogs.push(newEntry);
    this.saveData(this.data);
    return newEntry;
  }

  deleteFoodLog(id: string): boolean {
    const initialLength = this.data.foodLogs.length;
    this.data.foodLogs = this.data.foodLogs.filter((log) => log.id !== id);
    if (this.data.foodLogs.length !== initialLength) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  getWaterLogs(date: string): number {
    const entry = this.data.waterLogs.find((log) => log.date === date);
    return entry ? entry.amount : 0;
  }

  addWaterLog(date: string, amount: number): number {
    const entryIndex = this.data.waterLogs.findIndex((log) => log.date === date);
    if (entryIndex >= 0) {
      this.data.waterLogs[entryIndex].amount = Math.max(0, this.data.waterLogs[entryIndex].amount + amount);
    } else {
      this.data.waterLogs.push({ date, amount: Math.max(0, amount) });
    }
    this.saveData(this.data);
    return this.getWaterLogs(date);
  }

  setWaterLog(date: string, amount: number): number {
    const entryIndex = this.data.waterLogs.findIndex((log) => log.date === date);
    if (entryIndex >= 0) {
      this.data.waterLogs[entryIndex].amount = Math.max(0, amount);
    } else {
      this.data.waterLogs.push({ date, amount: Math.max(0, amount) });
    }
    this.saveData(this.data);
    return this.getWaterLogs(date);
  }

  getWeightLogs(): WeightLogEntry[] {
    // Return sorted weight logs
    return [...this.data.weightLogs].sort((a, b) => a.date.localeCompare(b.date));
  }

  addWeightLog(date: string, weight: number): WeightLogEntry {
    const existingIndex = this.data.weightLogs.findIndex((log) => log.date === date);
    let entry: WeightLogEntry;
    if (existingIndex >= 0) {
      this.data.weightLogs[existingIndex].weight = weight;
      entry = this.data.weightLogs[existingIndex];
    } else {
      entry = {
        id: `w-${Date.now()}`,
        date,
        weight,
      };
      this.data.weightLogs.push(entry);
    }

    // Also update current weight in profile if it's the latest entry
    const sortedLogs = this.getWeightLogs();
    if (sortedLogs.length > 0 && sortedLogs[sortedLogs.length - 1].date === date) {
      this.data.profile.weight = weight;
    }

    this.saveData(this.data);
    return entry;
  }

  deleteWeightLog(id: string): boolean {
    const initialLength = this.data.weightLogs.length;
    this.data.weightLogs = this.data.weightLogs.filter((log) => log.id !== id);
    if (this.data.weightLogs.length !== initialLength) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  getFoodDatabase(): FoodDatabaseItem[] {
    return this.data.foodDatabase;
  }

  addFoodToDatabase(item: Omit<FoodDatabaseItem, 'id'>): FoodDatabaseItem {
    const newItem: FoodDatabaseItem = {
      ...item,
      id: `f-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    };
    this.data.foodDatabase.push(newItem);
    this.saveData(this.data);
    return newItem;
  }
}

export const db = new NutritionDatabase();
