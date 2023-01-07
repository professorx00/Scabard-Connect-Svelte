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
   const folders = game.folders.filter((f) => f.type === "JournalEntry" && f.flags["scabard"]);
   const filteredFolders = folders.filter((folder) => folder.flags.scabard === concept);
   return filteredFolders[0] ? filteredFolders[0] : null;
}

async function _updateExistingEntry(entry, data, id, uri, pages, folder) {
   // Update the entry
   try {
      let updated = await entry.updateDocuments(pages);
      return updated;
   } catch (err) {
      console.error("error", err);
   }
}

const createPages = async (data, id, uri, imageURL) => {
   const pageContent = [data.main.description, data.main.secrets, data.main.gmSecrets];
   let pages = [];
   for (let i = 0; i < pageContent.length; i++) {
      // Text, Image,PDF,Video
      switch (i) {
         case 0:
            let newPage = {
               id: `${id}+page${i}`,
               type: "text",
               name: "Description",
               text: { content: pageContent[i] },
               flags: { scabard: { id: id, uri: uri } },
            };
            pages.push(newPage);
            break;
         case 1:
            let newPage2 = {
               id: `${id}+page${i}`,
               name: "Secrets",
               type: "text",
               text: { content: pageContent[i] },
               flags: { scabard: { id: id, uri: uri } },
            };
            pages.push(newPage2);
            break;
         case 2:
            let newPage3 = {
               id: `${id}+page${i}`,
               name: "GM Secrets",
               type: "text",
               text: { content: pageContent[i] },
               flags: { scabard: { id: id, uri: uri } },
            };
            pages.push(newPage3);
            break;
         default:
            break;
      }
   }
   let imagePage = {
      id: id,
      name: "Image",
      type: "image",
      src: imageURL,
      flags: { scabard: { id: id, uri: uri } },
   };
   pages.push(imagePage);

   return pages;
};

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
   const pages = await createPages(data, id, uri, imageURL);
   console.log("pages: ", pages);

   //Creates a new Journal Entry which I can render
   let entry = game.journal.find((e) => {
      if (e.flags.scabard) {
         return e.flags.scabard.id === id;
      }
   });
   if (entry) {
      console.log("before delete", entry);
      return await _updateExistingEntry(entry, data, id, uri, pages, folder.id);
   }
   let entries = await JournalEntry.createDocuments([
      {
         id: id,
         name: data.main.name,
         pages: pages,
         flags: { scabard: { id: id, uri: uri } },
         folder: folder.id,
      },
   ]);
   entry = entries[0];

   return entry;
};

export default createJournalEntry;



















































































































































