package com.example.nutrifit.ui.dialogs

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.WaterDrop
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.nutrifit.data.db.FastingLogEntity
import com.example.nutrifit.ui.theme.Blue400
import com.example.nutrifit.ui.theme.Cyan400
import com.example.nutrifit.ui.theme.Emerald400
import com.example.nutrifit.ui.theme.Emerald500
import com.example.nutrifit.ui.theme.Rose500
import com.example.nutrifit.ui.theme.Slate100
import com.example.nutrifit.ui.theme.Slate200
import com.example.nutrifit.ui.theme.Slate400
import com.example.nutrifit.ui.theme.Slate700
import com.example.nutrifit.ui.theme.Slate800
import com.example.nutrifit.ui.theme.Slate900
import com.example.nutrifit.ui.theme.Slate950

@Composable
fun WaterDialog(
    onDismiss: () -> Unit,
    onAddWater: (Int) -> Unit
) {
    var customAmount by remember { mutableStateOf("") }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            color = Slate900,
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
            modifier = Modifier.fillMaxWidth().padding(16.dp)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.WaterDrop, contentDescription = null, tint = Blue400, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Log Water Intake", style = MaterialTheme.typography.titleMedium, color = Slate100, fontWeight = FontWeight.Bold)
                    }
                    IconButton(onClick = onDismiss, modifier = Modifier.size(28.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = Slate400)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))
                Text("Quick Add:", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(6.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf(250, 500, 750).forEach { amount ->
                        Button(
                            onClick = {
                                onAddWater(amount)
                                onDismiss()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Slate950),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.weight(1f).testTag("quick_water_${amount}")
                        ) {
                            Text("+${amount}ml", color = Blue400, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = customAmount,
                    onValueChange = { customAmount = it },
                    placeholder = { Text("Or custom ml (e.g. 300)", color = Slate400, fontSize = 11.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Emerald500, unfocusedBorderColor = Slate700, focusedTextColor = Slate100, unfocusedTextColor = Slate100),
                    shape = RoundedCornerShape(10.dp),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    onClick = {
                        val amt = customAmount.toIntOrNull() ?: 250
                        onAddWater(amt)
                        onDismiss()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald500),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth().testTag("confirm_custom_water")
                ) {
                    Text("Add Water", color = Slate950, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun StepsDialog(
    onDismiss: () -> Unit,
    onAddSteps: (Int) -> Unit
) {
    var stepsText by remember { mutableStateOf("") }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            color = Slate900,
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
            modifier = Modifier.fillMaxWidth().padding(16.dp)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("👟 Log Daily Steps", style = MaterialTheme.typography.titleMedium, color = Slate100, fontWeight = FontWeight.Bold)
                    IconButton(onClick = onDismiss, modifier = Modifier.size(28.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = Slate400)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf(1000, 2000, 5000).forEach { s ->
                        Button(
                            onClick = {
                                onAddSteps(s)
                                onDismiss()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Slate950),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.weight(1f).testTag("quick_steps_${s}")
                        ) {
                            Text("+$s", color = Emerald400, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = stepsText,
                    onValueChange = { stepsText = it },
                    placeholder = { Text("Custom step count (e.g. 3500)", color = Slate400, fontSize = 11.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Emerald500, unfocusedBorderColor = Slate700, focusedTextColor = Slate100, unfocusedTextColor = Slate100),
                    shape = RoundedCornerShape(10.dp),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    onClick = {
                        val s = stepsText.toIntOrNull() ?: 1000
                        onAddSteps(s)
                        onDismiss()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald500),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth().testTag("confirm_custom_steps")
                ) {
                    Text("Log Steps", color = Slate950, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun SleepDialog(
    onDismiss: () -> Unit,
    onLogSleep: (Float, String) -> Unit
) {
    var hours by remember { mutableStateOf(7.5f) }
    var quality by remember { mutableStateOf("Good") }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            color = Slate900,
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
            modifier = Modifier.fillMaxWidth().padding(16.dp)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("😴 Log Night Sleep", style = MaterialTheme.typography.titleMedium, color = Slate100, fontWeight = FontWeight.Bold)
                    IconButton(onClick = onDismiss, modifier = Modifier.size(28.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = Slate400)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))
                Text("Hours of Sleep: ${hours}h", fontSize = 12.sp, color = Cyan400, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(6.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    listOf(6.0f, 7.0f, 7.5f, 8.0f, 8.5f).forEach { h ->
                        val sel = hours == h
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (sel) Cyan400 else Slate950)
                                .clickable { hours = h }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("${h}h", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = if (sel) Slate950 else Slate200)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))
                Text("Sleep Quality:", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(6.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    listOf("Great", "Good", "Fair", "Restless").forEach { q ->
                        val sel = quality == q
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (sel) Emerald500 else Slate950)
                                .clickable { quality = q }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(q, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = if (sel) Slate950 else Slate200)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                Button(
                    onClick = {
                        onLogSleep(hours, quality)
                        onDismiss()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald500),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth().testTag("confirm_sleep_log")
                ) {
                    Text("Save Sleep Log", color = Slate950, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun FastingDialog(
    activeFasting: FastingLogEntity?,
    onDismiss: () -> Unit,
    onToggleFasting: (String, Float) -> Unit
) {
    var selectedProtocol by remember { mutableStateOf("16:8") }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            color = Slate900,
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
            modifier = Modifier.fillMaxWidth().padding(16.dp)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("⏱️ Intermittent Fasting", style = MaterialTheme.typography.titleMedium, color = Slate100, fontWeight = FontWeight.Bold)
                    IconButton(onClick = onDismiss, modifier = Modifier.size(28.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = Slate400)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                if (activeFasting != null) {
                    val elapsedHours = ((System.currentTimeMillis() - activeFasting.startTime) / (1000 * 60 * 60f))
                    Surface(
                        color = Slate950,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("ACTIVE FASTING SESSION", fontSize = 10.sp, color = Emerald400, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("Protocol: ${activeFasting.fastingType}", fontSize = 14.sp, color = Slate100, fontWeight = FontWeight.Bold)
                            Text("Elapsed: ${String.format(java.util.Locale.getDefault(), "%.1f", elapsedHours)} / ${activeFasting.targetHours.toInt()} hours", fontSize = 12.sp, color = Slate400)
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            onToggleFasting(activeFasting.fastingType, activeFasting.targetHours)
                            onDismiss()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Rose500),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth().testTag("stop_fasting_button")
                    ) {
                        Text("End Fasting Session", color = Slate100, fontWeight = FontWeight.Bold)
                    }
                } else {
                    Text("Choose Protocol:", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))

                    val protocols = listOf(
                        "16:8" to 16f,
                        "18:6" to 18f,
                        "20:4" to 20f,
                        "OMAD (23:1)" to 23f
                    )

                    protocols.forEach { (name, hrs) ->
                        val sel = selectedProtocol == name
                        Surface(
                            color = if (sel) Color(0xFF064E3B) else Slate950,
                            shape = RoundedCornerShape(10.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, if (sel) Emerald500 else Slate800),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .clickable { selectedProtocol = name }
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(name, color = if (sel) Emerald400 else Slate200, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                Text("${hrs.toInt()}h Fasting", color = Slate400, fontSize = 11.sp)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            val hrs = when (selectedProtocol) {
                                "18:6" -> 18f
                                "20:4" -> 20f
                                "OMAD (23:1)" -> 23f
                                else -> 16f
                            }
                            onToggleFasting(selectedProtocol, hrs)
                            onDismiss()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald500),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth().testTag("start_fasting_button")
                    ) {
                        Text("Start Fasting Now", color = Slate950, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
