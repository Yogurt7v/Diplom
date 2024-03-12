import style from "./main-page.module.css";
import React from "react";
import Content from "../components/content/content.js";
import SearchBar from "../components/search-bar/search-bar.js";
import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../actions";
import { VideoBackground } from "../components";
import { useState } from "react";
import { useEffect } from "react";
import { useServerRequest } from "../../hooks/use-server-request";
import { SortBar } from "../components/sort-bar";
import { Header } from "../components";
import _ from "lodash";

export const MainPage = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const requestServer = useServerRequest();
  const [searchPhrase, setSearchPhrase] = useState("");
  const [searchPhraseFromSearchBar, setSearchPhraseFromSearchBar] =
    useState("");
  const [sorting, setSorting] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const sortOption = [
    {
      value: "priceDESC",
      label: "по цене по убыванию",
      sort: (data) => _.orderBy(data, ["price"], ["desc"]),
    },
    {
      value: "priceASC",
      label: "по цене по возрастанию",
      sort: (data) => _.orderBy(data, ["price"], ["asc"]),
    },
    {
      value: "weightASC",
      label: "по весу по возрастанию",
      sort: (data) => _.orderBy(data, ["weight"], ["asc"]),
    },
    {
      value: "weightDESC",
      label: "по весу по убыванию",
      sort: (data) => _.orderBy(data, ["weight"], ["desc"]),
    },
    {
      value: "caloriesASC",
      label: "по калорийности по возрастанию",
      sort: (data) => _.orderBy(data, ["calories"], ["asc"]),
    },
    {
      value: "caloriesDESC",
      label: "по калорийности по убыванию",
      sort: (data) => _.orderBy(data, ["calories"], ["desc"]),
    },
  ];

  const onSearch = () => {
    setSearchPhrase(searchPhraseFromSearchBar);
  };

  const onDelete = () => {
    setSearchPhrase("");
  };


  useLayoutEffect(() => {
    const currentUserDataJSON = sessionStorage.getItem("userData");
    if (!currentUserDataJSON) {
      return;
    }

    const currentUserData = JSON.parse(currentUserDataJSON);
    dispatch(
      setUser({ ...currentUserData, roleId: Number(currentUserData.roleId) })
    );
  }, [dispatch]);


  useEffect(() => {
    requestServer(`fetchProducts`, searchPhrase, searchCategory).then(
      ({ res: { products, links } }) => {

        const sortObJ = sortOption.find((option) => option.value === sorting);
        const filteredProducts = products.filter((product) =>
        searchCategory ? product.category === searchCategory : product
        );
        setProducts(sortObJ ? sortObJ.sort(filteredProducts) : filteredProducts);
      }
    );
  }, [requestServer, searchPhrase, sorting, searchCategory]);
  

const onCategoryChange = (event) => {
  const category = event.target.textContent.toLowerCase().slice(0, -1);
  if (!searchCategory){
    setSearchCategory(category)
  } else {
    setSearchCategory('')
  }

}

  const handleSort = (e) => {
    setSorting(e.target.value);
  };
  return (
    <>
      <Header  onCategoryChange={onCategoryChange}/>
      <div className={style.AppWrapper}>
        <div className={style.SortBarWrapper}>
          <SortBar options={sortOption} onSort={handleSort} value={sorting} />
          <SearchBar
            searchPhraseFromSearchBar={searchPhraseFromSearchBar}
            setSearchPhraseFromSearchBar={setSearchPhraseFromSearchBar}
            searchPhrase={searchPhrase}
            onSearch={onSearch}
            onDelete={onDelete}
          />
        </div>
        <Content 
          products={products}
        />
        <VideoBackground />
      </div>
    </>
  );
};
