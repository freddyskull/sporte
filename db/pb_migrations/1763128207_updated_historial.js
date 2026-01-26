/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1119805642")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select1156485628",
    "maxSelect": 1,
    "name": "asunto",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "problemas de red",
      "soporte técnico",
      "soporte ofimático"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1119805642")

  // remove field
  collection.fields.removeById("select1156485628")

  return app.save(collection)
})
