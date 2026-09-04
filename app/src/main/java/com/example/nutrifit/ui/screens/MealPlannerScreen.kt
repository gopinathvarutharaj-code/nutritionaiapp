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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nutrifit.data.model.FoodItem
import com.example.nutrifit.ui.theme.Amber400
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
fun MealPlannerScreen(viewModel: NutriFitViewModel) {
    val profile by viewModel.profile.collectAsState()
    val mealPlan by viewModel.mealPlan.collectAsState()
    val isGenerating by viewModel.isMealPlanLoading.collectAsState()

    val totalPlanCalories = mealPlan.sumOf { it.calories }
    val totalPlanProtein = mealPlan.sumOf { it.protein }
    val totalPlanCarbs = mealPlan.sumOf { it.carbs }
    val totalPlanFat = mealPlan.sumOf { it.fat }
    val totalPlanFiber = mealPlan.sumOf { it.fiber }

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
                        text = "AI DIET PLANNER",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate400,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "${profile.cuisinePreference} Plan",
                        style = MaterialTheme.typography.headlineSmall,
                        color = Slate100,
                        fontWeight = FontWeight.Black
                    )
                }

                Button(
                    onClick = { viewModel.refreshMealPlan() },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald500),
                    shape = RoundedCornerShape(12.dp),
                    enabled = !isGenerating,
                    modifier = Modifier.testTag("regenerate_meal_plan_button")
                ) {
                    if (isGenerating) {
                        CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Slate950, strokeWidth = 2.dp)
                    } else {
                        Icon(Icons.Default.Refresh, contentDescription = "Regenerate", tint = Slate950, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Regenerate", color = Slate950, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }
            }
        }

        // Summary Card
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
                        Column {
                            Text("Target: ${profile.goal} (${profile.dietPreference})", color = Slate200, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            Text("Cuisine: ${profile.cuisinePreference} Tradition", color = Slate400, fontSize = 11.sp)
                        }
                        Text(
                            text = "$totalPlanCalories kcal",
                            color = Emerald400,
                            fontWeight = FontWeight.Black,
                            fontSize = 18.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(Slate950)
                            .padding(10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Protein", fontSize = 9.sp, color = Slate400, fontWeight = FontWeight.Bold)
                            Text("${totalPlanProtein}g", fontSize = 12.sp, color = Emerald400, fontWeight = FontWeight.Black)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Carbs", fontSize = 9.sp, color = Slate400, fontWeight = FontWeight.Bold)
                            Text("${totalPlanCarbs}g", fontSize = 12.sp, color = Amber400, fontWeight = FontWeight.Black)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Fat", fontSize = 9.sp, color = Slate400, fontWeight = FontWeight.Bold)
                            Text("${totalPlanFat}g", fontSize = 12.sp, color = Rose400, fontWeight = FontWeight.Black)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Fiber", fontSize = 9.sp, color = Slate400, fontWeight = FontWeight.Bold)
                            Text("${totalPlanFiber}g", fontSize = 12.sp, color = Cyan400, fontWeight = FontWeight.Black)
                        }
                    }
                }
            }
        }

        // Meal Cards List
        items(mealPlan) { meal ->
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(18.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                color = Color(0xFF064E3B),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = meal.mealType,
                                    color = Emerald400,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(meal.time, color = Slate400, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }

                        Text("${meal.calories} kcal", color = Slate100, fontSize = 14.sp, fontWeight = FontWeight.Black)
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Text(meal.name, color = Slate100, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(meal.items, color = Slate200, fontSize = 12.sp, lineHeight = 18.sp)

                    Spacer(modifier = Modifier.height(8.dp))

                    // Recipe instructions
                    Surface(
                        color = Slate950,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(modifier = Modifier.padding(10.dp), verticalAlignment = Alignment.Top) {
                            Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Emerald400, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(meal.instructions, color = Slate400, fontSize = 11.sp, lineHeight = 16.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            Text("P: ${meal.protein}g", color = Emerald400, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text("C: ${meal.carbs}g", color = Amber400, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text("F: ${meal.fat}g", color = Rose400, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text("Fib: ${meal.fiber}g", color = Cyan400, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }

                        Button(
                            onClick = {
                                viewModel.logMeal(
                                    mealType = meal.mealType,
                                    items = listOf(
                                        FoodItem(
                                            name = meal.name,
                                            calories = meal.calories.toFloat(),
                                            protein = meal.protein.toFloat(),
                                            carbs = meal.carbs.toFloat(),
                                            fat = meal.fat.toFloat(),
                                            fiber = meal.fiber.toFloat(),
                                            verifiedSource = "NutriFit AI Meal Planner"
                                        )
                                    )
                                )
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Slate800),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.testTag("log_planned_meal_${meal.mealType}")
                        ) {
                            Icon(Icons.Default.Add, contentDescription = "Log Meal", tint = Emerald400, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Log Meal", color = Slate100, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        item { Spacer(modifier = Modifier.height(24.dp)) }
    }
}
