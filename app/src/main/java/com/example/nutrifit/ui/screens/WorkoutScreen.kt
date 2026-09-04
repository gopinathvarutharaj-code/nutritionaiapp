package com.example.nutrifit.ui.screens

import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.FitnessCenter
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nutrifit.data.db.WorkoutPlanEntity
import com.example.nutrifit.data.model.Exercise
import com.example.nutrifit.ui.theme.Amber400
import com.example.nutrifit.ui.theme.Emerald400
import com.example.nutrifit.ui.theme.Emerald500
import com.example.nutrifit.ui.theme.Rose400
import com.example.nutrifit.ui.theme.Slate100
import com.example.nutrifit.ui.theme.Slate200
import com.example.nutrifit.ui.theme.Slate400
import com.example.nutrifit.ui.theme.Slate700
import com.example.nutrifit.ui.theme.Slate800
import com.example.nutrifit.ui.theme.Slate900
import com.example.nutrifit.ui.theme.Slate950
import com.example.nutrifit.ui.viewmodel.NutriFitViewModel

@Composable
fun WorkoutScreen(viewModel: NutriFitViewModel) {
    val workouts by viewModel.workoutsForDate.collectAsState()
    var showAddDialog by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate950)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item { Spacer(modifier = Modifier.height(8.dp)) }

        // Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "FITNESS & CONDITIONING",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate400,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "Daily Workouts",
                        style = MaterialTheme.typography.headlineSmall,
                        color = Slate100,
                        fontWeight = FontWeight.Black
                    )
                }

                Button(
                    onClick = {
                        viewModel.generateNewWorkout("Indian Home HIIT & Core", "Bodyweight / Home", 30)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald500),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.testTag("generate_workout_button")
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Add", tint = Slate950, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("New Plan", color = Slate950, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }
        }

        if (workouts.isEmpty()) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Slate900),
                    shape = RoundedCornerShape(18.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(CircleShape)
                                .background(Slate800),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.FitnessCenter, contentDescription = null, tint = Emerald400, modifier = Modifier.size(24.dp))
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        Text("No workout plan yet today", color = Slate100, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("Tap 'New Plan' above to generate an Indian home or gym session.", color = Slate400, fontSize = 11.sp)
                    }
                }
            }
        } else {
            items(workouts) { workout ->
                WorkoutCard(workout = workout, viewModel = viewModel)
            }
        }

        item { Spacer(modifier = Modifier.height(24.dp)) }
    }
}

@Composable
fun WorkoutCard(workout: WorkoutPlanEntity, viewModel: NutriFitViewModel) {
    val exercises = viewModel.repository.parseExercises(workout.exercisesJson)
    val completedCount = exercises.count { it.completed }
    val progressPct = if (exercises.isNotEmpty()) completedCount.toFloat() / exercises.size.toFloat() else 0f

    Card(
        colors = CardDefaults.cardColors(containerColor = Slate900),
        shape = RoundedCornerShape(20.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, if (workout.completed) Emerald500 else Slate800),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(workout.name, color = Slate100, fontSize = 15.sp, fontWeight = FontWeight.Black)
                        if (workout.completed) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                color = Color(0xFF064E3B),
                                shape = RoundedCornerShape(6.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(Icons.Default.Check, contentDescription = null, tint = Emerald400, modifier = Modifier.size(12.dp))
                                    Spacer(modifier = Modifier.width(2.dp))
                                    Text("DONE", color = Emerald400, fontSize = 9.sp, fontWeight = FontWeight.Black)
                                }
                            }
                        }
                    }
                    Text("${workout.type} • ${workout.durationMinutes} mins", color = Slate400, fontSize = 11.sp)
                }

                IconButton(
                    onClick = { viewModel.viewModelScopeLaunchDelete(workout.id) },
                    modifier = Modifier.size(28.dp)
                ) {
                    Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Slate400, modifier = Modifier.size(16.dp))
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Progress bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Exercises: $completedCount / ${exercises.size}", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                Text("${(progressPct * 100).toInt()}%", fontSize = 11.sp, color = Emerald400, fontWeight = FontWeight.Black)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(CircleShape)
                    .background(Slate950)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(progressPct)
                        .height(6.dp)
                        .clip(CircleShape)
                        .background(if (workout.completed) Emerald400 else Emerald500)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Exercises checklist
            exercises.forEachIndexed { index, exercise ->
                Surface(
                    color = Slate950,
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, if (exercise.completed) Color(0xFF064E3B) else Slate800),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .clickable { viewModel.toggleExercise(workout, index) }
                        .testTag("exercise_item_${exercise.name.take(6)}")
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = exercise.completed,
                            onCheckedChange = { viewModel.toggleExercise(workout, index) },
                            colors = CheckboxDefaults.colors(
                                checkedColor = Emerald500,
                                uncheckedColor = Slate700,
                                checkmarkColor = Slate950
                            )
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = exercise.name,
                                color = if (exercise.completed) Slate400 else Slate100,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                textDecoration = if (exercise.completed) TextDecoration.LineThrough else TextDecoration.None
                            )
                            val meta = if (exercise.durationSeconds > 0) {
                                "${exercise.sets} sets • ${exercise.durationSeconds}s hold • Rest ${exercise.restSeconds}s"
                            } else {
                                "${exercise.sets} sets x ${exercise.reps} reps • Rest ${exercise.restSeconds}s"
                            }
                            Text(meta, color = Slate400, fontSize = 10.sp)
                            if (exercise.instructions.isNotBlank()) {
                                Text(exercise.instructions, color = Slate400.copy(alpha = 0.8f), fontSize = 9.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}

// Extension to safely launch delete from Composable
fun NutriFitViewModel.viewModelScopeLaunchDelete(id: Long) {
    viewModelScope.launch {
        repository.deleteWorkout(id)
        showToast("Workout removed")
    }
}
