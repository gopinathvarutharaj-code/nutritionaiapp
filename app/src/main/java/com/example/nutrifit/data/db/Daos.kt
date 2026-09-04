package com.example.nutrifit.data.db

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface FoodDao {
    @Query("SELECT * FROM food_logs WHERE date = :date ORDER BY timestamp DESC")
    fun getLogsByDate(date: String): Flow<List<FoodLogEntity>>

    @Query("SELECT * FROM food_logs ORDER BY timestamp DESC")
    fun getAllLogs(): Flow<List<FoodLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLog(log: FoodLogEntity): Long

    @Query("DELETE FROM food_logs WHERE id = :id")
    suspend fun deleteLog(id: Long)

    @Update
    suspend fun updateLog(log: FoodLogEntity)
}

@Dao
interface HealthDao {
    // Water
    @Query("SELECT * FROM water_logs WHERE date = :date")
    fun getWaterLogsByDate(date: String): Flow<List<WaterLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWater(log: WaterLogEntity): Long

    // Activity
    @Query("SELECT * FROM activity_logs WHERE date = :date")
    fun getActivityLogsByDate(date: String): Flow<List<ActivityLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertActivity(log: ActivityLogEntity): Long

    // Sleep
    @Query("SELECT * FROM sleep_logs WHERE date = :date ORDER BY timestamp DESC LIMIT 1")
    fun getSleepLogByDate(date: String): Flow<SleepLogEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSleep(log: SleepLogEntity): Long

    // Fasting
    @Query("SELECT * FROM fasting_logs WHERE isActive = 1 ORDER BY timestamp DESC LIMIT 1")
    fun getActiveFasting(): Flow<FastingLogEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFasting(log: FastingLogEntity): Long

    @Query("UPDATE fasting_logs SET isActive = 0 WHERE id = :id")
    suspend fun stopFasting(id: Long)

    // User Profile
    @Query("SELECT * FROM user_profile_table WHERE id = 1")
    fun getUserProfile(): Flow<UserProfileEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveUserProfile(entity: UserProfileEntity)
}

@Dao
interface WorkoutDao {
    @Query("SELECT * FROM workout_plans WHERE date = :date ORDER BY timestamp DESC")
    fun getWorkoutsByDate(date: String): Flow<List<WorkoutPlanEntity>>

    @Query("SELECT * FROM workout_plans ORDER BY timestamp DESC")
    fun getAllWorkouts(): Flow<List<WorkoutPlanEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWorkout(workout: WorkoutPlanEntity): Long

    @Update
    suspend fun updateWorkout(workout: WorkoutPlanEntity)

    @Query("DELETE FROM workout_plans WHERE id = :id")
    suspend fun deleteWorkout(id: Long)
}
