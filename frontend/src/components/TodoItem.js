import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';

const CATEGORY_COLORS = {
  Urgent: { bg: '#FEE2E2', border: '#FECACA', text: '#DC2626', dot: '#EF4444' },
  Work: { bg: '#EEF2FF', border: '#E0E7FF', text: '#4F46E5', dot: '#6366F1' },
  Personal: { bg: '#FEF3C7', border: '#FDE68A', text: '#D97706', dot: '#F59E0B' },
  General: { bg: '#F1F5F9', border: '#E2E8F0', text: '#475569', dot: '#64748B' },
};

const TodoItem = ({ todo, onToggle, onDelete }) => {
  const theme = CATEGORY_COLORS[todo.category] || CATEGORY_COLORS.General;

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(todo.isCompleted ? 1 : 0.8)).current;

  // Card Press In/Out bounce
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  // Checkbox toggle with pop bounce effect
  const handleTogglePress = () => {
    Animated.sequence([
      Animated.timing(checkAnim, {
        toValue: 1.3,
        duration: 120,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(checkAnim, {
        toValue: 1,
        friction: 3,
        tension: 50,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();

    onToggle(todo._id, todo.isCompleted);
  };

  return (
    <Animated.View
      style={[
        styles.card,
        todo.isCompleted && styles.cardCompleted,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      {/* Tap to Toggle */}
      <TouchableOpacity
        style={styles.clickableArea}
        onPress={handleTogglePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Animated.View
          style={[
            styles.checkbox,
            todo.isCompleted && styles.checkboxCompleted,
            { transform: [{ scale: checkAnim }] },
          ]}
        >
          {todo.isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </Animated.View>

        <View style={styles.textContainer}>
          <Text
            style={[styles.title, todo.isCompleted && styles.titleCompleted]}
            numberOfLines={2}
          >
            {todo.title}
          </Text>

          <View style={styles.metaRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: theme.bg, borderColor: theme.border },
              ]}
            >
              <View style={[styles.categoryDot, { backgroundColor: theme.dot }]} />
              <Text style={[styles.categoryText, { color: theme.text }]}>
                {todo.category || 'General'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Delete Action Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(todo._id)}
        activeOpacity={0.6}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardCompleted: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.85,
  },
  clickableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 20,
    flexShrink: 1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default TodoItem;