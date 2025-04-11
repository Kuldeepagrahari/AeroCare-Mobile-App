import { Platform, View, Text } from "react-native"

// Create a mapping of icon names to components
const IconComponents = {}

// Only import Lucide icons on supported platforms
if (Platform.OS !== "web") {
  try {
    // Use dynamic require to prevent web bundling issues
    const LucideIcons = require("lucide-react-native")

    // Map all the icons we need
    const iconNames = [
      "Home",
      "Activity",
      "MapPin",
      "User",
      "ArrowLeft",
      "MoreVertical",
      "Battery",
      "Globe",
      "Wind",
      "Clock",
      "Navigation2",
      "ChevronRight",
    ]

    iconNames.forEach((iconName : any) => {
      IconComponents[iconName] = LucideIcons[iconName]
    })
  } catch (error) {
    console.warn("Failed to load lucide-react-native:", error)
  }
}

// Create a safe icon component that works on all platforms
export const SafeIcon = ({ name, size = 24, color = "#000", ...props }:any) => {
  // If we have the icon component, use it
  if (IconComponents[name]) {
    const IconComponent = IconComponents[name]
    return <IconComponent size={size} color={color} {...props} />
  }

  // Fallback for web or when icon is not found
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: color,
        borderRadius: size / 4,
      }}
    >
      <Text style={{ color, fontSize: size / 3 }}>{name[0]}</Text>
    </View>
  )
}

// Export individual icon components for convenience
export const Home = (props) => <SafeIcon name="Home" {...props} />
export const Activity = (props) => <SafeIcon name="Activity" {...props} />
export const MapPin = (props) => <SafeIcon name="MapPin" {...props} />
export const User = (props) => <SafeIcon name="User" {...props} />
export const ArrowLeft = (props) => <SafeIcon name="ArrowLeft" {...props} />
export const MoreVertical = (props) => <SafeIcon name="MoreVertical" {...props} />
export const Battery = (props) => <SafeIcon name="Battery" {...props} />
export const Globe = (props) => <SafeIcon name="Globe" {...props} />
export const Wind = (props) => <SafeIcon name="Wind" {...props} />
export const Clock = (props) => <SafeIcon name="Clock" {...props} />
export const Navigation2 = (props) => <SafeIcon name="Navigation2" {...props} />
export const ChevronRight = (props) => <SafeIcon name="ChevronRight" {...props} />
