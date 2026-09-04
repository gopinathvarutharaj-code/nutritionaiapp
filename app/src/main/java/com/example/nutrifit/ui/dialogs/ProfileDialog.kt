package com.example.nutrifit.ui.dialogs

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.nutrifit.data.model.UserProfile
import com.example.nutrifit.ui.theme.Emerald400
import com.example.nutrifit.ui.theme.Emerald500
import com.example.nutrifit.ui.theme.Slate100
import com.example.nutrifit.ui.theme.Slate200
import com.example.nutrifit.ui.theme.Slate400
import com.example.nutrifit.ui.theme.Slate700
import com.example.nutrifit.ui.theme.Slate800
import com.example.nutrifit.ui.theme.Slate900
import com.example.nutrifit.ui.theme.Slate950

@Composable
fun ProfileDialog(
    currentProfile: UserProfile,
    onDismiss: () -> Unit,
    onSave: (UserProfile) -> Unit
) {
    var name by remember { mutableStateOf(currentProfile.name) }
    var age by remember { mutableStateOf(currentProfile.age.toString()) }
    var gender by remember { mutableStateOf(currentProfile.gender) }
    var height by remember { mutableStateOf(currentProfile.height.toInt().toString()) }
    var weight by remember { mutableStateOf(currentProfile.weight.toInt().toString()) }
    var targetWeight by remember { mutableStateOf(currentProfile.targetWeight.toInt().toString()) }
    var goal by remember { mutableStateOf(currentProfile.goal) }
    var dietPreference by remember { mutableStateOf(currentProfile.dietPreference) }
    var cuisinePreference by remember { mutableStateOf(currentProfile.cuisinePreference) }
    var dailyCalories by remember { mutableStateOf(currentProfile.dailyCalorieTarget.toString()) }
    var protein by remember { mutableStateOf(currentProfile.targetProtein.toString()) }
    var carbs by remember { mutableStateOf(currentProfile.targetCarbs.toString()) }
    var fat by remember { mutableStateOf(currentProfile.targetFat.toString()) }
    var fiber by remember { mutableStateOf(currentProfile.targetFiber.toString()) }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            color = Slate900,
            shape = RoundedCornerShape(24.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 16.dp)
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                // Dialog Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Edit Profile & Goals",
                        style = MaterialTheme.typography.titleLarge,
                        color = Slate100,
                        fontWeight = FontWeight.Black
                    )
                    IconButton(onClick = onDismiss, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = Slate400)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Name
                Text("Name", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Emerald500,
                        unfocusedBorderColor = Slate700,
                        focusedTextColor = Slate100,
                        unfocusedTextColor = Slate100
                    ),
                    shape = RoundedCornerShape(10.dp),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Gender Selection
                Text("Gender", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf("Male", "Female", "Other").forEach { g ->
                        val sel = gender == g
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (sel) Emerald500 else Slate950)
                                .clickable { gender = g }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(g, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = if (sel) Slate950 else Slate200)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Metrics Row (Age, Height, Weight, Target Weight)
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Age", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                        OutlinedTextField(
                            value = age,
                            onValueChange = { age = it },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Emerald500, unfocusedBorderColor = Slate700, focusedTextColor = Slate100, unfocusedTextColor = Slate100),
                            shape = RoundedCornerShape(10.dp),
                            singleLine = true
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Height (cm)", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                        OutlinedTextField(
                            value = height,
                            onValueChange = { height = it },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Emerald500, unfocusedBorderColor = Slate700, focusedTextColor = Slate100, unfocusedTextColor = Slate100),
                            shape = RoundedCornerShape(10.dp),
                            singleLine = true
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Weight (kg)", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                        OutlinedTextField(
                            value = weight,
                            onValueChange = { weight = it },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Emerald500, unfocusedBorderColor = Slate700, focusedTextColor = Slate100, unfocusedTextColor = Slate100),
                            shape = RoundedCornerShape(10.dp),
                            singleLine = true
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Target (kg)", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                        OutlinedTextField(
                            value = targetWeight,
                            onValueChange = { targetWeight = it },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Emerald500, unfocusedBorderColor = Slate700, focusedTextColor = Slate100, unfocusedTextColor = Slate100),
                            shape = RoundedCornerShape(10.dp),
                            singleLine = true
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Fitness Goal
                Text("Fitness Goal", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    listOf("Weight Loss", "Fat Loss", "Muscle Gain", "Maintain Weight", "Six-Pack").forEach { g ->
                        val sel = goal == g
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (sel) Emerald500 else Slate950)
                                .clickable { goal = g }
                                .padding(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Text(g, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = if (sel) Slate950 else Slate200)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Diet Preference
                Text("Diet Preference", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    listOf("Vegetarian", "Non-Vegetarian", "Vegan", "Eggitarian", "Jain").forEach { d ->
                        val sel = dietPreference == d
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (sel) Emerald500 else Slate950)
                                .clickable { dietPreference = d }
                                .padding(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Text(d, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = if (sel) Slate950 else Slate200)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Regional Cuisine Preference
                Text("Regional Indian Cuisine Preference", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    listOf("Tamil", "Kerala", "South Indian", "North Indian", "Andhra", "Telangana", "Karnataka", "Bengali", "Gujarati", "Maharashtrian").forEach { c ->
                        val sel = cuisinePreference == c
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (sel) Emerald500 else Slate950)
                                .clickable { cuisinePreference = c }
                                .padding(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Text(c, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = if (sel) Slate950 else Slate200)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Calorie Target
                Text("Daily Calorie Target (kcal)", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                OutlinedTextField(
                    value = dailyCalories,
                    onValueChange = { dailyCalories = it },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Emerald500, unfocusedBorderColor = Slate700, focusedTextColor = Slate100, unfocusedTextColor = Slate100),
                    shape = RoundedCornerShape(10.dp),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Macro Targets Row
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Prot (g)", fontSize = 10.sp, color = Emerald400, fontWeight = FontWeight.Bold)
                        OutlinedTextField(
                            value = protein,
                            onValueChange = { protein = it },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Emerald500, unfocusedBorderColor = Slate700, focusedTextColor = Slate100, unfocusedTextColor = Slate100),
                            shape = RoundedCornerShape(8.dp),
                            singleLine = true
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Carb (g)", fontSize = 10.sp, color = Slate400, fontWeight = FontWeight.Bold)
                        OutlinedTextField(
                            value = carbs,
                            onValueChange = { carbs = it },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Emerald500, unfocusedBorderColor = Slate700, focusedTextColor = Slate100, unfocusedTextColor = Slate100),
                            shape = RoundedCornerShape(8.dp),
                            singleLine = true
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Fat (g)", fontSize = 10.sp, color = Slate400, fontWeight = FontWeight.Bold)
                        OutlinedTextField(
                            value = fat,
                            onValueChange = { fat = it },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Emerald500, unfocusedBorderColor = Slate700, focusedTextColor = Slate100, unfocusedTextColor = Slate100),
                            shape = RoundedCornerShape(8.dp),
                            singleLine = true
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Fib (g)", fontSize = 10.sp, color = Slate400, fontWeight = FontWeight.Bold)
                        OutlinedTextField(
                            value = fiber,
                            onValueChange = { fiber = it },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Emerald500, unfocusedBorderColor = Slate700, focusedTextColor = Slate100, unfocusedTextColor = Slate100),
                            shape = RoundedCornerShape(8.dp),
                            singleLine = true
                        )
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                Button(
                    onClick = {
                        val updated = currentProfile.copy(
                            name = name.ifBlank { "User" },
                            age = age.toIntOrNull() ?: currentProfile.age,
                            gender = gender,
                            height = height.toFloatOrNull() ?: currentProfile.height,
                            weight = weight.toFloatOrNull() ?: currentProfile.weight,
                            targetWeight = targetWeight.toFloatOrNull() ?: currentProfile.targetWeight,
                            goal = goal,
                            dietPreference = dietPreference,
                            cuisinePreference = cuisinePreference,
                            dailyCalorieTarget = dailyCalories.toIntOrNull() ?: currentProfile.dailyCalorieTarget,
                            targetProtein = protein.toIntOrNull() ?: currentProfile.targetProtein,
                            targetCarbs = carbs.toIntOrNull() ?: currentProfile.targetCarbs,
                            targetFat = fat.toIntOrNull() ?: currentProfile.targetFat,
                            targetFiber = fiber.toIntOrNull() ?: currentProfile.targetFiber
                        )
                        onSave(updated)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald500),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("save_profile_button")
                ) {
                    Icon(Icons.Default.Check, contentDescription = "Save", tint = Slate950, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Save Changes", color = Slate950, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
