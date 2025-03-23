import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Linking,
  ActivityIndicator,
  ViewStyle,
  ImageStyle,
  TextStyle
} from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import COLORS from '@/constants/colors';
import { SmallText } from './common/AppText';

const { width } = Dimensions.get('window');

export interface Advertisement {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  linkType: 'screen' | 'url';
  link: string; // screen path or URL
  brandName?: string;
  backgroundColor?: string;
}

interface AdvertisementBannerProps {
  advertisements: Advertisement[];
  autoScroll?: boolean;
  scrollInterval?: number; // in milliseconds
  showIndicator?: boolean;
  height?: number;
  width?: number;
  borderRadius?: number;
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  indicatorContainerStyle?: ViewStyle;
  activeIndicatorStyle?: ViewStyle;
  inactiveIndicatorStyle?: ViewStyle;
}

export const AdvertisementBanner: React.FC<AdvertisementBannerProps> = ({
  advertisements,
  autoScroll = true,
  scrollInterval = 3000,
  showIndicator = true,
  height = 150,
  width: customWidth,
  borderRadius = 12,
  containerStyle,
  imageStyle,
  titleStyle,
  descriptionStyle,
  indicatorContainerStyle,
  activeIndicatorStyle,
  inactiveIndicatorStyle
}) => {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const bannerWidth = customWidth || width - 40; // Default to screen width minus padding

  // Handle auto-scrolling
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    
    if (autoScroll && advertisements.length > 1) {
      scrollTimer = setInterval(() => {
        const nextIndex = (currentIndex + 1) % advertisements.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true
        });
        setCurrentIndex(nextIndex);
      }, scrollInterval);
    }
    
    return () => {
      if (scrollTimer) {
        clearInterval(scrollTimer);
      }
    };
  }, [currentIndex, autoScroll, scrollInterval, advertisements.length]);

  // Handle advertisement click
  const handleAdvertisementPress = async (ad: Advertisement) => {
    if (ad.linkType === 'screen') {
    //   router.push(`/${ad.link}`);
    } else if (ad.linkType === 'url') {
      try {
        // Open URL in browser
        await WebBrowser.openBrowserAsync(ad.link);
      } catch (error) {
        console.error('Error opening URL:', error);
        // Fallback to Linking API
        const supported = await Linking.canOpenURL(ad.link);
        if (supported) {
          await Linking.openURL(ad.link);
        } else {
          console.error(`Cannot open URL: ${ad.link}`);
        }
      }
    }
  };

  // Handle image load start
  const handleLoadStart = (id: string) => {
    setLoading(prev => ({ ...prev, [id]: true }));
  };

  // Handle image load end
  const handleLoadEnd = (id: string) => {
    setLoading(prev => ({ ...prev, [id]: false }));
  };

  // Handle scroll end
  const handleScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / bannerWidth);
    setCurrentIndex(index);
  };

  // Render advertisement item
  const renderItem = ({ item }: { item: Advertisement }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleAdvertisementPress(item)}
      style={[
        styles.itemContainer,
        {
          width: bannerWidth,
          height,
          borderRadius,
          backgroundColor: item.backgroundColor || '#F5F5F5'
        }
      ]}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={[
          styles.image,
          {
            width: bannerWidth,
            height,
            borderRadius
          },
          imageStyle
        ]}
        resizeMode="cover"
        onLoadStart={() => handleLoadStart(item.id)}
        onLoadEnd={() => handleLoadEnd(item.id)}
      />
      
      {loading[item.id] && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
      
      {/* {(item.title || item.description) && (
        <View style={styles.textOverlay}>
          {item.title && (
            <SmallText style={[styles.title, titleStyle]}>
              {item.title}
            </SmallText>
          )}
          {item.description && (
            <SmallText style={[styles.description, descriptionStyle]}>
              {item.description}
            </SmallText>
          )}
          {item.brandName && (
            <View style={styles.brandContainer}>
              <SmallText style={styles.brandText}>
                Ad by {item.brandName}
              </SmallText>
            </View>
          )}
        </View>
      )} */}
    </TouchableOpacity>
  );

  // Render pagination indicators
  const renderIndicators = () => {
    if (!showIndicator || advertisements.length <= 1) return null;
    
    return (
      <View style={[styles.indicatorContainer, indicatorContainerStyle]}>
        {advertisements.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex
                ? [styles.activeIndicator, activeIndicatorStyle]
                : [styles.inactiveIndicator, inactiveIndicatorStyle]
            ]}
          />
        ))}
      </View>
    );
  };

  // If no advertisements, return null
  if (!advertisements || advertisements.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        ref={flatListRef}
        data={advertisements}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        snapToInterval={bannerWidth}
        decelerationRate="fast"
        snapToAlignment="center"
      />
      {/* {renderIndicators()} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  itemContainer: {
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  brandContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: COLORS.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  inactiveIndicator: {
    backgroundColor: '#CCCCCC',
  },
});