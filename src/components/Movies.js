import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Card, Button, FormControl } from "react-bootstrap";
import FilterDropdown from "./FilterDropdown";
import { getData } from "./../api/data";
import useData from "./../api/data";
import Movie from "./Movie";

const baseImageUrl = "https://image.tmdb.org/t/p/original/";

const Movies = ({ session, api }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const [genre, setGenre] = useState({});
    const [year, setYear] = useState({});
    const [type, setType] = useState({ name: "TV shows", id: "tv" });
    const [query, setQuery] = useState("");
    const [movieId, setMovieId] = useState(null);
    const genres = useData(type.id, "genres", {}, 1, null, api);
    const trending = useData(type.id, "trending", {}, 1, null, api);

    useEffect(() => {
        // default load
        setLoading(true);
        if (tags.length < 1 && genres.data?.length > 0) {
            setTags(genres.data);
        }
        setLoading(false);
    }, [genres]);

    useEffect(() => {
        // default load
        setLoading(true);
        if (data.length < 1 && trending.data?.length > 0) {
            setData(trending.data);
        }
        setLoading(false);
    }, [trending]);

    const filterContent = () => {
        setLoading(true);
        getData(type.id, "genreYear", { year: year, genre: genre.id }, 1, null, api)
            .then(res => setData(res.results))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
        getData(type.id, "genres", { year: year, genre: genre.id }, 1, null, api)
            .then(res => {
                setTags(res.genres);
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    };

    const renderTabNav = () => {
        // Could add some tabs here, split Movies and TV shows in separate spaces
        let list = [{ name: "Catalogue", slug: "catalogue", id: 0 }];
        return (
            <React.Fragment>
                <div className="tabNav">
                    {list.map((item, index) => {
                        return (
                            <div aria-label={item.name} className={"tabItem active"} key={index} data-id={item.id}>
                                <span>
                                    <img alt={item.name} src={"/svg/" + item.slug + ".svg"} />
                                </span>
                                {item.name}
                            </div>
                        );
                    })}
                </div>
            </React.Fragment>
        );
    };

    const renderFilterOptions = tags => {
        let createYearsList = () => {
            let today = new Date().getFullYear();
            let list = Array(100)
                .fill()
                .map((_, i) => {
                    return { id: today - i, name: today - i };
                });
            return list;
        };
        let years = createYearsList();
        return (
            <React.Fragment>
                <Col md={7} sm={12} xs={12} className="filtersCol">
                    <FilterDropdown
                        name="type"
                        active={type}
                        options={[
                            { id: "tv", name: "TV shows" },
                            { id: "movie", name: "Movies" },
                        ]}
                        setFilter={setType}
                    />
                    <FilterDropdown name="genre" active={genre} options={tags} setFilter={setGenre} />
                    <FilterDropdown name="year" search active={year} options={years} setFilter={setYear} />
                </Col>
            </React.Fragment>
        );
    };

    if (loading) {
        return (
            <div className="loading">
                <Spinner animation="grow" />
            </div>
        );
    }
    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <Row className="content">
            <Col sm={6} className="contentHeader">
                <h1>≧◔◡◔≦﻿</h1>
            </Col>
            <Col sm={6}>
                {/* Might implement this at some point */}
                {/* <FormControl value={query} className="searchBar" type="text" placeholder="Search..." onChange={e => setQuery(e.target.value)} /> */}
            </Col>
            <Col sm={12} className="tabbed">
                {renderTabNav()}
            </Col>
            <Row className="mainContent">
                {movieId === null && (
                    <Col sm={12} lg={3} className="leftMenu">
                        <h3>Filters</h3>
                        <div className="filterOptions">{renderFilterOptions(tags)}</div>
                        <Button onClick={() => filterContent()}>Filter content</Button>
                    </Col>
                )}
                {movieId !== null ? (
                    <Movie session={session} api={api} type={type} id={movieId} goBack={() => setMovieId(null)} />
                ) : (
                    <Col sm={12} lg={9}>
                        <Row className="results">
                            <h2>Uuuh, trending fishies! Yummy!</h2>
                            {data.length < 1 ? (
                                <p>No data yet... ¯\\_(ツ)_/¯"</p>
                            ) : (
                                data.map(item => {
                                    const ratingText = item.vote_average.toString().slice(0, 3).replace(/\./g, "");
                                    const rating = ratingText.length === 1 ? ratingText + 0 : ratingText;
                                    return (
                                        <Col sm={12} md={6} lg={4} key={item.id} onClick={() => setMovieId(item.id)}>
                                            <Card className="movieCard">
                                                {item.poster_path ? (
                                                    <img className="card-img" loading="lazy" src={baseImageUrl + item.poster_path} alt={item.name} />
                                                ) : (
                                                    <div className="card-img placeholder">¯\\_(ツ)_/¯</div>
                                                )}
                                                <Card.Title>{item.name ? item.name : item.title}</Card.Title>
                                                <span className="movieRating" style={{ "--p": rating, "--b": "3px", "--c": "#199BB5" }}>
                                                    {item.vote_average.toString().slice(0, 3)}
                                                </span>
                                                <Button>View details</Button>
                                            </Card>
                                        </Col>
                                    );
                                })
                            )}
                        </Row>
                    </Col>
                )}
            </Row>
        </Row>
    );
};

export default Movies;
