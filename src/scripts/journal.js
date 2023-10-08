

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
      const Jpages = entry.toJSON().pages;
      let newPages = [];
      Jpages.forEach((h,i) => {
         if (h.flags.scabard) {
            let id = h._id;
            let name = h.name;
            switch (name) {
               case "Brief Summary":
                  newPages.push({
                     _id: id,
                     name: h.name,
                     ownership: { default: isSecret ? 0 : -1 },
                     ...pages[i],
                  });
                  break;
               case "Description":
                  newPages.push({
                     _id: id,
                     name: h.name,
                     ownership: { default: isSecret ? 0 : -1 },
                     ...pages[i],
                  });
                  break;
               case "Secrets":
                  newPages.push({
                     _id: id,
                     ownership: { default: 0 },
                     ...pages[i],
                  });
                  break;
               case "GM Secrets":
                  newPages.push({
                     _id: id,
                     ownership: { default: 0 },
                     ...pages[i],
                  });
                  break;
               case "Image":
                  newPages.push({
                     _id: id,
                     ownership: { default: isSecret ? 0 : -1 },
                     ...pages[i],
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
                     ...pages[i],
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

const createPages = async (data, id, uri, imageURL,isSecret, concept,mapURL) => {
   const pageContent = [data.main.briefSummary, data.main.description, data.main.secrets, data.main.gmSecrets];
   let pages = [];
   for (let i = 0; i < pageContent.length; i++) {
      // Text, Image,PDF,Video
      let newPage = {
         id: id,
         name: ["Brief Summary","Description", "Secrets", "GM Secrets" ][i],
         type: "text",
         text: { content: pageContent[i] },
         flags: { scabard: { id: id, uri: uri, concept: concept } },
         ownership: i === 0 || i === 1 ? { default: isSecret ? 0 : -1 } : { default: 0 },
      };
      pages.push(newPage);
   }
   let imagePage = {
      id: id,
      name: "Image",
      type: "image",
      src: imageURL,
      flags: { scabard: { id: id, uri: uri, concept: concept } },
      ownership: { default: isSecret ? 0 : -1 },
   };

   pages.push(imagePage);
   if (mapURL) {
      let mapPage = {
         id: id,
         name: "Map",
         type: "image",
         src: mapURL,
         flags: { scabard: { id: id, uri: uri, concept: concept } },
         ownership: { default: isSecret ? 0 : -1 },
      };
      pages.push(mapPage);
   }
   return pages;
};

export const createJournalEntry = async (concept, data, id, uri) => {
   // Checks If there is a folder if there is returns else return new
   const isSecret = data.main.isSecret;
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
   const pages = await createPages(data, id, uri, imageURL, isSecret, concept, mapURL);
   //Creates a new Journal Entry which I can render
   let entry = game.journal.find((e) => {
      if (e.flags.scabard) {
         return e.flags.scabard.id === id;
      }
   });
   if (entry) {
      return await _updateExistingEntry(entry, pages, data, isSecret);
   }
   let entries = await JournalEntry.createDocuments([
      {
         id: data.main.id,
         name: data.main.name,
         pages: pages,
         flags: { scabard: { id: id, uri: uri, concept:concept } },
         folder: folder.id,
         ownership: { default: isSecret ? 0 : 2 },
      },
   ]);

   return entries[0];
};

export const saveChangestoScabard = async(concept, data, id, uri, username, accessKey) => {

   const body = {
      name: 'Test',
      briefSummary: 'Summary Test',
      concept: concept.toUpperCase()
   }
   let formattedBody = []
   for(var property in body){
      var encodedKey = encodeURIComponent(property)
      var encodedValue = encodeURIComponent(body[property]);
      formattedBody.push(encodedKey + "=" + encodedValue);
   }

   formattedBody = formattedBody.join('&');
};


export default {createJournalEntry: createJournalEntry, saveChangestoScabard: saveChangestoScabard}





































