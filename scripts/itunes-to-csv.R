# this script exports the data from an iTunes library file
# it a more useable CSV file

# To create the iTunes library xml file, you can choose
# File...Library...Export from within iTunes

library(xml2)
library(dplyr)
library(readr)

itunes_to_tibble <- function (path) {
  docs <- read_xml(path)
  tracks <- xml_find_all(docs, "./dict/key[text() = 'Tracks']/following-sibling::dict/dict")
  as_tibble(bind_rows(lapply(tracks, function(x) {
    names <- xml_text(xml_find_all(x, "./key"))
    vals <- xml_text(xml_find_all(x, "./*[not(self::key)]"))
    setNames(data.frame(as.list(vals), stringsAsFactors = FALSE), names)
  })))
}

dd <- itunes_to_tibble("~/Documents/songbook/Library.xml")

ss <- dd %>% 
  filter(Genre=="Showtune") %>% 
  select_if(function(x) !all(is.na(x)))

write_csv(ss, "~/Documents/songbook/showtunes.csv")
