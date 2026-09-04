package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.FitnessCenter
import androidx.compose.material.icons.filled.Leaderboard
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nutrifit.ui.dialogs.FastingDialog
import com.example.nutrifit.ui.dialogs.ProfileDialog
import com.example.nutrifit.ui.dialogs.SleepDialog
import com.example.nutrifit.ui.dialogs.StepsDialog
import com.example.nutrifit.ui.dialogs.WaterDialog
import com.example.nutrifit.ui.screens.AIAssistantScreen
import com.example.nutrifit.ui.screens.DashboardScreen
import com.example.nutrifit.ui.screens.FoodDiaryScreen
import com.example.nutrifit.ui.screens.MealPlannerScreen
import com.example.nutrifit.ui.screens.ProgressScreen
import com.example.nutrifit.ui.screens.WorkoutScreen
import com.example.nutrifit.ui.theme.Emerald400
import com.example.nutrifit.ui.theme.Emerald500
import com.example.nutrifit.ui.theme.NutriFitTheme
import com.example.nutrifit.ui.theme.Slate400
import com.example.nutrifit.ui.theme.Slate700
import com.example.nutrifit.ui.theme.Slate900
import com.example.nutrifit.ui.theme.Slate950
import com.example.nutrifit.ui.viewmodel.NutriFitViewModel

data class NavTabItem(
    val title: String,
    val icon: ImageVector,
    val testTag: String
)

class MainActivity : ComponentActivity() {

    private val viewModel: NutriFitViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            NutriFitTheme {
                NutriFitApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun NutriFitApp(viewModel: NutriFitViewModel) {
    var currentTab by remember { mutableIntStateOf(0) }
    val snackbarHostState = remember { SnackbarHostState() }
    val toastMsg by viewModel.toastMessage.collectAsState()

    // Dialog Visibility States
    var showProfileDialog by remember { mutableStateOf(false) }
    var showWaterDialog by remember { mutableStateOf(false) }
    var showStepsDialog by remember { mutableStateOf(false) }
    var showSleepDialog by remember { mutableStateOf(false) }
    var showFastingDialog by remember { mutableStateOf(false) }

    val profile by viewModel.profile.collectAsState()
    val activeFasting by viewModel.activeFasting.collectAsState()

    LaunchedEffect(toastMsg) {
        toastMsg?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.clearToast()
        }
    }

    val navItems = listOf(
        NavTabItem("Home", Icons.Default.Dashboard, "nav_tab_dashboard"),
        NavTabItem("Diary", Icons.Default.Restaurant, "nav_tab_food_diary"),
        NavTabItem("Meals", Icons.Default.MenuBook, "nav_tab_meal_planner"),
        NavTabItem("Workouts", Icons.Default.FitnessCenter, "nav_tab_workouts"),
        NavTabItem("Coach", Icons.Default.AutoAwesome, "nav_tab_ai_assistant"),
        NavTabItem("Progress", Icons.Default.Leaderboard, "nav_tab_progress")
    )

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        contentWindowInsets = WindowInsets.navigationBars,
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        bottomBar = {
            NavigationBar(
                containerColor = Slate900,
                contentColor = Slate400,
                tonalElevation = 8.dp
            ) {
                navItems.forEachIndexed { index, item ->
                    val isSelected = currentTab == index
                    NavigationBarItem(
                        selected = isSelected,
                        onClick = { currentTab = index },
                        icon = {
                            Icon(
                                imageVector = item.icon,
                                contentDescription = item.title,
                                tint = if (isSelected) Emerald400 else Slate400,
                                modifier = Modifier.size(22.dp)
                            )
                        },
                        label = {
                            Text(
                                text = item.title,
                                fontSize = 10.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                color = if (isSelected) Emerald400 else Slate400
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            indicatorColor = Color(0xFF064E3B)
                        ),
                        modifier = Modifier.testTag(item.testTag)
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Slate950)
                .padding(innerPadding)
        ) {
            when (currentTab) {
                0 -> DashboardScreen(
                    viewModel = viewModel,
                    onNavigateToTab = { currentTab = it },
                    onOpenProfile = { showProfileDialog = true },
                    onOpenWaterDialog = { showWaterDialog = true },
                    onOpenStepsDialog = { showStepsDialog = true },
                    onOpenSleepDialog = { showSleepDialog = true },
                    onOpenFastingDialog = { showFastingDialog = true }
                )
                1 -> FoodDiaryScreen(viewModel = viewModel)
                2 -> MealPlannerScreen(viewModel = viewModel)
                3 -> WorkoutScreen(viewModel = viewModel)
                4 -> AIAssistantScreen(viewModel = viewModel)
                5 -> ProgressScreen(viewModel = viewModel)
            }
        }

        // Active Dialogs
        if (showProfileDialog) {
            ProfileDialog(
                currentProfile = profile,
                onDismiss = { showProfileDialog = false },
                onSave = { updated ->
                    viewModel.updateProfile(updated)
                    showProfileDialog = false
                }
            )
        }

        if (showWaterDialog) {
            WaterDialog(
                onDismiss = { showWaterDialog = false },
                onAddWater = { amt -> viewModel.logWater(amt) }
            )
        }

        if (showStepsDialog) {
            StepsDialog(
                onDismiss = { showStepsDialog = false },
                onAddSteps = { s -> viewModel.logSteps(s) }
            )
        }

        if (showSleepDialog) {
            SleepDialog(
                onDismiss = { showSleepDialog = false },
                onLogSleep = { hrs, q -> viewModel.logSleep(hrs, q) }
            )
        }

        if (showFastingDialog) {
            FastingDialog(
                activeFasting = activeFasting,
                onDismiss = { showFastingDialog = false },
                onToggleFasting = { type, hrs -> viewModel.toggleFasting(type, hrs) }
            )
        }
    }
}
