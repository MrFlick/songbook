function isString(val) {
  if (typeof val === 'string' || val instanceof String) {
    return true;
  }
  return false;
}

function getData(url) {
  return fetch(url).then(resp => resp.json());
}

function postData(url, content) {
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content),
  }).then(resp => resp.json());
}

function getAlbums() {
  return getData('/api/albums');
}

function getAlbum(albumId) {
  return getData(`/api/album/${albumId}`);
}

function getPerson(personId) {
  return getData(`/api/person/${personId}`);
}

function getTrack(trackId) {
  return getData(`/api/track/${trackId}`);
}

function saveLyrics(trackId, lyric) {
  let lyricData = lyric;
  if (isString(lyricData)) {
    lyricData = { text: lyricData };
  }
  return postData(`/api/track/${trackId}/lyric`, lyricData);
}

function getTags() {
  return getData('/api/tags');
}

function getTag(tagId) {
  return getData(`/api/tag/${tagId}`);
}

function updateTrackTags(trackId, delta) {
  return postData(`/api/track/${trackId}/tags`, delta);
}

function updateAlbumTags(albumId, delta) {
  return postData(`/api/album/${albumId}/tags`, delta);
}

export default {
  getAlbums,
  getAlbum,
  getPerson,
  getTrack,
  saveLyrics,
  getTags,
  getTag,
  updateTrackTags,
  updateAlbumTags,
};
