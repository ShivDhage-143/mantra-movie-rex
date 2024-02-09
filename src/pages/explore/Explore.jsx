import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";

import "./style.scss";

import useFetch from "../../hooks/useFetch";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";

let filters = {};
const KEY = import.meta.env.VITE_API_KEY;

const sortbyData = [
    { value: "popularity.desc", label: "Popularity Descending" },
    { value: "popularity.asc", label: "Popularity Ascending" },
    { value: "vote_average.desc", label: "Rating Descending" },
    { value: "vote_average.asc", label: "Rating Ascending" },
    {
        value: "primary_release_date.desc",
        label: "Release Date Descending",
    },
    { value: "primary_release_date.asc", label: "Release Date Ascending" },
    { value: "original_title.asc", label: "Title (A-Z)" },
];

const Explore = () => {
    const [data, setData] = useState(null);
    const [releaseDate, setReleaseDate] =useState("");
    const [releasedEndDate, setReleasedEndDate] =useState("");
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(false);
    const [genre, setGenre] = useState(null);
    const [sortby, setSortby] = useState(null);
    const [startDate, setStartDate] = useState(""); // New state for start date
    const [endDate, setEndDate] = useState(""); // New state for end date
    const { mediaType: paramsMediaType } = useParams();
    const mediaType = paramsMediaType || "movie"; 

    

    const { data: genresData } = useFetch(`/genre/${mediaType}/list`);

    const fetchInitialData = () => {
        setLoading(true);
        fetchDataFromApi(`/discover/${mediaType}`, filters).then((res) => {
            setData(res);
            setPageNum((prev) => prev + 1);
            setLoading(false);
        });
    };
    const fetchInitialDateData = () =>{
        setLoading(true);
        fetch(`https://api.themoviedb.org/3/discover/${mediaType}?api_key=${KEY}&include_adult=false&include_video=false&primary_release_date.gte=${releaseDate}&primary_release_date.lte=${releasedEndDate}`, filters
        )
                .then(response => response.json())
                .then(response => setData(response))
                .catch(err => console.error(err));
                setPageNum((prev) => prev + 1);
                setLoading(false);

    };
    useEffect(() => {
        if (releaseDate !== "" && releasedEndDate !== "") {
            fetchInitialDateData();
        }
    }, [releaseDate, releasedEndDate]);


    const fetchNextPageData = () => {
        fetchDataFromApi(
            `/discover/${mediaType}?page=${pageNum}`,
            filters
        ).then((res) => {
            if (data?.results) {
                setData({
                    ...data,
                    results: [...data?.results, ...res.results],
                });
            } else {
                setData(res);
            }
            setPageNum((prev) => prev + 1);
        });
    };

    useEffect(() => {
        filters = {};
        setData(null);
        setPageNum(1);
        setSortby(null);
        setGenre(null);
        fetchInitialData();
    
    }, [mediaType,]);

    
    const onChange = (selectedItems, action) => {
        if (action.name === "sortby") {
            setSortby(selectedItems);
            if (action.action !== "clear") {
                filters.sort_by = selectedItems.value;
            } else {
                delete filters.sort_by;
            }
        }

        if (action.name === "genres") {
            setGenre(selectedItems);
            if (action.action !== "clear") {
                let genreId = selectedItems.map((g) => g.id);
                genreId = JSON.stringify(genreId).slice(1, -1);
                filters.with_genres = genreId;
            } else {
                delete filters.with_genres;
            }
        }

        setPageNum(1);
        fetchInitialData();
    };

    const handleSubmit = () => {

        setReleaseDate(startDate);
        setReleasedEndDate(endDate);
        fetchInitialDateData();
    };

    return (
        <div className="explorePage">
            <ContentWrapper>
                <div className="pageHeader">
                    <div className="pageTitle">
                        {mediaType === "tv"
                            ? "Explore TV Shows"
                            : "Explore Movies"}
                    </div>
                    <div className="filters">
                        <Select
                            isMulti
                            name="genres"
                            value={genre}
                            closeMenuOnSelect={false}
                            options={genresData?.genres}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            onChange={onChange}
                            placeholder="Select genres"
                            className="react-select-container genresDD"
                            classNamePrefix="react-select"
                        />
                        <Select
                            name="sortby"
                            value={sortby}
                            options={sortbyData}
                            onChange={onChange}
                            isClearable={true}
                            placeholder="Sort by"
                            className="react-select-container sortbyDD"
                            classNamePrefix="react-select"
                        />
                        <div className="dateFilters">
                               <div className="date-inputs">
                               <input
                                    type="date"
                                    value={startDate ? startDate : ""}
                                    onChange={(e) => {
                                        const selectedDate = new Date(e.target.value);
                                        const year = selectedDate.getFullYear();
                                        let month = selectedDate.getMonth() + 1;
                                        let day = selectedDate.getDate();

                                        // Ensure month and day are two digits
                                        month = month < 10 ? `0${month}` : month;
                                        day = day < 10 ? `0${day}` : day;

                                        // Construct the yyyy/mm/dd format
                                        const formattedDate = `${year}-${month}-${day}`;

                                        setStartDate(formattedDate);
                                    }}
                                />

                                <input
                                    
                                    type="date"
                                    value={endDate ? endDate : ""}
                                    onChange={(e) => {
                                        const selectedDate = new Date(e.target.value);
                                        const year = selectedDate.getFullYear();
                                        let month = selectedDate.getMonth() + 1;
                                        let day = selectedDate.getDate();

                                        // Ensure month and day are two digits
                                        month = month < 10 ? `0${month}` : month;
                                        day = day < 10 ? `0${day}` : day;

                                        // Construct the yyyy/mm/dd format
                                        const formattedDate = `${year}-${month}-${day}`;

                                        setEndDate(formattedDate);
                                    }}
                                />


                               <button onClick={handleSubmit}>Submit</button>
                               </div>
                        </div>
                    </div>
                </div>
                {loading && <Spinner initial={true} />}
                {!loading && (
                    <>
                        {data?.results?.length > 0 ? (
                            <InfiniteScroll
                                className="content"
                                dataLength={data?.results?.length || []}
                                next={fetchNextPageData}
                                hasMore={pageNum <= data?.total_pages}
                                loader={<Spinner />}
                            >
                                {data?.results?.map((item, index) => {
                                    if (item.media_type === "person") return;
                                    return (
                                        <MovieCard
                                            key={index}
                                            data={item}
                                            mediaType={mediaType}
                                        />
                                    );
                                })}
                            </InfiniteScroll>
                        ) : (
                            <span className="resultNotFound">
                                Sorry, Results not found!
                            </span>
                        )}
                    </>
                )}
            </ContentWrapper>
        </div>
    );
};

export default Explore;
