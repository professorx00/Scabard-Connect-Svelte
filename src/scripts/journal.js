const getImages = async (concept, data) => {
   console.log(concept, data);
   if (concept === "place") {
      let bool = game.settings.get("scabard-connect", "placesMaps");
      if (bool) {
         if (data.main.largeImageName === "Map") {
            return data.main.largeImageURL;
         }
      }
      return data.main.imageURL;
   }

   return data.main.imageURL;
};

async function _findFolder(concept, id) {
   const folders = game.folders.filter((f) => f.data.type === "JournalEntry" && f.data.flags["scabard"]);
   const filteredFolders = folders.filter((folder) => folder.data.flags.scabard === concept);
   return filteredFolders[0] ? filteredFolders[0] : null;
}

async function _updateExistingEntry(entry, data, id, uri, folder) {
   Hooks.callAll(`ScabardUpdateJournalEntry`, entry, id, uri);

   // Update the entry
   await entry.data.update({
      id: id,
      name: data.main.name,
      content: data.main.description,
      img: data.main.imageURL,
      scabard: { id: id, uri: uri },
      folder: folder,
   });
}

const createJournalEntry = async (concept, data, id, uri) => {
   // Checks If there is a folder if there is returns else return new
   let folder = await _findFolder(concept, id);
   if (!folder) {
      console.log("creating Folder");
      folder = await Folder.create({
         name: `Scabard ${concept}`,
         type: "JournalEntry",
         flags: { scabard: concept },
      });
   }
   const imageURL = await getImages(concept, data);
   console.log(imageURL);

   //Creates a new Journal Entry which I can render
   let entry = game.journal.find((e) => {
      if (e.data.flags.scabard) {
         return e.data.flags.scabard.id === id;
      }
   });
   if (entry) return await _updateExistingEntry(entry, data, id, uri, folder.id);
   entry = await JournalEntry.create(
      {
         id: id,
         name: data.main.name,
         content: data.main.description,
         img: imageURL,
         flags: { scabard: { id: id, uri: uri } },
         folder: folder.id,
      },
      {}
   );

   return entry;
};

export default createJournalEntry;
