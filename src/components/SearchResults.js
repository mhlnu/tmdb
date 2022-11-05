import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Card, Button } from "react-bootstrap";
import useData from "./../api/data";
import Movie from "./Movie";

const baseImageUrl = "https://image.tmdb.org/t/p/original/";

const SearchResults = ({ type, movieId, query, api, goBack, setMovie, session }) => {
    const { loading, error, data } = useData("all", "search", { query }, 1, null, api);

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
        <>
            <Col sm={12} className="movieNav search">
                <a className="backBtn" href="#" onClick={() => goBack()}>
                    Back
                </a>
            </Col>
            {movieId ? (
                <Movie session={session} api={api} type={type} id={movieId} goBack={() => setMovieId(null)} />
            ) : (
                <Col sm={12} lg={12}>
                    <Row className="results">
                        <h2>Results for {query}:</h2>
                        {data.length < 1 ? (
                            <p>No results ¯\\_(ツ)_/¯"</p>
                        ) : (
                            data.map(item => {
                                if (["tv", "movie"].includes(item.media_type)) {
                                    const ratingText = item.vote_average.toString().slice(0, 3).replace(/\./g, "");
                                    const rating = ratingText.length === 1 ? ratingText + 0 : ratingText;
                                    const type = item.media_type === "tv" ? { name: "TV shows", id: "tv" } : { name: "Movies", id: "movie" };
                                    return (
                                        <Col sm={12} md={6} lg={3} key={item.id} onClick={() => setMovie(type, item.id)}>
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
                                }
                            })
                        )}
                    </Row>
                </Col>
            )}
        </>
    );
};

export default SearchResults;
