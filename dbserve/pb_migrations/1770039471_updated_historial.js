/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1119805642")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "date1119911313",
    "max": "",
    "min": "",
    "name": "fecha_soporte",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1119805642")

  // remove field
  collection.fields.removeById("date1119911313")

  return app.save(collection)
})
