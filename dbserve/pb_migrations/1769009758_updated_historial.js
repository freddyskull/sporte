/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1119805642")

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3315739933",
    "hidden": false,
    "id": "relation1088722923",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "departamento",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1119805642")

  // remove field
  collection.fields.removeById("relation1088722923")

  return app.save(collection)
})
