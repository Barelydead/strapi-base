# Usage
In order to index collection types in the global index you have to update the model definition for the collection.

`api/page/models/page.settings.json` 
```json
{
...
...
  "options": {
    "indexGlobal": true
  },
...
...
}

````