import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, Zap, Search, Settings } from "lucide-react-native";
import { useApp } from "@/contexts/AppContext";

export default function HomeScreen() {
  const { navigateToScreen, coachingStyle } = useApp();
  const insets = useSafeAreaInsets();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const ActionCard = ({
    icon: Icon,
    title,
    description,
    extra,
    onPress,
    delay = 0,
    isPrimary = false,
  }: {
    icon: any;
    title: string;
    description: string | React.ReactNode;
    extra?: React.ReactNode;
    onPress: () => void;
    delay?: number;
    isPrimary?: boolean;
  }) => {
    const cardFadeAnim = React.useRef(new Animated.Value(0)).current;
    const cardSlideAnim = React.useRef(new Animated.Value(20)).current;

    React.useEffect(() => {
      Animated.parallel([
        Animated.timing(cardFadeAnim, {
          toValue: 1,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(cardSlideAnim, {
          toValue: 0,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    }, [cardFadeAnim, cardSlideAnim, delay]);

    return (
      <Animated.View
        style={{
          opacity: cardFadeAnim,
          transform: [{ translateY: cardSlideAnim }],
        }}
      >
        <TouchableOpacity
          style={[styles.actionCard, isPrimary && styles.primaryActionCard]}
          onPress={onPress}
          activeOpacity={0.7}
          testID={`action-${title}`}
        >
          <View
            style={[
              styles.iconContainer,
              isPrimary && styles.primaryIconContainer,
            ]}
          >
            <Icon size={32} color="#fff" strokeWidth={2} />
          </View>
          <View style={styles.cardContent}>
            <Text
              style={[styles.cardTitle, isPrimary && styles.primaryCardTitle]}
            >
              {title}
            </Text>
            {typeof description === "string" ? (
              <Text style={styles.cardDescription}>{description}</Text>
            ) : (
              description
            )}
            {extra && <View style={{ marginTop: 8 }}>{extra}</View>}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}
      >
        <View style={styles.headerSpacer} />
        <Text style={styles.appName}>ふぉっとも</Text>
        <TouchableOpacity
          onPress={() => navigateToScreen("settings")}
          style={styles.settingsButton}
          testID="settings-button"
        >
          <Settings size={24} color="#1a4d2e" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.mascotContainer}>
            <Image
              source={require("@/assets/images/phottomo.jpeg")}
              style={styles.mascotImage}
              resizeMode="cover"
            />
          </View>
        </Animated.View>

        <View style={styles.actionsContainer}>
          <ActionCard
            icon={Zap}
            title="写真アドバイス"
            description="写真をアップロード"
            onPress={() => navigateToScreen("upload")}
            extra={(() => {
              const styleInfo: Record<string, { name: string; emoji: string }> =
                {
                  phottomo: { name: "ふぉっとも君", emoji: "📷" },
                  logical: { name: "ロジカル博士", emoji: "🔬" },
                  supportive: { name: "寄り添いカウンセラー", emoji: "🤝" },
                  spartan: { name: "スパルタ鬼軍曹", emoji: "💪" },
                };
              const s = styleInfo[coachingStyle] || styleInfo.phottomo;
              return (
                <View style={styles.stylePill}>
                  <Text style={styles.stylePillText}>
                    {s.emoji} {s.name} を選択中
                  </Text>
                </View>
              );
            })()}
            delay={100}
            isPrimary={true}
          />

          <ActionCard
            icon={Camera}
            title="カメラ診断"
            description={
              <Text style={styles.cardDescription}>
                最適な<Text style={styles.highlightText}>FUJIFILMカメラ</Text>
                を診断
              </Text>
            }
            onPress={() => navigateToScreen("survey")}
            delay={200}
          />

          <ActionCard
            icon={Search}
            title="レンズを探す"
            description={
              <Text style={styles.cardDescription}>
                最適な<Text style={styles.highlightText}>FUJIFILMレンズ</Text>
                を診断
              </Text>
            }
            onPress={() => navigateToScreen("lensSurvey")}
            delay={300}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7f5",
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e8ebe8",
  },
  appName: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 40,
  },
  stylePill: {
    marginTop: 6,
    alignSelf: "flex-start" as const,
    backgroundColor: "#eef7ee",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0f0e2",
  },
  stylePillText: {
    fontSize: 11,
    color: "#2a3a2a",
  },
  currentStyleWrapper: {
    alignItems: "center" as const,
    marginVertical: 12,
  },
  settingsButton: {
    padding: 8,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginVertical: 24,
  },
  mascotContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#fff",
  },
  mascotImage: {
    width: "100%",
    height: "100%",
  },
  highlightText: {
    fontWeight: "bold",
    color: "#2e7d46",
  },
  mascotEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#5a7c5f",
    letterSpacing: 0.5,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  actionCard: {
    flexDirection: "row" as const,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryActionCard: {
    backgroundColor: "#f0f8f2",
    borderWidth: 2,
    borderColor: "#2e7d46",
    paddingVertical: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#2e7d46",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 16,
  },
  primaryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#1a4d2e",
    marginBottom: 4,
  },
  primaryCardTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  cardDescription: {
    fontSize: 14,
    color: "#5a7c5f",
    lineHeight: 20,
  },
});
