import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from "../../apiConfig";
import logo from "../../assets/images/logo.png";

const api_notification = `${BASE_URL}/notification`;
const { width } = Dimensions.get('window');

const HeaderNav = ({ userInformation, onSelectPage }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [accessToken, setAccessToken] = useState('');

  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setAccessToken(token || '');
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return '';
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await axios.get(api_notification, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        // Map backend data to expected frontend format
        const mappedNotifications = response.data.map((notif) => ({
          id: notif.id,
          message: notif.message,
          unread: notif.status === 'unread', // assuming status column
          time: new Date(notif.created_at).toLocaleString(),
          category: notif.type || 'general',
        }));

        setNotifications(mappedNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (showNotifications) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [showNotifications]);

  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const closeNotifications = () => setShowNotifications(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const viewAllNotifications = () => {
    console.log("Redirect to full notifications page");
    closeNotifications();
  };

  const getNotificationIcon = (category) => {
    const icons = {
      'Booking': 'confirmation-number',
      'Favorite': 'favorite',
      'Payment': 'payments',
      'Review': 'star',
      'Promotion': 'local-offer',
      'Reminder': 'event',
      'general': 'notifications'
    };
    return icons[category] || 'notifications';
  };

  const getNotificationColor = (category) => {
    const colors = {
      'Booking': '#28a745',
      'Favorite': '#e91e63',
      'Payment': '#2196f3',
      'Review': '#ff9800',
      'Promotion': '#9c27b0',
      'Reminder': '#4caf50',
      'general': '#00b4db'
    };
    return colors[category] || '#00b4db';
  };

  const NotificationItem = ({ notification }) => (
      <View style={[
        styles.notificationItem,
        notification.unread && styles.unreadNotification
      ]}>
        <View style={[
          styles.notificationIcon,
          { backgroundColor: getNotificationColor(notification.category) }
        ]}>
          <MaterialIcons name={getNotificationIcon(notification.category)} size={20} color="#fff" />
        </View>

        <View style={styles.notificationContent}>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          <View style={styles.notificationMeta}>
            <Text style={styles.notificationTime}>{notification.time}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{notification.category}</Text>
            </View>
          </View>
        </View>

        {notification.unread && (
            <TouchableOpacity style={styles.markReadBtn} onPress={() => markAsRead(notification.id)}>
              <MaterialIcons name="check-circle" size={20} color="#28a745" />
            </TouchableOpacity>
        )}
      </View>
  );

  return (
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={styles.profileSection}>
            <Image source={logo} style={styles.avatar} />
            <Text style={styles.userName}>Suroy Surigao</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.notificationButton} onPress={toggleNotifications}>
            <View style={styles.iconButton}>
              <MaterialIcons name="notifications-none" size={24} color="#666" />
              {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                  </View>
              )}
            </View>
          </TouchableOpacity>

          <Modal visible={showNotifications} transparent animationType="fade" onRequestClose={closeNotifications}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeNotifications}>
              <Animated.View style={[styles.dropdown, {
                opacity: fadeAnim,
                transform: [
                  { translateY: fadeAnim.interpolate({ inputRange: [0,1], outputRange: [-10,0] }) },
                  { scale: fadeAnim.interpolate({ inputRange: [0,1], outputRange: [0.95,1] }) },
                ],
              }]}>
                <View style={styles.dropdownHeader}>
                  <Text style={styles.dropdownTitle}>Notifications</Text>
                  <View style={styles.headerActions}>
                    {unreadCount > 0 && (
                        <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
                          <MaterialIcons name="done-all" size={16} color="#00b4db" />
                          <Text style={styles.markAllText}>Mark all read</Text>
                        </TouchableOpacity>
                    )}
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
                    </View>
                  </View>
                </View>

                <ScrollView style={styles.dropdownContent} showsVerticalScrollIndicator={false}>
                  {notifications.length === 0 ? (
                      <View style={styles.emptyState}>
                        <MaterialIcons name="notifications-off" size={48} color="#999" />
                        <Text style={styles.emptyTitle}>No notifications yet</Text>
                        <Text style={styles.emptySubtitle}>We'll notify you when something arrives</Text>
                      </View>
                  ) : (
                      <View style={styles.notificationList}>
                        {notifications.map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                      </View>
                  )}
                </ScrollView>

                <View style={styles.dropdownFooter}>
                  <TouchableOpacity style={styles.viewAllButton} onPress={viewAllNotifications}>
                    <MaterialIcons name="list-alt" size={20} color="#fff" />
                    <Text style={styles.viewAllText}>View Notification History</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableOpacity>
          </Modal>
        </View>
      </View>
  );
};



const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 64,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 50,
    marginTop: 30,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#00b4db',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
  },
  notificationButton: {
    position: 'relative',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ff6b6b',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: 16,
  },
  dropdown: {
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: 500,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 180, 219, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00b4db',
  },
  unreadBadge: {
    backgroundColor: '#00b4db',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 20,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  dropdownContent: {
    maxHeight: 350,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  notificationList: {
    paddingVertical: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  unreadNotification: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#00b4db',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 180, 219, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00b4db',
  },
  markReadBtn: {
    padding: 8,
    borderRadius: 8,
  },
  dropdownFooter: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    alignItems: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00b4db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
  },
  viewAllText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HeaderNav;