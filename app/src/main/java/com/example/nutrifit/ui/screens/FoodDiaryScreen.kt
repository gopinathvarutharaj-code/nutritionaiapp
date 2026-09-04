package com.example.nutrifit.ui.screens

import android.graphics.Bitmap
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.PhotoLibrary
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nutrifit.data.db.FoodLogEntity
import com.example.nutrifit.data.model.FoodItem
import com.example.nutrifit.data.model.IndianFoodCatalog
import com.example.nutrifit.ui.theme.Amber400
import com.example.nutrifit.ui.theme.Cyan400
import com.example.nutrifit.ui.theme.Emerald400
import com.example.nutrifit.ui.theme.Emerald500
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
fun FoodDiaryScreen(viewModel: NutriFitViewModel) {
    val foodLogs by viewModel.foodLogsForDate.collectAsState()
    val scannedItems by viewModel.scannedFoodItems.collectAsState()
    val isScanning by viewModel.isScanning.collectAsState()
    val context = LocalContext.current

    val mealTypes = listOf("All", "Breakfast", "Mid-Morning Snack", "Lunch", "Evening Snack", "Dinner")
    var selectedMealTypeTab by remember { mutableStateOf("All") }
    var targetLoggingMeal by remember { mutableStateOf("Breakfast") }

    var searchQuery by remember { mutableStateOf("") }
    var capturedBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var showScannerPanel by remember { mutableStateOf(false) }

    // Camera launcher
    val cameraLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicturePreview()
    ) { bitmap ->
        if (bitmap != null) {
            capturedBitmap = bitmap
            showScannerPanel = true
            viewModel.scanFood("Scan this meal", bitmap)
        }
    }

    // Photo picker launcher
    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia()
    ) { uri: Uri? ->
        if (uri != null) {
            try {
                val bitmap = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    ImageDecoder.decodeBitmap(ImageDecoder.createSource(context.contentResolver, uri))
                } else {
                    @Suppress("DEPRECATION")
                    MediaStore.Images.Media.getBitmap(context.contentResolver, uri)
                }
                capturedBitmap = bitmap
                showScannerPanel = true
                viewModel.scanFood("Analyze food item from image", bitmap)
            } catch (e: Exception) {
                viewModel.showToast("Could not load selected photo")
            }
        }
    }

    val filteredLogs = if (selectedMealTypeTab == "All") {
        foodLogs
    } else {
        foodLogs.filter { it.mealType == selectedMealTypeTab }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate950)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item { Spacer(modifier = Modifier.height(8.dp)) }

        // Screen Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "FOOD DIARY & NUTRITION",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate400,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "Daily Meals Log",
                        style = MaterialTheme.typography.headlineSmall,
                        color = Slate100,
                        fontWeight = FontWeight.Black
                    )
                }

                Button(
                    onClick = { showScannerPanel = !showScannerPanel },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald500),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.testTag("toggle_scanner_button")
                ) {
                    Icon(
                        if (showScannerPanel) Icons.Default.Close else Icons.Default.AutoAwesome,
                        contentDescription = "Scan",
                        tint = Slate950,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (showScannerPanel) "Close" else "AI Scan",
                        color = Slate950,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }
            }
        }

        // AI Scanner Card / Form
        if (showScannerPanel) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Slate900),
                    shape = RoundedCornerShape(20.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Emerald500)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Emerald400, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("AI Food Vision & Search", color = Slate100, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            }
                            Surface(
                                color = Color(0xFF064E3B),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text("Gemini AI", color = Emerald400, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp))
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Target Meal Type Selector
                        Text("Add to meal:", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .horizontalScroll(rememberScrollState()),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            listOf("Breakfast", "Mid-Morning Snack", "Lunch", "Evening Snack", "Dinner").forEach { meal ->
                                val isSel = targetLoggingMeal == meal
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(if (isSel) Emerald500 else Slate800)
                                        .clickable { targetLoggingMeal = meal }
                                        .padding(horizontal = 10.dp, vertical = 6.dp)
                                ) {
                                    Text(meal, fontSize = 11.sp, color = if (isSel) Slate950 else Slate200, fontWeight = FontWeight.Bold)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Photo preview if snapped
                        if (capturedBitmap != null) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(140.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Slate950)
                                    .border(1.dp, Slate800, RoundedCornerShape(12.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Image(
                                    bitmap = capturedBitmap!!.asImageBitmap(),
                                    contentDescription = "Captured Meal",
                                    modifier = Modifier.fillMaxSize()
                                )
                                IconButton(
                                    onClick = { capturedBitmap = null },
                                    modifier = Modifier
                                        .align(Alignment.TopEnd)
                                        .padding(4.dp)
                                        .size(28.dp)
                                        .background(Slate950.copy(alpha = 0.7f), CircleShape)
                                ) {
                                    Icon(Icons.Default.Close, contentDescription = "Clear", tint = Slate100, modifier = Modifier.size(16.dp))
                                }
                            }
                            Spacer(modifier = Modifier.height(10.dp))
                        }

                        // Search Text Field
                        OutlinedTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            placeholder = { Text("e.g., 2 rotis and yellow dal, or Sorghum noodles", color = Slate400, fontSize = 12.sp) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("food_search_text_input"),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Emerald500,
                                unfocusedBorderColor = Slate700,
                                focusedTextColor = Slate100,
                                unfocusedTextColor = Slate100,
                                cursorColor = Emerald400
                            ),
                            shape = RoundedCornerShape(12.dp),
                            singleLine = true,
                            leadingIcon = {
                                Icon(Icons.Default.Search, contentDescription = null, tint = Slate400)
                            }
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        // Capture and Search Action Row
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = { cameraLauncher.launch(null) },
                                colors = ButtonDefaults.buttonColors(containerColor = Slate800),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .testTag("camera_scan_button")
                            ) {
                                Icon(Icons.Default.CameraAlt, contentDescription = "Camera", tint = Slate100, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Camera", color = Slate100, fontSize = 11.sp)
                            }

                            Button(
                                onClick = { photoPickerLauncher.launch(androidx.activity.result.PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)) },
                                colors = ButtonDefaults.buttonColors(containerColor = Slate800),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .testTag("gallery_scan_button")
                            ) {
                                Icon(Icons.Default.PhotoLibrary, contentDescription = "Gallery", tint = Slate100, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Gallery", color = Slate100, fontSize = 11.sp)
                            }

                            Button(
                                onClick = {
                                    if (searchQuery.isNotBlank() || capturedBitmap != null) {
                                        viewModel.scanFood(searchQuery, capturedBitmap)
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Emerald500),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .weight(1.2f)
                                    .testTag("analyze_food_button")
                            ) {
                                if (isScanning) {
                                    CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Slate950, strokeWidth = 2.dp)
                                } else {
                                    Text("Analyze", color = Slate950, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                                }
                            }
                        }

                        // Scanned Results Preview
                        if (scannedItems.isNotEmpty()) {
                            Spacer(modifier = Modifier.height(14.dp))
                            Text("Analyzed Food Items:", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(6.dp))

                            scannedItems.forEach { item ->
                                Surface(
                                    color = Slate950,
                                    shape = RoundedCornerShape(12.dp),
                                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp)
                                ) {
                                    Column(modifier = Modifier.padding(10.dp)) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Column(modifier = Modifier.weight(1f)) {
                                                Row(verticalAlignment = Alignment.CenterVertically) {
                                                    Text(item.name, color = Slate100, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                                    if (item.verifiedSource != null) {
                                                        Spacer(modifier = Modifier.width(4.dp))
                                                        Icon(Icons.Default.Verified, contentDescription = "Verified", tint = Emerald400, modifier = Modifier.size(14.dp))
                                                    }
                                                }
                                                if (item.brand != null) {
                                                    Text(item.brand, color = Emerald400, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                                }
                                            }
                                            Text("${item.calories.toInt()} kcal", color = Slate100, fontWeight = FontWeight.Black, fontSize = 13.sp)
                                        }

                                        Spacer(modifier = Modifier.height(6.dp))
                                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                            Text("P: ${item.protein}g", color = Emerald400, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                            Text("C: ${item.carbs}g", color = Amber400, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                            Text("F: ${item.fat}g", color = Rose400, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                            Text("Fib: ${item.fiber}g", color = Cyan400, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))
                            Button(
                                onClick = {
                                    viewModel.logMeal(targetLoggingMeal, scannedItems)
                                    capturedBitmap = null
                                    searchQuery = ""
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Emerald500),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("confirm_log_meal_button")
                            ) {
                                Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Slate950, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Log to $targetLoggingMeal", color = Slate950, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }

        // Popular Indian Food & Millet Quick Catalog
        item {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Verified Indian Foods & e-Millets", style = MaterialTheme.typography.titleSmall, color = Slate100, fontWeight = FontWeight.Bold)
                    Surface(
                        color = Color(0xFF064E3B),
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text("1-Tap Add", color = Emerald400, fontSize = 9.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(IndianFoodCatalog.foods) { food ->
                        Surface(
                            color = Slate900,
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
                            modifier = Modifier
                                .width(180.dp)
                                .clickable {
                                    viewModel.quickAddFoodItem(
                                        if (selectedMealTypeTab == "All") "Lunch" else selectedMealTypeTab,
                                        food
                                    )
                                }
                                .testTag("catalog_item_${food.name.take(10)}")
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = food.name,
                                        maxLines = 1,
                                        color = Slate100,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.weight(1f)
                                    )
                                    Icon(Icons.Default.Add, contentDescription = "Add", tint = Emerald400, modifier = Modifier.size(14.dp))
                                }
                                Spacer(modifier = Modifier.height(2.dp))
                                Text("${food.calories.toInt()} kcal • ${food.portionGrams.toInt()}g", color = Slate400, fontSize = 10.sp)
                                Spacer(modifier = Modifier.height(4.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    Text("P:${food.protein}g", color = Emerald400, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    Text("C:${food.carbs}g", color = Amber400, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    Text("F:${food.fat}g", color = Rose400, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }

        // Meal Category Tabs
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                mealTypes.forEach { tab ->
                    val isSelected = selectedMealTypeTab == tab
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) Emerald500 else Slate900)
                            .border(1.dp, if (isSelected) Emerald400 else Slate800, RoundedCornerShape(10.dp))
                            .clickable { selectedMealTypeTab = tab }
                            .padding(horizontal = 14.dp, vertical = 8.dp)
                    ) {
                        Text(
                            text = tab,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) Slate950 else Slate200
                        )
                    }
                }
            }
        }

        // Logged Meals
        if (filteredLogs.isEmpty()) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Slate900),
                    shape = RoundedCornerShape(16.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("No food logged yet for $selectedMealTypeTab", color = Slate400, fontSize = 12.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Use the AI Scan button above or tap any verified item to log.", color = Slate400, fontSize = 10.sp)
                    }
                }
            }
        } else {
            items(filteredLogs) { log ->
                FoodLogCard(
                    log = log,
                    viewModel = viewModel,
                    onDeleteMeal = { viewModel.deleteFoodLog(log.id) },
                    onDeleteItem = { index -> viewModel.deleteFoodItem(log.id, index) }
                )
            }
        }

        item { Spacer(modifier = Modifier.height(24.dp)) }
    }
}

@Composable
fun FoodLogCard(
    log: FoodLogEntity,
    viewModel: NutriFitViewModel,
    onDeleteMeal: () -> Unit,
    onDeleteItem: (Int) -> Unit
) {
    val items = viewModel.repository.parseFoodItems(log.itemsJson)

    Card(
        colors = CardDefaults.cardColors(containerColor = Slate900),
        shape = RoundedCornerShape(18.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(log.mealType, color = Emerald400, fontWeight = FontWeight.Black, fontSize = 14.sp)
                    Text("Logged at ${log.loggedTime.ifEmpty { "Today" }}", color = Slate400, fontSize = 10.sp)
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "${log.totalCalories.toInt()} kcal",
                        color = Slate100,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Black,
                        modifier = Modifier.padding(end = 4.dp)
                    )
                    IconButton(onClick = onDeleteMeal, modifier = Modifier.size(28.dp)) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete Meal", tint = Rose400, modifier = Modifier.size(16.dp))
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Macro summary pill
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(Slate950)
                    .padding(horizontal = 10.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("P: ${log.totalProtein.toInt()}g", color = Emerald400, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                Text("C: ${log.totalCarbs.toInt()}g", color = Amber400, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                Text("F: ${log.totalFat.toInt()}g", color = Rose400, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                Text("Fib: ${log.totalFiber.toInt()}g", color = Cyan400, fontSize = 10.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Food items in this meal
            items.forEachIndexed { index, food ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(food.name, color = Slate200, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                        Text("${food.portionGrams.toInt()}g • ${food.calories.toInt()} kcal", color = Slate400, fontSize = 10.sp)
                    }
                    IconButton(
                        onClick = { onDeleteItem(index) },
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(Icons.Default.Close, contentDescription = "Remove Item", tint = Slate400, modifier = Modifier.size(14.dp))
                    }
                }
            }
        }
    }
}
