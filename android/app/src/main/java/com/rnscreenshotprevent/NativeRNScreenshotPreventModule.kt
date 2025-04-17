package com.rnscreenshotprevent

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.pm.PackageManager
import android.os.Build
import android.provider.Settings
import android.view.WindowManager
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices

class NativeRNScreenshotPreventModule(reactContext: ReactApplicationContext) :
        NativeRNScreenshotPreventSpec(reactContext) {

  override fun getName() = NAME

  // This method is called when the module is initialized and is used to check if the screenshot
  // blocking is enabled or not.
  override fun isEnabled(promise: com.facebook.react.bridge.Promise) {

    val activity = currentActivity

    if (activity == null) {
      throw IllegalStateException("Current activity is null")
    }

    val isSecure =
            (activity.window.attributes.flags and WindowManager.LayoutParams.FLAG_SECURE) != 0
    promise.resolve(isSecure) // Return boolean to JS
  }

  override fun enable() {

    val activity: Activity? = currentActivity
    activity?.runOnUiThread {
      activity.window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
      sendEvent("onScreenshotBlockingEnabled")
    }
  }

  override fun disable() {
    val activity: Activity? = currentActivity
    activity?.runOnUiThread {
      activity.window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
      sendEvent("onScreenshotBlockingDisabled")
    }
  }

  private fun getAndroidId(): String {
    return Settings.Secure.getString(
            reactApplicationContext.contentResolver,
            Settings.Secure.ANDROID_ID
    )
  }

  @SuppressLint("MissingPermission")
  fun getLocationWithPermission(callback: (WritableMap?) -> Unit) {
    val context = reactApplicationContext
    val activity =
            currentActivity
                    ?: run {
                      callback(null)
                      return
                    }

    // Check permission
    if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) !=
                    PackageManager.PERMISSION_GRANTED
    ) {
      ActivityCompat.requestPermissions(
              activity,
              arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
              101
      )
      callback(null) // Return null if permission not granted
      return
    }

    val fusedLocationClient: FusedLocationProviderClient =
            LocationServices.getFusedLocationProviderClient(context)

    fusedLocationClient.lastLocation
            .addOnSuccessListener { location ->
              if (location != null) {
                val locationMap =
                        Arguments.createMap().apply {
                          putDouble("latitude", location.latitude)
                          putDouble("longitude", location.longitude)
                        }
                callback(locationMap)
              } else {
                callback(null)
              }
            }
            .addOnFailureListener { callback(null) }
  }

  private fun sendEvent(eventName: String) {
    getLocationWithPermission { locationMap ->
      val params = Arguments.createMap()

      // Device Info
      params.putString("deviceName", Build.MODEL)
      params.putString("deviceManufacturer", Build.MANUFACTURER)
      params.putString("androidId", getAndroidId())
      params.putString("androidVersion", Build.VERSION.RELEASE)

      // Add location data if available
      if (locationMap != null) {
        params.putMap("location", locationMap)
      } else {
        params.putNull("location")
      }

      // Emit to JS
      reactApplicationContext
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
              .emit(eventName, params)
    }
  }

  companion object {
    const val NAME = "NativeRNScreenshotPrevent"
  }
}
