import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  ActivityIndicator,
  RefreshControl,
  TextInput
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const BlogContent = ({ blogsURL = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [refreshing, setRefreshing] = useState(false);
  const webViewRef = useRef(null);

  const hasBlogs = blogsURL && blogsURL.length > 0;
  const blogUrl = hasBlogs ? blogsURL[0] : null;
  const displayUrl = blogUrl 
    ? (blogUrl.length > 50 ? blogUrl.substring(0, 50) + '...' : blogUrl)
    : 'No blog post URL available';

  const onIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const onIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const refreshContent = () => {
    setIsLoading(true);
    setHasError(false);
    setRefreshing(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const toggleZoom = () => {
    setZoomLevel(current => {
      if (current === 100) return 75;
      if (current === 75) return 50;
      return 100;
    });
  };

  const openBlogInBrowser = async () => {
    if (!blogUrl) return;
    
    try {
      await WebBrowser.openBrowserAsync(blogUrl);
    } catch (error) {
      console.error('Error opening browser:', error);
      const supported = await Linking.canOpenURL(blogUrl);
      if (supported) {
        await Linking.openURL(blogUrl);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <ScrollView 
      style={styles.blogContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshContent}
          colors={['#0d9488']}
        />
      }
    >
      {/* Welcome Header */}
      <View style={styles.welcomeHeader}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>User</Text>
            </View>
          </View>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Welcome back, Traveler!</Text>
            <Text style={styles.welcomeSubtitle}>
              Ready to explore Surigao's hidden gems? Check out our latest recommendations below.
            </Text>
          </View>
        </View>
      </View>

      {/* Mini Browser Section */}
      <View style={styles.browserSection}>
        <View style={styles.browserHeader}>
          <Text style={styles.browserTitle}>Live Blog Preview</Text>
          <Text style={styles.browserSubtitle}>
            {hasBlogs ? 'Previewing your latest blog post.' : 'No blog posts available.'}
          </Text>
        </View>

        {/* Browser Toolbar */}
        <View style={styles.browserToolbar}>
          {/* Single Tab */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                hasBlogs ? styles.tabButtonActive : styles.tabButtonDisabled
              ]}
              disabled={!hasBlogs}
            >
              <Text style={[
                styles.tabButtonText,
                hasBlogs ? styles.tabButtonTextActive : styles.tabButtonTextDisabled
              ]}>
                News Blog
              </Text>
            </TouchableOpacity>
          </View>

          {/* Address Bar */}
          <View style={styles.addressBar}>
            <Text style={styles.addressPrefix}>Web</Text>
            <TextInput
              style={styles.addressInput}
              value={displayUrl}
              editable={false}
              placeholder="No blog post URL available"
            />
            <TouchableOpacity onPress={refreshContent} style={styles.refreshButton}>
              <MaterialIcons name="refresh" size={18} color="#0d9488" />
            </TouchableOpacity>
          </View>

          {/* Zoom Button */}
          <TouchableOpacity style={styles.zoomButton} onPress={toggleZoom}>
            <Text style={styles.zoomButtonText}>Zoom {zoomLevel}%</Text>
          </TouchableOpacity>
        </View>

        {/* Mini Browser Window */}
        <View style={styles.browserWindow}>
          {/* Loading State */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0d9488" />
              <Text style={styles.loadingText}>Loading preview...</Text>
            </View>
          )}

          {/* No Blog Posts */}
          {!hasBlogs && !isLoading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No blog posts available</Text>
              <Text style={styles.emptySubtitle}>
                Add a post in the admin panel to preview it here.
              </Text>
            </View>
          )}

          {/* Error State */}
          {hasError && !isLoading && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Failed to load content</Text>
              <TouchableOpacity onPress={refreshContent} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* WebView Preview */}
          {hasBlogs && blogUrl && !hasError && (
            <View style={[
              styles.webViewContainer,
              { transform: [{ scale: zoomLevel / 100 }] }
            ]}>
              <WebView
                ref={webViewRef}
                source={{ uri: blogUrl }}
                style={styles.webView}
                onLoad={onIframeLoad}
                onError={onIframeError}
                startInLoadingState={true}
                renderLoading={() => (
                  <View style={styles.webViewLoading}>
                    <ActivityIndicator size="large" color="#0d9488" />
                  </View>
                )}
              />
            </View>
          )}
        </View>

        {/* Open in Browser Button */}
        {hasBlogs && blogUrl && (
          <TouchableOpacity style={styles.openBrowserButton} onPress={openBlogInBrowser}>
            <MaterialIcons name="open-in-new" size={20} color="#fff" />
            <Text style={styles.openBrowserText}>Open in Browser</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  blogContainer: {
    flex: 1,
    backgroundColor: '#f0fdfa', // cyan-50 equivalent
  },
  welcomeHeader: {
    backgroundColor: '#e0f7fa',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0f766e', // teal-700 equivalent
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#134e4a', // teal-900 equivalent
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#374151', // gray-700 equivalent
    lineHeight: 20,
  },
  browserSection: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  browserHeader: {
    marginBottom: 20,
  },
  browserTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#134e4a',
    marginBottom: 4,
  },
  browserSubtitle: {
    fontSize: 14,
    color: '#6b7280', // gray-600 equivalent
  },
  browserToolbar: {
    backgroundColor: '#f3f4f6', // gray-100 equivalent
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300 equivalent
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  tabContainer: {
    flexDirection: 'row',
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: '#134e4a', // teal-900 equivalent
  },
  tabButtonDisabled: {
    backgroundColor: '#fff',
    opacity: 0.5,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  tabButtonTextDisabled: {
    color: '#374151', // gray-700 equivalent
  },
  addressBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  addressPrefix: {
    fontSize: 12,
    color: '#6b7280', // gray-500 equivalent
    marginRight: 8,
  },
  addressInput: {
    flex: 1,
    fontSize: 12,
    color: '#374151', // gray-700 equivalent
    padding: 0,
  },
  refreshButton: {
    padding: 4,
  },
  zoomButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  zoomButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151', // gray-700 equivalent
  },
  browserWindow: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300 equivalent
    borderTopWidth: 0,
    minHeight: 400,
    maxHeight: 550,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb', // gray-50 equivalent
    minHeight: 400,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280', // gray-500 equivalent
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefce8', // yellow-50 equivalent
    minHeight: 400,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#92400e', // yellow-800 equivalent
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#854d0e', // yellow-700 equivalent
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef2f2', // red-50 equivalent
    minHeight: 400,
    padding: 24,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#dc2626', // red-600 equivalent
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryButtonText: {
    color: '#0d9488', // teal-600 equivalent
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  webViewContainer: {
    flex: 1,
    minHeight: 400,
    maxHeight: 550,
  },
  webView: {
    flex: 1,
  },
  webViewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  openBrowserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d9488', // teal-600 equivalent
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  openBrowserText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BlogContent;