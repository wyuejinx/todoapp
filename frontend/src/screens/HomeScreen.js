import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '../api/client';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';

const notifyError = (title, message) => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};

const HomeScreen = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All'); // 'All' | 'Active' | 'Done'

  const fetchTodos = async () => {
    try {
      const response = await apiClient.get('/');
      setTodos(response.data);
    } catch (err) {
      notifyError('Fetch Error', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTodos();
  }, []);

 const handleAddTodo = async (title, category) => {
    try {
      const response = await apiClient.post('/', { title, category });
      setTodos((prev) => [response.data, ...prev]);
    } catch (err) {
      notifyError('Add Error', err.response?.data?.message || err.message);
    }
  };

  const handleToggleTodo = async (id, currentStatus) => {
    try {
      const response = await apiClient.put(`/${id}`, {
        isCompleted: !currentStatus,
      });
      setTodos((prev) =>
        prev.map((item) => (item._id === id ? response.data : item))
      );
    } catch (err) {
      notifyError('Update Error', err.response?.data?.message || err.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await apiClient.delete(`/${id}`);
      setTodos((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      notifyError('Delete Error', err.response?.data?.message || err.message);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await apiClient.delete('/completed/clear');
      setTodos((prev) => prev.filter((item) => !item.isCompleted));
    } catch (err) {
      notifyError('Clear Error', err.response?.data?.message || err.message);
    }
  };

  const filteredTodos = useMemo(() => {
    if (filter === 'Active') return todos.filter((t) => !t.isCompleted);
    if (filter === 'Done') return todos.filter((t) => t.isCompleted);
    return todos;
  }, [todos, filter]);

  const completedCount = todos.filter((t) => t.isCompleted).length;
  const progressPercent = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  // Color mapper helper for tabs
  const getTabColor = (tabName, isSelected) => {
    if (!isSelected) return 'transparent';
    if (tabName === 'Active') return '#2563EB'; // Vibrant Blue
    if (tabName === 'Done') return '#10B981';   // Emerald Green
    return '#1E293B';                           // Slate for All
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.responsiveWrapper}>
          {/* Header Card */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerTitle}>Task Manager</Text>
                <Text style={styles.headerSubtitle}>Full-stack MERN & React Native</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {completedCount}/{todos.length} Done
                </Text>
              </View>
            </View>

            {/* Visual Progress Bar */}
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>

          {/* Form */}
          <TodoForm onAdd={handleAddTodo} />

          {/* Dedicated Filter & Action Bar Card */}
          <View style={styles.filterCard}>
            <View style={styles.tabGroup}>
              {['All', 'Active', 'Done'].map((tab) => {
                const isSelected = filter === tab;
                const activeBg = getTabColor(tab, isSelected);

                return (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.tabButton,
                      { backgroundColor: activeBg },
                      isSelected && styles.tabButtonShadow,
                    ]}
                    onPress={() => setFilter(tab)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.tabButtonText,
                        isSelected ? styles.tabButtonTextActive : styles.tabButtonTextInactive,
                      ]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {completedCount > 0 && (
              <TouchableOpacity
                style={styles.clearDoneButton}
                onPress={handleClearCompleted}
                activeOpacity={0.7}
              >
                <Text style={styles.clearDoneText}>Clear Done</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Task List */}
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          ) : (
            <FlatList
              data={filteredTodos}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TodoItem
                  todo={item}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />
              }
              contentContainerStyle={
                filteredTodos.length === 0 ? styles.emptyListContainer : { paddingBottom: 32 }
              }
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyEmoji}>📋</Text>
                  <Text style={styles.emptyTitle}>
                    {filter === 'All' ? 'No tasks created yet' : `No ${filter.toLowerCase()} tasks`}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    {filter === 'All'
                      ? 'Type a task title and pick a category above to start.'
                      : 'Try switching to another filter tab.'}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardContainer: {
    flex: 1,
  },
  responsiveWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 6,
  },
  filterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 8,
  },
  tabGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonShadow: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  tabButtonTextInactive: {
    color: '#64748B',
  },
  clearDoneButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearDoneText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 44,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default HomeScreen;