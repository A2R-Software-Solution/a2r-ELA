/**
 * Intro Screen
 * Onboarding screens with swipe navigation
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import PreferencesManager from '../../utils/PreferencesManager';

const { width } = Dimensions.get('window');

interface IntroScreenProps {
  onGetStarted: () => void;
}

interface IntroPage {
  id: number;
  title?: string;
  subtitle?: string;
  showButton?: boolean;
}

const INTRO_PAGES: IntroPage[] = [
  {
    id: 0,
    title: 'A2R Presents',
  },
  {
    id: 1,
    title: 'ELA',
    subtitle: 'English Language Arts',
  },
  {
    id: 2,
    title: 'Get Started',
    showButton: true,
  },
];

const IntroScreen: React.FC<IntroScreenProps> = ({ onGetStarted }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleGetStarted = async () => {
    try {
      await PreferencesManager.markIntroAsSeen();
      onGetStarted();
    } catch (error) {
      console.error('Error marking intro as seen:', error);
      onGetStarted(); // Navigate anyway
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(contentOffsetX / width);
    setCurrentPage(pageIndex);
  };

  const goToNextPage = () => {
    if (currentPage < INTRO_PAGES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentPage + 1,
        animated: true,
      });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentPage - 1,
        animated: true,
      });
    }
  };

  const renderPage = ({ item }: { item: IntroPage }) => (
    <View style={styles.page}>
      <View style={styles.content}>
        {item.title && (
          <Text style={styles.title}>{item.title}</Text>
        )}
        
        {item.subtitle && (
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        )}

        {item.showButton && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>

      <DotsIndicator
        totalDots={INTRO_PAGES.length}
        selectedIndex={currentPage}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={INTRO_PAGES}
        renderItem={renderPage}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      />

      {/* Debug Controls */}
      <View style={styles.debugControls}>
        <TouchableOpacity onPress={goToPreviousPage}>
          <Text style={styles.debugText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextPage}>
          <Text style={styles.debugText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface DotsIndicatorProps {
  totalDots: number;
  selectedIndex: number;
}

const DotsIndicator: React.FC<DotsIndicatorProps> = ({
  totalDots,
  selectedIndex,
}) => {
  return (
    <View style={styles.dotsContainer}>
      {Array.from({ length: totalDots }).map((_, index) => (
        <Text
          key={index}
          style={[
            styles.dot,
            {
              opacity: index === selectedIndex ? 1 : 0.4,
            },
          ]}
        >
          •
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7D55FF',
  },
  page: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  button: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    fontSize: 22,
    color: '#FFFFFF',
    marginHorizontal: 6,
  },
  debugControls: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  debugText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default IntroScreen;