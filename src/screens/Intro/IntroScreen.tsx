import { styles } from './IntroScreen.styles';
import ScreenBackground from '../../components/ScreenBackground';

/**
 * Intro Screen
 * Onboarding screens with swipe navigation
 */

import React, { useState, useRef } from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import PreferencesManager from '../../utils/PreferencesManager';

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
  const { width } = useWindowDimensions();
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
    <View style={[styles.page, { width }]}>
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
      <ScreenBackground />
      <FlatList
        key={width}
        initialScrollIndex={currentPage}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
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

export default IntroScreen;
