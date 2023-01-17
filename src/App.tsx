import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  TextField,
} from "@mui/material";
import axios from "axios";

interface RecipesDataItem {
  recipe: object;
  _links: object;
}
interface RecipesDataItems extends Array<RecipesDataItem> {}

const fetchRecipes = (
  searchQuery: string,
  setRecipesData: Function,
  recipesData: RecipesDataItems,
  setNextLink: Function,
  nextLink: string,
  setHasNext: Function
) => {
  console.log(searchQuery);
  axios
    .get(
      nextLink !== ""
        ? nextLink
        : `https://api.edamam.com/api/recipes/v2?type=public&app_id=${
            import.meta.env.VITE_EDAMAM_SEARCH_APP_ID
          }&app_key=${
            import.meta.env.VITE_EDAMAM_SEARCH_API_KEY
          }&q=${searchQuery}`
    )
    .then((res) => {
      if (res.data._links.next.href) {
        setNextLink(res.data._links.next.href);
        setHasNext(true);
      }
      setRecipesData([...recipesData, ...res.data.hits]);
    });
};

function App() {
  const [recipesData, setRecipesData] = useState<RecipesDataItems>([]);
  const [nextLink, setNextLink] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: any) => {
    setRecipesData([]);
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    fetchRecipes(
      searchQuery,
      setRecipesData,
      recipesData,
      setNextLink,
      nextLink,
      setHasNext
    );
  }, [searchQuery]);

  return (
    <div className='gap-2'>
      <TextField
        id='outlined-search'
        label='Search recipes'
        type='search'
        className='w-full'
        onChange={handleSearchChange}
      />
      {searchQuery && (
        <Box sx={{ flexGrow: 1 }}>
          <InfiniteScroll
            hasMore={hasNext}
            next={() =>
              fetchRecipes(
                searchQuery,
                setRecipesData,
                recipesData,
                setNextLink,
                nextLink,
                setHasNext
              )
            }
            dataLength={recipesData.length}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <Grid container spacing={3}>
              {recipesData?.map((recipeObject: any, index: number) => (
                <Grid item xs='auto'>
                  <Card key={index} sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                      <CardMedia
                        sx={{ height: 140 }}
                        image={recipeObject.recipe.images.REGULAR.url}
                        title={recipeObject.recipe.label}
                      />
                      <CardContent>
                        <Typography variant='h5' component='div'>
                          {recipeObject.recipe.label}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        </Box>
      )}
    </div>
  );
}

export default App;
