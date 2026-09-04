package com.example.nutrifit.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Emerald500,
    onPrimary = Slate950,
    primaryContainer = Emerald950,
    onPrimaryContainer = Emerald400,
    secondary = Amber400,
    onSecondary = Slate950,
    tertiary = Cyan400,
    background = Slate950,
    onBackground = Slate100,
    surface = Slate900,
    onSurface = Slate100,
    surfaceVariant = Slate800,
    onSurfaceVariant = Slate400,
    outline = Slate700,
    error = Rose500
)

@Composable
fun NutriFitTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
