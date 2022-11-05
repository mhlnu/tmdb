import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Card } from "react-bootstrap";
import useData from "./../api/data";
import Rating from "./Rating";

const baseImageUrl = "https://image.tmdb.org/t/p/original/";

const Movie = ({ api, session, type, id, goBack }) => {
    const [rating, setRating] = useState(0);
    const [movie, setMovie] = useState({});
    const [cast, setCast] = useState([]);
    const [review, setReview] = useState([]);
    const res = useData(type.id, "details", { id }, null, null, api);
    const credits = useData(type.id, "cast", { id }, null, null, api);
    const reviews = useData(type.id, "reviews", { id }, null, null, api);
    const { loading, error, data } = res;

    useEffect(() => {
        if (Object.keys(data).length > 0) {
            setMovie(data);
        }
    }, [data]);

    useEffect(() => {
        const ratingText = movie?.vote_average?.toString().slice(0, 3).replace(/\./g, "") || 0;
        const rating = ratingText.length === 1 ? ratingText + 0 : ratingText;
        setRating(rating);
    }, [movie]);

    useEffect(() => {
        if (Object.keys(credits.data).length > 0) {
            setCast(credits.data);
        }
    }, [credits.data]);

    useEffect(() => {
        if (Object.keys(reviews.data).length > 0) {
            setReview(reviews.data);
        }
    }, [reviews.data]);

    if (loading || Object.keys(movie).length < 1) {
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
        <Col sm={12} lg={12} className="itemContent">
            <Row>
                <Col sm={12} className="movieNav">
                    <a className="backBtn" href="#" onClick={() => goBack()}>
                        Back
                    </a>
                </Col>
                <Col sm={12} lg={8}>
                    <Row className="heroWrapper">
                        <h1 className="heroTitle">
                            {movie.name ? movie.name : movie.title} <span>({movie.first_air_date ? movie.first_air_date.substring(0, 4) : movie.release_date.substring(0, 4)})</span>
                        </h1>
                        <div className="heroDetails">
                            <Row className="align-items-center">
                                <Col sm={2}>
                                    <span className="movieRating" style={{ "--p": rating, "--b": "3px", "--c": "#199BB5" }}>
                                        {movie.vote_average.toString().slice(0, 3)}
                                    </span>
                                </Col>
                                <Col sm={10}>
                                    <div className="movieTags">
                                        {data?.genres.map(item => {
                                            return (
                                                <div className="movieTag" key={item.id}>
                                                    {item.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mt-5">
                                <p>{movie.overview}</p>
                            </Row>
                            <Row className="mt-5">
                                <Col sm={3}>Status</Col>
                                <Col sm={9}>{movie.status}</Col>
                                {type === "tv" && (
                                    <>
                                        <Col sm={3}>Seasons</Col>
                                        <Col sm={9}>
                                            {movie.number_of_seasons} of {movie.number_of_episodes} episodes each
                                        </Col>
                                        <Col sm={3}>Next episode to air</Col>
                                        <Col sm={9}>{movie.next_episode_to_air === null ? "TBD" : movie.next_episode_to_air.air_date}</Col>
                                    </>
                                )}
                                <Col sm={3} className="mt-4">
                                    Rate this {type === "tv" ? "show" : "movie"}
                                </Col>
                                <Col sm={9} className="mt-4">
                                    <Rating api={api} session={session} type={type} id={id} />
                                </Col>
                            </Row>
                        </div>
                    </Row>
                </Col>
                <Col sm={12} lg={4} className="hero">
                    <img loading="lazy" src={baseImageUrl + movie.poster_path} className="heroImg" />
                </Col>
                <Row className="mt-5">
                    <h3>Cast</h3>
                    <Row className="movieCast">
                        {cast.map(item => {
                            return (
                                <Col sm={12} md={3} key={item.id}>
                                    <Card className="castCard">
                                        {item.profile_path ? (
                                            <img className="card-img" loading="lazy" src={baseImageUrl + item.profile_path} alt={item.name} />
                                        ) : (
                                            <div className="card-img placeholder">¯\\_(ツ)_/¯</div>
                                        )}
                                        <Card.Title>{item.name}</Card.Title>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Row>
                <Row className="mt-5">
                    <h3>Reviews</h3>
                    {review.map(item => {
                        const date = new Date(item.updated_at);
                        return (
                            <div className="movieReview" key={item.id}>
                                <p>{item.content}</p>
                                <p className="movieReviewMeta">
                                    <span className="author">{item.author}</span>
                                    <br />
                                    {date.toLocaleDateString()}
                                </p>
                            </div>
                        );
                    })}
                </Row>
            </Row>
        </Col>
    );
};

export default Movie;
