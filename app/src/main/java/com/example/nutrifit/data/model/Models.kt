package com.example.nutrifit.data.model

import kotlinx.serialization.Serializable

@Serializable
data class UserProfile(
    val name: String = "Gopinath",
    val email: String = "user@nutrifit.ai",
    val age: Int = 26,
    val gender: String = "Male",
    val height: Float = 175f, // cm
    val weight: Float = 70f, // kg
    val targetWeight: Float = 68f, // kg
    val activityLevel: String = "Moderately Active",
    val goal: String = "Weight Loss",
    val dietPreference: String = "Vegetarian",
    val cuisinePreference: String = "Tamil",
    val dailyCalorieTarget: Int = 2000,
    val targetProtein: Int = 110,
    val targetCarbs: Int = 210,
    val targetFat: Int = 55,
    val targetFiber: Int = 30,
    val streakDays: Int = 3
) {
    val bmi: Float
        get() {
            val h = height / 100f
            return if (h > 0) (weight / (h * h) * 10).toInt() / 10f else 22.5f
        }

    val bmr: Int
        get() = (10 * weight + 6.25 * height - 5 * age + 5).toInt()

    val tdee: Int
        get() = (dailyCalorieTarget * 1.2).toInt()

    val bmiCategory: String
        get() = when {
            bmi < 18.5f -> "Underweight"
            bmi < 24.9f -> "Normal"
            bmi < 29.9f -> "Overweight"
            else -> "Obese"
        }
}

@Serializable
data class FoodItem(
    val name: String,
    val portionGrams: Float = 100f,
    val calories: Float,
    val protein: Float,
    val carbs: Float,
    val fat: Float,
    val fiber: Float,
    val sugar: Float? = null,
    val sodium: Float? = null,
    val calcium: Float? = null,
    val iron: Float? = null,
    val saturatedFat: Float? = null,
    val transFat: Float? = 0f,
    val cholesterol: Float? = 0f,
    val brand: String? = null,
    val verifiedSource: String? = null,
    val groundingUrl: String? = null,
    val highlights: List<String> = emptyList(),
    val ingredients: List<String> = emptyList()
)

@Serializable
data class Exercise(
    val name: String,
    val sets: Int = 3,
    val reps: Int = 12,
    val durationSeconds: Int = 0,
    val restSeconds: Int = 45,
    val instructions: String = "",
    val completed: Boolean = false
)

@Serializable
data class MealPlanItem(
    val mealType: String,
    val time: String,
    val name: String,
    val items: String,
    val calories: Int,
    val protein: Int,
    val carbs: Int,
    val fat: Int,
    val fiber: Int,
    val instructions: String
)

@Serializable
data class ChatMessage(
    val id: String = java.util.UUID.randomUUID().toString(),
    val sender: String, // "user" or "model"
    val text: String,
    val timestamp: Long = System.currentTimeMillis()
)
