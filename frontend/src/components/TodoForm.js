import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CATEGORIES = [
  { label: 'General', color: '#64748B' },
  { label: 'Urgent', color: '#EF4444' },
  { label: 'Work', color: '#6366F1' },
  { label: 'Personal', color: '#F59E0B' },
];

const TodoForm = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');

 const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd(text.trim(), selectedCategory);
    setText('');
  };

  return (
    <View style={styles.card}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          placeholderTextColor="#94A3B8"
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
          onPress={handleSubmit}
          disabled={!text.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Justified full-width category buttons */}
      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.label;
          return (
            <TouchableOpacity
              key={cat.label}
              style={[
                styles.categoryChip,
                isSelected && { backgroundColor: cat.color, borderColor: cat.color },
              ]}
              onPress={() => setSelectedCategory(cat.label)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isSelected && styles.categoryChipTextActive,
                ]}
                numberOfLines={1}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 3,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: '#0F172A',
  },
  addButton: {
    backgroundColor: '#2563EB',
    borderRadius: 9,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    gap: 8,
  },
  categoryChip: {
    flex: 1, // Distributes all 4 buttons equally across the full width
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
});

export default TodoForm;