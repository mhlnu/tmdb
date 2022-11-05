import React, { useEffect, useState } from "react";
import { getData } from "./../api/data";

const Rating = ({ api, session, type, id }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [error, setError] = useState("");
    const [data, setData] = useState("");
    const { guest_session_id } = session;

    const rateMovie = rating => {
        setRating(rating);
        const query = { value: rating };
        getData(type.id, "rate", { query, id }, null, guest_session_id, api)
            .then(res => setData(res.status_message))
            .catch(err => setError(err));
    };

    useEffect(() => {
        if (data || error)
            setTimeout(() => {
                setError(false);
                setData("");
            }, 5000);
    }, [error, data]);

    return (
        <div className="starRating">
            {[...Array(10)].map((star, index) => {
                index += 1;
                return (
                    <button
                        type="button"
                        key={index}
                        className={index <= (hover || rating) ? "on" : "off"}
                        onClick={() => rateMovie(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                    >
                        <span className="star">&#9733;</span>
                    </button>
                );
            })}
            <span className="values">{hover} of 10</span>
            <span className="result">
                {data && <span className="rateResult">{data}</span>}
                {error && <span className="rateResult">{error}</span>}
            </span>
        </div>
    );
};

export default Rating;
