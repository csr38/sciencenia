import { Text, DetailItem } from "app/components";
import React, { FC } from "react";
import { TextStyle, View} from "react-native";

interface IncentiveBudgetDetailProps {
    totalBudget: {
        BachelorDegree:number;
        Doctorate:number;
        MasterDegree: number;
    };
    usedBudget: {
        BachelorDegree:number;
        Doctorate:number;
        MasterDegree: number;
    };
    textStyle: TextStyle;
    subtitleStyle: TextStyle;
}

export const IncentiveBudgetDetail: FC<IncentiveBudgetDetailProps> = ({ totalBudget , usedBudget, textStyle, subtitleStyle }) => {
    const calculateRemainingBudget = () => {
      return {
        BachelorDegree: Math.max(
          0,
          (totalBudget.BachelorDegree || 0) - (usedBudget.BachelorDegree || 0)
        ),
        Doctorate: Math.max(
          0,
          (totalBudget.Doctorate || 0) - (usedBudget.Doctorate || 0)
        ),
        MasterDegree: Math.max(
          0,
          (totalBudget.MasterDegree || 0) - (usedBudget.MasterDegree || 0)
        ),
      };
    };
  
    const remainingBudget = calculateRemainingBudget();
  return (
    <View >
      <Text style={subtitleStyle} text="Fondos disponibles:"/>
      <DetailItem label="Pregrado" value={remainingBudget.BachelorDegree} />
      <DetailItem label="Doctorado" value={remainingBudget.Doctorate} />
      <DetailItem label="Magíster" value={remainingBudget.MasterDegree} />
    </View>
  );
};

