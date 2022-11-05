import { useState, useEffect } from "react";

const baseUrl = "https://api.themoviedb.org/3";

export async function getData(type, action, { query, year, genre, id }, page, session, api) {
    let g = genre !== undefined ? `&with_genres=${genre}` : "";
    let y = year === undefined ? "" : type === "movie" ? `&primary_release_year=${year?.id}` : type === "tv" ? `&first_air_date_year=${year?.id}` : "";
    // in case I want to add pagination in the future:
    let p = page ? page : 1;

    const formatParams = {
        all: {
            search: `${baseUrl}/search/multi?api_key=${api}&query=${query}&language=en-US&page=${p}`,
            session: `${baseUrl}/authentication/guest_session/new?api_key=${api}`,
        },
        tv: {
            trending: `${baseUrl}/trending/tv/week?api_key=${api}&language=en-US&page=${p}`,
            genres: `${baseUrl}/genre/tv/list?api_key=${api}&language=en-US`,
            genreYear: `${baseUrl}/discover/tv?api_key=${api + g + y}&sort_by=popularity.desc&language=en-US&page=${p}`,
            details: `${baseUrl}/tv/${id}?api_key=${api}&language=en-US&page=${p}`,
            reviews: `${baseUrl}/tv/${id}/reviews?api_key=${api}&language=en-US&page=${p}`,
            cast: `${baseUrl}/tv/${id}/credits?api_key=${api}&language=en-US&page=${p}`,
            rate: `${baseUrl}/tv/${id}/rating?api_key=${api}&guest_session_id=${session}`,
        },
        movie: {
            trending: `${baseUrl}/trending/movie/week?api_key=${api}&language=en-US&page=${p}`,
            genres: `${baseUrl}/genre/movie/list?api_key=${api}&language=en-US`,
            genreYear: `${baseUrl}/discover/movie?api_key=${api + g + y}&sort_by=popularity.desc&language=en-US&page=${p}`,
            details: `${baseUrl}/movie/${id}?api_key=${api}&language=en-US&page=${p}`,
            reviews: `${baseUrl}/movie/${id}/reviews?api_key=${api}&language=en-US&page=${p}`,
            cast: `${baseUrl}/movie/${id}/credits?api_key=${api}&language=en-US&page=${p}`,
            rate: `${baseUrl}/movie/${id}/rating?api_key=${api}&guest_session_id=${session}`,
        },
    };

    const params = formatParams[type][action];
    const response = !session
        ? await fetch(params)
        : await fetch(params, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json;charset=utf-8",
              },
              body: JSON.stringify(query),
          });
    const data = await response.json();

    return data;
}

export default function useData(type, action, { query, year, genre, id }, page, session, api) {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData(type, action, { query, year, genre, id }, page, session, api)
            .then(res => {
                // this can be improved in the future with a switch statement
                if (["genres", "details", "cast", "session"].includes(action)) {
                    if (["details", "session"].includes(action)) {
                        setData(res);
                    } else {
                        setData(res[action]);
                    }
                } else {
                    setData(res.results);
                }
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, []);

    return { loading, error, data };
}
