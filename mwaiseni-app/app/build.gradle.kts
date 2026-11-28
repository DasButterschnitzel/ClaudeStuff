plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "app.mwaiseni"
    compileSdk = 35

    defaultConfig {
        applicationId = "app.mwaiseni"
        minSdk = 26
        targetSdk = 35
        versionCode = 3
        versionName = "1.2.0"
        // Phones are ARM. Add -PwithX86 to also build for the x86_64 emulator.
        ndk {
            abiFilters += listOf("arm64-v8a", "armeabi-v7a")
            if (project.hasProperty("withX86")) abiFilters += "x86_64"
        }
    }

    signingConfigs {
        // One stable key for every build, so updates install over the old version
        // without losing her progress. Personal sideload app, not a store release.
        create("mwaiseni") {
            storeFile = rootProject.file("keystore/mwaiseni.jks")
            storePassword = "mwaiseni"
            keyAlias = "mwaiseni"
            keyPassword = "mwaiseni"
        }
    }

    buildTypes {
        debug { signingConfig = signingConfigs.getByName("mwaiseni") }
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("mwaiseni")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
    buildFeatures { buildConfig = true }
    packaging {
        resources.excludes += "/META-INF/{AL2.0,LGPL2.1}"
        // compress the ML Kit native libraries inside the APK: a much smaller download
        jniLibs.useLegacyPackaging = true
    }
    lint { abortOnError = false; checkReleaseBuilds = false }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.activity:activity-ktx:1.9.3")
    implementation("androidx.webkit:webkit:1.12.1")
    implementation("com.google.mlkit:translate:17.0.3")
    implementation("com.google.mlkit:text-recognition:16.0.1")
}
