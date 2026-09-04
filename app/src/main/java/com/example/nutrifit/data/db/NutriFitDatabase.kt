package com.example.nutrifit.data.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(
    entities = [
        FoodLogEntity::class,
        WaterLogEntity::class,
        ActivityLogEntity::class,
        SleepLogEntity::class,
        FastingLogEntity::class,
        WorkoutPlanEntity::class,
        UserProfileEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class NutriFitDatabase : RoomDatabase() {
    abstract fun foodDao(): FoodDao
    abstract fun healthDao(): HealthDao
    abstract fun workoutDao(): WorkoutDao

    companion object {
        @Volatile
        private var INSTANCE: NutriFitDatabase? = null

        fun getDatabase(context: Context): NutriFitDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    NutriFitDatabase::class.java,
                    "nutrifit_database"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
