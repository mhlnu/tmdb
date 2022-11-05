import React, { useEffect, useState } from "react";
import { Dropdown, Form } from "react-bootstrap";

const FilterToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        className="filterToggle"
        onClick={e => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
    </a>
));

const FilterDropdown = ({ name, active, options, search, setFilter }) => {
    const [query, setQuery] = useState("");
    const [data, setData] = useState([]);
    let items = name === "type" ? [] : [{ text: "All", value: "" }];
    let values = options || [];
    for (let i in values) {
        items.push({ text: values[i].name, value: values[i] });
    }

    useEffect(() => {
        if (options || query.length > 2) {
            let filtered = items.filter(obj => {
                return obj.text.toString().includes(query);
            });
            setData(filtered);
        } else {
            setData(items);
        }
    }, [options, query]);

    return (
        <Dropdown className="filterDropdown">
            <Dropdown.Toggle as={FilterToggle} id="dropdown-filter">
                {name} <span className="selectedVal">{active.id === undefined ? "All" : active.name}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {search && (
                    <div className="searchFilter">
                        <Form.Control type="text" placeholder="Filter years" aria-label="Filter years" onChange={e => setQuery(e.target.value)} />
                    </div>
                )}
                {data.map((item, index) => {
                    return (
                        <Dropdown.Item key={index} eventKey={index.toString()} active={active.id === item.value.id} onClick={() => setFilter(item.value)}>
                            {item.text}
                        </Dropdown.Item>
                    );
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default FilterDropdown;
