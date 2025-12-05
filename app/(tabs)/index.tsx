import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { router } from "expo-router";


const { width, height } = Dimensions.get('window');

// Icon Components
const WindIcon = () => (
  <Svg width={56} height={56} viewBox="0 0 24 24" stroke="white" strokeWidth={2} fill="none">
    <Path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </Svg>
);

const MapPinIcon = () => (
  <Svg width={56} height={56} viewBox="0 0 24 24" stroke="white" strokeWidth={2} fill="none">
    <Path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <Path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </Svg>
);

const ShieldIcon = () => (
  <Svg width={56} height={56} viewBox="0 0 24 24" stroke="white" strokeWidth={2} fill="none">
    <Path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </Svg>
);

const TrendingIcon = () => (
  <Svg width={56} height={56} viewBox="0 0 24 24" stroke="white" strokeWidth={2} fill="none">
    <Path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </Svg>
);

const HeartIcon = () => (
  <Svg width={56} height={56} viewBox="0 0 24 24" stroke="white" strokeWidth={2} fill="none">
    <Path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </Svg>
);

interface WelcomeScreenProps {
  navigation: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <WindIcon />,
      title: "SafeUrLungs",
      subtitle: "Your Smart Air Quality Companion",
      description: "Discover safe running locations based on real-time air quality data. Make informed decisions for healthier outdoor activities.",
      colors: ['#3B82F6', '#22D3EE'] as [string, string]
    },
    {
      icon: <MapPinIcon />,
      title: "Interactive Air Quality Map",
      subtitle: "Real-Time Monitoring",
      description: "View air quality data across your city with our interactive map. Color-coded zones help you identify safe areas instantly.",
      colors: ['#10B981', '#34D399'] as [string, string]
    },
    {
      icon: <ShieldIcon />,
      title: "Health Protection",
      subtitle: "Prevent Respiratory Risks",
      description: "According to WHO and EPA research, exercising in poor air quality increases respiratory disease risk by 20-30%. We help you stay safe.",
      colors: ['#A855F7', '#EC4899'] as [string, string]
    },
    {
      icon: <TrendingIcon />,
      title: "AQI Classification System",
      subtitle: "Understand Air Quality Levels",
      description: "From 'Excellent' to 'Hazardous' - our 5-level classification system provides clear guidance on when and where it's safe to exercise outdoors.",
      colors: ['#F97316', '#EF4444'] as [string, string]
    },
    {
      icon: <HeartIcon />,
      title: "Optimize Your Workout",
      subtitle: "Exercise Smarter, Not Harder",
      description: "Clean air increases endorphin production and lung capacity. Choose the right time and place to maximize your workout benefits.",
      colors: ['#F43F5E', '#EC4899'] as [string, string]
    }
  ];

  const aqiLevels = [
    { name: "Excellent", color: "#16A34A", range: "0-50", icon: "😊" },
    { name: "Good", color: "#4ADE80", range: "51-100", icon: "🙂" },
    { name: "Moderate", color: "#FACC15", range: "101-150", icon: "😐" },
    { name: "Unhealthy", color: "#F97316", range: "151-200", icon: "😷" },
    { name: "Hazardous", color: "#DC2626", range: "201+", icon: "⚠️" }
  ];

  const facts = [
    "Air pollution can reduce lung capacity by up to 10% during exercise",
    "People exercising in poor air quality are 2x more likely to develop asthma",
    "80% of urban pollution comes from vehicles - dangerous while running"
  ];

const handleNext = () => {
  if (currentSlide < slides.length - 1) {
    setCurrentSlide(currentSlide + 1);
  } else {
    // Navigasi ke mapwebview tab menggunakan Expo Router
    router.push('/(tabs)/mapwebview');
  }
};

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            {/* Main Slide Area */}
            <LinearGradient
              colors={slides[currentSlide].colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.slideContainer}
            >
              <View style={styles.slideContent}>
                <View style={styles.iconContainer}>
                  {slides[currentSlide].icon}
                </View>
                
                <Text style={styles.title}>{slides[currentSlide].title}</Text>
                <Text style={styles.subtitle}>{slides[currentSlide].subtitle}</Text>
                <Text style={styles.description}>{slides[currentSlide].description}</Text>
              </View>
            </LinearGradient>

            {/* Dots Indicator */}
            <View style={styles.dotsContainer}>
              {slides.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentSlide(index)}
                  style={[
                    styles.dot,
                    index === currentSlide ? styles.dotActive : styles.dotInactive
                  ]}
                />
              ))}
            </View>

            {/* AQI Quick Reference - Slide 4 */}
            {currentSlide === 3 && (
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Quick AQI Reference</Text>
                {aqiLevels.map((level, index) => (
                  <View key={index} style={styles.aqiRow}>
                    <View style={[styles.aqiBox, { backgroundColor: level.color }]}>
                      <Text style={styles.aqiRange}>{level.range}</Text>
                    </View>
                    <Text style={styles.aqiName}>{level.name}</Text>
                    <Text style={styles.aqiIcon}>{level.icon}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Key Facts - Slide 5 */}
            {currentSlide === 4 && (
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Health Benefits</Text>
                {facts.map((fact, index) => (
                  <View key={index} style={styles.factRow}>
                    <Text style={styles.factBullet}>•</Text>
                    <Text style={styles.factText}>{fact}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
              {currentSlide > 0 && (
                <TouchableOpacity
                  onPress={handlePrev}
                  style={styles.buttonBack}
                  activeOpacity={0.7}
                >
                  <Text style={styles.buttonBackText}>Back</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                onPress={handleNext}
                style={[
                  styles.buttonNext,
                  currentSlide === 0 && styles.buttonNextFull
                ]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={currentSlide === slides.length - 1 ? ['#2563EB', '#06B6D4'] : ['#3B82F6', '#22D3EE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonNextText}>
                    {currentSlide === slides.length - 1 ? 'Get Started ✨' : 'Next →'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Built with React Native & Expo</Text>
              <Text style={styles.footerSubtext}>Data powered by WHO & EPA standards</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 90 : 80,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: height - 100,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    marginVertical: 8,
  },
  slideContainer: {
    height: Math.min(380, height * 0.5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 14,
    opacity: 0.95,
  },
  description: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.95,
    maxWidth: 320,
    paddingHorizontal: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 32,
    backgroundColor: '#3B82F6',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#D1D5DB',
  },
  infoSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  aqiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  aqiBox: {
    width: 52,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aqiRange: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  aqiName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  aqiIcon: {
    fontSize: 22,
  },
  factRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
    paddingRight: 4,
  },
  factBullet: {
    color: '#F43F5E',
    fontSize: 14,
    marginTop: 2,
  },
  factText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  buttonBack: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBackText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonNext: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonNextFull: {
    flex: 1,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonNextText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
});