import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { Text } from 'app/components';
import { colors, spacing, typography } from "app/theme";

interface ApplicationContainerProps {
    title: string; 
    status: string; 
    children: React.ReactNode;
}

export const ApplicationContainer: React.FC<ApplicationContainerProps> = ({ title, children, status }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Aprobado':
                return colors.palette.acceptedGreen;
            case 'Aprobada':
                    return colors.palette.acceptedGreen;
            case 'Rechazada':
                return colors.palette.rejectedRed;
            case 'Pendiente':
                return colors.palette.pendingYellow;
            default:
                return colors.palette.brandingGray;
        }
    };

    return (
        <View style={$container}>
            <View style={$statusContainer}>
                <Text style={$applicationTitle}>{title}</Text>
                <Text style={[$statusText, { backgroundColor: getStatusColor(status) }]}>
                    {status}
                </Text>
            </View>
            <View >
                {children}
            </View>
        </View>
    );
};

const $applicationTitle: TextStyle = {
    color: colors.palette.brandingBlack,
    fontFamily: typography.primary.bold,
    fontSize: 20,
    marginBottom: spacing.xs,
    maxWidth: "80%",
};

const $container: ViewStyle = {
    backgroundColor: colors.palette.brandingWhite,
    borderRadius: 10,
    display: "flex",
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 15,
    padding: 20,
    paddingHorizontal: 25,
    position: "relative",
    shadowColor: colors.palette.brandingBlack,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
};

const $statusContainer: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
};

const $statusText: TextStyle = {
    borderRadius: 16,
    color: colors.palette.brandingWhite,
    fontFamily: typography.primary.bold,
    fontSize: 12,
    height: 30,
    lineHeight: 30,
    overflow: "hidden",
    paddingEnd: 10,
    paddingStart: 10,
    textAlign: "center",
};
