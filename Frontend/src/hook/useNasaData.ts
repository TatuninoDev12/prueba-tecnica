import { usePaginationStore } from "@/store/PaginationStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
const Nasa_API_KEY = import.meta.env.VITE_API_KEY;

const fetchData = async (page: number, limit: number) => {
    try {
        const response = await fetch(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&amp&api_key=${Nasa_API_KEY}&page=${page}&per_page=${limit}`
        );
        if (!response.ok) Swal.fire({ icon: "error", title: "HTTP error!", text: `HTTP error! status: ${response.status}` });

        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch data from NASA API.",
        });
        throw error;
    }

}

export const useNasaData = (page: number, limit: number) => {
    return useInfiniteQuery({
        queryKey: ["nasaData pagina: ", page],
        queryFn: ({ pageParam }) => fetchData(pageParam, limit),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.photos.length === 12 ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: Infinity,
    });
}