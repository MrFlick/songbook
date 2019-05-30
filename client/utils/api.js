function isString(val) {
  if (typeof val === 'string' || val instanceof String) {
    return true;
  }
  return false;
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

function saveLyrics(trackId, lyric) {
  let lyricData = lyric;
  if (isString(lyricData)) {
    lyricData = { text: lyricData };
  }
  return postData(`/api/track/${trackId}/lyric`, lyricData);
}

export default {
  saveLyrics,
};
