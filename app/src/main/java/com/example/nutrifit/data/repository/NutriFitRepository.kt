package com.example.nutrifit.data.repository

import android.graphics.Bitmap
import com.example.nutrifit.data.api.GeminiClient
import com.example.nutrifit.data.db.ActivityLogEntity
import com.example.nutrifit.data.db.FastingLogEntity
import com.example.nutrifit.data.db.FoodDao
import com.example.nutrifit.data.db.FoodLogEntity
import com.example.nutrifit.data.db.HealthDao
import com.example.nutrifit.data.db.SleepLogEntity
import com.example.nutrifit.data.db.UserProfileEntity
import com.example.nutrifit.data.db.WaterLogEntity
import com.example.nutrifit.data.db.WorkoutDao
import com.example.nutrifit.data.db.WorkoutPlanEntity
import com.example.nutrifit.data.model.ChatMessage
import com.example.nutrifit.data.model.Exercise
import com.example.nutrifit.data.model.FoodItem
import com.example.nutrifit.data.model.MealPlanItem
import com.example.nutrifit.data.model.UserProfile
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class NutriFitRepository(
    private val foodDao: FoodDao,
    private val healthDao: HealthDao,
    private val workoutDao: WorkoutDao
) {
    private val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
    }

    val todayDate: String
        get() = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())

    // Profile
    fun getUserProfile(): Flow<UserProfile> {
        return healthDao.getUserProfile().map { entity ->
            if (entity != null) {
                try {
                    json.decodeFromString<UserProfile>(entity.profileJson)
                } catch (e: Exception) {
                    UserProfile()
                }
            } else {
                UserProfile()
            }
        }
    }

    suspend fun saveUserProfile(profile: UserProfile) {
        val jsonStr = json.encodeToString(profile)
        healthDao.saveUserProfile(UserProfileEntity(id = 1, profileJson = jsonStr))
    }

    // Food Logs
    fun getFoodLogsByDate(date: String): Flow<List<FoodLogEntity>> = foodDao.getLogsByDate(date)

    fun getAllFoodLogs(): Flow<List<FoodLogEntity>> = foodDao.getAllLogs()

    suspend fun logMeal(
        date: String,
        mealType: String,
        items: List<FoodItem>,
        loggedTime: String = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())
    ): Long {
        val totalCals = items.sumOf { it.calories.toDouble() }.toFloat()
        val totalProtein = items.sumOf { it.protein.toDouble() }.toFloat()
        val totalCarbs = items.sumOf { it.carbs.toDouble() }.toFloat()
        val totalFat = items.sumOf { it.fat.toDouble() }.toFloat()
        val totalFiber = items.sumOf { it.fiber.toDouble() }.toFloat()
        val itemsJson = json.encodeToString(items)

        val entity = FoodLogEntity(
            date = date,
            mealType = mealType,
            itemsJson = itemsJson,
            totalCalories = totalCals,
            totalProtein = totalProtein,
            totalCarbs = totalCarbs,
            totalFat = totalFat,
            totalFiber = totalFiber,
            loggedTime = loggedTime
        )
        return foodDao.insertLog(entity)
    }

    suspend fun deleteFoodLog(id: Long) = foodDao.deleteLog(id)

    suspend fun deleteFoodItem(logId: Long, itemIndex: Int, currentLogs: List<FoodLogEntity>) {
        val targetLog = currentLogs.firstOrNull { it.id == logId } ?: return
        val items = try {
            json.decodeFromString<List<FoodItem>>(targetLog.itemsJson).toMutableList()
        } catch (e: Exception) {
            mutableListOf()
        }

        if (itemIndex in items.indices) {
            items.removeAt(itemIndex)
            if (items.isEmpty()) {
                foodDao.deleteLog(logId)
            } else {
                val totalCals = items.sumOf { it.calories.toDouble() }.toFloat()
                val totalProtein = items.sumOf { it.protein.toDouble() }.toFloat()
                val totalCarbs = items.sumOf { it.carbs.toDouble() }.toFloat()
                val totalFat = items.sumOf { it.fat.toDouble() }.toFloat()
                val totalFiber = items.sumOf { it.fiber.toDouble() }.toFloat()

                val updated = targetLog.copy(
                    itemsJson = json.encodeToString(items),
                    totalCalories = totalCals,
                    totalProtein = totalProtein,
                    totalCarbs = totalCarbs,
                    totalFat = totalFat,
                    totalFiber = totalFiber
                )
                foodDao.updateLog(updated)
            }
        }
    }

    fun parseFoodItems(itemsJson: String): List<FoodItem> {
        return try {
            json.decodeFromString(itemsJson)
        } catch (e: Exception) {
            emptyList()
        }
    }

    // Water
    fun getWaterLogsByDate(date: String): Flow<List<WaterLogEntity>> = healthDao.getWaterLogsByDate(date)

    suspend fun logWater(date: String, amountMl: Int) {
        healthDao.insertWater(WaterLogEntity(date = date, amountMl = amountMl))
    }

    // Steps / Activity
    fun getActivityLogsByDate(date: String): Flow<List<ActivityLogEntity>> = healthDao.getActivityLogsByDate(date)

    suspend fun logActivity(date: String, steps: Int, distanceKm: Float, calories: Int) {
        healthDao.insertActivity(
            ActivityLogEntity(
                date = date,
                steps = steps,
                distanceKm = distanceKm,
                caloriesBurned = calories
            )
        )
    }

    // Sleep
    fun getSleepLogByDate(date: String): Flow<SleepLogEntity?> = healthDao.getSleepLogByDate(date)

    suspend fun logSleep(date: String, durationHours: Float, quality: String) {
        healthDao.insertSleep(SleepLogEntity(date = date, durationHours = durationHours, quality = quality))
    }

    // Fasting
    fun getActiveFasting(): Flow<FastingLogEntity?> = healthDao.getActiveFasting()

    suspend fun startFasting(date: String, type: String = "16:8", hours: Float = 16f) {
        healthDao.insertFasting(
            FastingLogEntity(
                date = date,
                fastingType = type,
                startTime = System.currentTimeMillis(),
                targetHours = hours,
                isActive = true
            )
        )
    }

    suspend fun stopFasting(id: Long) = healthDao.stopFasting(id)

    // Workouts
    fun getWorkoutsByDate(date: String): Flow<List<WorkoutPlanEntity>> = workoutDao.getWorkoutsByDate(date)

    fun getAllWorkouts(): Flow<List<WorkoutPlanEntity>> = workoutDao.getAllWorkouts()

    suspend fun saveWorkout(workout: WorkoutPlanEntity) = workoutDao.insertWorkout(workout)

    suspend fun updateWorkout(workout: WorkoutPlanEntity) = workoutDao.updateWorkout(workout)

    suspend fun deleteWorkout(id: Long) = workoutDao.deleteWorkout(id)

    fun parseExercises(jsonStr: String): List<Exercise> {
        return try {
            json.decodeFromString(jsonStr)
        } catch (e: Exception) {
            emptyList()
        }
    }

    fun encodeExercises(list: List<Exercise>): String = json.encodeToString(list)

    // AI Operations
    suspend fun analyzeFood(query: String, bitmap: Bitmap? = null): List<FoodItem> =
        GeminiClient.analyzeFood(query, bitmap)

    suspend fun askAssistant(
        history: List<ChatMessage>,
        userMsg: String,
        profile: UserProfile
    ): String = GeminiClient.chatAssistant(history, userMsg, profile)

    suspend fun generateMealPlan(profile: UserProfile): List<MealPlanItem> =
        GeminiClient.generateMealPlan(profile)
}
