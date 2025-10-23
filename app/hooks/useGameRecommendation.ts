import { useQuery } from "@tanstack/react-query";
import { gameApi } from "../services/gameapi.service";

export function useGameRecommendation(filters: any) {
    return useQuery({
        queryKey: ['games', filters],
        queryFn: () => gameApi.getRecommendations(filters),
        enabled: !!filters,
    });
}