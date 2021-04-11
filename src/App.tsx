import { useEffect, useState } from 'react';

import { SideBar } from './components/SideBar';
import { Content } from './components/Content';

import { api } from './services/api';

import './styles/global.scss';


import { GenreResponseProps, MovieProps } from './commom/types/intex';


export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(1);

  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    Promise.all([ 
      api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`),
      api.get<GenreResponseProps>(`genres/${selectedGenreId}`)
     ]).then( ([ moviesResponse, selectedGenreResponse]) => {
      setMovies(moviesResponse.data),
      setSelectedGenre(selectedGenreResponse.data);
    })
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <SideBar genres={genres} handleClickButton={handleClickButton} selectedGenreId={selectedGenreId} />
      <Content selectedGenre={selectedGenre} movies={movies}/>
    </div>
  )
}