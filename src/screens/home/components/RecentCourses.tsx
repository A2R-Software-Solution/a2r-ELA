/**
 * Recent Courses Component
 * Displays horizontal scrollable list of recent courses
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { CourseUiModel } from '../../../models/ui/CourseUiModel';

interface RecentCoursesProps {
  courses: CourseUiModel[];
  onCourseClick?: (course: CourseUiModel) => void;
}

const RecentCourses: React.FC<RecentCoursesProps> = ({
  courses,
  onCourseClick = () => {},
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recents</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {courses.map((course) => (
          <RecentCourseCard
            key={course.id}
            course={course}
            onPress={() => onCourseClick(course)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

interface RecentCourseCardProps {
  course: CourseUiModel;
  onPress: () => void;
}

const RecentCourseCard: React.FC<RecentCourseCardProps> = ({ course, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {course.title}
        </Text>

        <View style={styles.spacer} />

        <View style={styles.footer}>
          <Text style={styles.category}>{course.category}</Text>
          {course.progress > 0 && (
            <Text style={styles.progress}>{course.progress}%</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 200,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  spacer: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: '#666666',
  },
  progress: {
    fontSize: 12,
    color: '#7D55FF',
    fontWeight: '500',
  },
});

export default RecentCourses;