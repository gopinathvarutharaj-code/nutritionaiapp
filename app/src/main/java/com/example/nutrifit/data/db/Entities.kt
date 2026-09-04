package com.example.nutrifit.data.db

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "food_logs")
data class FoodLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String, // YYYY-MM-DD
    val mealType: String, // Breakfast, Mid-Morning Snack, Lunch, Evening Snack, Dinner
    val itemsJson: String, // JSON array of FoodItem
    val totalCalories: Float,
    val totalProtein: Float,
    val totalCarbs: Float,
    val totalFat: Float,
    val totalFiber: Float,
    val loggedTime: String = "",
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "water_logs")
data class WaterLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,
    val amountMl: Int,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "activity_logs")
data class ActivityLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,
    val steps: Int,
    val distanceKm: Float,
    val caloriesBurned: Int,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "sleep_logs")
data class SleepLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,
    val durationHours: Float,
    val quality: String = "Good",
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "fasting_logs")
data class FastingLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,
    val fastingType: String = "16:8",
    val startTime: Long,
    val targetHours: Float = 16f,
    val isActive: Boolean = true,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "workout_plans")
data class WorkoutPlanEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,
    val name: String,
    val type: String,
    val durationMinutes: Int,
    val exercisesJson: String,
    val completed: Boolean = false,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "user_profile_table")
data class UserProfileEntity(
    @PrimaryKey val id: Int = 1,
    val profileJson: String
)
