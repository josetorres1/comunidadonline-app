import React, { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  StatusBar,
  BackHandler,
} from "react-native"
import { WebView } from "react-native-webview"
import * as WebBrowser from "expo-web-browser"
import { SplashScreen } from "expo"

export default function App(props) {
  const [visible, setvisible] = useState(true)
  const webView = useRef(null)
  const [canGoback, setCanGoback] = useState(null)
  const [isLoadingComplete, setLoadingComplete] = React.useState(false)

  const backHandler = () => {
    if (webView.current && canGoback) {
      webView.current.goBack()
      return true
    }
    return false
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backHandler)
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backHandler)
    }
  }, [])

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide()
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e)
      } finally {
        setLoadingComplete(true)
        SplashScreen.hide()
      }
    }

    loadResourcesAndDataAsync()
  }, [])

  const ActivityIndicatorLoadingView = () => {
    //making a view to show to while loading the webpage
    return (
      // <View style={styles.WebViewStyle}>
      <ActivityIndicator
        size="large"
        color="black"
        style={styles.flexContainer}
      />
      // </View>
    )
  }

  const handleWebViewNavigationStateChange = async ({
    url,
    title,
    loading,
    canGoBack,
    canGoForward,
  }) => {
    if (!url) return
    if (!url.includes("comunidadhosanna.info/")) {
      webView.current.stopLoading()
      if (url.includes("https")) await WebBrowser.openBrowserAsync(url)
      else if (Linking.canOpenURL(url)) Linking.openURL(url)
      else WebBrowser.openBrowserAsync("url")
    }
    setCanGoback(canGoBack)
  }

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null
  } else {
    return (
      <>
        <SafeAreaView style={[styles.container]}>
          <View style={styles.container}>
            <StatusBar backgroundColor="#2283F6" barStyle="dark-content" />
            <WebView
              ref={webView}
              source={{ uri: "https://comunidadhosanna.info/" }}
              style={styles.WebViewStyle}
              renderLoading={ActivityIndicatorLoadingView}
              onNavigationStateChange={handleWebViewNavigationStateChange}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
        </SafeAreaView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  WebViewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ActivityIndicatorStyle: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
})
