package com.example.nutrifit.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DirectionsRun
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.MonitorWeight
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nutrifit.ui.theme.Amber400
import com.example.nutrifit.ui.theme.Blue400
import com.example.nutrifit.ui.theme.Cyan400
import com.example.nutrifit.ui.theme.Emerald400
import com.example.nutrifit.ui.theme.Emerald500
import com.example.nutrifit.ui.theme.Rose400
import com.example.nutrifit.ui.theme.Slate100
import com.example.nutrifit.ui.theme.Slate200
import com.example.nutrifit.ui.theme.Slate400
import com.example.nutrifit.ui.theme.Slate800
import com.example.nutrifit.ui.theme.Slate900
import com.example.nutrifit.ui.theme.Slate950
import com.example.nutrifit.ui.viewmodel.NutriFitViewModel

@Composable
fun ProgressScreen(viewModel: NutriFitViewModel) {
    val profile by viewModel.profile.collectAsState()
    val allLogs by viewModel.allFoodLogs.collectAsState()
    val waterLogs by viewModel.waterLogsForDate.collectAsState()
    val activityLogs by viewModel.activityLogsForDate.collectAsState()

    val totalLogsCount = allLogs.size
    val totalCaloriesLogged = allLogs.sumOf { it.totalCalories.toDouble() }.toInt()
    val avgDailyCalories = if (totalLogsCount > 0) totalCaloriesLogged / maxOf(1, totalLogsCount) else profile.dailyCalorieTarget

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
            Column {
                Text(
                    text = "ANALYTICS & METRICS",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = Slate400,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Weekly Progress Report",
                    style = MaterialTheme.typography.headlineSmall,
                    color = Slate100,
                    fontWeight = FontWeight.Black
                )
            }
        }

        // Weight & Goal Status Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(20.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate800)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(Color(0xFF064E3B)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.MonitorWeight, contentDescription = null, tint = Emerald400, modifier = Modifier.size(20.dp))
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text("Weight & BMI Target", color = Slate100, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Text("Goal: ${profile.goal}", color = Slate400, fontSize = 11.sp)
                            }
                        }

                        Surface(
                            color = Color(0xFF064E3B),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text(
                                text = profile.bmiCategory,
                                color = Emerald400,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("Current Weight", fontSize = 11.sp, color = Slate400)
                            Text("${profile.weight} kg", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Slate100)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Target Weight", fontSize = 11.sp, color = Slate400)
                            Text("${profile.targetWeight} kg", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Emerald400)
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text("Current BMI", fontSize = 11.sp, color = Slate400)
                            Text("${profile.bmi}", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Slate100)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    val diff = kotlin.math.abs(profile.weight - profile.targetWeight)
                    Surface(
                        color = Slate950,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(modifier = Modifier.padding(10.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Emerald400, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "You are $diff kg away from your target goal of ${profile.targetWeight} kg.",
                                fontSize = 11.sp,
                                color = Slate200
                            )
                        }
                    }
                }
            }
        }

        // Calorie Adherence
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(20.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate800)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("CALORIE ADHERENCE", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Slate400, letterSpacing = 1.sp)
                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Bottom
                    ) {
                        Column {
                            Text("Target Budget", fontSize = 11.sp, color = Slate400)
                            Text("${profile.dailyCalorieTarget} kcal", fontSize = 18.sp, fontWeight = FontWeight.Black, color = Slate100)
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text("Average Intake", fontSize = 11.sp, color = Slate400)
                            Text("$avgDailyCalories kcal", fontSize = 18.sp, fontWeight = FontWeight.Black, color = Emerald400)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Adherence Visual Bars
                    val days = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
                    val heights = listOf(0.85f, 0.92f, 0.78f, 0.95f, 0.88f, 1.05f, 0.90f)

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(100.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(Slate950)
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Bottom
                    ) {
                        days.forEachIndexed { idx, day ->
                            val h = heights[idx]
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Box(
                                    modifier = Modifier
                                        .width(16.dp)
                                        .height((h * 60).dp)
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(if (h > 1.0f) Rose400 else Emerald500)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(day, fontSize = 9.sp, color = Slate400, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }

        // Macro Ratio Breakdown
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(20.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate800)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("MACRONUTRIENT DISTRIBUTION", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Slate400, letterSpacing = 1.sp)
                    Spacer(modifier = Modifier.height(12.dp))

                    // Horizontal Ratio Bar
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(12.dp)
                            .clip(CircleShape)
                    ) {
                        Box(modifier = Modifier.weight(0.25f).fillMaxSize().background(Emerald500))
                        Box(modifier = Modifier.weight(0.50f).fillMaxSize().background(Amber400))
                        Box(modifier = Modifier.weight(0.25f).fillMaxSize().background(Rose400))
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(10.dp).clip(CircleShape).background(Emerald500))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Protein (25%)", fontSize = 11.sp, color = Slate200)
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(10.dp).clip(CircleShape).background(Amber400))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Carbs (50%)", fontSize = 11.sp, color = Slate200)
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(10.dp).clip(CircleShape).background(Rose400))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Fat (25%)", fontSize = 11.sp, color = Slate200)
                        }
                    }
                }
            }
        }

        // Streaks & Consistency
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Surface(
                    color = Slate900,
                    shape = RoundedCornerShape(16.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Icon(Icons.Default.LocalFireDepartment, contentDescription = null, tint = Amber400, modifier = Modifier.size(24.dp))
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("${profile.streakDays} Days", fontSize = 18.sp, fontWeight = FontWeight.Black, color = Slate100)
                        Text("Active Streak", fontSize = 11.sp, color = Slate400)
                    }
                }

                Surface(
                    color = Slate900,
                    shape = RoundedCornerShape(16.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Icon(Icons.Default.WaterDrop, contentDescription = null, tint = Blue400, modifier = Modifier.size(24.dp))
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("${waterLogs.sumOf { it.amountMl }} ml", fontSize = 18.sp, fontWeight = FontWeight.Black, color = Slate100)
                        Text("Hydration Today", fontSize = 11.sp, color = Slate400)
                    }
                }
            }
        }

        item { Spacer(modifier = Modifier.height(24.dp)) }
    }
}
