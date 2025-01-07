import React, { FC, useCallback, useState } from "react"
import { View, FlatList, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { Text, TextField, Screen } from "app/components"
import { ObservatoryStackScreenProps } from "app/navigators/ObservatoryStack"
import { colors, spacing, typography } from "../theme"
import Toast from "react-native-toast-message"
import { useHeader } from 'app/utils/useHeader'
import { LoadingIndicator } from '../components/LoadingIndicator'
import { api } from "app/services/api"
import { Research } from "app/services/api/api.types";
import { useFocusEffect } from "@react-navigation/native"

interface ObservatoryScreenProps extends ObservatoryStackScreenProps<"ObservatoryView"> {}

export const ObservatoryScreen: FC<ObservatoryScreenProps> = (_props) => {
  const [searchQuery, setSearchQuery] = useState("")
  
  const [allData, setAllData] = useState<Research[]>([])
  const [filteredData, setFilteredData] = useState<Research[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useHeader({ title: "Observatorio" }, [])

  const fetchData = async () => {
    try {
      const response = await api.searchResearchOnAnyField(currentPage, searchQuery);

      if ("kind" in response) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No se pudieron cargar los datos.",
        })
        return
      } else {
        if (response.data && response.ok) {
          setAllData(response.data.data)  
          setFilteredData(response.data.data)
          setTotalPages(response.data.pages) 
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudieron cargar los datos.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    
    useCallback(() => {
      fetchData();
    }, [currentPage, searchQuery])
  );

  const handleSearch = async (query: string) => {
    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);
    setCurrentPage(1);
    fetchData();
  };

  const renderPaginationNavigator = () => (
    <View style={$paginationNavigator}>
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
      >
        <Text style={currentPage === 1 ? $disabledArrow : $arrow}>{"<"}</Text>
      </TouchableOpacity>

      <Text style={$currentPageText}>{currentPage}</Text>

      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
      >
        <Text style={currentPage === totalPages ? $disabledArrow : $arrow}>{">"}</Text>
      </TouchableOpacity>
    </View>
  )

  const renderResearchItem = ({ item }: { item: Research }) => {
    const authorsString = item.authors && Array.isArray(item.authors) 
      ? item.authors.map(author => { const [lastName, firstName] = author.split(", "); 
      return `${firstName} ${lastName}`; }).join(", ") : "Sin autores";

    const researchLinesString = item.researchLines && Array.isArray(item.researchLines)
      ? item.researchLines.join(", ") : "Sin líneas de investigación asignadas";
    
    return (
      <TouchableOpacity
        style={$item}
        onPress={() => _props.navigation.navigate("ResearchView", { id: item.id })}
      >
        <Text preset="bold" style={$title}>{item.title}</Text>
        <Text style={$researchlines}>Línea(s) de investigación: {researchLinesString}</Text>
        <Text style={$author}>Autor(es): {authorsString}</Text>
        <Text style={$yearPublished}>Año: {item.yearPublished}</Text>
      </TouchableOpacity>
    )
  }

  if (isLoading) {
    return (
      <LoadingIndicator />
    )
  }

  return (
    <Screen style={$container}>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderResearchItem}
        ListEmptyComponent={<Text style={$emptyText}>No se encontraron resultados</Text>}
        contentContainerStyle={$listContainer}
        ListFooterComponent={renderPaginationNavigator}
      />
      <View style={$fixedSearchContainer}>
        <TextField
          textBackgroundColor={colors.palette.brandingWhite}
          style={$searchInput}
          containerStyle={$inputContainer}
          inputWrapperStyle={$inputWrapperStyle}
          placeholder="Buscar por título, año, autor o DOI ..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
    </Screen>
  )
}

const $inputContainer: ViewStyle = {
  paddingHorizontal: spacing.sm,
  borderRadius: spacing.md,
  paddingVertical: spacing.xxs,
}

const $inputWrapperStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-start",
  borderWidth: 2,
  borderRadius: 8,
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.palette.brandingLightPink,
  overflow: "hidden",
}

const $container: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
}

const $listContainer: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
  flexGrow: 1,
  paddingBottom: 90,
  minHeight: "100%",
}

const $fixedSearchContainer: ViewStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: spacing.sm,
  backgroundColor: colors.palette.neutral100,
  borderTopWidth: 1,
  borderColor: colors.palette.brandingLightPink,
}

const $searchInput: ViewStyle = {
  height: 32,
  backgroundColor: colors.palette.brandingWhite,
  marginBottom: 0,
}

const $item: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.brandingWhite,
  padding: spacing.md,
  marginBottom: spacing.sm,
  borderRadius: spacing.xs,
  shadowColor: colors.palette.brandingBlack,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 2,
}

const $title: TextStyle = {
  fontSize: 16,
  marginBottom: spacing.xs,
  color: colors.palette.brandingPink,
}

const $author: TextStyle = {
  fontSize: 14,
  color: colors.palette.brandingDarkerBlue,
  marginTop: spacing.xxs,
}

const $researchlines: TextStyle = {
  fontSize: 14,
  color: colors.palette.brandingDarkerBlue,
}

const $emptyText: TextStyle = {
  textAlign: "center",
  color: colors.palette.neutral600,
  marginTop: spacing.md,
}

const $yearPublished: TextStyle = {
  fontSize: 12,
  color: colors.palette.neutral500,
  marginTop: spacing.xxs,
}

const $paginationNavigator: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.palette.neutral100,
}

const $arrow: TextStyle = {
  fontSize: 22,
  color: colors.palette.brandingPink,
  paddingHorizontal: spacing.sm,
  fontFamily: typography.primary.bold,
}

const $disabledArrow: TextStyle = {
  ...$arrow,
  color: colors.palette.neutral400,  
}

const $currentPageText: TextStyle = {
  fontSize: 18,
  color: colors.palette.brandingBlack,
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.xxs,
}



