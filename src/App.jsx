import { useState, useEffect } from "react";
import { BrowserRouter,Route,Routes } from "react-router-dom";
import { fetchDataFromApi } from "./utils/api";

import { useSelector, useDispatch } from 'react-redux';

import { getApiConfiguration, getGenres } from "./store/homeSlice";


import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";



function App() {
  const dispatch = useDispatch();
  const {url} = useSelector((state) => state.home);
  

  useEffect(() => {
    fetchApiConfig();
  }, []);

  const fetchApiConfig = () =>  {
    fetchDataFromApi("/configuration")
    .then((res) => {
      
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };
      dispatch(getApiConfiguration(url));

    });
  };

  const genresCall = async ()=>{
         let promises = []
         let endPoint = ["tv","movie"]
         let allGeners = {}

         endPoints.forEach((url)=>{
              promises.push(fetchDataFromApi(`/genre/${url}/list`))
         });

         const data = await Promise.all(promises);
         data.map(({genres})=>{
          return genres.map((item) => (allGenres[item.id] = item))
         });
         

         dispatch(getGenres(allGenres));

        
  }

  return (
            <BrowserRouter>
                <Header></Header>
              <Routes>
                   
                <Route path="/" element={<Explore></Explore>}></Route>

                <Route path="/:mediaType/:id" element={<Details></Details>}></Route>

                <Route path="/search/:query" element={<SearchResult></SearchResult>}></Route>

                <Route path="/explore/:mediaType" element={<Explore></Explore>}></Route>

                <Route path="/*" element={<PageNotFound></PageNotFound>}></Route>

              </Routes>
              <Footer></Footer>
            </BrowserRouter>
  );
}

export default App;
