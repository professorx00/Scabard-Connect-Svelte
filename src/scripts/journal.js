const getImages = async (data) => {
   return data.main.imageURL;
};

const getMap = async (concept, data) => {
   if (concept === "place") {
      if (data.main.largeImageURL) {
         return data.main.largeImageURL;
      } else {
         return null;
      }
   }
   return null;
};

async function _findFolder(concept, id) {
   const folders = game.folders.filter((f) => f.type === "JournalEntry" && f.flags["scabard"]);
   const filteredFolders = folders.filter((folder) => folder.flags.scabard === concept);
   return filteredFolders[0] ? filteredFolders[0] : null;
}

async function _updateExistingEntry(entry, pages, data, isSecret) {
   // Update the entry
   try {
      const Jpages = entry.pages;
      console.log("isSecret", isSecret);
      console.log("data", data);
      let newPages = [];
      Jpages.forEach((h) => {
         if (h.flags.scabard) {
            let id = h._id;
            let name = h.name;
            console.log("Names", h.name);
            switch (name) {
               case "Description":
                  newPages.push({
                     _id: id,
                     name: h.name,
                     ownership: { default: isSecret ? 0 : -1 },
                     ...pages[0],
                  });
                  break;
               case "Secrets":
                  newPages.push({
                     _id: id,
                     ownership: { default: 0 },
                     ...pages[1],
                  });
                  break;
               case "GM Secrets":
                  newPages.push({
                     _id: id,
                     ownership: { default: 0 },
                     ...pages[2],
                  });
                  break;
               case "Image":
                  newPages.push({
                     _id: id,
                     ownership: { default: isSecret ? 0 : -1 },
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
                     ownership: { default: isSecret ? 0 : -1 },
                  });
                  break;
            }
         }
      });
      await entry.updateEmbeddedDocuments("JournalEntryPage", newPages);
      await entry.update({ name: data.main.name });
      return entry;
   } catch (err) {
      console.error("error", err);
   }
}

const createPages = async (data, id, uri, imageURL, mapURL, isSecret) => {
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
         ownership: i === 0 ? { default: isSecret ? 0 : -1 } : { default: 0 },
      };
      pages.push(newPage);
   }
   let imagePage = {
      id: id,
      name: "Image",
      type: "image",
      src: imageURL,
      flags: { scabard: { id: id, uri: uri } },
      ownership: { default: isSecret ? 0 : -1 },
   };

   pages.push(imagePage);
   if (mapURL) {
      let mapPage = {
         id: id,
         name: "Map",
         type: "image",
         src: mapURL,
         flags: { scabard: { id: id, uri: uri } },
         ownership: { default: isSecret ? 0 : -1 },
      };
      pages.push(mapPage);
   }

   return pages;
};

const createJournalEntry = async (concept, data, id, uri) => {
   // Checks If there is a folder if there is returns else return new
   const isSecret = data.main.isSecret;
   console.log("isSecret", isSecret);
   let folder = await _findFolder(concept, id);
   if (!folder) {
      console.log("creating Folder");
      folder = await Folder.create({
         name: `Scabard ${concept}`,
         type: "JournalEntry",
         flags: { scabard: concept },
      });
   }
   const imageURL = await getImages(data);
   const mapURL = await getMap(concept, data);
   const pages = await createPages(data, id, uri, imageURL, mapURL, isSecret);

   //Creates a new Journal Entry which I can render
   let entry = game.journal.find((e) => {
      if (e.flags.scabard) {
         return e.flags.scabard.id === id;
      }
   });
   if (entry) {
      console.log("before update", entry);
      return await _updateExistingEntry(entry, pages, data, isSecret);
   }
   let entries = await JournalEntry.createDocuments([
      {
         id: data.main.id,
         name: data.main.name,
         pages: pages,
         flags: { scabard: { id: id, uri: uri } },
         folder: folder.id,
         ownership: { default: isSecret ? 0 : 2 },
      },
   ]);

   return entries[0];
};

export default createJournalEntry;





































