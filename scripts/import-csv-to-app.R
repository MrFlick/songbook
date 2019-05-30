# This script will import the data from the CSV file into
# the tables used by the application

# This assumes that you've first run the application to create
# the schema for the database. This will just add data to tables
# rather than create the tables.

library(DBI)
library(stringr)
library(tidyr)
library(dplyr)

con <- dbConnect(RSQLite::SQLite(), "~/../Documents/projects/songbook/db/data.sqlite3")

dd <- readr::read_csv("~/../Downloads/showtunes.csv", guess_max=3000) %>% 
  group_by(Album) %>% 
  mutate(`Album Id` = min(`Track ID`)) %>%
  ungroup()

albums <- dd %>% 
  group_by(`Album Id`) %>% 
  summarize_at(vars(Album, `Sort Album`, Year), first) %>% 
  rename(id=`Album Id`, name=`Album`, sortName=`Sort Album`, releaseYear=Year)
albums %>%
  dbWriteTable(con, "albums", .,append=TRUE)

tracks <- dd %>% 
  select(id=`Track ID`, albumId=`Album Id`,
         name=Name, length=`Total Time`, 
         trackNumber = `Track Number`, discNumber=`Disc Number`) 

tracks %>% 
  dbWriteTable(con, "tracks", .,append=TRUE)

trackartists <- dd %>%
  select(`Track ID`, `Album Id`, Artist) %>% 
  filter(!is.na(Artist)) %>% 
  group_by(`Album Id`) %>% 
  mutate(isalbum = mean(Artist == first(Artist))>.8) %>% 
  ungroup() %>% 
  filter(!isalbum) %>% 
  mutate(Artist = stringr::str_split(Artist, "(\\s*(,(?! Jr)|;|/|&|\\b(a|A)nd(?=\\s)|Feat\\.|with\\s|-\\s)\\s*)+")) %>% 
  unnest() %>% 
  mutate(Artist=trimws(Artist)) %>% 
  mutate(`Artist Id` = group_indices(., Artist))


people <- trackartists %>% 
  distinct(`Artist Id`, Artist) %>% 
  arrange(Artist) %>% 
  select(id=`Artist Id`, name=Artist)
people %>% 
  dbWriteTable(con, "people", .,append=TRUE)

data.frame(id=1, name="Performer") %>% 
  dbWriteTable(con, "roles", .,append=TRUE)

trackpeople <- trackartists %>% 
  mutate(roleId=1) %>% 
  select(personId=`Artist Id`, trackId=`Track ID`, roleId) %>% 
  distinct()
trackpeople %>% 
  dbWriteTable(con, "trackpeople", .,append=TRUE)


dbDisconnect(con)

