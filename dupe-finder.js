var songs = db.songs.find();

var dupes = {};
for(var i = 0; i < songs.length(); i++)
{
  var song = songs[i];
  for(var j = 0; j < songs.length(); j++)
  {
    if(i !== j)
    {
      var possibleDupe = songs[j];
      //if(possibleDupe.title.indexOf(song.title) > -1 )
      if(possibleDupe.title.indexOf("'") > -1 && possibleDupe.title.replace("'", " ") === song.title)
      {
        dupes[song.title+song.artist] = true;
      }
    }
  }
}

printjson(dupes);
