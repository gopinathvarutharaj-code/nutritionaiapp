package com.example.nutrifit.ui.viewmodel

import android.app.Application
import android.graphics.Bitmap
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.nutrifit.data.db.FoodLogEntity
import com.example.nutrifit.data.db.NutriFitDatabase
import com.example.nutrifit.data.db.WorkoutPlanEntity
import com.example.nutrifit.data.model.ChatMessage
import com.example.nutrifit.data.model.Exercise
import com.example.nutrifit.data.model.FoodItem
import com.example.nutrifit.data.model.IndianFoodCatalog
import com.example.nutrifit.data.model.MealPlanItem
import com.example.nutrifit.data.model.UserProfile
import com.example.nutrifit.data.repository.NutriFitRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class NutriFitViewModel(application: Application) : AndroidViewModel(application) {

    private val db = NutriFitDatabase.getDatabase(application)
    val repository = NutriFitRepository(db.foodDao(), db.healthDao(), db.workoutDao())

    private val _selectedDate = MutableStateFlow(repository.todayDate)
    val selectedDate: StateFlow<String> = _selectedDate.asStateFlow()

    val profile: StateFlow<UserProfile> = repository.getUserProfile()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), UserProfile())

    val foodLogsForDate: StateFlow<List<FoodLogEntity>> = _selectedDate.flatMapLatest { date ->
        repository.getFoodLogsByDate(date)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allFoodLogs: StateFlow<List<FoodLogEntity>> = repository.getAllFoodLogs()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val waterLogsForDate = _selectedDate.flatMapLatest { date ->
        repository.getWaterLogsByDate(date)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val activityLogsForDate = _selectedDate.flatMapLatest { date ->
        repository.getActivityLogsByDate(date)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val sleepLogForDate = _selectedDate.flatMapLatest { date ->
        repository.getSleepLogByDate(date)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val activeFasting = repository.getActiveFasting()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val workoutsForDate = _selectedDate.flatMapLatest { date ->
        repository.getWorkoutsByDate(date)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // AI Chat History
    private val _chatMessages = MutableStateFlow<List<ChatMessage>>(
        listOf(
            ChatMessage(
                sender = "model",
                text = "Vanakkam & Hello! I'm NutriFit AI, your personalized Indian nutrition, diet and workout coach. How can I help you today? Ask me about Indian macros, fasting, e-Millet products, or a custom Tamil/Kerala diet plan!"
            )
        )
    )
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    private val _isChatLoading = MutableStateFlow(false)
    val isChatLoading: StateFlow<Boolean> = _isChatLoading.asStateFlow()

    // AI Scanner state
    private val _scannedFoodItems = MutableStateFlow<List<FoodItem>>(emptyList())
    val scannedFoodItems: StateFlow<List<FoodItem>> = _scannedFoodItems.asStateFlow()

    private val _isScanning = MutableStateFlow(false)
    val isScanning: StateFlow<Boolean> = _isScanning.asStateFlow()

    // Meal Planner state
    private val _mealPlan = MutableStateFlow<List<MealPlanItem>>(emptyList())
    val mealPlan: StateFlow<List<MealPlanItem>> = _mealPlan.asStateFlow()

    private val _isMealPlanLoading = MutableStateFlow(false)
    val isMealPlanLoading: StateFlow<Boolean> = _isMealPlanLoading.asStateFlow()

    // Toast message
    private val _toastMessage = MutableStateFlow<String?>(null)
    val toastMessage: StateFlow<String?> = _toastMessage.asStateFlow()

    init {
        // Pre-populate sample workouts and seed meal plan if empty
        viewModelScope.launch {
            repository.saveUserProfile(UserProfile())
            // Generate default meal plan
            _mealPlan.value = repository.generateMealPlan(UserProfile())
            // Insert initial sample workout if none exists
            seedDefaultWorkout()
        }
    }

    private suspend fun seedDefaultWorkout() {
        val today = repository.todayDate
        val exercises = listOf(
            Exercise("Warmup: Jumping Jacks", sets = 1, durationSeconds = 180, restSeconds = 30, instructions = "Elevate heart rate and warm up shoulder joints."),
            Exercise("Bodyweight Squats", sets = 3, reps = 15, restSeconds = 45, instructions = "Keep feet shoulder-width, chest high, squat to parallel."),
            Exercise("Standard Push-ups", sets = 3, reps = 12, restSeconds = 45, instructions = "Keep core tight, lower chest to ground, press up explosively."),
            Exercise("Bent-over Backpack Rows", sets = 3, reps = 12, restSeconds = 45, instructions = "Hinge hips, pull load towards lower ribcage."),
            Exercise("Plank Core Hold", sets = 3, durationSeconds = 45, restSeconds = 30, instructions = "Maintain straight spine line from heels to crown.")
        )
        repository.saveWorkout(
            WorkoutPlanEntity(
                date = today,
                name = "Full Body Functional Conditioning",
                type = "HIIT / Strength",
                durationMinutes = 35,
                exercisesJson = repository.encodeExercises(exercises),
                completed = false
            )
        )
    }

    fun showToast(msg: String) {
        _toastMessage.value = msg
    }

    fun clearToast() {
        _toastMessage.value = null
    }

    fun selectDate(date: String) {
        _selectedDate.value = date
    }

    fun updateProfile(newProfile: UserProfile) {
        viewModelScope.launch {
            repository.saveUserProfile(newProfile)
            showToast("Profile updated successfully!")
        }
    }

    // Food logging
    fun logMeal(mealType: String, items: List<FoodItem>) {
        if (items.isEmpty()) return
        viewModelScope.launch {
            repository.logMeal(_selectedDate.value, mealType, items)
            _scannedFoodItems.value = emptyList()
            showToast("Logged $mealType (${items.size} items)")
        }
    }

    fun deleteFoodLog(id: Long) {
        viewModelScope.launch {
            repository.deleteFoodLog(id)
            showToast("Meal removed")
        }
    }

    fun deleteFoodItem(logId: Long, itemIndex: Int) {
        viewModelScope.launch {
            repository.deleteFoodItem(logId, itemIndex, foodLogsForDate.value)
            showToast("Item deleted")
        }
    }

    // Quick add food from catalog
    fun quickAddFoodItem(mealType: String, food: FoodItem) {
        viewModelScope.launch {
            repository.logMeal(_selectedDate.value, mealType, listOf(food))
            showToast("Added ${food.name} to $mealType")
        }
    }

    // AI Scanner
    fun scanFood(query: String, bitmap: Bitmap? = null) {
        viewModelScope.launch {
            _isScanning.value = true
            try {
                val results = repository.analyzeFood(query, bitmap)
                _scannedFoodItems.value = results
                if (results.isNotEmpty()) {
                    showToast("Analyzed ${results.size} food item(s)")
                }
            } catch (e: Exception) {
                showToast("Analysis fallback loaded")
                _scannedFoodItems.value = listOfNotNull(IndianFoodCatalog.findMatch(query))
            } finally {
                _isScanning.value = false
            }
        }
    }

    fun clearScannedItems() {
        _scannedFoodItems.value = emptyList()
    }

    // Water
    fun logWater(amountMl: Int) {
        viewModelScope.launch {
            repository.logWater(_selectedDate.value, amountMl)
            showToast("Added +${amountMl}ml water")
        }
    }

    // Steps
    fun logSteps(steps: Int) {
        viewModelScope.launch {
            val dist = (steps * 0.00075f)
            val cals = (steps * 0.04f).toInt()
            repository.logActivity(_selectedDate.value, steps, dist, cals)
            showToast("Added $steps steps")
        }
    }

    // Sleep
    fun logSleep(hours: Float, quality: String) {
        viewModelScope.launch {
            repository.logSleep(_selectedDate.value, hours, quality)
            showToast("Logged ${hours}h sleep ($quality)")
        }
    }

    // Fasting
    fun toggleFasting(type: String = "16:8", hours: Float = 16f) {
        viewModelScope.launch {
            val current = activeFasting.value
            if (current != null) {
                repository.stopFasting(current.id)
                showToast("Fasting session ended")
            } else {
                repository.startFasting(_selectedDate.value, type, hours)
                showToast("Started $type intermittent fast")
            }
        }
    }

    // Workouts
    fun toggleExercise(workout: WorkoutPlanEntity, exerciseIndex: Int) {
        viewModelScope.launch {
            val exercises = repository.parseExercises(workout.exercisesJson).toMutableList()
            if (exerciseIndex in exercises.indices) {
                val ex = exercises[exerciseIndex]
                exercises[exerciseIndex] = ex.copy(completed = !ex.completed)
                val allDone = exercises.all { it.completed }
                val updated = workout.copy(
                    exercisesJson = repository.encodeExercises(exercises),
                    completed = allDone
                )
                repository.updateWorkout(updated)
                if (allDone) {
                    showToast("Workout complete! Great job!")
                }
            }
        }
    }

    fun generateNewWorkout(name: String, type: String, duration: Int) {
        viewModelScope.launch {
            val exercises = listOf(
                Exercise("Warmup Jog / Arm Circles", sets = 1, durationSeconds = 240, restSeconds = 30, instructions = "Prepare muscles and warm up joints."),
                Exercise("Dumbbell / Bag Squats", sets = 4, reps = 12, restSeconds = 45, instructions = "Drive through mid-foot, glutes engaged."),
                Exercise("Incline / Floor Push-ups", sets = 3, reps = 15, restSeconds = 45, instructions = "Full range of motion, elbows at 45 degrees."),
                Exercise("Overhead Shoulder Press", sets = 3, reps = 12, restSeconds = 45, instructions = "Press upward without arching lumbar spine."),
                Exercise("Mountain Climbers", sets = 3, durationSeconds = 30, restSeconds = 30, instructions = "Rapid alternations driving knees forward."),
                Exercise("Cool down Stretch", sets = 1, durationSeconds = 180, restSeconds = 0, instructions = "Hamstring and chest open stretches.")
            )
            repository.saveWorkout(
                WorkoutPlanEntity(
                    date = _selectedDate.value,
                    name = name,
                    type = type,
                    durationMinutes = duration,
                    exercisesJson = repository.encodeExercises(exercises),
                    completed = false
                )
            )
            showToast("Added $name workout")
        }
    }

    // Chat Assistant
    fun sendChatMessage(text: String) {
        val userMsg = text.trim()
        if (userMsg.isBlank()) return

        val currentList = _chatMessages.value.toMutableList()
        currentList.add(ChatMessage(sender = "user", text = userMsg))
        _chatMessages.value = currentList
        _isChatLoading.value = true

        viewModelScope.launch {
            try {
                val reply = repository.askAssistant(currentList, userMsg, profile.value)
                val updated = _chatMessages.value.toMutableList()
                updated.add(ChatMessage(sender = "model", text = reply))
                _chatMessages.value = updated
            } catch (e: Exception) {
                val updated = _chatMessages.value.toMutableList()
                updated.add(
                    ChatMessage(
                        sender = "model",
                        text = "I am currently offline. Based on your ${profile.value.goal} goal, keep protein at ${profile.value.targetProtein}g and stay well-hydrated!"
                    )
                )
                _chatMessages.value = updated
            } finally {
                _isChatLoading.value = false
            }
        }
    }

    // Regenerate Meal Plan
    fun refreshMealPlan() {
        viewModelScope.launch {
            _isMealPlanLoading.value = true
            try {
                _mealPlan.value = repository.generateMealPlan(profile.value)
                showToast("Updated customized meal plan")
            } finally {
                _isMealPlanLoading.value = false
            }
        }
    }
}
