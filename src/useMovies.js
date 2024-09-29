import {useEffect, useState} from "react";

export default function useMovies(query,callback) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        callback?.();
        const controller = new AbortController();

        async function fetchMovies() {
            try {
                setIsLoading(true);
                setError("")
                const res = await fetch(`http://www.omdbapi.com/?apikey=cf17a28f&s=${query}`, {signal: controller.signal})
                if (!res.ok) throw new Error("Failed to fetch movies");
                const data = await res.json();
                if (data.Response === 'False') throw new Error(" movies not found");
                setMovies(data.Search)
                setError("")
            } catch (err) {
                if (err.name !== "AbortError")
                    console.log(err.message);
                setError(err.message)
            } finally {
                setIsLoading(false);

            }
        }

        if (query.length < 3) {
            setMovies([])
            setError('')
            return;
        }


        fetchMovies()
        return function () {
            controller.abort()
        }

    }, [query])

return{error, movies,isLoading}
}