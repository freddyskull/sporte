/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1119805642")

  // update field
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
      "soporte técnico",
      "soporte ofimático",
      "falla del saad",
      "falla de conexión",
      "falla de internet",
      "falla de red",
      "mantenimiento correctivo",
      "mantenimiento preventivo",
      "cableado estructurado",
      "soporte de red"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1119805642")

  // update field
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
})
