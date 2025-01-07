import { AutoImage } from "app/components";
import { colors, spacing } from "app/theme";
import React, { FC } from "react";
import { ImageStyle, View, ViewStyle } from "react-native";
export interface ResearcherPictureProps {
    picture: string;
}

export const ResearcherPicture: FC<ResearcherPictureProps> = ({ picture }) => (
    <View style={$imageContainer}>
      <AutoImage
        source={{ uri: picture }}
        maxWidth={150}
        maxHeight={150}
        style={$profileImage}
      />
  </View>

);
const $imageContainer: ViewStyle = {
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    backgroundColor: colors.palette.brandingWhite,
    borderRadius: 75,
    width: 150,
    height: 150,
    shadowColor: colors.palette.brandingDarkerBlue,
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  };
  
  const $profileImage: ImageStyle = {
    borderRadius: 75,
    width: 150,
    height: 150,
    borderWidth: 3,
    borderColor: colors.palette.brandingMediumPink,
    backgroundColor: colors.palette.brandingWhite,
  };