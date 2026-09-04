package com.example.nutrifit.ui.screens

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Bedtime
import androidx.compose.material.icons.filled.DirectionsRun
import androidx.compose.material.icons.filled.FitnessCenter
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
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
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.util.Locale
import com.example.nutrifit.data.db.FoodLogEntity
import com.example.nutrifit.ui.theme.Amber400
import com.example.nutrifit.ui.theme.Blue400
import com.example.nutrifit.ui.theme.Cyan400
import com.example.nutrifit.ui.theme.Emerald400
import com.example.nutrifit.ui.theme.Emerald500
import com.example.nutrifit.ui.theme.Purple400
import com.example.nutrifit.ui.theme.Rose400
import com.example.nutrifit.ui.theme.Rose500
import com.example.nutrifit.ui.theme.Slate100
import com.example.nutrifit.ui.theme.Slate200
import com.example.nutrifit.ui.theme.Slate400
import com.example.nutrifit.ui.theme.Slate700
import com.example.nutrifit.ui.theme.Slate800
import com.example.nutrifit.ui.theme.Slate900
import com.example.nutrifit.ui.theme.Slate950
import com.example.nutrifit.ui.viewmodel.NutriFitViewModel

@Composable
fun DashboardScreen(
    viewModel: NutriFitViewModel,
    onNavigateToTab: (Int) -> Unit,
    onOpenProfile: () -> Unit,
    onOpenWaterDialog: () -> Unit,
    onOpenStepsDialog: () -> Unit,
    onOpenSleepDialog: () -> Unit,
    onOpenFastingDialog: () -> Unit
) {
    val profile by viewModel.profile.collectAsState()
    val foodLogs by viewModel.foodLogsForDate.collectAsState()
    val allLogs by viewModel.allFoodLogs.collectAsState()
    val waterLogs by viewModel.waterLogsForDate.collectAsState()
    val activityLogs by viewModel.activityLogsForDate.collectAsState()
    val sleepLog by viewModel.sleepLogForDate.collectAsState()
    val activeFasting by viewModel.activeFasting.collectAsState()
    val workouts by viewModel.workoutsForDate.collectAsState()

    var reportInterval by remember { mutableStateOf("daily") } // "daily", "weekly", "monthly"

    // Totals calculations
    val dailyCalories = foodLogs.sumOf { it.totalCalories.toDouble() }.toInt()
    val dailyProtein = foodLogs.sumOf { it.totalProtein.toDouble() }.toInt()
    val dailyCarbs = foodLogs.sumOf { it.totalCarbs.toDouble() }.toInt()
    val dailyFat = foodLogs.sumOf { it.totalFat.toDouble() }.toInt()
    val dailyFiber = foodLogs.sumOf { it.totalFiber.toDouble() }.toInt()

    val totalWaterMl = waterLogs.sumOf { it.amountMl }
    val totalSteps = activityLogs.sumOf { it.steps }
    val totalWorkoutMins = workouts.filter { it.completed }.sumOf { it.durationMinutes }

    // Report scope values
    val (displayCalories, displayTarget, subLabel, remLabel) = when (reportInterval) {
        "weekly" -> {
            val avg = if (allLogs.isNotEmpty()) allLogs.sumOf { it.totalCalories.toDouble() }.toInt() / 7 else dailyCalories
            listOf(avg, profile.dailyCalorieTarget, "7-Day Daily Avg", "Avg Calories Left")
        }
        "monthly" -> {
            val avg = if (allLogs.isNotEmpty()) allLogs.sumOf { it.totalCalories.toDouble() }.toInt() / 30 else dailyCalories
            listOf(avg, profile.dailyCalorieTarget, "30-Day Daily Avg", "Avg Calories Left")
        }
        else -> {
            listOf(dailyCalories, profile.dailyCalorieTarget, "Today's Intake", "Remaining Calories")
        }
    }

    val calTarget = displayTarget as Int
    val cals = displayCalories as Int
    val percent = if (calTarget > 0) (cals * 100) / calTarget else 0
    val remaining = maxOf(0, calTarget - cals)

    val animatedProgress by animateFloatAsState(
        targetValue = minOf(1f, percent / 100f),
        animationSpec = tween(700),
        label = "progress"
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate950)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item { Spacer(modifier = Modifier.height(8.dp)) }

        // 1. Header with greeting & profile badge
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "GOOD DAY,",
                        style = MaterialTheme.typography.labelSmall,
                        color = Slate400,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "${profile.name} 👋",
                        style = MaterialTheme.typography.headlineMedium,
                        color = Slate100,
                        fontWeight = FontWeight.Black
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    // Streak Pill
                    Surface(
                        color = Slate900,
                        shape = RoundedCornerShape(12.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Slate800)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.LocalFireDepartment, contentDescription = "Streak", tint = Amber400, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("${profile.streakDays}d streak", color = Amber400, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    // Profile Avatar
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(Color(0xFF064E3B))
                            .border(2.dp, Emerald500, CircleShape)
                            .clickable { onOpenProfile() }
                            .testTag("profile_avatar_button"),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = profile.name.take(1).uppercase(),
                            color = Emerald400,
                            fontWeight = FontWeight.Black,
                            fontSize = 18.sp
                        )
                    }
                }
            }
        }

        // 2. Daily Health Insight Banner
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(18.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF065F46))
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color(0xFF064E3B)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.AutoAwesome, contentDescription = "AI", tint = Emerald400, modifier = Modifier.size(20.dp))
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "AI NUTRITION INSIGHT",
                            style = MaterialTheme.typography.labelSmall,
                            color = Emerald400,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.sp
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Incorporating traditional millets like Samai (Little Millet) and Jowar (Sorghum) provides steady, low-glycemic energy with up to 9.8g plant protein and 5g fiber per serving.",
                            style = MaterialTheme.typography.bodySmall,
                            color = Slate200,
                            lineHeight = 18.sp
                        )
                    }
                }
            }
        }

        // 3. AI Assistant Doubt Banner
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(18.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
                modifier = Modifier
                    .clickable { onNavigateToTab(4) }
                    .testTag("ai_coach_doubt_banner")
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFF1E293B)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.AutoAwesome, contentDescription = "AI Coach", tint = Emerald400, modifier = Modifier.size(22.dp))
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Have a Diet or Fitness Doubt?", color = Slate100, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.width(6.dp))
                                Surface(
                                    color = Color(0xFF064E3B),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Text("Gemini AI", color = Emerald400, fontSize = 9.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                                }
                            }
                            Text("Ask about Indian macros, fasting, e-Millet products & workouts", color = Slate400, fontSize = 11.sp)
                        }
                    }
                    Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = "Open", tint = Emerald400, modifier = Modifier.size(18.dp))
                }
            }
        }

        // 4. Calories Ring & Macro Targets Card (Interactive Interval: Daily, Weekly, Monthly)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(24.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate800)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    // Interval Toggles
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(Slate950)
                            .padding(4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "INTERVAL",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black,
                            color = Slate400,
                            modifier = Modifier.padding(start = 8.dp)
                        )
                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            listOf("daily" to "Daily", "weekly" to "Weekly", "monthly" to "Monthly").forEach { (key, label) ->
                                val isSelected = reportInterval == key
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(if (isSelected) Emerald500 else Color.Transparent)
                                        .clickable { reportInterval = key }
                                        .padding(horizontal = 12.dp, vertical = 6.dp)
                                ) {
                                    Text(
                                        text = label,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isSelected) Slate950 else Slate400
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Circular Calorie Visualizer
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            CircularProgressIndicator(
                                progress = { 1f },
                                modifier = Modifier.size(116.dp),
                                color = Slate800,
                                strokeWidth = 10.dp,
                                strokeCap = StrokeCap.Round
                            )
                            CircularProgressIndicator(
                                progress = { animatedProgress },
                                modifier = Modifier.size(116.dp),
                                color = if (percent > 100) Rose500 else if (percent >= 85) Amber400 else Emerald500,
                                strokeWidth = 10.dp,
                                strokeCap = StrokeCap.Round
                            )
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = "$percent%",
                                    fontSize = 22.sp,
                                    fontWeight = FontWeight.Black,
                                    color = if (percent > 100) Rose400 else Slate100
                                )
                                Text(
                                    text = if (reportInterval == "daily") "Eaten" else "Avg Eaten",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Slate400
                                )
                            }
                        }

                        Column(modifier = Modifier.padding(start = 8.dp)) {
                            Text(subLabel as String, fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                            Row(verticalAlignment = Alignment.Bottom) {
                                Text(
                                    text = "$cals",
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Slate100
                                )
                                Text(
                                    text = " / $calTarget kcal",
                                    fontSize = 12.sp,
                                    color = Slate400,
                                    modifier = Modifier.padding(bottom = 3.dp, start = 4.dp)
                                )
                            }
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(remLabel as String, fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.LocalFireDepartment, contentDescription = null, tint = Emerald400, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "$remaining kcal",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Emerald400
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    // Macro Breakdown Row (Protein, Carbs, Fat, Fiber)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        MacroBox(title = "Protein", value = dailyProtein, target = profile.targetProtein, color = Emerald500, modifier = Modifier.weight(1f))
                        MacroBox(title = "Carbs", value = dailyCarbs, target = profile.targetCarbs, color = Amber400, modifier = Modifier.weight(1f))
                        MacroBox(title = "Fat", value = dailyFat, target = profile.targetFat, color = Rose400, modifier = Modifier.weight(1f))
                        MacroBox(title = "Fiber", value = dailyFiber, target = profile.targetFiber, color = Cyan400, modifier = Modifier.weight(1f))
                    }
                }
            }
        }

        // 5. Mini Metrics Grid: Water, Steps, Workout, Sleep
        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    // Water Card
                    MetricCard(
                        title = "💧 Water",
                        value = "${String.format(Locale.getDefault(), "%.1f", totalWaterMl / 1000f)} / 3.0 L",
                        icon = Icons.Default.WaterDrop,
                        tint = Blue400,
                        modifier = Modifier
                            .weight(1f)
                            .clickable { onOpenWaterDialog() }
                            .testTag("water_quick_action_card")
                    )
                    // Steps Card
                    MetricCard(
                        title = "👟 Steps",
                        value = "$totalSteps / 10k",
                        icon = Icons.Default.DirectionsRun,
                        tint = Emerald400,
                        modifier = Modifier
                            .weight(1f)
                            .clickable { onOpenStepsDialog() }
                            .testTag("steps_quick_action_card")
                    )
                }

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    // Workout Card
                    MetricCard(
                        title = "🏋 Workout",
                        value = "$totalWorkoutMins min done",
                        icon = Icons.Default.FitnessCenter,
                        tint = Purple400,
                        modifier = Modifier
                            .weight(1f)
                            .clickable { onNavigateToTab(3) }
                            .testTag("workout_tab_jump_card")
                    )
                    // Sleep Card
                    MetricCard(
                        title = "😴 Sleep",
                        value = "${sleepLog?.durationHours ?: 7.5f}h (${sleepLog?.quality ?: "Good"})",
                        icon = Icons.Default.Bedtime,
                        tint = Cyan400,
                        modifier = Modifier
                            .weight(1f)
                            .clickable { onOpenSleepDialog() }
                            .testTag("sleep_quick_action_card")
                    )
                }

                // Fasting Session Card
                Card(
                    colors = CardDefaults.cardColors(containerColor = Slate900),
                    shape = RoundedCornerShape(16.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, if (activeFasting != null) Emerald500 else Slate800),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onOpenFastingDialog() }
                        .testTag("fasting_card")
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(if (activeFasting != null) Color(0xFF064E3B) else Slate800),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Timer, contentDescription = "Fasting", tint = if (activeFasting != null) Emerald400 else Slate400, modifier = Modifier.size(20.dp))
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text("⏱️ Intermittent Fasting", color = Slate100, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                Text(
                                    text = if (activeFasting != null) "Active (${activeFasting?.fastingType}) • Tap to complete" else "Not currently fasting • Tap to start 16:8",
                                    color = if (activeFasting != null) Emerald400 else Slate400,
                                    fontSize = 11.sp
                                )
                            }
                        }
                        Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null, tint = Slate400, modifier = Modifier.size(16.dp))
                    }
                }
            }
        }

        // 6. Body Health Indexes: BMI, BMR, TDEE
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(18.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate800)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "BODY HEALTH INDEXES",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        color = Slate400,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        IndexBox(
                            title = "BMI INDEX",
                            value = "${profile.bmi}",
                            subtitle = profile.bmiCategory,
                            subColor = Emerald400,
                            modifier = Modifier.weight(1f)
                        )
                        IndexBox(
                            title = "BMR TARGET",
                            value = "${profile.bmr}",
                            subtitle = "kcal / day",
                            subColor = Slate400,
                            modifier = Modifier.weight(1f)
                        )
                        IndexBox(
                            title = "ACTIVE TDEE",
                            value = "${profile.tdee}",
                            subtitle = "kcal / burn",
                            subColor = Slate400,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }

        // 7. Today's Meals Section
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Today's Meals", style = MaterialTheme.typography.titleMedium, color = Slate100, fontWeight = FontWeight.Bold)
                Text(
                    text = "Detailed Diary →",
                    color = Emerald400,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .clickable { onNavigateToTab(1) }
                        .testTag("open_diary_text_button")
                )
            }
        }

        val mealTypes = listOf("Breakfast", "Mid-Morning Snack", "Lunch", "Evening Snack", "Dinner")
        items(mealTypes.size) { index ->
            val meal = mealTypes[index]
            val log = foodLogs.find { it.mealType == meal }
            val itemsCount = if (log != null) viewModel.repository.parseFoodItems(log.itemsJson).size else 0

            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onNavigateToTab(1) }
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(meal, color = Slate100, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text(
                            text = if (log != null && itemsCount > 0) "$itemsCount item(s) logged" else "Nothing logged yet",
                            color = Slate400,
                            fontSize = 11.sp
                        )
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        if (log != null && log.totalCalories > 0) {
                            Text(
                                text = "${log.totalCalories.toInt()} kcal",
                                color = Slate200,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(end = 8.dp)
                            )
                        }
                        IconButton(
                            onClick = { onNavigateToTab(1) },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = "Add to $meal", tint = Emerald400)
                        }
                    }
                }
            }
        }

        item { Spacer(modifier = Modifier.height(24.dp)) }
    }
}

@Composable
fun MacroBox(title: String, value: Int, target: Int, color: Color, modifier: Modifier = Modifier) {
    val pct = if (target > 0) minOf(1f, value.toFloat() / target.toFloat()) else 0f
    Surface(
        color = Slate950,
        shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(8.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(title, fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate400)
                Text("${value}g", fontSize = 10.sp, fontWeight = FontWeight.Black, color = color)
            }
            Spacer(modifier = Modifier.height(6.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(4.dp)
                    .clip(CircleShape)
                    .background(Slate800)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(pct)
                        .height(4.dp)
                        .clip(CircleShape)
                        .background(color)
                )
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text("Goal: ${target}g", fontSize = 8.sp, color = Slate400)
        }
    }
}

@Composable
fun MetricCard(title: String, value: String, icon: androidx.compose.ui.graphics.vector.ImageVector, tint: Color, modifier: Modifier = Modifier) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Slate900),
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
        modifier = modifier
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(tint.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = title, tint = tint, modifier = Modifier.size(20.dp))
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Text(title, fontSize = 10.sp, color = Slate400, fontWeight = FontWeight.Bold)
                Text(value, fontSize = 13.sp, fontWeight = FontWeight.Black, color = Slate100)
            }
        }
    }
}

@Composable
fun IndexBox(title: String, value: String, subtitle: String, subColor: Color, modifier: Modifier = Modifier) {
    Surface(
        color = Slate950,
        shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(title, fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Black)
            Spacer(modifier = Modifier.height(4.dp))
            Text(value, fontSize = 16.sp, fontWeight = FontWeight.Black, color = Slate100)
            Spacer(modifier = Modifier.height(2.dp))
            Text(subtitle, fontSize = 9.sp, fontWeight = FontWeight.Bold, color = subColor)
        }
    }
}
