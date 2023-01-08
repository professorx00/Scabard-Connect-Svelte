const getImages = async (concept, data) => {
   console.log(concept, data);
   if (concept === "place") {
      let bool = game.settings.get("scabardconnect", "placesMaps");
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

async function _updateExistingEntry(entry, pages) {
   // Update the entry
   try {
      const Jpages = entry.pages;
      let newPages = [];
      Jpages.forEach((h) => {
         if (h.flags.scabard) {
            let id = h._id;
            let name = h.name;
            switch (name) {
               case "Description":
                  newPages.push({
                     _id: id,
                     ...pages[0],
                  });
                  break;
               case "Secrets":
                  newPages.push({
                     _id: id,
                     ...pages[1],
                  });
                  break;
               case "GM Secrets":
                  newPages.push({
                     _id: id,
                     ...pages[2],
                  });
                  break;
               case "Image":
                  newPages.push({
                     _id: id,
                     ...pages[3],
                  });
                  break;
               default:
                  newPages.push({
                     _id: id,
                     name: h.name,
                     type: h.type,
                     image: h.image,
                     text: h.text,
                     flags: h.flags,
                  });
                  break;
            }
         }
      });
      const newEntry = await entry.updateEmbeddedDocuments("JournalEntryPage", newPages);

      return newEntry;
   } catch (err) {
      console.error("error", err);
   }
}

const createPages = async (data, id, uri, imageURL) => {
   const pageContent = [data.main.description, data.main.secrets, data.main.gmSecrets];
   let pages = [];
   for (let i = 0; i < pageContent.length; i++) {
      // Text, Image,PDF,Video
      let newPage = {
         id: id,
         name: ["Description", "Secrets", "GM Secrets"][i],
         type: "text",
         text: { content: pageContent[i] },
         flags: { scabard: { id: id, uri: uri } },
      };
      pages.push(newPage);
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

   //Creates a new Journal Entry which I can render
   let entry = game.journal.find((e) => {
      if (e.flags.scabard) {
         return e.flags.scabard.id === id;
      }
   });
   if (entry) {
      console.log("before update", entry);
      return await _updateExistingEntry(entry, pages);
   }
   let entries = await JournalEntry.createDocuments([
      {
         id: data.main.id,
         name: data.main.name,
         pages: pages,
         flags: { scabard: { id: id, uri: uri } },
         folder: folder.id,
      },
   ]);

   return entries[0];
};

export default createJournalEntry;






































































































































































































